const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventEmitter", function () {
  let eventEmitter;
  let owner, factory, wallet1, wallet2, addr1, unauthorized;

  beforeEach(async function () {
    [owner, factory, wallet1, wallet2, addr1, unauthorized] = await ethers.getSigners();

    const EventEmitter = await ethers.getContractFactory("EventEmitter");
    eventEmitter = await EventEmitter.deploy(owner.address);
    await eventEmitter.waitForDeployment();

    // Set factory
    await eventEmitter.setFactory(factory.address);
  });

  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await eventEmitter.owner()).to.equal(owner.address);
    });

    it("should start with zero total transactions", async function () {
      expect(await eventEmitter.totalTransactions()).to.equal(0);
    });

    it("should not be paused initially", async function () {
      expect(await eventEmitter.paused()).to.equal(false);
    });
  });

  describe("setFactory", function () {
    it("should set the factory address", async function () {
      expect(await eventEmitter.factory()).to.equal(factory.address);
    });

    it("should only allow owner to set factory", async function () {
      await expect(
        eventEmitter.connect(unauthorized).setFactory(addr1.address)
      ).to.be.revertedWithCustomError(eventEmitter, "OwnableUnauthorizedAccount");
    });

    it("should allow owner to update factory", async function () {
      await eventEmitter.setFactory(addr1.address);
      expect(await eventEmitter.factory()).to.equal(addr1.address);
    });
  });

  describe("registerWallet", function () {
    it("should allow factory to register a wallet", async function () {
      await eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address);
      expect(await eventEmitter.isRegisteredWallet(wallet1.address)).to.equal(true);
    });

    it("should allow owner to register a wallet", async function () {
      await eventEmitter.registerWallet(wallet1.address, addr1.address);
      expect(await eventEmitter.isRegisteredWallet(wallet1.address)).to.equal(true);
    });

    it("should emit WalletRegistered event", async function () {
      await expect(eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address))
        .to.emit(eventEmitter, "WalletRegistered")
        .withArgs(wallet1.address, addr1.address);
    });

    it("should store the wallet owner", async function () {
      await eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address);
      expect(await eventEmitter.walletOwnerOf(wallet1.address)).to.equal(addr1.address);
    });

    it("should revert when registering an already-registered wallet", async function () {
      await eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address);
      await expect(
        eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address)
      ).to.be.revertedWithCustomError(eventEmitter, "WalletAlreadyRegistered");
    });

    it("should revert when called by unauthorized address", async function () {
      await expect(
        eventEmitter.connect(unauthorized).registerWallet(wallet1.address, addr1.address)
      ).to.be.revertedWithCustomError(eventEmitter, "CallerNotFactory");
    });

    it("should allow registering multiple wallets", async function () {
      await eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address);
      await eventEmitter.connect(factory).registerWallet(wallet2.address, addr1.address);
      expect(await eventEmitter.isRegisteredWallet(wallet1.address)).to.equal(true);
      expect(await eventEmitter.isRegisteredWallet(wallet2.address)).to.equal(true);
    });
  });

  describe("deregisterWallet", function () {
    beforeEach(async function () {
      await eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address);
    });

    it("should deregister a wallet", async function () {
      await eventEmitter.connect(factory).deregisterWallet(wallet1.address);
      expect(await eventEmitter.isRegisteredWallet(wallet1.address)).to.equal(false);
    });

    it("should emit WalletDeregistered event", async function () {
      await expect(eventEmitter.connect(factory).deregisterWallet(wallet1.address))
        .to.emit(eventEmitter, "WalletDeregistered")
        .withArgs(wallet1.address);
    });

    it("should clear the wallet owner", async function () {
      await eventEmitter.connect(factory).deregisterWallet(wallet1.address);
      expect(await eventEmitter.walletOwnerOf(wallet1.address)).to.equal(ethers.ZeroAddress);
    });

    it("should revert when deregistering a non-registered wallet", async function () {
      await expect(
        eventEmitter.connect(factory).deregisterWallet(wallet2.address)
      ).to.be.revertedWithCustomError(eventEmitter, "WalletNotRegistered");
    });

    it("should revert when called by unauthorized address", async function () {
      await expect(
        eventEmitter.connect(unauthorized).deregisterWallet(wallet1.address)
      ).to.be.revertedWithCustomError(eventEmitter, "CallerNotFactory");
    });
  });

  describe("emitTransaction", function () {
    beforeEach(async function () {
      await eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address);
    });

    it("should emit TransactionExecuted event from a registered wallet", async function () {
      const to = addr1.address;
      const value = ethers.parseEther("1");
      const data = "0xdeadbeef";
      const nonce = 0;
      const success = true;
      const returnData = "0x";

      await expect(
        eventEmitter.connect(wallet1).emitTransaction(to, value, data, nonce, success, returnData)
      ).to.emit(eventEmitter, "TransactionExecuted");
    });

    it("should increment totalTransactions", async function () {
      await eventEmitter.connect(wallet1).emitTransaction(
        addr1.address, 0, "0x", 0, true, "0x"
      );
      expect(await eventEmitter.totalTransactions()).to.equal(1);

      await eventEmitter.connect(wallet1).emitTransaction(
        addr1.address, 0, "0x", 1, true, "0x"
      );
      expect(await eventEmitter.totalTransactions()).to.equal(2);
    });

    it("should revert when called by unregistered address", async function () {
      await expect(
        eventEmitter.connect(unauthorized).emitTransaction(
          addr1.address, 0, "0x", 0, true, "0x"
        )
      ).to.be.revertedWithCustomError(eventEmitter, "CallerNotRegisteredWallet");
    });

    it("should emit with failed transaction status", async function () {
      await expect(
        eventEmitter.connect(wallet1).emitTransaction(
          addr1.address, 100, "0x0badcafe", 0, false, "0x"
        )
      ).to.emit(eventEmitter, "TransactionExecuted");
    });

    it("should revert when paused", async function () {
      await eventEmitter.pause();
      await expect(
        eventEmitter.connect(wallet1).emitTransaction(
          addr1.address, 0, "0x", 0, true, "0x"
        )
      ).to.be.revertedWithCustomError(eventEmitter, "EnforcedPause");
    });

    it("should work again after unpause", async function () {
      await eventEmitter.pause();
      await eventEmitter.unpause();
      await eventEmitter.connect(wallet1).emitTransaction(
        addr1.address, 0, "0x", 0, true, "0x"
      );
      expect(await eventEmitter.totalTransactions()).to.equal(1);
    });
  });

  describe("Pause / Unpause", function () {
    it("should only allow owner to pause", async function () {
      await expect(
        eventEmitter.connect(unauthorized).pause()
      ).to.be.revertedWithCustomError(eventEmitter, "OwnableUnauthorizedAccount");
    });

    it("should only allow owner to unpause", async function () {
      await eventEmitter.pause();
      await expect(
        eventEmitter.connect(unauthorized).unpause()
      ).to.be.revertedWithCustomError(eventEmitter, "OwnableUnauthorizedAccount");
    });
  });

  describe("isRegisteredWallet", function () {
    it("should return false for unregistered address", async function () {
      expect(await eventEmitter.isRegisteredWallet(addr1.address)).to.equal(false);
    });

    it("should return false for zero address", async function () {
      expect(await eventEmitter.isRegisteredWallet(ethers.ZeroAddress)).to.equal(false);
    });
  });

  describe("Edge cases", function () {
    it("should handle re-registration after deregistration", async function () {
      await eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address);
      await eventEmitter.connect(factory).deregisterWallet(wallet1.address);
      // Re-register should work
      await eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address);
      expect(await eventEmitter.isRegisteredWallet(wallet1.address)).to.equal(true);
    });

    it("should handle emitTransaction with large data payload", async function () {
      await eventEmitter.connect(factory).registerWallet(wallet1.address, addr1.address);
      const bigData = "0x" + "ab".repeat(10000);
      await eventEmitter.connect(wallet1).emitTransaction(
        addr1.address, 0, bigData, 0, true, "0x"
      );
      expect(await eventEmitter.totalTransactions()).to.equal(1);
    });
  });
});
