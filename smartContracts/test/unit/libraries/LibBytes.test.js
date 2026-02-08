const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LibBytes", function () {
  let harness;

  beforeEach(async function () {
    const LibBytesHarness = await ethers.getContractFactory("LibBytesHarness");
    harness = await LibBytesHarness.deploy();
    await harness.waitForDeployment();
  });

  describe("slice", function () {
    it("should return a correct slice from the beginning", async function () {
      const data = "0xaabbccddee";
      const result = await harness.slice(data, 0, 3);
      expect(result).to.equal("0xaabbcc");
    });

    it("should return a correct slice from the middle", async function () {
      const data = "0xaabbccddee";
      const result = await harness.slice(data, 1, 3);
      expect(result).to.equal("0xbbccdd");
    });

    it("should return the full data when slice covers everything", async function () {
      const data = "0xaabbccdd";
      const result = await harness.slice(data, 0, 4);
      expect(result).to.equal("0xaabbccdd");
    });

    it("should return empty bytes for zero-length slice", async function () {
      const data = "0xaabbccdd";
      const result = await harness.slice(data, 0, 0);
      expect(result).to.equal("0x");
    });

    it("should revert when slice is out of bounds", async function () {
      const data = "0xaabbccdd";
      await expect(
        harness.slice(data, 2, 5)
      ).to.be.revertedWithCustomError(harness, "BytesSliceOutOfBounds");
    });

    it("should revert when start is beyond data length", async function () {
      const data = "0xaabb";
      await expect(
        harness.slice(data, 10, 1)
      ).to.be.revertedWithCustomError(harness, "BytesSliceOutOfBounds");
    });

    it("should handle large data slicing", async function () {
      const data = "0x" + "ab".repeat(256);
      const result = await harness.slice(data, 100, 50);
      expect(ethers.dataLength(result)).to.equal(50);
    });
  });

  describe("readAddress", function () {
    it("should read an address correctly from position 0", async function () {
      const addr = "0x1234567890AbcdEF1234567890aBcdef12345678";
      // Pad to 20 bytes (address is already 20 bytes)
      const data = addr.toLowerCase() + "00".repeat(12);
      const result = await harness.readAddress(data, 0);
      expect(result.toLowerCase()).to.equal(addr.toLowerCase());
    });

    it("should read an address from an offset", async function () {
      const addr = "0x1234567890AbcdEF1234567890aBcdef12345678";
      // 4 bytes prefix + address
      const data = "0xdeadbeef" + addr.slice(2).toLowerCase() + "00".repeat(12);
      const result = await harness.readAddress(data, 4);
      expect(result.toLowerCase()).to.equal(addr.toLowerCase());
    });

    it("should revert when out of bounds", async function () {
      const data = "0xaabbccdd"; // 4 bytes, need 20
      await expect(
        harness.readAddress(data, 0)
      ).to.be.revertedWithCustomError(harness, "BytesSliceOutOfBounds");
    });
  });

  describe("readUint256", function () {
    it("should read a uint256 correctly", async function () {
      const value = 12345n;
      const encoded = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [value]);
      const result = await harness.readUint256(encoded, 0);
      expect(result).to.equal(value);
    });

    it("should read uint256 from an offset", async function () {
      const prefix = "0xdeadbeef";
      const value = 999999n;
      const encoded = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [value]);
      const data = ethers.concat([prefix, encoded]);
      const result = await harness.readUint256(data, 4);
      expect(result).to.equal(value);
    });

    it("should read max uint256", async function () {
      const maxUint = ethers.MaxUint256;
      const encoded = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [maxUint]);
      const result = await harness.readUint256(encoded, 0);
      expect(result).to.equal(maxUint);
    });

    it("should revert when out of bounds", async function () {
      const data = "0xaabbccdd";
      await expect(
        harness.readUint256(data, 0)
      ).to.be.revertedWithCustomError(harness, "BytesSliceOutOfBounds");
    });
  });

  describe("readSelector", function () {
    it("should read the function selector from calldata", async function () {
      const iface = new ethers.Interface(["function transfer(address,uint256)"]);
      const calldata = iface.encodeFunctionData("transfer", [
        ethers.ZeroAddress,
        100,
      ]);
      const selector = await harness.readSelector(calldata);
      expect(selector).to.equal(iface.getFunction("transfer").selector);
    });

    it("should read selector from minimal 4-byte data", async function () {
      const data = "0xdeadbeef";
      const result = await harness.readSelector(data);
      expect(result).to.equal("0xdeadbeef");
    });

    it("should revert for data shorter than 4 bytes", async function () {
      await expect(
        harness.readSelector("0xaabb")
      ).to.be.revertedWithCustomError(harness, "BytesSliceOutOfBounds");
    });

    it("should revert for empty data", async function () {
      await expect(
        harness.readSelector("0x")
      ).to.be.revertedWithCustomError(harness, "BytesSliceOutOfBounds");
    });
  });
});
