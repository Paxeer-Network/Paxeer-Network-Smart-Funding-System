const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReentrancyGuard", function () {
  let harness;

  beforeEach(async function () {
    const ReentrancyHarness = await ethers.getContractFactory("ReentrancyHarness");
    harness = await ReentrancyHarness.deploy();
    await harness.waitForDeployment();
  });

  describe("nonReentrant modifier", function () {
    it("should allow normal calls to protected functions", async function () {
      await harness.protectedIncrement();
      expect(await harness.counter()).to.equal(1);
    });

    it("should allow multiple sequential calls", async function () {
      await harness.protectedIncrement();
      await harness.protectedIncrement();
      await harness.protectedIncrement();
      expect(await harness.counter()).to.equal(3);
    });

    it("should allow calls to unprotected functions", async function () {
      await harness.unprotectedIncrement();
      expect(await harness.counter()).to.equal(1);
    });

    it("should block reentrant calls from the same contract", async function () {
      // callSelf() calls protectedIncrement() on itself — reentrancy blocked
      await harness.callSelf();
      // counter should be 1 (only from callSelf itself, not the reentrant protectedIncrement)
      expect(await harness.counter()).to.equal(1);
    });

    it("should revert when a nonReentrant function calls another nonReentrant function externally", async function () {
      await expect(harness.reentrantCall()).to.be.reverted;
    });
  });
});
