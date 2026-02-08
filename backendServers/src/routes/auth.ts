import { Router, Request, Response, type IRouter } from "express";
import { z } from "zod";
import {
  generateNonce,
  buildSignMessage,
  verifyEvmSignature,
  verifySolanaSignature,
  issueToken,
  consumeNonce,
} from "../services/auth.js";
import {
  getEvmTransactionCount,
  getSolanaTransactionCount,
} from "../services/moralis.js";
import { query } from "../db/client.js";
import { CONFIG } from "../config.js";

const router: IRouter = Router();

// =========================================================================
// POST /auth/nonce – generate a sign-in nonce for the wallet
// =========================================================================

const nonceSchema = z.object({
  walletAddress: z.string().min(1),
});

router.post("/nonce", async (req: Request, res: Response) => {
  try {
    const { walletAddress } = nonceSchema.parse(req.body);
    const nonce = await generateNonce(walletAddress);
    const message = buildSignMessage(nonce);
    res.json({ nonce, message });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// =========================================================================
// POST /auth/verify – verify wallet signature → check eligibility
// =========================================================================

const verifySchema = z.object({
  walletAddress: z.string().min(1),
  signature: z.string().min(1),
  network: z.string().min(1),
  chainId: z.number().int().nonnegative(),
  chainType: z.enum(["evm", "solana"]).default("evm"),
});

router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, network, chainId, chainType } =
      verifySchema.parse(req.body);

    // 1. Verify signature
    let valid = false;
    if (chainType === "evm") {
      valid = await verifyEvmSignature(walletAddress, signature);
    } else {
      valid = await verifySolanaSignature(walletAddress, signature);
    }

    if (!valid) {
      res.status(401).json({ error: "Signature verification failed" });
      return;
    }

    // 2. Consume the nonce so it can't be replayed
    await consumeNonce(walletAddress);

    // 3. Check if user already exists
    const existing = await query(
      `SELECT id, argus_id, eligible, signup_complete, smart_wallet FROM users WHERE wallet_address = $1`,
      [walletAddress.toLowerCase()],
    );

    if (existing.rowCount && existing.rowCount > 0) {
      const user = existing.rows[0];
      const token = issueToken(walletAddress, user.argus_id);
      res.json({
        token,
        user: {
          argusId: user.argus_id,
          eligible: user.eligible,
          signupComplete: user.signup_complete,
          smartWallet: user.smart_wallet,
        },
      });
      return;
    }

    // 4. New user – fetch transaction count via Moralis
    let qualityCount = 0;

    if (chainType === "evm") {
      qualityCount = await getEvmTransactionCount(walletAddress, chainId);
    } else {
      qualityCount = await getSolanaTransactionCount(walletAddress);
    }

    const eligible = qualityCount >= CONFIG.minQualityTransactions;

    // 5. Create user record
    const result = await query(
      `INSERT INTO users (wallet_address, network, chain_type, eligible, onchain_id)
       VALUES ($1, $2, $3, $4, $1)
       RETURNING argus_id`,
      [walletAddress.toLowerCase(), network, chainType, eligible],
    );

    const argusId = result.rows[0].argus_id;
    const token = issueToken(walletAddress, argusId);

    if (!eligible) {
      res.json({
        token,
        eligible: false,
        qualityTransactions: qualityCount,
        required: CONFIG.minQualityTransactions,
        message:
          "Funding for this wallet not available at the moment",
      });
      return;
    }

    // 6. Eligible – return token and prompt for metadata
    res.json({
      token,
      eligible: true,
      qualityTransactions: qualityCount,
      message: "Wallet eligible. Please complete your profile to proceed.",
    });
  } catch (err: any) {
    console.error("Auth verify error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
