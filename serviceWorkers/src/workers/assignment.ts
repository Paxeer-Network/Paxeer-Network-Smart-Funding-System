import { ethers } from "ethers";
import { query } from "../db/client.js";
import { CONFIG } from "../config.js";

const WALLET_FACTORY_ABI = [
  "function createWallet(address owner) external returns (address wallet)",
  "function assignWallet(address wallet, address newOwner) external",
  "function deployWallets(uint256 count) external returns (address[])",
  "function unassignedWalletAt(uint256 index) external view returns (address)",
  "function unassignedWalletCount() external view returns (uint256)",
  "function getWallet(address owner) external view returns (address)",
  "function isWallet(address wallet) external view returns (bool)",
];

const SMART_WALLET_ABI = [
  "function setMetadata(string argusId, address onchainId, string userAlias, string telegram, string twitter, string website, string github, string discord) external",
  "function walletOwner() external view returns (address)",
  "function isAssigned() external view returns (bool)",
];

export async function processAssignmentQueue(): Promise<void> {
  // Grab one pending assignment at a time
  const pending = await query(
    `UPDATE assignment_queue SET status = 'processing', updated_at = NOW()
     WHERE id = (
       SELECT id FROM assignment_queue WHERE status = 'pending'
       ORDER BY created_at ASC LIMIT 1
       FOR UPDATE SKIP LOCKED
     )
     RETURNING id, user_id, owner_address, network`,
  );

  if (!pending.rowCount || pending.rowCount === 0) return;

  const job = pending.rows[0];
  console.log(`[Assignment] Processing job #${job.id} for ${job.owner_address}`);

  try {
    const provider = new ethers.JsonRpcProvider(CONFIG.paxeerRpcUrl);
    const signer = new ethers.Wallet(CONFIG.adminPrivateKey, provider);
    const factory = new ethers.Contract(
      CONFIG.walletFactoryAddress,
      WALLET_FACTORY_ABI,
      signer,
    );

    // Check if user already has a wallet on-chain
    const existingWallet = await factory.getWallet(job.owner_address);
    if (existingWallet !== ethers.ZeroAddress) {
      console.log(`[Assignment] Owner ${job.owner_address} already has wallet ${existingWallet}`);
      // Skip on-chain work, just update DB
      await query(
        `UPDATE assignment_queue SET status = 'completed', smart_wallet = $1, tx_hash = 'already-assigned', updated_at = NOW()
         WHERE id = $2`,
        [existingWallet, job.id],
      );
      await query(`UPDATE users SET smart_wallet = $1, updated_at = NOW() WHERE id = $2`, [existingWallet, job.user_id]);
      await query(`UPDATE funding_queue SET smart_wallet = $1, updated_at = NOW() WHERE user_id = $2 AND status = 'pending'`, [existingWallet, job.user_id]);
      console.log(`[Assignment] Job #${job.id} completed (existing wallet)`);
      return;
    }

    let walletAddress: string;
    let receipt: ethers.TransactionReceipt;

    // Try to assign from pre-deployed pool, otherwise create a new one
    const poolCount = await factory.unassignedWalletCount();

    if (poolCount > 0n) {
      // Path A: assign from pre-deployed pool
      const preDeployed = await factory.unassignedWalletAt(0);
      console.log(`[Assignment] Assigning pre-deployed wallet ${preDeployed} to ${job.owner_address}`);
      const tx = await factory.assignWallet(preDeployed, job.owner_address);
      receipt = await tx.wait();
      walletAddress = preDeployed;
    } else {
      // Path B: create a new wallet directly for this owner
      console.log(`[Assignment] No pre-deployed wallets, creating new wallet for ${job.owner_address}`);
      const tx = await factory.createWallet(job.owner_address);
      receipt = await tx.wait();

      // Read the wallet address from the on-chain mapping
      walletAddress = await factory.getWallet(job.owner_address);
      if (!walletAddress || walletAddress === ethers.ZeroAddress) {
        throw new Error("createWallet succeeded but getWallet returned zero address");
      }
    }

    console.log(`[Assignment] TX confirmed: ${receipt.hash}, wallet: ${walletAddress}`);

    // Set metadata on the smart wallet
    const userRow = await query(
      `SELECT argus_id, wallet_address, user_alias,
              telegram, twitter, website, github, discord
       FROM users WHERE id = $1`,
      [job.user_id],
    );

    if (userRow.rowCount && userRow.rowCount > 0) {
      const u = userRow.rows[0];
      const smartWallet = new ethers.Contract(
        walletAddress,
        SMART_WALLET_ABI,
        signer,
      );

      // setMetadata is callable by factory (admin) before ownership handover is fully finalized
      // or we call it as admin via the factory's authority
      try {
        const metaTx = await smartWallet.setMetadata(
          u.argus_id,
          u.wallet_address,
          u.user_alias || "",
          u.telegram || "",
          u.twitter || "",
          u.website || "",
          u.github || "",
          u.discord || "",
        );
        await metaTx.wait();
        console.log(`[Assignment] Metadata set on ${walletAddress}`);
      } catch (metaErr: any) {
        console.warn(`[Assignment] Metadata set failed (non-fatal): ${metaErr.message}`);
      }
    }

    // Update job + user records
    await query(
      `UPDATE assignment_queue SET status = 'completed', smart_wallet = $1, tx_hash = $2, updated_at = NOW()
       WHERE id = $3`,
      [walletAddress, receipt.hash, job.id],
    );

    await query(
      `UPDATE users SET smart_wallet = $1, updated_at = NOW() WHERE id = $2`,
      [walletAddress, job.user_id],
    );

    // Update the funding queue entry with the smart wallet address
    await query(
      `UPDATE funding_queue SET smart_wallet = $1, updated_at = NOW()
       WHERE user_id = $2 AND status = 'pending'`,
      [walletAddress, job.user_id],
    );

    console.log(`[Assignment] Job #${job.id} completed → wallet ${walletAddress}`);
  } catch (err: any) {
    console.error(`[Assignment] Job #${job.id} failed:`, err.message);
    await query(
      `UPDATE assignment_queue SET status = 'failed', error = $1, updated_at = NOW()
       WHERE id = $2`,
      [err.message?.slice(0, 500), job.id],
    );
  }
}
