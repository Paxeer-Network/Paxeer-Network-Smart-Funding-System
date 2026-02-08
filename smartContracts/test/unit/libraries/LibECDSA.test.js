const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LibECDSA", function () {
  let harness;
  let signer;

  beforeEach(async function () {
    [signer] = await ethers.getSigners();
    const LibECDSAHarness = await ethers.getContractFactory("LibECDSAHarness");
    harness = await LibECDSAHarness.deploy();
    await harness.waitForDeployment();
  });

  describe("recover", function () {
    it("should recover the signer from a valid signature", async function () {
      const message = "Hello Paxeer";
      const messageHash = ethers.hashMessage(message);
      const signature = await signer.signMessage(message);
      const recovered = await harness.recover(messageHash, signature);
      expect(recovered).to.equal(signer.address);
    });

    it("should recover correctly for a raw hash signature", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("test data"));
      const ethHash = await harness.toEthSignedMessageHash(hash);
      const signature = await signer.signMessage(ethers.getBytes(hash));
      const recovered = await harness.recover(ethHash, signature);
      expect(recovered).to.equal(signer.address);
    });

    it("should return a different address for a wrong message", async function () {
      const signature = await signer.signMessage("correct message");
      const wrongHash = ethers.hashMessage("wrong message");
      const recovered = await harness.recover(wrongHash, signature);
      expect(recovered).to.not.equal(signer.address);
    });

    it("should revert for invalid signature length", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      // 64-byte sig is invalid
      const badSig = "0x" + "aa".repeat(64);
      await expect(
        harness.recover(hash, badSig)
      ).to.be.revertedWithCustomError(harness, "ECDSAInvalidSignatureLength");
    });

    it("should revert for zero-length signature", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      await expect(
        harness.recover(hash, "0x")
      ).to.be.revertedWithCustomError(harness, "ECDSAInvalidSignatureLength");
    });

    it("should revert for signature with high s value", async function () {
      const message = "test message";
      const hash = ethers.hashMessage(message);
      const sig = await signer.signMessage(message);
      const sigBytes = ethers.getBytes(sig);

      // Manually set s to a high value (above the secp256k1 half-order)
      const highS = "0x" + "ff".repeat(32);
      const manipulated = ethers.concat([
        sigBytes.slice(0, 32), // r
        ethers.getBytes(highS), // s (high)
        sigBytes.slice(64),    // v
      ]);

      await expect(
        harness.recover(hash, manipulated)
      ).to.be.revertedWithCustomError(harness, "ECDSAInvalidSignatureS");
    });
  });

  describe("toEthSignedMessageHash", function () {
    it("should produce correct Ethereum signed message hash", async function () {
      const hash = ethers.keccak256(ethers.toUtf8Bytes("hello"));
      const expected = ethers.hashMessage(ethers.getBytes(hash));
      const result = await harness.toEthSignedMessageHash(hash);
      expect(result).to.equal(expected);
    });

    it("should produce different hashes for different inputs", async function () {
      const hash1 = ethers.keccak256(ethers.toUtf8Bytes("a"));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("b"));
      const result1 = await harness.toEthSignedMessageHash(hash1);
      const result2 = await harness.toEthSignedMessageHash(hash2);
      expect(result1).to.not.equal(result2);
    });
  });

  describe("toTypedDataHash", function () {
    it("should produce correct EIP-712 typed data hash", async function () {
      const domainSep = ethers.keccak256(ethers.toUtf8Bytes("domain"));
      const structHash = ethers.keccak256(ethers.toUtf8Bytes("struct"));
      const result = await harness.toTypedDataHash(domainSep, structHash);

      // Manual calculation: keccak256("\x19\x01" + domainSeparator + structHash)
      const expected = ethers.keccak256(
        ethers.concat([
          ethers.toUtf8Bytes("\x19\x01"),
          ethers.getBytes(domainSep),
          ethers.getBytes(structHash),
        ])
      );
      expect(result).to.equal(expected);
    });
  });

  describe("Multiple signers", function () {
    it("should recover different signers correctly", async function () {
      const [, signer2, signer3] = await ethers.getSigners();
      const message = "multi-signer test";
      const hash = ethers.hashMessage(message);

      const sig1 = await signer.signMessage(message);
      const sig2 = await signer2.signMessage(message);
      const sig3 = await signer3.signMessage(message);

      expect(await harness.recover(hash, sig1)).to.equal(signer.address);
      expect(await harness.recover(hash, sig2)).to.equal(signer2.address);
      expect(await harness.recover(hash, sig3)).to.equal(signer3.address);
    });
  });
});
