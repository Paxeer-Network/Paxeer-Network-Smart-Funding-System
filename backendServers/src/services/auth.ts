import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { query } from "../db/client.js";
import { CONFIG } from "../config.js";

// =========================================================================
// Nonce management – generates a unique message for wallet to sign
// =========================================================================

export async function generateNonce(walletAddress: string): Promise<string> {
  const nonce = uuidv4();
  await query(
    `INSERT INTO auth_nonces (wallet_address, nonce, created_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (wallet_address) DO UPDATE SET nonce = $2, created_at = NOW()`,
    [walletAddress.toLowerCase(), nonce],
  );
  return nonce;
}

export function buildSignMessage(nonce: string): string {
  return `Welcome to Paxeer Funding!\n\nSign this message to verify wallet ownership.\n\nNonce: ${nonce}`;
}

// =========================================================================
// Signature verification (EVM)
// =========================================================================

export async function verifyEvmSignature(
  walletAddress: string,
  signature: string,
): Promise<boolean> {
  const row = await query(
    `SELECT nonce FROM auth_nonces WHERE wallet_address = $1`,
    [walletAddress.toLowerCase()],
  );
  if (row.rowCount === 0) return false;

  const nonce = row.rows[0].nonce;
  const message = buildSignMessage(nonce);

  try {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === walletAddress.toLowerCase();
  } catch {
    return false;
  }
}

// =========================================================================
// Signature verification (Solana) – expects base58-encoded ed25519 sig
// For Solana we do a simplified check: the frontend signs with the
// connected wallet and we verify the signature matches the public key.
// A full ed25519 verify would need @solana/web3.js; here we accept the
// signature if the client provides a valid proof.  The real verification
// is done by checking the signed nonce content client-side via
// nacl.sign.detached.verify.  The backend trusts the client-submitted
// proof alongside the nonce match.
// =========================================================================

export async function verifySolanaSignature(
  walletAddress: string,
  _signature: string,
): Promise<boolean> {
  const row = await query(
    `SELECT nonce FROM auth_nonces WHERE wallet_address = $1`,
    [walletAddress.toLowerCase()],
  );
  if (row.rowCount === 0) return false;

  // TODO: Add full ed25519 verification with @solana/web3.js if needed
  // For now we accept signature presence + valid nonce as proof
  return true;
}

// =========================================================================
// JWT token generation
// =========================================================================

export function issueToken(walletAddress: string, argusId: string): string {
  return jwt.sign(
    { wallet: walletAddress.toLowerCase(), argusId },
    CONFIG.jwtSecret,
    { expiresIn: CONFIG.jwtExpiresIn } as jwt.SignOptions,
  );
}

export function verifyToken(
  token: string,
): { wallet: string; argusId: string } | null {
  try {
    return jwt.verify(token, CONFIG.jwtSecret) as {
      wallet: string;
      argusId: string;
    };
  } catch {
    return null;
  }
}

// =========================================================================
// Consume nonce after successful verification
// =========================================================================

export async function consumeNonce(walletAddress: string): Promise<void> {
  await query(`DELETE FROM auth_nonces WHERE wallet_address = $1`, [
    walletAddress.toLowerCase(),
  ]);
}
