const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LibAddress", function () {
  let harness;
  let receiver, rejecter, recorder;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const LibAddressHarness = await ethers.getContractFactory("LibAddressHarness");
    harness = await LibAddressHarness.deploy();
    await harness.waitForDeployment();

    const EtherReceiver = await ethers.getContractFactory("EtherReceiver");
    receiver = await EtherReceiver.deploy();
    await receiver.waitForDeployment();

    const EtherRejecter = await ethers.getContractFactory("EtherRejecter");
    rejecter = await EtherRejecter.deploy();
    await rejecter.waitForDeployment();

    const CallRecorder = await ethers.getContractFactory("CallRecorder");
    recorder = await CallRecorder.deploy();
    await recorder.waitForDeployment();

    // Fund the harness
    await owner.sendTransaction({
      to: await harness.getAddress(),
      value: ethers.parseEther("10"),
    });
  });

  describe("isContract", function () {
    it("should return true for a contract address", async function () {
      expect(await harness.isContract(await receiver.getAddress())).to.equal(true);
    });

    it("should return false for an EOA", async function () {
      expect(await harness.isContract(owner.address)).to.equal(false);
    });

    it("should return false for zero address", async function () {
      expect(await harness.isContract(ethers.ZeroAddress)).to.equal(false);
    });
  });

  describe("sendValue", function () {
    it("should send ETH to a payable address", async function () {
      const receiverAddr = await receiver.getAddress();
      const amount = ethers.parseEther("1");
      const balBefore = await ethers.provider.getBalance(receiverAddr);
      await harness.sendValue(receiverAddr, amount);
      const balAfter = await ethers.provider.getBalance(receiverAddr);
      expect(balAfter - balBefore).to.equal(amount);
    });

    it("should send ETH to an EOA", async function () {
      const [, recipient] = await ethers.getSigners();
      const amount = ethers.parseEther("1");
      const balBefore = await ethers.provider.getBalance(recipient.address);
      await harness.sendValue(recipient.address, amount);
      const balAfter = await ethers.provider.getBalance(recipient.address);
      expect(balAfter - balBefore).to.equal(amount);
    });

    it("should revert when sending to a contract that rejects ETH", async function () {
      await expect(
        harness.sendValue(await rejecter.getAddress(), ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(harness, "FailedInnerCall");
    });

    it("should revert when balance is insufficient", async function () {
      await expect(
        harness.sendValue(owner.address, ethers.parseEther("999"))
      ).to.be.revertedWithCustomError(harness, "AddressInsufficientBalance");
    });

    it("should send zero value without error", async function () {
      await harness.sendValue(owner.address, 0);
    });
  });

  describe("functionCall", function () {
    it("should call a function on a contract and return result", async function () {
      const iface = recorder.interface;
      const calldata = iface.encodeFunctionData("echoUint", [42]);
      const result = await harness.functionCall.staticCall(await recorder.getAddress(), calldata);
      const decoded = iface.decodeFunctionResult("echoUint", result);
      expect(decoded[0]).to.equal(84n);
    });

    it("should revert when calling a non-contract address", async function () {
      await expect(
        harness.functionCall(owner.address, "0x12345678")
      ).to.be.reverted;
    });

    it("should propagate revert from the target", async function () {
      const iface = recorder.interface;
      const calldata = iface.encodeFunctionData("failingFunction");
      await expect(
        harness.functionCall(await recorder.getAddress(), calldata)
      ).to.be.revertedWith("Intentional failure");
    });
  });

  describe("functionCallWithValue", function () {
    it("should call a function with ETH value", async function () {
      const recorderAddr = await recorder.getAddress();
      const iface = recorder.interface;
      const calldata = iface.encodeFunctionData("record");
      await harness.functionCallWithValue(recorderAddr, calldata, ethers.parseEther("1"));
      expect(await recorder.lastValue()).to.equal(ethers.parseEther("1"));
      expect(await recorder.callCount()).to.equal(1);
    });

    it("should revert if harness has insufficient balance", async function () {
      const calldata = recorder.interface.encodeFunctionData("record");
      await expect(
        harness.functionCallWithValue(
          await recorder.getAddress(),
          calldata,
          ethers.parseEther("999")
        )
      ).to.be.revertedWithCustomError(harness, "AddressInsufficientBalance");
    });
  });

  describe("functionStaticCall", function () {
    it("should perform a static call and return result", async function () {
      const iface = recorder.interface;
      const calldata = iface.encodeFunctionData("echoUint", [10]);
      const result = await harness.functionStaticCall(await recorder.getAddress(), calldata);
      const decoded = iface.decodeFunctionResult("echoUint", result);
      expect(decoded[0]).to.equal(20n);
    });
  });
});
