const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WalletFactory", function () {
  let walletFactory, eventEmitter, ssoRegistry, smartWalletImpl;
  let owner, user1, user2, user3, unauthorized;

  beforeEach(async function () {
    [owner, user1, user2, user3, unauthorized] = await ethers.getSigners();

    const EventEmitter = await ethers.getContractFactory("EventEmitter");
    eventEmitter = await EventEmitter.deploy(owner.address);
    await eventEmitter.waitForDeployment();

    const SSORegistry = await ethers.getContractFactory("SSORegistry");
    ssoRegistry = await SSORegistry.deploy(owner.address);
    await ssoRegistry.waitForDeployment();

    const SmartWallet = await ethers.getContractFactory("SmartWallet");
    smartWalletImpl = await SmartWallet.deploy();
    await smartWalletImpl.waitForDeployment();

    const WalletFactory = await ethers.getContractFactory("WalletFactory");
    walletFactory = await WalletFactory.deploy(
      owner.address,
      await smartWalletImpl.getAddress(),
      await eventEmitter.getAddress(),
      await ssoRegistry.getAddress()
    );
    await walletFactory.waitForDeployment();

    // Wire factory to event emitter
    await eventEmitter.setFactory(await walletFactory.getAddress());
  });

  describe("Deployment", function () {
    it("should set correct owner", async function () {
      expect(await walletFactory.owner()).to.equal(owner.address);
    });

    it("should set correct implementation", async function () {
      expect(await walletFactory.implementation()).to.equal(await smartWalletImpl.getAddress());
    });

    it("should set correct event emitter", async function () {
      expect(await walletFactory.eventEmitter()).to.equal(await eventEmitter.getAddress());
    });

    it("should set correct SSO registry", async function () {
      expect(await walletFactory.ssoRegistry()).to.equal(await ssoRegistry.getAddress());
    });

    it("should start with zero total wallets", async function () {
      expect(await walletFactory.totalWallets()).to.equal(0);
    });

    it("should revert with zero address implementation", async function () {
      const WalletFactory = await ethers.getContractFactory("WalletFactory");
      await expect(
        WalletFactory.deploy(
          owner.address,
          ethers.ZeroAddress,
          await eventEmitter.getAddress(),
          await ssoRegistry.getAddress()
        )
      ).to.be.revertedWithCustomError(walletFactory, "InvalidImplementation");
    });
  });

  describe("createWallet", function () {
    it("should create a wallet for a user", async function () {
      await walletFactory.createWallet(user1.address);
      const walletAddr = await walletFactory.getWallet(user1.address);
      expect(walletAddr).to.not.equal(ethers.ZeroAddress);
    });

    it("should emit WalletCreated event", async function () {
      await expect(walletFactory.createWallet(user1.address))
        .to.emit(walletFactory, "WalletCreated");
    });

    it("should register wallet with EventEmitter", async function () {
      await walletFactory.createWallet(user1.address);
      const walletAddr = await walletFactory.getWallet(user1.address);
      expect(await eventEmitter.isRegisteredWallet(walletAddr)).to.equal(true);
    });

    it("should initialize the wallet with correct owner", async function () {
      await walletFactory.createWallet(user1.address);
      const walletAddr = await walletFactory.getWallet(user1.address);
      const wallet = await ethers.getContractAt("SmartWallet", walletAddr);
      expect(await wallet.walletOwner()).to.equal(user1.address);
    });

    it("should initialize the wallet with correct eventEmitter", async function () {
      await walletFactory.createWallet(user1.address);
      const walletAddr = await walletFactory.getWallet(user1.address);
      const wallet = await ethers.getContractAt("SmartWallet", walletAddr);
      expect(await wallet.eventEmitter()).to.equal(await eventEmitter.getAddress());
    });

    it("should initialize the wallet with correct ssoRegistry", async function () {
      await walletFactory.createWallet(user1.address);
      const walletAddr = await walletFactory.getWallet(user1.address);
      const wallet = await ethers.getContractAt("SmartWallet", walletAddr);
      expect(await wallet.ssoRegistry()).to.equal(await ssoRegistry.getAddress());
    });

    it("should increment totalWallets", async function () {
      await walletFactory.createWallet(user1.address);
      expect(await walletFactory.totalWallets()).to.equal(1);
      await walletFactory.createWallet(user2.address);
      expect(await walletFactory.totalWallets()).to.equal(2);
    });

    it("should mark address as a wallet via isWallet", async function () {
      await walletFactory.createWallet(user1.address);
      const walletAddr = await walletFactory.getWallet(user1.address);
      expect(await walletFactory.isWallet(walletAddr)).to.equal(true);
    });

    it("should revert when creating a second wallet for same owner", async function () {
      await walletFactory.createWallet(user1.address);
      await expect(
        walletFactory.createWallet(user1.address)
      ).to.be.revertedWithCustomError(walletFactory, "WalletAlreadyExists");
    });

    it("should revert with zero address owner", async function () {
      await expect(
        walletFactory.createWallet(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(walletFactory, "InvalidOwner");
    });

    it("should revert when non-owner tries to create a wallet", async function () {
      await expect(
        walletFactory.connect(unauthorized).createWallet(user1.address)
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });

    it("should create distinct wallets for distinct owners", async function () {
      await walletFactory.createWallet(user1.address);
      await walletFactory.createWallet(user2.address);
      const w1 = await walletFactory.getWallet(user1.address);
      const w2 = await walletFactory.getWallet(user2.address);
      expect(w1).to.not.equal(w2);
    });
  });

  describe("createWalletWithSalt", function () {
    it("should create a wallet with a custom salt", async function () {
      const salt = ethers.id("custom-salt");
      await walletFactory.createWalletWithSalt(user1.address, salt);
      const walletAddr = await walletFactory.getWallet(user1.address);
      expect(walletAddr).to.not.equal(ethers.ZeroAddress);
    });

    it("should revert for duplicate owner even with different salt", async function () {
      const salt1 = ethers.id("salt1");
      const salt2 = ethers.id("salt2");
      await walletFactory.createWalletWithSalt(user1.address, salt1);
      await expect(
        walletFactory.createWalletWithSalt(user1.address, salt2)
      ).to.be.revertedWithCustomError(walletFactory, "WalletAlreadyExists");
    });
  });

  describe("predictWalletAddress", function () {
    it("should predict the correct address before deployment", async function () {
      const salt = ethers.id("predict-test");
      const predicted = await walletFactory.predictWalletAddress(user1.address, salt);
      await walletFactory.createWalletWithSalt(user1.address, salt);
      const actual = await walletFactory.getWallet(user1.address);
      expect(predicted).to.equal(actual);
    });

    it("should predict different addresses for different owners", async function () {
      const salt = ethers.id("same-salt");
      const p1 = await walletFactory.predictWalletAddress(user1.address, salt);
      const p2 = await walletFactory.predictWalletAddress(user2.address, salt);
      expect(p1).to.not.equal(p2);
    });

    it("should predict different addresses for different salts", async function () {
      const salt1 = ethers.id("salt-a");
      const salt2 = ethers.id("salt-b");
      const p1 = await walletFactory.predictWalletAddress(user1.address, salt1);
      const p2 = await walletFactory.predictWalletAddress(user1.address, salt2);
      expect(p1).to.not.equal(p2);
    });
  });

  describe("getWallet", function () {
    it("should return zero address for non-existent wallet", async function () {
      expect(await walletFactory.getWallet(user1.address)).to.equal(ethers.ZeroAddress);
    });
  });

  describe("isWallet", function () {
    it("should return false for non-factory address", async function () {
      expect(await walletFactory.isWallet(user1.address)).to.equal(false);
    });

    it("should return false for the implementation contract", async function () {
      expect(await walletFactory.isWallet(await smartWalletImpl.getAddress())).to.equal(false);
    });
  });

  describe("Admin functions", function () {
    it("should allow owner to update implementation", async function () {
      const SmartWallet = await ethers.getContractFactory("SmartWallet");
      const newImpl = await SmartWallet.deploy();
      await newImpl.waitForDeployment();

      await walletFactory.setImplementation(await newImpl.getAddress());
      expect(await walletFactory.implementation()).to.equal(await newImpl.getAddress());
    });

    it("should revert setting implementation to zero address", async function () {
      await expect(
        walletFactory.setImplementation(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(walletFactory, "InvalidImplementation");
    });

    it("should only allow owner to set implementation", async function () {
      await expect(
        walletFactory.connect(unauthorized).setImplementation(user1.address)
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });

    it("should allow owner to update event emitter", async function () {
      await walletFactory.setEventEmitter(user1.address);
      expect(await walletFactory.eventEmitter()).to.equal(user1.address);
    });

    it("should only allow owner to update event emitter", async function () {
      await expect(
        walletFactory.connect(unauthorized).setEventEmitter(user1.address)
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });

    it("should allow owner to update SSO registry", async function () {
      await walletFactory.setSSORegistry(user1.address);
      expect(await walletFactory.ssoRegistry()).to.equal(user1.address);
    });

    it("should only allow owner to update SSO registry", async function () {
      await expect(
        walletFactory.connect(unauthorized).setSSORegistry(user1.address)
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });
  });

  describe("deployWallets (batch pre-deploy)", function () {
    it("should pre-deploy a batch of unassigned wallets", async function () {
      const tx = await walletFactory.deployWallets(3);
      const receipt = await tx.wait();
      expect(await walletFactory.totalWallets()).to.equal(3);
      expect(await walletFactory.unassignedWalletCount()).to.equal(3);
    });

    it("should emit WalletPreDeployed for each wallet", async function () {
      await expect(walletFactory.deployWallets(2))
        .to.emit(walletFactory, "WalletPreDeployed");
    });

    it("should deploy wallets that are not yet assigned", async function () {
      await walletFactory.deployWallets(1);
      const walletAddr = await walletFactory.unassignedWalletAt(0);
      const wallet = await ethers.getContractAt("SmartWallet", walletAddr);
      expect(await wallet.isAssigned()).to.equal(false);
      expect(await wallet.walletOwner()).to.equal(ethers.ZeroAddress);
    });

    it("should initialize pre-deployed wallets with eventEmitter and ssoRegistry", async function () {
      await walletFactory.deployWallets(1);
      const walletAddr = await walletFactory.unassignedWalletAt(0);
      const wallet = await ethers.getContractAt("SmartWallet", walletAddr);
      expect(await wallet.eventEmitter()).to.equal(await eventEmitter.getAddress());
      expect(await wallet.ssoRegistry()).to.equal(await ssoRegistry.getAddress());
    });

    it("should mark pre-deployed wallets via isWallet", async function () {
      await walletFactory.deployWallets(1);
      const walletAddr = await walletFactory.unassignedWalletAt(0);
      expect(await walletFactory.isWallet(walletAddr)).to.equal(true);
    });

    it("should revert with count = 0", async function () {
      await expect(
        walletFactory.deployWallets(0)
      ).to.be.revertedWithCustomError(walletFactory, "InvalidBatchCount");
    });

    it("should only allow owner to batch deploy", async function () {
      await expect(
        walletFactory.connect(unauthorized).deployWallets(1)
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });

    it("should deploy unique wallet addresses in batch", async function () {
      await walletFactory.deployWallets(5);
      const addrs = new Set();
      for (let i = 0; i < 5; i++) {
        addrs.add(await walletFactory.unassignedWalletAt(i));
      }
      expect(addrs.size).to.equal(5);
    });

    it("should accumulate across multiple deploy calls", async function () {
      await walletFactory.deployWallets(3);
      await walletFactory.deployWallets(2);
      expect(await walletFactory.totalWallets()).to.equal(5);
      expect(await walletFactory.unassignedWalletCount()).to.equal(5);
    });
  });

  describe("assignWallet", function () {
    let preDeployedAddr;

    beforeEach(async function () {
      await walletFactory.deployWallets(3);
      preDeployedAddr = await walletFactory.unassignedWalletAt(0);
    });

    it("should assign a pre-deployed wallet to a user", async function () {
      await walletFactory.assignWallet(preDeployedAddr, user1.address);
      expect(await walletFactory.getWallet(user1.address)).to.equal(preDeployedAddr);
    });

    it("should set the wallet owner on the contract", async function () {
      await walletFactory.assignWallet(preDeployedAddr, user1.address);
      const wallet = await ethers.getContractAt("SmartWallet", preDeployedAddr);
      expect(await wallet.walletOwner()).to.equal(user1.address);
      expect(await wallet.isAssigned()).to.equal(true);
    });

    it("should register the wallet with EventEmitter upon assignment", async function () {
      await walletFactory.assignWallet(preDeployedAddr, user1.address);
      expect(await eventEmitter.isRegisteredWallet(preDeployedAddr)).to.equal(true);
    });

    it("should emit WalletAssigned event", async function () {
      await expect(walletFactory.assignWallet(preDeployedAddr, user1.address))
        .to.emit(walletFactory, "WalletAssigned")
        .withArgs(preDeployedAddr, user1.address);
    });

    it("should remove wallet from unassigned pool", async function () {
      expect(await walletFactory.unassignedWalletCount()).to.equal(3);
      await walletFactory.assignWallet(preDeployedAddr, user1.address);
      expect(await walletFactory.unassignedWalletCount()).to.equal(2);
    });

    it("should not change totalWallets on assign", async function () {
      const before = await walletFactory.totalWallets();
      await walletFactory.assignWallet(preDeployedAddr, user1.address);
      expect(await walletFactory.totalWallets()).to.equal(before);
    });

    it("should revert when assigning to zero address", async function () {
      await expect(
        walletFactory.assignWallet(preDeployedAddr, ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(walletFactory, "InvalidOwner");
    });

    it("should revert when wallet is not from the factory", async function () {
      await expect(
        walletFactory.assignWallet(user2.address, user1.address)
      ).to.be.revertedWithCustomError(walletFactory, "WalletNotFromFactory");
    });

    it("should revert when wallet is already assigned", async function () {
      await walletFactory.assignWallet(preDeployedAddr, user1.address);
      await expect(
        walletFactory.assignWallet(preDeployedAddr, user2.address)
      ).to.be.revertedWithCustomError(walletFactory, "WalletNotUnassigned");
    });

    it("should revert when owner already has a wallet", async function () {
      const second = await walletFactory.unassignedWalletAt(1);
      await walletFactory.assignWallet(preDeployedAddr, user1.address);
      await expect(
        walletFactory.assignWallet(second, user1.address)
      ).to.be.revertedWithCustomError(walletFactory, "WalletAlreadyExists");
    });

    it("should only allow owner (admin) to assign", async function () {
      await expect(
        walletFactory.connect(unauthorized).assignWallet(preDeployedAddr, user1.address)
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });

    it("should allow the assigned wallet to function normally", async function () {
      await walletFactory.assignWallet(preDeployedAddr, user1.address);
      const wallet = await ethers.getContractAt("SmartWallet", preDeployedAddr);

      await owner.sendTransaction({ to: preDeployedAddr, value: ethers.parseEther("5") });
      await wallet.connect(user1).execute(user2.address, ethers.parseEther("1"), "0x");
      expect(await wallet.getNonce()).to.equal(1);
      expect(await wallet.getBalance()).to.equal(ethers.parseEther("4"));
    });

    it("should handle swap-and-pop correctly for unassigned pool", async function () {
      // 3 wallets: [w0, w1, w2]
      const w0 = await walletFactory.unassignedWalletAt(0);
      const w1 = await walletFactory.unassignedWalletAt(1);
      const w2 = await walletFactory.unassignedWalletAt(2);

      // Assign w0 → pool becomes [w2, w1] (swap-and-pop)
      await walletFactory.assignWallet(w0, user1.address);
      expect(await walletFactory.unassignedWalletCount()).to.equal(2);

      // Assign w1 → pool becomes [w2]
      await walletFactory.assignWallet(w1, user2.address);
      expect(await walletFactory.unassignedWalletCount()).to.equal(1);
      expect(await walletFactory.unassignedWalletAt(0)).to.equal(w2);

      // Assign w2 → pool is empty
      await walletFactory.assignWallet(w2, user3.address);
      expect(await walletFactory.unassignedWalletCount()).to.equal(0);
    });
  });

  describe("createWalletWithSalt (admin only)", function () {
    it("should revert when non-owner tries createWalletWithSalt", async function () {
      await expect(
        walletFactory.connect(unauthorized).createWalletWithSalt(user1.address, ethers.id("salt"))
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });
  });

  describe("Pause / Unpause", function () {
    it("should prevent wallet creation when paused", async function () {
      await walletFactory.pause();
      await expect(
        walletFactory.createWallet(user1.address)
      ).to.be.revertedWithCustomError(walletFactory, "EnforcedPause");
    });

    it("should allow wallet creation after unpause", async function () {
      await walletFactory.pause();
      await walletFactory.unpause();
      await walletFactory.createWallet(user1.address);
      expect(await walletFactory.totalWallets()).to.equal(1);
    });

    it("should only allow owner to pause", async function () {
      await expect(
        walletFactory.connect(unauthorized).pause()
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });

    it("should only allow owner to unpause", async function () {
      await walletFactory.pause();
      await expect(
        walletFactory.connect(unauthorized).unpause()
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });
  });

  describe("Wallet functionality after factory deployment", function () {
    it("should produce a fully functional wallet", async function () {
      await walletFactory.createWallet(user1.address);
      const walletAddr = await walletFactory.getWallet(user1.address);
      const wallet = await ethers.getContractAt("SmartWallet", walletAddr);

      // Fund it
      await owner.sendTransaction({ to: walletAddr, value: ethers.parseEther("5") });

      // Execute a transfer
      await wallet.connect(user1).execute(user2.address, ethers.parseEther("1"), "0x");
      expect(await wallet.getNonce()).to.equal(1);
      expect(await wallet.getBalance()).to.equal(ethers.parseEther("4"));
    });

    it("should not allow re-initialization of deployed wallet", async function () {
      await walletFactory.createWallet(user1.address);
      const walletAddr = await walletFactory.getWallet(user1.address);
      const wallet = await ethers.getContractAt("SmartWallet", walletAddr);

      await expect(
        wallet.initialize(
          user2.address,
          await eventEmitter.getAddress(),
          await ssoRegistry.getAddress()
        )
      ).to.be.revertedWithCustomError(wallet, "AlreadyInitialized");
    });
  });

  describe("Edge cases", function () {
    it("should handle creating wallets for many users", async function () {
      const signers = await ethers.getSigners();
      for (let i = 1; i < Math.min(signers.length, 15); i++) {
        await walletFactory.createWallet(signers[i].address);
      }
      expect(await walletFactory.totalWallets()).to.equal(Math.min(signers.length - 1, 14));
    });

    it("new impl should only apply to future wallets, not existing ones", async function () {
      await walletFactory.createWallet(user1.address);
      const w1Addr = await walletFactory.getWallet(user1.address);
      const w1 = await ethers.getContractAt("SmartWallet", w1Addr);

      // Deploy new implementation
      const SmartWallet = await ethers.getContractFactory("SmartWallet");
      const newImpl = await SmartWallet.deploy();
      await newImpl.waitForDeployment();
      await walletFactory.setImplementation(await newImpl.getAddress());

      // Old wallet should still function
      await owner.sendTransaction({ to: w1Addr, value: ethers.parseEther("1") });
      await w1.connect(user1).execute(user2.address, ethers.parseEther("0.5"), "0x");
      expect(await w1.getNonce()).to.equal(1);
    });
  });
});
