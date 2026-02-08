const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ownable", function () {
  let ownable;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const OwnableHarness = await ethers.getContractFactory("OwnableHarness");
    ownable = await OwnableHarness.deploy(owner.address);
    await ownable.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await ownable.owner()).to.equal(owner.address);
    });

    it("should revert if deployed with zero address owner", async function () {
      const OwnableHarness = await ethers.getContractFactory("OwnableHarness");
      await expect(
        OwnableHarness.deploy(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(ownable, "OwnableInvalidOwner");
    });

    it("should emit OwnershipTransferred on deployment", async function () {
      const OwnableHarness = await ethers.getContractFactory("OwnableHarness");
      const tx = await OwnableHarness.deploy(addr1.address);
      await expect(tx.deploymentTransaction())
        .to.emit(tx, "OwnershipTransferred")
        .withArgs(ethers.ZeroAddress, addr1.address);
    });
  });

  describe("onlyOwner modifier", function () {
    it("should allow owner to call protected functions", async function () {
      await ownable.setProtectedValue(42);
      expect(await ownable.protectedValue()).to.equal(42);
    });

    it("should revert when non-owner calls protected functions", async function () {
      await expect(
        ownable.connect(addr1).setProtectedValue(42)
      ).to.be.revertedWithCustomError(ownable, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });
  });

  describe("transferOwnership", function () {
    it("should transfer ownership to a new address", async function () {
      await ownable.transferOwnership(addr1.address);
      expect(await ownable.owner()).to.equal(addr1.address);
    });

    it("should emit OwnershipTransferred event", async function () {
      await expect(ownable.transferOwnership(addr1.address))
        .to.emit(ownable, "OwnershipTransferred")
        .withArgs(owner.address, addr1.address);
    });

    it("should revert when transferring to zero address", async function () {
      await expect(
        ownable.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(ownable, "OwnableInvalidOwner");
    });

    it("should revert when non-owner tries to transfer", async function () {
      await expect(
        ownable.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWithCustomError(ownable, "OwnableUnauthorizedAccount");
    });

    it("should allow new owner to call protected functions after transfer", async function () {
      await ownable.transferOwnership(addr1.address);
      await ownable.connect(addr1).setProtectedValue(99);
      expect(await ownable.protectedValue()).to.equal(99);
    });

    it("should prevent old owner from calling protected functions after transfer", async function () {
      await ownable.transferOwnership(addr1.address);
      await expect(
        ownable.setProtectedValue(99)
      ).to.be.revertedWithCustomError(ownable, "OwnableUnauthorizedAccount");
    });
  });

  describe("renounceOwnership", function () {
    it("should set owner to zero address", async function () {
      await ownable.renounceOwnership();
      expect(await ownable.owner()).to.equal(ethers.ZeroAddress);
    });

    it("should emit OwnershipTransferred event", async function () {
      await expect(ownable.renounceOwnership())
        .to.emit(ownable, "OwnershipTransferred")
        .withArgs(owner.address, ethers.ZeroAddress);
    });

    it("should prevent anyone from calling protected functions after renounce", async function () {
      await ownable.renounceOwnership();
      await expect(
        ownable.setProtectedValue(42)
      ).to.be.revertedWithCustomError(ownable, "OwnableUnauthorizedAccount");
    });

    it("should revert when non-owner tries to renounce", async function () {
      await expect(
        ownable.connect(addr1).renounceOwnership()
      ).to.be.revertedWithCustomError(ownable, "OwnableUnauthorizedAccount");
    });
  });
});
