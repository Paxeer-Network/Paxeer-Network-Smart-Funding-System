/**
 * Global type declarations shared across the Paxeer Funding monorepo.
 */

/** Ethereum address (0x-prefixed, 42 chars) */
type Address = `0x${string}`;

/** Transaction hash (0x-prefixed, 66 chars) */
type TxHash = `0x${string}`;

/** Hex-encoded string */
type Hex = `0x${string}`;

/** Chain ID as a number */
type ChainId = number;

/** ISO-8601 timestamp string */
type ISOTimestamp = string;

/** UUID v4 string */
type UUID = string;
