import { Router, Response, type IRouter } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { query } from "../db/client.js";
import { AuthRequest, requireAuth } from "../middleware/auth.js";

const router: IRouter = Router();

// =========================================================================
// POST /users/complete-signup – collect metadata, email, PIN
// =========================================================================

const signupSchema = z.object({
  email: z.string().email(),
  pin: z.string().min(4).max(12),
  userAlias: z.string().min(1).max(128),
  evmAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address").optional(),
  telegram: z.string().max(128).optional(),
  twitter: z.string().max(128).optional(),
  website: z.string().max(255).optional(),
  github: z.string().max(128).optional(),
  discord: z.string().max(128).optional(),
});

router.post(
  "/complete-signup",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const wallet = req.user.wallet;
      const data = signupSchema.parse(req.body);

      // Check user exists and is eligible
      const userRow = await query(
        `SELECT id, eligible, signup_complete FROM users WHERE wallet_address = $1`,
        [wallet],
      );

      if (!userRow.rowCount || userRow.rowCount === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const user = userRow.rows[0];

      if (!user.eligible) {
        res.status(403).json({
          error: "Funding for this wallet not available at the moment",
        });
        return;
      }

      if (user.signup_complete) {
        res.status(409).json({ error: "Signup already completed" });
        return;
      }

      // Hash the PIN
      const pinHash = await bcrypt.hash(data.pin, 12);

      // Update user record with metadata + email/pin
      await query(
        `UPDATE users SET
          email = $1,
          pin_hash = $2,
          user_alias = $3,
          telegram = $4,
          twitter = $5,
          website = $6,
          github = $7,
          discord = $8,
          signup_complete = TRUE,
          updated_at = NOW()
        WHERE wallet_address = $9`,
        [
          data.email,
          pinHash,
          data.userAlias,
          data.telegram || null,
          data.twitter || null,
          data.website || null,
          data.github || null,
          data.discord || null,
          wallet,
        ],
      );

      // Determine the EVM owner address for the smart wallet.
      // If user connected via Solana, they must provide an EVM address for on-chain ownership.
      const chainTypeRow = await query(
        `SELECT chain_type FROM users WHERE id = $1`,
        [user.id],
      );
      const chainType = chainTypeRow.rows[0]?.chain_type;
      let ownerAddress = wallet;

      if (chainType === "solana") {
        if (!data.evmAddress) {
          res.status(400).json({ error: "EVM address is required for Solana wallet users" });
          return;
        }
        ownerAddress = data.evmAddress.toLowerCase();
      }

      // Queue the wallet assignment job
      await query(
        `INSERT INTO assignment_queue (user_id, smart_wallet, owner_address, network, status)
         VALUES ($1, '', $2, (SELECT network FROM users WHERE id = $1), 'pending')`,
        [user.id, ownerAddress],
      );

      // Queue the funding job (will execute after assignment completes)
      await query(
        `INSERT INTO funding_queue (user_id, wallet_address, smart_wallet, network, status)
         VALUES ($1, $2, '', (SELECT network FROM users WHERE id = $1), 'pending')`,
        [user.id, wallet],
      );

      res.json({
        message: "Signup complete. Your smart wallet is being prepared.",
        argusId: req.user.argusId,
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: err.errors });
        return;
      }
      console.error("Complete signup error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// =========================================================================
// GET /users/status – get current user status
// =========================================================================

router.get(
  "/status",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const result = await query(
        `SELECT argus_id, wallet_address, network, chain_type, email,
                user_alias, telegram, twitter, website, github, discord,
                smart_wallet, eligible, signup_complete, created_at
         FROM users WHERE wallet_address = $1`,
        [req.user.wallet],
      );

      if (!result.rowCount || result.rowCount === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const u = result.rows[0];

      // Check assignment status
      let assignmentStatus = null;
      const aRow = await query(
        `SELECT status, smart_wallet, tx_hash FROM assignment_queue
         WHERE user_id = (SELECT id FROM users WHERE wallet_address = $1)
         ORDER BY created_at DESC LIMIT 1`,
        [req.user.wallet],
      );
      if (aRow.rowCount && aRow.rowCount > 0) {
        assignmentStatus = aRow.rows[0];
      }

      // Check funding status
      let fundingStatus = null;
      const fRow = await query(
        `SELECT status, tx_hash, amount FROM funding_queue
         WHERE user_id = (SELECT id FROM users WHERE wallet_address = $1)
         ORDER BY created_at DESC LIMIT 1`,
        [req.user.wallet],
      );
      if (fRow.rowCount && fRow.rowCount > 0) {
        fundingStatus = fRow.rows[0];
      }

      res.json({
        user: {
          argusId: u.argus_id,
          walletAddress: u.wallet_address,
          network: u.network,
          chainType: u.chain_type,
          email: u.email,
          userAlias: u.user_alias,
          telegram: u.telegram,
          twitter: u.twitter,
          website: u.website,
          github: u.github,
          discord: u.discord,
          smartWallet: u.smart_wallet,
          eligible: u.eligible,
          signupComplete: u.signup_complete,
          createdAt: u.created_at,
        },
        assignmentStatus,
        fundingStatus,
      });
    } catch (err: any) {
      console.error("User status error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// =========================================================================
// POST /users/verify-pin – verify PIN for sensitive operations
// =========================================================================

const pinSchema = z.object({
  pin: z.string().min(4).max(12),
});

router.post(
  "/verify-pin",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { pin } = pinSchema.parse(req.body);

      const result = await query(
        `SELECT pin_hash FROM users WHERE wallet_address = $1`,
        [req.user.wallet],
      );

      if (!result.rowCount || result.rowCount === 0 || !result.rows[0].pin_hash) {
        res.status(404).json({ error: "User not found or PIN not set" });
        return;
      }

      const valid = await bcrypt.compare(pin, result.rows[0].pin_hash);
      res.json({ valid });
    } catch (err: any) {
      console.error("Verify PIN error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
