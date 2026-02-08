import { ethers } from "ethers";
import { query } from "../db/client.js";
import { CONFIG } from "../config.js";

// Minimal ERC-20 ABI for transfer
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];

export async function processFundingQueue(): Promise<void> {
  // Only process funding jobs that have a smart_wallet assigned (assignment worker fills this in)
  const pending = await query(
    `UPDATE funding_queue SET status = 'processing', updated_at = NOW()
     WHERE id = (
       SELECT fq.id FROM funding_queue fq
       WHERE fq.status = 'pending' AND fq.smart_wallet != ''
       ORDER BY fq.created_at ASC LIMIT 1
       FOR UPDATE SKIP LOCKED
     )
     RETURNING id, user_id, wallet_address, smart_wallet, network`,
  );

  if (!pending.rowCount || pending.rowCount === 0) return;

  const job = pending.rows[0];
  console.log(`[Funding] Processing job #${job.id} → smart wallet ${job.smart_wallet}`);

  try {
    if (!CONFIG.usdlTokenAddress) {
      throw new Error("USDL_TOKEN_ADDRESS not configured");
    }

    const provider = new ethers.JsonRpcProvider(CONFIG.paxeerRpcUrl);
    const signer = new ethers.Wallet(CONFIG.adminPrivateKey, provider);

    const usdl = new ethers.Contract(CONFIG.usdlTokenAddress, ERC20_ABI, signer);

    // Get token decimals and compute transfer amount
    const decimals = await usdl.decimals();
    const amount = ethers.parseUnits(CONFIG.fundingAmount, decimals);

    // Check admin balance first
    const balance = await usdl.balanceOf(signer.address);
    if (balance < amount) {
      throw new Error(
        `Insufficient USDL balance: have ${ethers.formatUnits(balance, decimals)}, need ${CONFIG.fundingAmount}`,
      );
    }

    // Transfer USDL to the user's smart wallet
    console.log(
      `[Funding] Transferring ${CONFIG.fundingAmount} USDL to ${job.smart_wallet}`,
    );
    const tx = await usdl.transfer(job.smart_wallet, amount);
    const receipt = await tx.wait();
    console.log(`[Funding] TX confirmed: ${receipt.hash}`);

    // Verify the balance was received
    const newBalance = await usdl.balanceOf(job.smart_wallet);
    console.log(
      `[Funding] Smart wallet USDL balance: ${ethers.formatUnits(newBalance, decimals)}`,
    );

    // Update job record
    await query(
      `UPDATE funding_queue SET status = 'completed', amount = $1, tx_hash = $2, updated_at = NOW()
       WHERE id = $3`,
      [CONFIG.fundingAmount, receipt.hash, job.id],
    );

    console.log(`[Funding] Job #${job.id} completed`);
  } catch (err: any) {
    console.error(`[Funding] Job #${job.id} failed:`, err.message);
    await query(
      `UPDATE funding_queue SET status = 'failed', error = $1, updated_at = NOW()
       WHERE id = $2`,
      [err.message?.slice(0, 500), job.id],
    );
  }
}
