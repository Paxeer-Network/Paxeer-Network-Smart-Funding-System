-- Paxeer Funding – Database Schema
-- Run: psql -U <user> -d paxeer_funding -f migration.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- Users
-- =========================================================================
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  argus_id        UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  wallet_address  VARCHAR(128) NOT NULL UNIQUE,
  network         VARCHAR(64) NOT NULL,
  chain_type      VARCHAR(16) NOT NULL DEFAULT 'evm',  -- 'evm' | 'solana'
  email           VARCHAR(255),
  pin_hash        VARCHAR(255),
  onchain_id      VARCHAR(128),
  user_alias      VARCHAR(128),
  telegram        VARCHAR(128),
  twitter         VARCHAR(128),
  website         VARCHAR(255),
  github          VARCHAR(128),
  discord         VARCHAR(128),
  smart_wallet    VARCHAR(128),
  eligible        BOOLEAN NOT NULL DEFAULT FALSE,
  signup_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- Funding Queue
-- =========================================================================
CREATE TYPE funding_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS funding_queue (
  id              SERIAL PRIMARY KEY,
  user_id         INT NOT NULL REFERENCES users(id),
  wallet_address  VARCHAR(128) NOT NULL,
  smart_wallet    VARCHAR(128) NOT NULL,
  network         VARCHAR(64) NOT NULL,
  amount          VARCHAR(78),
  token_address   VARCHAR(128),
  status          funding_status NOT NULL DEFAULT 'pending',
  tx_hash         VARCHAR(128),
  error           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- Assignment Queue
-- =========================================================================
CREATE TYPE assignment_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS assignment_queue (
  id              SERIAL PRIMARY KEY,
  user_id         INT NOT NULL REFERENCES users(id),
  smart_wallet    VARCHAR(128) NOT NULL,
  owner_address   VARCHAR(128) NOT NULL,
  network         VARCHAR(64) NOT NULL,
  status          assignment_status NOT NULL DEFAULT 'pending',
  tx_hash         VARCHAR(128),
  error           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- Auth nonces (for wallet signature verification)
-- =========================================================================
CREATE TABLE IF NOT EXISTS auth_nonces (
  wallet_address  VARCHAR(128) PRIMARY KEY,
  nonce           VARCHAR(128) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_funding_queue_status ON funding_queue(status);
CREATE INDEX IF NOT EXISTS idx_assignment_queue_status ON assignment_queue(status);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_smart_wallet ON users(smart_wallet);
