const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SSORegistry", function () {
  let ssoRegistry;
  let owner, wallet1, wallet2, signer1, signer2, signer3, unauthorized;

  // Permission constants
  const PERMISSION_EXECUTE = 1n;
  const PERMISSION_EXECUTE_BATCH = 2n;
  const PERMISSION_TRANSFER_ETH = 4n;
  const PERMISSION_TRANSFER_ERC20 = 8n;
  const PERMISSION_CALL_CONTRACT = 16n;
  const PERMISSION_ALL = 31n;

  async function getTimestamp() {
    return BigInt(await time.latest());
  }

  beforeEach(async function () {
    [owner, wallet1, wallet2, signer1, signer2, signer3, unauthorized] = await ethers.getSigners();

    const SSORegistry = await ethers.getContractFactory("SSORegistry");
    ssoRegistry = await SSORegistry.deploy(owner.address);
    await ssoRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set correct owner", async function () {
      expect(await ssoRegistry.owner()).to.equal(owner.address);
    });

    it("should have correct permission constants", async function () {
      expect(await ssoRegistry.PERMISSION_EXECUTE()).to.equal(PERMISSION_EXECUTE);
      expect(await ssoRegistry.PERMISSION_EXECUTE_BATCH()).to.equal(PERMISSION_EXECUTE_BATCH);
      expect(await ssoRegistry.PERMISSION_TRANSFER_ETH()).to.equal(PERMISSION_TRANSFER_ETH);
      expect(await ssoRegistry.PERMISSION_TRANSFER_ERC20()).to.equal(PERMISSION_TRANSFER_ERC20);
      expect(await ssoRegistry.PERMISSION_CALL_CONTRACT()).to.equal(PERMISSION_CALL_CONTRACT);
      expect(await ssoRegistry.PERMISSION_ALL()).to.equal(PERMISSION_ALL);
    });

    it("should have correct max session duration", async function () {
      expect(await ssoRegistry.MAX_SESSION_DURATION()).to.equal(30n * 24n * 60n * 60n);
    });

    it("should have correct max keys per wallet", async function () {
      expect(await ssoRegistry.MAX_KEYS_PER_WALLET()).to.equal(10);
    });
  });

  describe("registerSessionKey", function () {
    it("should register a session key for the caller (wallet)", async function () {
      const now = await getTimestamp();
      const validAfter = now;
      const validUntil = now + 3600n;

      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, validAfter, validUntil, PERMISSION_EXECUTE
      );

      const key = await ssoRegistry.getSessionKey(wallet1.address, signer1.address);
      expect(key.signer).to.equal(signer1.address);
      expect(key.active).to.equal(true);
      expect(key.permissions).to.equal(PERMISSION_EXECUTE);
    });

    it("should emit SessionKeyRegistered event", async function () {
      const now = await getTimestamp();
      const validAfter = now;
      const validUntil = now + 3600n;

      await expect(
        ssoRegistry.connect(wallet1).registerSessionKey(
          signer1.address, validAfter, validUntil, PERMISSION_EXECUTE
        )
      ).to.emit(ssoRegistry, "SessionKeyRegistered")
        .withArgs(wallet1.address, signer1.address, validAfter, validUntil, PERMISSION_EXECUTE);
    });

    it("should revert with zero address signer", async function () {
      const now = await getTimestamp();
      await expect(
        ssoRegistry.connect(wallet1).registerSessionKey(
          ethers.ZeroAddress, now, now + 3600n, PERMISSION_EXECUTE
        )
      ).to.be.revertedWithCustomError(ssoRegistry, "InvalidSigner");
    });

    it("should revert when validUntil <= validAfter", async function () {
      const now = await getTimestamp();
      await expect(
        ssoRegistry.connect(wallet1).registerSessionKey(
          signer1.address, now + 100n, now, PERMISSION_EXECUTE
        )
      ).to.be.revertedWithCustomError(ssoRegistry, "InvalidDuration");
    });

    it("should revert when validUntil == validAfter", async function () {
      const now = await getTimestamp();
      await expect(
        ssoRegistry.connect(wallet1).registerSessionKey(
          signer1.address, now, now, PERMISSION_EXECUTE
        )
      ).to.be.revertedWithCustomError(ssoRegistry, "InvalidDuration");
    });

    it("should revert when duration exceeds MAX_SESSION_DURATION", async function () {
      const now = await getTimestamp();
      const maxDuration = 30n * 24n * 60n * 60n;
      await expect(
        ssoRegistry.connect(wallet1).registerSessionKey(
          signer1.address, now, now + maxDuration + 1n, PERMISSION_EXECUTE
        )
      ).to.be.revertedWithCustomError(ssoRegistry, "InvalidDuration");
    });

    it("should allow duration exactly at MAX_SESSION_DURATION", async function () {
      const now = await getTimestamp();
      const maxDuration = 30n * 24n * 60n * 60n;
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + maxDuration, PERMISSION_EXECUTE
      );
      const key = await ssoRegistry.getSessionKey(wallet1.address, signer1.address);
      expect(key.active).to.equal(true);
    });

    it("should revert with zero permissions", async function () {
      const now = await getTimestamp();
      await expect(
        ssoRegistry.connect(wallet1).registerSessionKey(
          signer1.address, now, now + 3600n, 0
        )
      ).to.be.revertedWithCustomError(ssoRegistry, "InvalidPermissions");
    });

    it("should revert with permissions exceeding PERMISSION_ALL", async function () {
      const now = await getTimestamp();
      await expect(
        ssoRegistry.connect(wallet1).registerSessionKey(
          signer1.address, now, now + 3600n, PERMISSION_ALL + 1n
        )
      ).to.be.revertedWithCustomError(ssoRegistry, "InvalidPermissions");
    });

    it("should revert when session key already exists and is active", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      await expect(
        ssoRegistry.connect(wallet1).registerSessionKey(
          signer1.address, now, now + 7200n, PERMISSION_EXECUTE
        )
      ).to.be.revertedWithCustomError(ssoRegistry, "SessionKeyAlreadyExists");
    });

    it("should allow registering up to MAX_KEYS_PER_WALLET", async function () {
      const now = await getTimestamp();
      const signers = await ethers.getSigners();
      for (let i = 0; i < 10; i++) {
        await ssoRegistry.connect(wallet1).registerSessionKey(
          signers[i + 7].address, // offset to avoid collision with named signers
          now, now + 3600n, PERMISSION_EXECUTE
        );
      }
    });

    it("should revert when exceeding MAX_KEYS_PER_WALLET", async function () {
      const now = await getTimestamp();
      const signers = await ethers.getSigners();
      for (let i = 0; i < 10; i++) {
        await ssoRegistry.connect(wallet1).registerSessionKey(
          signers[i + 7].address,
          now, now + 3600n, PERMISSION_EXECUTE
        );
      }
      await expect(
        ssoRegistry.connect(wallet1).registerSessionKey(
          signers[17].address, now, now + 3600n, PERMISSION_EXECUTE
        )
      ).to.be.revertedWithCustomError(ssoRegistry, "MaxSessionKeysReached");
    });

    it("should register with combined permissions", async function () {
      const now = await getTimestamp();
      const combined = PERMISSION_EXECUTE | PERMISSION_TRANSFER_ETH | PERMISSION_CALL_CONTRACT;
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, combined
      );
      const key = await ssoRegistry.getSessionKey(wallet1.address, signer1.address);
      expect(key.permissions).to.equal(combined);
    });
  });

  describe("revokeSessionKey", function () {
    beforeEach(async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
    });

    it("should revoke an active session key", async function () {
      await ssoRegistry.connect(wallet1).revokeSessionKey(signer1.address);
      const key = await ssoRegistry.getSessionKey(wallet1.address, signer1.address);
      expect(key.active).to.equal(false);
    });

    it("should emit SessionKeyRevoked event", async function () {
      await expect(ssoRegistry.connect(wallet1).revokeSessionKey(signer1.address))
        .to.emit(ssoRegistry, "SessionKeyRevoked")
        .withArgs(wallet1.address, signer1.address);
    });

    it("should revert when revoking non-existent key", async function () {
      await expect(
        ssoRegistry.connect(wallet1).revokeSessionKey(signer2.address)
      ).to.be.revertedWithCustomError(ssoRegistry, "SessionKeyNotFound");
    });

    it("should revert when revoking already-revoked key", async function () {
      await ssoRegistry.connect(wallet1).revokeSessionKey(signer1.address);
      await expect(
        ssoRegistry.connect(wallet1).revokeSessionKey(signer1.address)
      ).to.be.revertedWithCustomError(ssoRegistry, "SessionKeyNotFound");
    });

    it("should allow re-registration after revocation", async function () {
      await ssoRegistry.connect(wallet1).revokeSessionKey(signer1.address);
      const now = await getTimestamp();
      // Should work since key was revoked and removed from array
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_ALL
      );
      const key = await ssoRegistry.getSessionKey(wallet1.address, signer1.address);
      expect(key.active).to.equal(true);
      expect(key.permissions).to.equal(PERMISSION_ALL);
    });
  });

  describe("validateSessionKey", function () {
    it("should return true for a valid active session key with correct permissions", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, PERMISSION_EXECUTE)
      ).to.equal(true);
    });

    it("should return false for non-existent session key", async function () {
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer2.address, PERMISSION_EXECUTE)
      ).to.equal(false);
    });

    it("should return false for revoked session key", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      await ssoRegistry.connect(wallet1).revokeSessionKey(signer1.address);
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, PERMISSION_EXECUTE)
      ).to.equal(false);
    });

    it("should return false before validAfter time", async function () {
      const now = await getTimestamp();
      const futureStart = now + 1000n;
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, futureStart, futureStart + 3600n, PERMISSION_EXECUTE
      );
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, PERMISSION_EXECUTE)
      ).to.equal(false);
    });

    it("should return true after validAfter time", async function () {
      const now = await getTimestamp();
      const futureStart = now + 100n;
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, futureStart, futureStart + 3600n, PERMISSION_EXECUTE
      );
      await time.increase(200);
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, PERMISSION_EXECUTE)
      ).to.equal(true);
    });

    it("should return false after validUntil time (expired)", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 100n, PERMISSION_EXECUTE
      );
      await time.increase(200);
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, PERMISSION_EXECUTE)
      ).to.equal(false);
    });

    it("should return false when required permissions not met", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      // Requires TRANSFER_ETH but key only has EXECUTE
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, PERMISSION_TRANSFER_ETH)
      ).to.equal(false);
    });

    it("should validate combined permissions correctly", async function () {
      const now = await getTimestamp();
      const combined = PERMISSION_EXECUTE | PERMISSION_TRANSFER_ETH;
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, combined
      );
      // Should pass for each individual permission
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, PERMISSION_EXECUTE)
      ).to.equal(true);
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, PERMISSION_TRANSFER_ETH)
      ).to.equal(true);
      // Should pass for combined
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, combined)
      ).to.equal(true);
      // Should fail for permission not in set
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, PERMISSION_CALL_CONTRACT)
      ).to.equal(false);
    });
  });

  describe("getActiveSigners", function () {
    it("should return empty array when no signers registered", async function () {
      const signers = await ssoRegistry.getActiveSigners(wallet1.address);
      expect(signers.length).to.equal(0);
    });

    it("should return active signers", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer2.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      const signers = await ssoRegistry.getActiveSigners(wallet1.address);
      expect(signers.length).to.equal(2);
    });

    it("should not include revoked signers", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer2.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      await ssoRegistry.connect(wallet1).revokeSessionKey(signer1.address);
      const signers = await ssoRegistry.getActiveSigners(wallet1.address);
      expect(signers.length).to.equal(1);
      expect(signers[0]).to.equal(signer2.address);
    });

    it("should not include expired signers", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 100n, PERMISSION_EXECUTE
      );
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer2.address, now, now + 10000n, PERMISSION_EXECUTE
      );
      await time.increase(200);
      const signers = await ssoRegistry.getActiveSigners(wallet1.address);
      expect(signers.length).to.equal(1);
      expect(signers[0]).to.equal(signer2.address);
    });

    it("should not include future-start signers", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer2.address, now + 5000n, now + 8600n, PERMISSION_EXECUTE
      );
      const signers = await ssoRegistry.getActiveSigners(wallet1.address);
      expect(signers.length).to.equal(1);
      expect(signers[0]).to.equal(signer1.address);
    });
  });

  describe("registerSessionKeyFor / revokeSessionKeyFor", function () {
    it("should allow authorized caller to register on behalf of wallet", async function () {
      await ssoRegistry.setAuthorizedCaller(owner.address, true);
      const now = await getTimestamp();
      await ssoRegistry.registerSessionKeyFor(
        wallet1.address, signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      const key = await ssoRegistry.getSessionKey(wallet1.address, signer1.address);
      expect(key.active).to.equal(true);
    });

    it("should allow the wallet itself to call registerSessionKeyFor", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKeyFor(
        wallet1.address, signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      const key = await ssoRegistry.getSessionKey(wallet1.address, signer1.address);
      expect(key.active).to.equal(true);
    });

    it("should revert for unauthorized caller", async function () {
      const now = await getTimestamp();
      await expect(
        ssoRegistry.connect(unauthorized).registerSessionKeyFor(
          wallet1.address, signer1.address, now, now + 3600n, PERMISSION_EXECUTE
        )
      ).to.be.revertedWithCustomError(ssoRegistry, "CallerNotWalletOrOwner");
    });

    it("should allow authorized caller to revoke on behalf of wallet", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      await ssoRegistry.setAuthorizedCaller(owner.address, true);
      await ssoRegistry.revokeSessionKeyFor(wallet1.address, signer1.address);
      const key = await ssoRegistry.getSessionKey(wallet1.address, signer1.address);
      expect(key.active).to.equal(false);
    });
  });

  describe("setAuthorizedCaller", function () {
    it("should only allow owner to set", async function () {
      await expect(
        ssoRegistry.connect(unauthorized).setAuthorizedCaller(wallet1.address, true)
      ).to.be.revertedWithCustomError(ssoRegistry, "OwnableUnauthorizedAccount");
    });

    it("should toggle authorization", async function () {
      await ssoRegistry.setAuthorizedCaller(wallet1.address, true);
      expect(await ssoRegistry.authorizedCallers(wallet1.address)).to.equal(true);
      await ssoRegistry.setAuthorizedCaller(wallet1.address, false);
      expect(await ssoRegistry.authorizedCallers(wallet1.address)).to.equal(false);
    });
  });

  describe("Edge cases", function () {
    it("should isolate session keys between wallets", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      // signer1 should not be valid for wallet2
      expect(
        await ssoRegistry.validateSessionKey(wallet2.address, signer1.address, PERMISSION_EXECUTE)
      ).to.equal(false);
    });

    it("should allow same signer across different wallets", async function () {
      const now = await getTimestamp();
      await ssoRegistry.connect(wallet1).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_EXECUTE
      );
      await ssoRegistry.connect(wallet2).registerSessionKey(
        signer1.address, now, now + 3600n, PERMISSION_ALL
      );
      expect(
        await ssoRegistry.validateSessionKey(wallet1.address, signer1.address, PERMISSION_EXECUTE)
      ).to.equal(true);
      expect(
        await ssoRegistry.validateSessionKey(wallet2.address, signer1.address, PERMISSION_ALL)
      ).to.equal(true);
    });
  });
});
