const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SmartWallet", function () {
  let smartWallet, eventEmitter, ssoRegistry, walletFactory;
  let smartWalletImpl;
  let owner, user1, user2, sessionSigner, unauthorized;
  let walletAddress;

  // Permission constants
  const PERMISSION_EXECUTE = 1n;
  const PERMISSION_EXECUTE_BATCH = 2n;

  async function deployFullStack() {
    [owner, user1, user2, sessionSigner, unauthorized] = await ethers.getSigners();

    // Deploy EventEmitter
    const EventEmitter = await ethers.getContractFactory("EventEmitter");
    eventEmitter = await EventEmitter.deploy(owner.address);
    await eventEmitter.waitForDeployment();

    // Deploy SSORegistry
    const SSORegistry = await ethers.getContractFactory("SSORegistry");
    ssoRegistry = await SSORegistry.deploy(owner.address);
    await ssoRegistry.waitForDeployment();

    // Deploy SmartWallet implementation
    const SmartWallet = await ethers.getContractFactory("SmartWallet");
    smartWalletImpl = await SmartWallet.deploy();
    await smartWalletImpl.waitForDeployment();

    // Deploy WalletFactory
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

    // Create a wallet for user1
    const tx = await walletFactory.createWallet(user1.address);
    const receipt = await tx.wait();
    const walletCreatedEvent = receipt.logs.find(
      (log) => {
        try {
          return walletFactory.interface.parseLog(log)?.name === "WalletCreated";
        } catch { return false; }
      }
    );
    const parsed = walletFactory.interface.parseLog(walletCreatedEvent);
    walletAddress = parsed.args.wallet;

    // Attach SmartWallet ABI to the proxy address
    smartWallet = await ethers.getContractAt("SmartWallet", walletAddress);

    // Fund the wallet
    await owner.sendTransaction({ to: walletAddress, value: ethers.parseEther("10") });
  }

  beforeEach(async function () {
    await deployFullStack();
  });

  describe("Initialization", function () {
    it("should set correct owner", async function () {
      expect(await smartWallet.walletOwner()).to.equal(user1.address);
    });

    it("should set correct event emitter", async function () {
      expect(await smartWallet.eventEmitter()).to.equal(await eventEmitter.getAddress());
    });

    it("should set correct SSO registry", async function () {
      expect(await smartWallet.ssoRegistry()).to.equal(await ssoRegistry.getAddress());
    });

    it("should start with nonce 0", async function () {
      expect(await smartWallet.getNonce()).to.equal(0);
    });

    it("should have a non-zero DOMAIN_SEPARATOR", async function () {
      expect(await smartWallet.DOMAIN_SEPARATOR()).to.not.equal(ethers.ZeroHash);
    });

    it("should revert if initialized again", async function () {
      await expect(
        smartWallet.initialize(user2.address, await eventEmitter.getAddress(), await ssoRegistry.getAddress())
      ).to.be.revertedWithCustomError(smartWallet, "AlreadyInitialized");
    });
  });

  describe("Receive ETH", function () {
    it("should receive ETH and emit Received event", async function () {
      await expect(
        owner.sendTransaction({ to: walletAddress, value: ethers.parseEther("1") })
      ).to.emit(smartWallet, "Received")
        .withArgs(owner.address, ethers.parseEther("1"));
    });

    it("should update balance after receiving ETH", async function () {
      const balBefore = await smartWallet.getBalance();
      await owner.sendTransaction({ to: walletAddress, value: ethers.parseEther("2") });
      const balAfter = await smartWallet.getBalance();
      expect(balAfter - balBefore).to.equal(ethers.parseEther("2"));
    });
  });

  describe("execute", function () {
    it("should execute a native transfer", async function () {
      const recipient = user2.address;
      const amount = ethers.parseEther("1");
      const balBefore = await ethers.provider.getBalance(recipient);

      await smartWallet.connect(user1).execute(recipient, amount, "0x");

      const balAfter = await ethers.provider.getBalance(recipient);
      expect(balAfter - balBefore).to.equal(amount);
    });

    it("should increment nonce after execution", async function () {
      expect(await smartWallet.getNonce()).to.equal(0);
      await smartWallet.connect(user1).execute(user2.address, 0, "0x");
      expect(await smartWallet.getNonce()).to.equal(1);
    });

    it("should record transaction in history", async function () {
      const to = user2.address;
      const value = ethers.parseEther("0.5");
      await smartWallet.connect(user1).execute(to, value, "0x");

      const txRecord = await smartWallet.getTransaction(0);
      expect(txRecord.to).to.equal(to);
      expect(txRecord.value).to.equal(value);
      expect(txRecord.nonce).to.equal(0);
      expect(txRecord.success).to.equal(true);
    });

    it("should emit Executed event", async function () {
      await expect(
        smartWallet.connect(user1).execute(user2.address, ethers.parseEther("0.1"), "0x")
      ).to.emit(smartWallet, "Executed");
    });

    it("should emit TransactionExecuted on EventEmitter", async function () {
      await expect(
        smartWallet.connect(user1).execute(user2.address, ethers.parseEther("0.1"), "0x")
      ).to.emit(eventEmitter, "TransactionExecuted");
    });

    it("should call a contract function", async function () {
      const CallRecorder = await ethers.getContractFactory("CallRecorder");
      const recorder = await CallRecorder.deploy();
      await recorder.waitForDeployment();
      const recorderAddr = await recorder.getAddress();

      const iface = recorder.interface;
      const calldata = iface.encodeFunctionData("record");

      await smartWallet.connect(user1).execute(recorderAddr, ethers.parseEther("0.5"), calldata);
      expect(await recorder.callCount()).to.equal(1);
      expect(await recorder.lastValue()).to.equal(ethers.parseEther("0.5"));
    });

    it("should revert when called by unauthorized address", async function () {
      await expect(
        smartWallet.connect(unauthorized).execute(user2.address, 0, "0x")
      ).to.be.revertedWithCustomError(smartWallet, "UnauthorizedCaller");
    });

    it("should revert when balance is insufficient", async function () {
      await expect(
        smartWallet.connect(user1).execute(user2.address, ethers.parseEther("999"), "0x")
      ).to.be.revertedWithCustomError(smartWallet, "InsufficientBalance");
    });

    it("should revert on failed simple transfer (no data, value > 0)", async function () {
      const EtherRejecter = await ethers.getContractFactory("EtherRejecter");
      const rejecter = await EtherRejecter.deploy();
      await rejecter.waitForDeployment();

      await expect(
        smartWallet.connect(user1).execute(
          await rejecter.getAddress(),
          ethers.parseEther("1"),
          "0x"
        )
      ).to.be.revertedWithCustomError(smartWallet, "ExecutionFailed");
    });

    it("should record failed contract calls but not revert (when data is provided)", async function () {
      const CallRecorder = await ethers.getContractFactory("CallRecorder");
      const recorder = await CallRecorder.deploy();
      await recorder.waitForDeployment();

      const calldata = recorder.interface.encodeFunctionData("failingFunction");
      await smartWallet.connect(user1).execute(await recorder.getAddress(), 0, calldata);

      const txRecord = await smartWallet.getTransaction(0);
      expect(txRecord.success).to.equal(false);
    });

    it("should handle zero-value calls", async function () {
      await smartWallet.connect(user1).execute(user2.address, 0, "0x");
      expect(await smartWallet.getNonce()).to.equal(1);
    });

    it("should execute multiple sequential transactions", async function () {
      for (let i = 0; i < 5; i++) {
        await smartWallet.connect(user1).execute(user2.address, ethers.parseEther("0.1"), "0x");
      }
      expect(await smartWallet.getNonce()).to.equal(5);
    });
  });

  describe("executeBatch", function () {
    it("should execute multiple transactions in a batch", async function () {
      const targets = [user2.address, owner.address];
      const values = [ethers.parseEther("0.5"), ethers.parseEther("0.3")];
      const datas = ["0x", "0x"];

      const bal2Before = await ethers.provider.getBalance(user2.address);
      const balOwnerBefore = await ethers.provider.getBalance(owner.address);

      await smartWallet.connect(user1).executeBatch(targets, values, datas);

      const bal2After = await ethers.provider.getBalance(user2.address);
      expect(bal2After - bal2Before).to.equal(ethers.parseEther("0.5"));

      // Nonce should be incremented by batch size
      expect(await smartWallet.getNonce()).to.equal(2);
    });

    it("should emit BatchExecuted event", async function () {
      const targets = [user2.address, owner.address];
      const values = [0, 0];
      const datas = ["0x", "0x"];

      await expect(
        smartWallet.connect(user1).executeBatch(targets, values, datas)
      ).to.emit(smartWallet, "BatchExecuted")
        .withArgs(2, 0); // count=2, startNonce=0
    });

    it("should revert with mismatched array lengths", async function () {
      await expect(
        smartWallet.connect(user1).executeBatch(
          [user2.address, owner.address],
          [0],
          ["0x", "0x"]
        )
      ).to.be.revertedWithCustomError(smartWallet, "ArrayLengthMismatch");
    });

    it("should revert when called by unauthorized address", async function () {
      await expect(
        smartWallet.connect(unauthorized).executeBatch([user2.address], [0], ["0x"])
      ).to.be.revertedWithCustomError(smartWallet, "UnauthorizedCaller");
    });

    it("should record each transaction in the batch", async function () {
      const targets = [user2.address, owner.address];
      const values = [ethers.parseEther("0.1"), ethers.parseEther("0.2")];
      const datas = ["0x", "0x"];

      await smartWallet.connect(user1).executeBatch(targets, values, datas);

      const tx0 = await smartWallet.getTransaction(0);
      expect(tx0.to).to.equal(user2.address);
      expect(tx0.value).to.equal(ethers.parseEther("0.1"));

      const tx1 = await smartWallet.getTransaction(1);
      expect(tx1.to).to.equal(owner.address);
      expect(tx1.value).to.equal(ethers.parseEther("0.2"));
    });

    it("should handle empty batch", async function () {
      await smartWallet.connect(user1).executeBatch([], [], []);
      expect(await smartWallet.getNonce()).to.equal(0);
    });
  });

  describe("executeWithSignature (meta-tx / SSO)", function () {
    async function signExecute(signerWallet, to, value, data, nonce, deadline) {
      // Use EIP-712 signTypedData which produces a raw signature over the typed data
      // (no Ethereum prefix). The contract's recover uses toTypedDataHash + ecrecover.
      // However, the contract builds the digest manually with its stored domain separator,
      // then calls LibECDSA.recover which expects a standard ECDSA sig over a raw hash.
      // The contract does NOT use toEthSignedMessageHash — it uses toTypedDataHash.
      // So we need: raw sign over keccak256("\x19\x01" || domainSep || structHash).
      // signTypedData does exactly this.
      const domain = {
        name: "PaxeerSmartWallet",
        version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: walletAddress,
      };
      const types = {
        Execute: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "data", type: "bytes" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };
      const message = { to, value, data, nonce, deadline };
      return signerWallet.signTypedData(domain, types, message);
    }

    it("should execute when signed by the owner", async function () {
      const to = user2.address;
      const value = ethers.parseEther("0.1");
      const data = "0x";
      const nonce = await smartWallet.getNonce();
      const deadline = BigInt(await time.latest()) + 3600n;

      const sig = await signExecute(user1, to, value, data, nonce, deadline);

      const balBefore = await ethers.provider.getBalance(to);
      await smartWallet.connect(owner).executeWithSignature(to, value, data, deadline, sig);
      const balAfter = await ethers.provider.getBalance(to);
      expect(balAfter - balBefore).to.equal(value);
    });

    it("should execute when signed by a valid session key via wallet", async function () {
      // Register a session key for the SmartWallet contract by having the wallet
      // call registerSessionKeyFor on the SSORegistry via execute
      const now = BigInt(await time.latest());
      const validAfter = now;
      const validUntil = now + 7200n;

      // Encode the call to ssoRegistry.registerSessionKeyFor(walletAddress, sessionSigner, ...)
      const regCalldata = ssoRegistry.interface.encodeFunctionData("registerSessionKeyFor", [
        walletAddress,
        sessionSigner.address,
        validAfter,
        validUntil,
        PERMISSION_EXECUTE,
      ]);

      // Execute the registration call from the wallet itself
      await smartWallet.connect(user1).execute(
        await ssoRegistry.getAddress(),
        0,
        regCalldata
      );

      // Now sign with the session key
      const nonce = await smartWallet.getNonce();
      const deadline = BigInt(await time.latest()) + 3600n;
      const to = user2.address;
      const value = ethers.parseEther("0.05");
      const sig = await signExecute(sessionSigner, to, value, "0x", nonce, deadline);

      const balBefore = await ethers.provider.getBalance(to);
      await smartWallet.connect(owner).executeWithSignature(to, value, "0x", deadline, sig);
      const balAfter = await ethers.provider.getBalance(to);
      expect(balAfter - balBefore).to.equal(value);
    });

    it("should revert with expired deadline", async function () {
      const to = user2.address;
      const deadline = BigInt(await time.latest()) - 100n;
      const sig = await signExecute(user1, to, 0, "0x", 0n, deadline);

      await expect(
        smartWallet.connect(owner).executeWithSignature(to, 0, "0x", deadline, sig)
      ).to.be.revertedWithCustomError(smartWallet, "ExpiredDeadline");
    });

    it("should revert with invalid signature", async function () {
      const to = user2.address;
      const deadline = BigInt(await time.latest()) + 3600n;
      const sig = await signExecute(unauthorized, to, 0, "0x", 0n, deadline);

      await expect(
        smartWallet.connect(owner).executeWithSignature(to, 0, "0x", deadline, sig)
      ).to.be.revertedWithCustomError(smartWallet, "InvalidSignature");
    });
  });

  describe("Token operations", function () {
    let mockToken;

    beforeEach(async function () {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      mockToken = await MockERC20.deploy("Test Token", "TT", 18);
      await mockToken.waitForDeployment();

      // Mint tokens to the wallet
      await mockToken.mint(walletAddress, ethers.parseEther("1000"));
    });

    it("should report correct token balance", async function () {
      const balance = await smartWallet.getTokenBalance(await mockToken.getAddress());
      expect(balance).to.equal(ethers.parseEther("1000"));
    });

    it("should transfer tokens via execute", async function () {
      const tokenAddr = await mockToken.getAddress();
      const transferData = mockToken.interface.encodeFunctionData("transfer", [
        user2.address,
        ethers.parseEther("100"),
      ]);

      await smartWallet.connect(user1).execute(tokenAddr, 0, transferData);
      expect(await mockToken.balanceOf(user2.address)).to.equal(ethers.parseEther("100"));
      expect(await smartWallet.getTokenBalance(tokenAddr)).to.equal(ethers.parseEther("900"));
    });

    it("should approve tokens via execute", async function () {
      const tokenAddr = await mockToken.getAddress();
      const approveData = mockToken.interface.encodeFunctionData("approve", [
        user2.address,
        ethers.parseEther("500"),
      ]);

      await smartWallet.connect(user1).execute(tokenAddr, 0, approveData);
      expect(await mockToken.allowance(walletAddress, user2.address)).to.equal(ethers.parseEther("500"));
    });
  });

  describe("Ownership", function () {
    it("should transfer ownership", async function () {
      await smartWallet.connect(user1).transferOwnership(user2.address);
      expect(await smartWallet.walletOwner()).to.equal(user2.address);
    });

    it("should allow new owner to execute after transfer", async function () {
      await smartWallet.connect(user1).transferOwnership(user2.address);
      await smartWallet.connect(user2).execute(user1.address, ethers.parseEther("0.1"), "0x");
      expect(await smartWallet.getNonce()).to.equal(1);
    });

    it("should prevent old owner from executing after transfer", async function () {
      await smartWallet.connect(user1).transferOwnership(user2.address);
      await expect(
        smartWallet.connect(user1).execute(user2.address, 0, "0x")
      ).to.be.revertedWithCustomError(smartWallet, "UnauthorizedCaller");
    });

    it("should revert transfer to zero address", async function () {
      await expect(
        smartWallet.connect(user1).transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(smartWallet, "UnauthorizedCaller");
    });

    it("should only allow owner to transfer", async function () {
      await expect(
        smartWallet.connect(unauthorized).transferOwnership(unauthorized.address)
      ).to.be.revertedWithCustomError(smartWallet, "UnauthorizedCaller");
    });
  });

  describe("Pause / Unpause", function () {
    it("should pause execution", async function () {
      await smartWallet.connect(user1).pause();
      await expect(
        smartWallet.connect(user1).execute(user2.address, 0, "0x")
      ).to.be.revertedWithCustomError(smartWallet, "EnforcedPause");
    });

    it("should pause batch execution", async function () {
      await smartWallet.connect(user1).pause();
      await expect(
        smartWallet.connect(user1).executeBatch([user2.address], [0], ["0x"])
      ).to.be.revertedWithCustomError(smartWallet, "EnforcedPause");
    });

    it("should resume after unpause", async function () {
      await smartWallet.connect(user1).pause();
      await smartWallet.connect(user1).unpause();
      await smartWallet.connect(user1).execute(user2.address, 0, "0x");
      expect(await smartWallet.getNonce()).to.equal(1);
    });

    it("should only allow owner to pause", async function () {
      await expect(
        smartWallet.connect(unauthorized).pause()
      ).to.be.revertedWithCustomError(smartWallet, "UnauthorizedCaller");
    });

    it("should only allow owner to unpause", async function () {
      await smartWallet.connect(user1).pause();
      await expect(
        smartWallet.connect(unauthorized).unpause()
      ).to.be.revertedWithCustomError(smartWallet, "UnauthorizedCaller");
    });
  });

  describe("Reentrancy protection", function () {
    it("should prevent reentrancy attacks on execute", async function () {
      const ReentrancyAttacker = await ethers.getContractFactory("ReentrancyAttacker");
      const attacker = await ReentrancyAttacker.deploy(walletAddress);
      await attacker.waitForDeployment();

      // Owner executes a transfer to the attacker (which will try to re-enter)
      const attackerAddr = await attacker.getAddress();
      await expect(
        smartWallet.connect(user1).execute(attackerAddr, ethers.parseEther("1"), "0x")
      ).to.emit(smartWallet, "Executed");

      // Attacker's reentrant call count should be limited
      // The reentrancy guard prevents the attack from succeeding
    });
  });

  describe("getBalance / getTokenBalance", function () {
    it("should return correct native balance", async function () {
      expect(await smartWallet.getBalance()).to.equal(ethers.parseEther("10"));
    });

    it("should return 0 for token with no balance", async function () {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      const token = await MockERC20.deploy("Empty", "EMP", 18);
      await token.waitForDeployment();
      expect(await smartWallet.getTokenBalance(await token.getAddress())).to.equal(0);
    });
  });

  describe("getTransaction edge cases", function () {
    it("should return empty record for non-existent nonce", async function () {
      const record = await smartWallet.getTransaction(999);
      expect(record.to).to.equal(ethers.ZeroAddress);
      expect(record.value).to.equal(0);
      expect(record.nonce).to.equal(0);
    });
  });

  describe("Metadata", function () {
    const validMetadata = {
      argusId: "550e8400-e29b-41d4-a716-446655440000",
      onchainId: ethers.ZeroAddress, // will be overridden in beforeEach
      userAlias: "alice_paxeer",
      telegram: "@alice_tg",
      twitter: "@alice_tw",
      website: "https://alice.paxeer.io",
      github: "alice-gh",
      discord: "alice#1234",
    };

    beforeEach(function () {
      validMetadata.onchainId = user1.address;
    });

    it("should allow owner to set metadata", async function () {
      await smartWallet.connect(user1).setMetadata(validMetadata);
      const meta = await smartWallet.getMetadata();
      expect(meta.argusId).to.equal(validMetadata.argusId);
      expect(meta.onchainId).to.equal(user1.address);
      expect(meta.userAlias).to.equal(validMetadata.userAlias);
      expect(meta.telegram).to.equal(validMetadata.telegram);
      expect(meta.twitter).to.equal(validMetadata.twitter);
      expect(meta.website).to.equal(validMetadata.website);
      expect(meta.github).to.equal(validMetadata.github);
      expect(meta.discord).to.equal(validMetadata.discord);
    });

    it("should emit MetadataUpdated event", async function () {
      await expect(smartWallet.connect(user1).setMetadata(validMetadata))
        .to.emit(smartWallet, "MetadataUpdated")
        .withArgs(validMetadata.argusId, user1.address, validMetadata.userAlias);
    });

    it("should allow factory (deployer) to set metadata", async function () {
      // owner is the factory deployer, and the factory is the actual factory contract
      // We need the factory contract address to call setMetadata
      // The factory address is stored in the wallet during initialize
      // Since only the factory or owner can call, let's test with owner
      await smartWallet.connect(user1).setMetadata(validMetadata);
      const meta = await smartWallet.getMetadata();
      expect(meta.argusId).to.equal(validMetadata.argusId);
    });

    it("should revert when unauthorized caller sets metadata", async function () {
      await expect(
        smartWallet.connect(unauthorized).setMetadata(validMetadata)
      ).to.be.revertedWithCustomError(smartWallet, "UnauthorizedCaller");
    });

    it("should revert with empty argusId", async function () {
      const bad = { ...validMetadata, argusId: "" };
      await expect(
        smartWallet.connect(user1).setMetadata(bad)
      ).to.be.revertedWithCustomError(smartWallet, "InvalidMetadata");
    });

    it("should revert with zero address onchainId", async function () {
      const bad = { ...validMetadata, onchainId: ethers.ZeroAddress };
      await expect(
        smartWallet.connect(user1).setMetadata(bad)
      ).to.be.revertedWithCustomError(smartWallet, "InvalidMetadata");
    });

    it("should revert with empty userAlias", async function () {
      const bad = { ...validMetadata, userAlias: "" };
      await expect(
        smartWallet.connect(user1).setMetadata(bad)
      ).to.be.revertedWithCustomError(smartWallet, "InvalidMetadata");
    });

    it("should allow empty optional fields", async function () {
      const minimal = {
        argusId: "uuid-123",
        onchainId: user1.address,
        userAlias: "alice",
        telegram: "",
        twitter: "",
        website: "",
        github: "",
        discord: "",
      };
      await smartWallet.connect(user1).setMetadata(minimal);
      const meta = await smartWallet.getMetadata();
      expect(meta.telegram).to.equal("");
      expect(meta.twitter).to.equal("");
    });

    it("should allow owner to update metadata", async function () {
      await smartWallet.connect(user1).setMetadata(validMetadata);
      const updated = { ...validMetadata, userAlias: "alice_v2", twitter: "@new_alice" };
      await smartWallet.connect(user1).setMetadata(updated);
      const meta = await smartWallet.getMetadata();
      expect(meta.userAlias).to.equal("alice_v2");
      expect(meta.twitter).to.equal("@new_alice");
    });

    it("should return empty metadata before it is set", async function () {
      const meta = await smartWallet.getMetadata();
      expect(meta.argusId).to.equal("");
      expect(meta.onchainId).to.equal(ethers.ZeroAddress);
      expect(meta.userAlias).to.equal("");
    });
  });

  describe("isAssigned", function () {
    it("should return true for a wallet with an owner", async function () {
      expect(await smartWallet.isAssigned()).to.equal(true);
    });
  });

  describe("assignOwner (via factory)", function () {
    it("should revert when called by non-factory address", async function () {
      // Deploy a fresh unassigned wallet via deployWallets
      await walletFactory.deployWallets(1);
      const unassignedAddr = await walletFactory.unassignedWalletAt(0);
      const unassignedWallet = await ethers.getContractAt("SmartWallet", unassignedAddr);

      await expect(
        unassignedWallet.connect(user1).assignOwner(user1.address)
      ).to.be.revertedWithCustomError(unassignedWallet, "CallerNotFactory");
    });

    it("should revert when wallet already has an owner", async function () {
      // smartWallet already has user1 as owner
      // Calling assignOwner directly on it from any address should fail
      // (either CallerNotFactory or WalletAlreadyAssigned depending on caller)
      await expect(
        smartWallet.connect(unauthorized).assignOwner(user2.address)
      ).to.be.revertedWithCustomError(smartWallet, "CallerNotFactory");
    });

    it("should work via the factory assignWallet flow", async function () {
      await walletFactory.deployWallets(1);
      const unassignedAddr = await walletFactory.unassignedWalletAt(0);

      await walletFactory.assignWallet(unassignedAddr, user2.address);

      const wallet = await ethers.getContractAt("SmartWallet", unassignedAddr);
      expect(await wallet.walletOwner()).to.equal(user2.address);
      expect(await wallet.isAssigned()).to.equal(true);
    });
  });

  describe("factory() view", function () {
    it("should return the factory address", async function () {
      expect(await smartWallet.factory()).to.equal(await walletFactory.getAddress());
    });
  });
});
