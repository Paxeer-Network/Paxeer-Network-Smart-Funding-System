const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Pausable", function () {
  let pausable;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const PausableHarness = await ethers.getContractFactory("PausableHarness");
    pausable = await PausableHarness.deploy();
    await pausable.waitForDeployment();
  });

  describe("Initial state", function () {
    it("should not be paused initially", async function () {
      expect(await pausable.paused()).to.equal(false);
    });
  });

  describe("whenNotPaused modifier", function () {
    it("should allow calls when not paused", async function () {
      await pausable.incrementWhenNotPaused();
      expect(await pausable.counter()).to.equal(1);
    });

    it("should revert calls when paused", async function () {
      await pausable.pause();
      await expect(
        pausable.incrementWhenNotPaused()
      ).to.be.revertedWithCustomError(pausable, "EnforcedPause");
    });
  });

  describe("whenPaused modifier", function () {
    it("should revert calls when not paused", async function () {
      await expect(
        pausable.incrementWhenPaused()
      ).to.be.revertedWithCustomError(pausable, "ExpectedPause");
    });

    it("should allow calls when paused", async function () {
      await pausable.pause();
      await pausable.incrementWhenPaused();
      expect(await pausable.counter()).to.equal(1);
    });
  });

  describe("pause", function () {
    it("should set paused to true", async function () {
      await pausable.pause();
      expect(await pausable.paused()).to.equal(true);
    });

    it("should emit Paused event", async function () {
      await expect(pausable.pause())
        .to.emit(pausable, "Paused")
        .withArgs(owner.address);
    });

    it("should revert if already paused", async function () {
      await pausable.pause();
      await expect(pausable.pause()).to.be.revertedWithCustomError(
        pausable,
        "EnforcedPause"
      );
    });
  });

  describe("unpause", function () {
    it("should set paused to false", async function () {
      await pausable.pause();
      await pausable.unpause();
      expect(await pausable.paused()).to.equal(false);
    });

    it("should emit Unpaused event", async function () {
      await pausable.pause();
      await expect(pausable.unpause())
        .to.emit(pausable, "Unpaused")
        .withArgs(owner.address);
    });

    it("should revert if not paused", async function () {
      await expect(pausable.unpause()).to.be.revertedWithCustomError(
        pausable,
        "ExpectedPause"
      );
    });
  });

  describe("Pause-unpause cycle", function () {
    it("should allow normal operation after unpause", async function () {
      await pausable.pause();
      await pausable.unpause();
      await pausable.incrementWhenNotPaused();
      expect(await pausable.counter()).to.equal(1);
    });

    it("should allow multiple pause/unpause cycles", async function () {
      for (let i = 0; i < 5; i++) {
        await pausable.pause();
        expect(await pausable.paused()).to.equal(true);
        await pausable.unpause();
        expect(await pausable.paused()).to.equal(false);
      }
    });
  });
});
