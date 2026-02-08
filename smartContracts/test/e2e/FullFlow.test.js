const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("E2E: Full System Flow", function () {
  let eventEmitter, ssoRegistry, smartWalletImpl, walletFactory;
  let deployer, alice, bob, charlie, sessionKey1, sessionKey2, relayer, attacker;
  let aliceWallet, bobWallet;
  let aliceWalletAddr, bobWalletAddr;
  let mockToken;

  const PERMISSION_EXECUTE = 1n;
  const PERMISSION_EXECUTE_BATCH = 2n;
  const PERMISSION_TRANSFER_ETH = 4n;
  const PERMISSION_TRANSFER_ERC20 = 8n;
  const PERMISSION_CALL_CONTRACT = 16n;
  const PERMISSION_ALL = 31n;

  before(async function () {
    [deployer, alice, bob, charlie, sessionKey1, sessionKey2, relayer, attacker] =
      await ethers.getSigners();
  });

  describe("Phase 1: Deployment", function () {
    it("should deploy the entire contract stack", async function () {
      // Deploy EventEmitter
      const EventEmitter = await ethers.getContractFactory("EventEmitter");
      eventEmitter = await EventEmitter.deploy(deployer.address);
      await eventEmitter.waitForDeployment();
      expect(await eventEmitter.owner()).to.equal(deployer.address);

      // Deploy SSORegistry
      const SSORegistry = await ethers.getContractFactory("SSORegistry");
      ssoRegistry = await SSORegistry.deploy(deployer.address);
      await ssoRegistry.waitForDeployment();
      expect(await ssoRegistry.owner()).to.equal(deployer.address);

      // Deploy SmartWallet implementation
      const SmartWallet = await ethers.getContractFactory("SmartWallet");
      smartWalletImpl = await SmartWallet.deploy();
      await smartWalletImpl.waitForDeployment();

      // Deploy WalletFactory
      const WalletFactory = await ethers.getContractFactory("WalletFactory");
      walletFactory = await WalletFactory.deploy(
        deployer.address,
        await smartWalletImpl.getAddress(),
        await eventEmitter.getAddress(),
        await ssoRegistry.getAddress()
      );
      await walletFactory.waitForDeployment();

      // Wire factory into EventEmitter
      await eventEmitter.setFactory(await walletFactory.getAddress());
      expect(await eventEmitter.factory()).to.equal(await walletFactory.getAddress());
    });

    it("should deploy a mock ERC20 token", async function () {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      mockToken = await MockERC20.deploy("Paxeer Token", "PAX", 18);
      await mockToken.waitForDeployment();
    });
  });

  describe("Phase 2: Admin-Only Wallet Creation", function () {
    it("should reject non-admin wallet creation", async function () {
      await expect(
        walletFactory.connect(alice).createWallet(alice.address)
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });

    it("deployer (admin) creates a wallet for Alice", async function () {
      const tx = await walletFactory.createWallet(alice.address);
      const receipt = await tx.wait();
      aliceWalletAddr = await walletFactory.getWallet(alice.address);
      aliceWallet = await ethers.getContractAt("SmartWallet", aliceWalletAddr);

      expect(await aliceWallet.walletOwner()).to.equal(alice.address);
      expect(await walletFactory.isWallet(aliceWalletAddr)).to.equal(true);
      expect(await eventEmitter.isRegisteredWallet(aliceWalletAddr)).to.equal(true);
      expect(await walletFactory.totalWallets()).to.equal(1);
    });

    it("deployer creates a wallet for Bob", async function () {
      await walletFactory.createWallet(bob.address);
      bobWalletAddr = await walletFactory.getWallet(bob.address);
      bobWallet = await ethers.getContractAt("SmartWallet", bobWalletAddr);

      expect(await bobWallet.walletOwner()).to.equal(bob.address);
      expect(await walletFactory.totalWallets()).to.equal(2);
    });

    it("should reject duplicate wallet creation for Alice", async function () {
      await expect(
        walletFactory.createWallet(alice.address)
      ).to.be.revertedWithCustomError(walletFactory, "WalletAlreadyExists");
    });

    it("should reject wallet for zero address", async function () {
      await expect(
        walletFactory.createWallet(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(walletFactory, "InvalidOwner");
    });
  });

  describe("Phase 3: Fund Wallets", function () {
    it("should receive native currency", async function () {
      await deployer.sendTransaction({
        to: aliceWalletAddr,
        value: ethers.parseEther("20"),
      });
      await deployer.sendTransaction({
        to: bobWalletAddr,
        value: ethers.parseEther("10"),
      });

      expect(await aliceWallet.getBalance()).to.equal(ethers.parseEther("20"));
      expect(await bobWallet.getBalance()).to.equal(ethers.parseEther("10"));
    });

    it("should receive ERC20 tokens", async function () {
      await mockToken.mint(aliceWalletAddr, ethers.parseEther("5000"));
      await mockToken.mint(bobWalletAddr, ethers.parseEther("2000"));

      expect(await aliceWallet.getTokenBalance(await mockToken.getAddress())).to.equal(
        ethers.parseEther("5000")
      );
    });
  });

  describe("Phase 4: Basic Transactions", function () {
    it("Alice sends ETH to Bob's wallet", async function () {
      const bobBalBefore = await bobWallet.getBalance();

      await expect(
        aliceWallet.connect(alice).execute(bobWalletAddr, ethers.parseEther("2"), "0x")
      )
        .to.emit(aliceWallet, "Executed")
        .to.emit(eventEmitter, "TransactionExecuted");

      const bobBalAfter = await bobWallet.getBalance();
      expect(bobBalAfter - bobBalBefore).to.equal(ethers.parseEther("2"));
      expect(await aliceWallet.getNonce()).to.equal(1);
    });

    it("Alice sends ETH to an EOA (Charlie)", async function () {
      const charlieBefore = await ethers.provider.getBalance(charlie.address);
      await aliceWallet.connect(alice).execute(charlie.address, ethers.parseEther("1"), "0x");
      const charlieAfter = await ethers.provider.getBalance(charlie.address);
      expect(charlieAfter - charlieBefore).to.equal(ethers.parseEther("1"));
    });

    it("Alice transfers ERC20 tokens to Bob's wallet", async function () {
      const tokenAddr = await mockToken.getAddress();
      const transferData = mockToken.interface.encodeFunctionData("transfer", [
        bobWalletAddr,
        ethers.parseEther("500"),
      ]);

      await aliceWallet.connect(alice).execute(tokenAddr, 0, transferData);

      expect(await mockToken.balanceOf(bobWalletAddr)).to.equal(ethers.parseEther("2500"));
      expect(await mockToken.balanceOf(aliceWalletAddr)).to.equal(ethers.parseEther("4500"));
    });

    it("Bob approves and Alice's wallet transfersFrom", async function () {
      const tokenAddr = await mockToken.getAddress();

      // Bob approves Alice's wallet to spend
      const approveData = mockToken.interface.encodeFunctionData("approve", [
        aliceWalletAddr,
        ethers.parseEther("200"),
      ]);
      await bobWallet.connect(bob).execute(tokenAddr, 0, approveData);

      // Alice's wallet does transferFrom
      const transferFromData = mockToken.interface.encodeFunctionData("transferFrom", [
        bobWalletAddr,
        aliceWalletAddr,
        ethers.parseEther("200"),
      ]);
      await aliceWallet.connect(alice).execute(tokenAddr, 0, transferFromData);

      expect(await mockToken.balanceOf(aliceWalletAddr)).to.equal(ethers.parseEther("4700"));
    });

    it("transaction history is accurately recorded", async function () {
      const nonce = await aliceWallet.getNonce();
      // We've done several transactions by now; check the first one
      const tx0 = await aliceWallet.getTransaction(0);
      expect(tx0.to).to.equal(bobWalletAddr);
      expect(tx0.success).to.equal(true);
      expect(tx0.timestamp).to.be.gt(0);
    });
  });

  describe("Phase 5: Batch Transactions", function () {
    it("Alice sends a batch of ETH transfers", async function () {
      const startNonce = await aliceWallet.getNonce();

      const targets = [charlie.address, bob.address, deployer.address];
      const values = [
        ethers.parseEther("0.1"),
        ethers.parseEther("0.2"),
        ethers.parseEther("0.3"),
      ];
      const datas = ["0x", "0x", "0x"];

      await expect(
        aliceWallet.connect(alice).executeBatch(targets, values, datas)
      ).to.emit(aliceWallet, "BatchExecuted")
        .withArgs(3, startNonce);

      expect(await aliceWallet.getNonce()).to.equal(startNonce + 3n);
    });

    it("batch with mixed ETH and token operations", async function () {
      const tokenAddr = await mockToken.getAddress();
      const transferData = mockToken.interface.encodeFunctionData("transfer", [
        charlie.address,
        ethers.parseEther("50"),
      ]);

      const targets = [charlie.address, tokenAddr];
      const values = [ethers.parseEther("0.5"), 0];
      const datas = ["0x", transferData];

      await aliceWallet.connect(alice).executeBatch(targets, values, datas);
      expect(await mockToken.balanceOf(charlie.address)).to.equal(ethers.parseEther("50"));
    });

    it("batch should revert on mismatched arrays", async function () {
      await expect(
        aliceWallet.connect(alice).executeBatch(
          [charlie.address],
          [0, 0],
          ["0x"]
        )
      ).to.be.revertedWithCustomError(aliceWallet, "ArrayLengthMismatch");
    });
  });

  describe("Phase 6: SSO Session Keys", function () {
    it("Alice registers a session key for seamless SSO", async function () {
      const now = BigInt(await time.latest());
      const validAfter = now;
      const validUntil = now + 86400n; // 24 hours

      await ssoRegistry.connect(alice).registerSessionKey(
        sessionKey1.address,
        validAfter,
        validUntil,
        PERMISSION_EXECUTE | PERMISSION_TRANSFER_ETH
      );

      expect(
        await ssoRegistry.validateSessionKey(
          alice.address,
          sessionKey1.address,
          PERMISSION_EXECUTE
        )
      ).to.equal(true);
    });

    it("session key with insufficient permissions is rejected", async function () {
      expect(
        await ssoRegistry.validateSessionKey(
          alice.address,
          sessionKey1.address,
          PERMISSION_CALL_CONTRACT // not granted
        )
      ).to.equal(false);
    });

    it("Alice registers a second session key", async function () {
      const now = BigInt(await time.latest());
      await ssoRegistry.connect(alice).registerSessionKey(
        sessionKey2.address,
        now,
        now + 3600n,
        PERMISSION_ALL
      );

      const signers = await ssoRegistry.getActiveSigners(alice.address);
      expect(signers.length).to.equal(2);
    });

    it("Alice revokes first session key", async function () {
      await ssoRegistry.connect(alice).revokeSessionKey(sessionKey1.address);

      expect(
        await ssoRegistry.validateSessionKey(
          alice.address,
          sessionKey1.address,
          PERMISSION_EXECUTE
        )
      ).to.equal(false);

      const signers = await ssoRegistry.getActiveSigners(alice.address);
      expect(signers.length).to.equal(1);
      expect(signers[0]).to.equal(sessionKey2.address);
    });

    it("expired session key is invalid", async function () {
      const now = BigInt(await time.latest());
      await ssoRegistry.connect(bob).registerSessionKey(
        sessionKey1.address,
        now,
        now + 60n, // 60 seconds
        PERMISSION_EXECUTE
      );

      expect(
        await ssoRegistry.validateSessionKey(bob.address, sessionKey1.address, PERMISSION_EXECUTE)
      ).to.equal(true);

      await time.increase(120);

      expect(
        await ssoRegistry.validateSessionKey(bob.address, sessionKey1.address, PERMISSION_EXECUTE)
      ).to.equal(false);
    });
  });

  describe("Phase 7: EventEmitter Risk Feed", function () {
    it("every wallet transaction emits to the centralized risk feed", async function () {
      const totalBefore = await eventEmitter.totalTransactions();

      await aliceWallet.connect(alice).execute(charlie.address, ethers.parseEther("0.01"), "0x");
      await bobWallet.connect(bob).execute(charlie.address, ethers.parseEther("0.01"), "0x");

      const totalAfter = await eventEmitter.totalTransactions();
      expect(totalAfter - totalBefore).to.equal(2);
    });

    it("EventEmitter correctly identifies which wallet emitted", async function () {
      const tx = await aliceWallet.connect(alice).execute(
        charlie.address,
        ethers.parseEther("0.01"),
        "0x"
      );
      const receipt = await tx.wait();

      // Find the TransactionExecuted event from EventEmitter
      const emitterLog = receipt.logs.find((log) => {
        try {
          const parsed = eventEmitter.interface.parseLog(log);
          return parsed?.name === "TransactionExecuted";
        } catch {
          return false;
        }
      });

      const parsed = eventEmitter.interface.parseLog(emitterLog);
      expect(parsed.args.wallet).to.equal(aliceWalletAddr);
      expect(parsed.args.to).to.equal(charlie.address);
      expect(parsed.args.success).to.equal(true);
    });

    it("pausing EventEmitter blocks all wallet transactions", async function () {
      await eventEmitter.pause();

      // Alice's execute should revert because the EventEmitter call fails
      await expect(
        aliceWallet.connect(alice).execute(charlie.address, 0, "0x")
      ).to.be.reverted;

      await eventEmitter.unpause();

      // Should work again
      await aliceWallet.connect(alice).execute(charlie.address, 0, "0x");
    });
  });

  describe("Phase 8: Access Control & Attack Vectors", function () {
    it("attacker cannot execute on Alice's wallet", async function () {
      await expect(
        aliceWallet.connect(attacker).execute(
          attacker.address,
          ethers.parseEther("10"),
          "0x"
        )
      ).to.be.revertedWithCustomError(aliceWallet, "UnauthorizedCaller");
    });

    it("attacker cannot batch-execute on Alice's wallet", async function () {
      await expect(
        aliceWallet.connect(attacker).executeBatch(
          [attacker.address],
          [ethers.parseEther("10")],
          ["0x"]
        )
      ).to.be.revertedWithCustomError(aliceWallet, "UnauthorizedCaller");
    });

    it("attacker cannot transfer wallet ownership", async function () {
      await expect(
        aliceWallet.connect(attacker).transferOwnership(attacker.address)
      ).to.be.revertedWithCustomError(aliceWallet, "UnauthorizedCaller");
    });

    it("attacker cannot pause wallet", async function () {
      await expect(
        aliceWallet.connect(attacker).pause()
      ).to.be.revertedWithCustomError(aliceWallet, "UnauthorizedCaller");
    });

    it("attacker cannot re-initialize wallet", async function () {
      await expect(
        aliceWallet.connect(attacker).initialize(
          attacker.address,
          attacker.address,
          attacker.address
        )
      ).to.be.revertedWithCustomError(aliceWallet, "AlreadyInitialized");
    });

    it("attacker cannot register session keys for Alice in SSORegistry", async function () {
      // The attacker cannot call registerSessionKeyFor on Alice's wallet
      // unless they are the wallet itself or an authorized caller
      const now = BigInt(await time.latest());
      await expect(
        ssoRegistry.connect(attacker).registerSessionKeyFor(
          alice.address,
          attacker.address,
          now,
          now + 3600n,
          PERMISSION_ALL
        )
      ).to.be.revertedWithCustomError(ssoRegistry, "CallerNotWalletOrOwner");
    });

    it("attacker cannot emit fake events on EventEmitter", async function () {
      await expect(
        eventEmitter.connect(attacker).emitTransaction(
          charlie.address,
          ethers.parseEther("1000"),
          "0x",
          0,
          true,
          "0x"
        )
      ).to.be.revertedWithCustomError(eventEmitter, "CallerNotRegisteredWallet");
    });

    it("attacker cannot register fake wallet on EventEmitter", async function () {
      await expect(
        eventEmitter.connect(attacker).registerWallet(attacker.address, attacker.address)
      ).to.be.revertedWithCustomError(eventEmitter, "CallerNotFactory");
    });

    it("attacker cannot deregister wallets from EventEmitter", async function () {
      await expect(
        eventEmitter.connect(attacker).deregisterWallet(aliceWalletAddr)
      ).to.be.revertedWithCustomError(eventEmitter, "CallerNotFactory");
    });

    it("attacker cannot create wallets via factory", async function () {
      await expect(
        walletFactory.connect(attacker).createWallet(attacker.address)
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });

    it("attacker cannot batch deploy wallets", async function () {
      await expect(
        walletFactory.connect(attacker).deployWallets(1)
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
    });

    it("attacker cannot assign pre-deployed wallets", async function () {
      await walletFactory.deployWallets(1);
      const w = await walletFactory.unassignedWalletAt(0);
      await expect(
        walletFactory.connect(attacker).assignWallet(w, attacker.address)
      ).to.be.revertedWithCustomError(walletFactory, "OwnableUnauthorizedAccount");
      // Clean up: assign it so it doesn't interfere with later tests
      await walletFactory.assignWallet(w, attacker.address);
    });

    it("attacker cannot set metadata on someone else's wallet", async function () {
      await expect(
        aliceWallet.connect(attacker).setMetadata({
          argusId: "fake-uuid",
          onchainId: attacker.address,
          userAlias: "hacker",
          telegram: "", twitter: "", website: "", github: "", discord: "",
        })
      ).to.be.revertedWithCustomError(aliceWallet, "UnauthorizedCaller");
    });

    it("reentrancy attack on SmartWallet is blocked", async function () {
      const ReentrancyAttacker = await ethers.getContractFactory("ReentrancyAttacker");
      const reentrancyAttacker = await ReentrancyAttacker.deploy(aliceWalletAddr);
      await reentrancyAttacker.waitForDeployment();
      const attackerAddr = await reentrancyAttacker.getAddress();

      // Alice sends ETH to the attacker contract, which tries to re-enter
      await aliceWallet.connect(alice).execute(
        attackerAddr,
        ethers.parseEther("1"),
        "0x"
      );

      // The attacker's reentrant calls should have been blocked
      // The wallet should have only sent the initial 1 ETH
      const walletBal = await aliceWallet.getBalance();
      // Wallet started with 20 ETH, we've done several transactions
      // The key assertion: balance should not have been drained
      expect(walletBal).to.be.gt(ethers.parseEther("5"));
    });
  });

  describe("Phase 9: Wallet Pause / Unpause Lifecycle", function () {
    it("Alice pauses her wallet", async function () {
      await aliceWallet.connect(alice).pause();

      await expect(
        aliceWallet.connect(alice).execute(charlie.address, 0, "0x")
      ).to.be.revertedWithCustomError(aliceWallet, "EnforcedPause");

      await expect(
        aliceWallet.connect(alice).executeBatch([charlie.address], [0], ["0x"])
      ).to.be.revertedWithCustomError(aliceWallet, "EnforcedPause");
    });

    it("Alice can still receive ETH while paused", async function () {
      const balBefore = await aliceWallet.getBalance();
      await deployer.sendTransaction({
        to: aliceWalletAddr,
        value: ethers.parseEther("1"),
      });
      const balAfter = await aliceWallet.getBalance();
      expect(balAfter - balBefore).to.equal(ethers.parseEther("1"));
    });

    it("Alice unpauses and resumes operations", async function () {
      await aliceWallet.connect(alice).unpause();
      await aliceWallet.connect(alice).execute(charlie.address, 0, "0x");
    });
  });

  describe("Phase 10: Ownership Transfer", function () {
    it("Alice transfers wallet ownership to Charlie", async function () {
      await aliceWallet.connect(alice).transferOwnership(charlie.address);
      expect(await aliceWallet.walletOwner()).to.equal(charlie.address);
    });

    it("Alice can no longer execute on the wallet", async function () {
      await expect(
        aliceWallet.connect(alice).execute(alice.address, 0, "0x")
      ).to.be.revertedWithCustomError(aliceWallet, "UnauthorizedCaller");
    });

    it("Charlie (new owner) can execute on the wallet", async function () {
      const nonceBefore = await aliceWallet.getNonce();
      await aliceWallet.connect(charlie).execute(bob.address, 0, "0x");
      expect(await aliceWallet.getNonce()).to.equal(nonceBefore + 1n);
    });
  });

  describe("Phase 11: Factory Pause", function () {
    it("deployer pauses the factory", async function () {
      await walletFactory.pause();
      await expect(
        walletFactory.createWallet(charlie.address)
      ).to.be.revertedWithCustomError(walletFactory, "EnforcedPause");
    });

    it("existing wallets still function while factory is paused", async function () {
      await bobWallet.connect(bob).execute(charlie.address, 0, "0x");
    });

    it("deployer unpauses the factory", async function () {
      await walletFactory.unpause();
      // Charlie doesn't have a wallet yet (Alice's was transferred to him)
      // But his address is not an owner in the factory mapping
      // Let's create one for a fresh signer
      const signers = await ethers.getSigners();
      const freshUser = signers[10];
      await walletFactory.createWallet(freshUser.address);
      const newWalletAddr = await walletFactory.getWallet(freshUser.address);
      expect(newWalletAddr).to.not.equal(ethers.ZeroAddress);
    });
  });

  describe("Phase 12: Batch Pre-Deploy + Assign Flow", function () {
    let preDeployedWallets;

    it("deployer batch-deploys 5 wallets", async function () {
      const tx = await walletFactory.deployWallets(5);
      await tx.wait();
      expect(await walletFactory.unassignedWalletCount()).to.be.gte(5);
    });

    it("pre-deployed wallets are unassigned", async function () {
      const count = await walletFactory.unassignedWalletCount();
      for (let i = 0; i < Math.min(Number(count), 3); i++) {
        const addr = await walletFactory.unassignedWalletAt(i);
        const w = await ethers.getContractAt("SmartWallet", addr);
        expect(await w.isAssigned()).to.equal(false);
        expect(await w.walletOwner()).to.equal(ethers.ZeroAddress);
      }
    });

    it("deployer assigns wallets to users", async function () {
      const signers = await ethers.getSigners();
      const freshUser1 = signers[13];
      const freshUser2 = signers[14];

      const w1Addr = await walletFactory.unassignedWalletAt(0);
      const w2Addr = await walletFactory.unassignedWalletAt(1);

      await walletFactory.assignWallet(w1Addr, freshUser1.address);
      await walletFactory.assignWallet(w2Addr, freshUser2.address);

      const w1 = await ethers.getContractAt("SmartWallet", w1Addr);
      const w2 = await ethers.getContractAt("SmartWallet", w2Addr);

      expect(await w1.walletOwner()).to.equal(freshUser1.address);
      expect(await w2.walletOwner()).to.equal(freshUser2.address);
      expect(await w1.isAssigned()).to.equal(true);

      // They should be registered in EventEmitter
      expect(await eventEmitter.isRegisteredWallet(w1Addr)).to.equal(true);
      expect(await eventEmitter.isRegisteredWallet(w2Addr)).to.equal(true);
    });

    it("assigned pre-deployed wallets function normally", async function () {
      const signers = await ethers.getSigners();
      const freshUser1 = signers[13];
      const w1Addr = await walletFactory.getWallet(freshUser1.address);
      const w1 = await ethers.getContractAt("SmartWallet", w1Addr);

      await deployer.sendTransaction({ to: w1Addr, value: ethers.parseEther("2") });
      await w1.connect(freshUser1).execute(charlie.address, ethers.parseEther("0.5"), "0x");
      expect(await w1.getNonce()).to.equal(1);
    });
  });

  describe("Phase 13: Wallet Metadata", function () {
    it("Alice sets her wallet metadata", async function () {
      const metadata = {
        argusId: "550e8400-e29b-41d4-a716-446655440000",
        onchainId: alice.address,
        userAlias: "alice_paxeer",
        telegram: "@alice_tg",
        twitter: "@alice_tw",
        website: "https://alice.paxeer.io",
        github: "alice-gh",
        discord: "alice#1234",
      };

      // Alice's wallet is now owned by Charlie (from Phase 10)
      await aliceWallet.connect(charlie).setMetadata({
        ...metadata,
        onchainId: charlie.address,
        userAlias: "charlie_paxeer",
      });

      const meta = await aliceWallet.getMetadata();
      expect(meta.argusId).to.equal(metadata.argusId);
      expect(meta.onchainId).to.equal(charlie.address);
      expect(meta.userAlias).to.equal("charlie_paxeer");
      expect(meta.telegram).to.equal("@alice_tg");
    });

    it("Bob sets his wallet metadata with only required fields", async function () {
      await bobWallet.connect(bob).setMetadata({
        argusId: "bob-uuid-001",
        onchainId: bob.address,
        userAlias: "bob_paxeer",
        telegram: "",
        twitter: "",
        website: "",
        github: "",
        discord: "",
      });

      const meta = await bobWallet.getMetadata();
      expect(meta.argusId).to.equal("bob-uuid-001");
      expect(meta.onchainId).to.equal(bob.address);
      expect(meta.userAlias).to.equal("bob_paxeer");
      expect(meta.telegram).to.equal("");
    });

    it("should revert metadata with empty required fields", async function () {
      await expect(
        bobWallet.connect(bob).setMetadata({
          argusId: "",
          onchainId: bob.address,
          userAlias: "bob",
          telegram: "", twitter: "", website: "", github: "", discord: "",
        })
      ).to.be.revertedWithCustomError(bobWallet, "InvalidMetadata");
    });

    it("Bob updates his metadata", async function () {
      await bobWallet.connect(bob).setMetadata({
        argusId: "bob-uuid-001",
        onchainId: bob.address,
        userAlias: "bob_v2",
        telegram: "@bob_tg",
        twitter: "@bob_tw",
        website: "",
        github: "bob-gh",
        discord: "",
      });
      const meta = await bobWallet.getMetadata();
      expect(meta.userAlias).to.equal("bob_v2");
      expect(meta.telegram).to.equal("@bob_tg");
    });
  });

  describe("Phase 14: Stress & Edge Cases", function () {
    it("wallet can interact with another wallet's contract calls", async function () {
      // Bob's wallet calls a function on a recorder contract
      const CallRecorder = await ethers.getContractFactory("CallRecorder");
      const recorder = await CallRecorder.deploy();
      await recorder.waitForDeployment();

      const calldata = recorder.interface.encodeFunctionData("record");
      await bobWallet.connect(bob).execute(
        await recorder.getAddress(),
        ethers.parseEther("0.1"),
        calldata
      );
      expect(await recorder.callCount()).to.equal(1);
    });

    it("wallet handles failed contract call gracefully", async function () {
      const CallRecorder = await ethers.getContractFactory("CallRecorder");
      const recorder = await CallRecorder.deploy();
      await recorder.waitForDeployment();

      const failData = recorder.interface.encodeFunctionData("failingFunction");
      // Should not revert the whole tx since data is provided
      await bobWallet.connect(bob).execute(await recorder.getAddress(), 0, failData);
      const txRecord = await bobWallet.getTransaction(await bobWallet.getNonce() - 1n);
      expect(txRecord.success).to.equal(false);
    });

    it("EventEmitter tracks accurate global transaction count", async function () {
      const totalBefore = await eventEmitter.totalTransactions();
      const N = 5;
      for (let i = 0; i < N; i++) {
        await bobWallet.connect(bob).execute(charlie.address, 0, "0x");
      }
      const totalAfter = await eventEmitter.totalTransactions();
      expect(totalAfter - totalBefore).to.equal(N);
    });

    it("wallet can send its entire ETH balance", async function () {
      // Create a fresh wallet with known balance
      const signers = await ethers.getSigners();
      const freshUser = signers[11];
      await walletFactory.createWallet(freshUser.address);
      const fwAddr = await walletFactory.getWallet(freshUser.address);
      const fw = await ethers.getContractAt("SmartWallet", fwAddr);

      await deployer.sendTransaction({ to: fwAddr, value: ethers.parseEther("1") });
      const bal = await fw.getBalance();

      await fw.connect(freshUser).execute(charlie.address, bal, "0x");
      expect(await fw.getBalance()).to.equal(0);
    });

    it("wallet rejects transfer exceeding balance", async function () {
      const signers = await ethers.getSigners();
      const freshUser = signers[12];
      await walletFactory.createWallet(freshUser.address);
      const fwAddr = await walletFactory.getWallet(freshUser.address);
      const fw = await ethers.getContractAt("SmartWallet", fwAddr);

      await deployer.sendTransaction({ to: fwAddr, value: ethers.parseEther("1") });

      await expect(
        fw.connect(freshUser).execute(charlie.address, ethers.parseEther("999"), "0x")
      ).to.be.revertedWithCustomError(fw, "InsufficientBalance");
    });

    it("multiple wallets can transact simultaneously without interference", async function () {
      // Bob sends to Charlie
      const bobNonceBefore = await bobWallet.getNonce();
      await bobWallet.connect(bob).execute(charlie.address, ethers.parseEther("0.01"), "0x");
      expect(await bobWallet.getNonce()).to.equal(bobNonceBefore + 1n);

      // Alice's wallet (now owned by Charlie) sends to deployer
      const aliceNonceBefore = await aliceWallet.getNonce();
      await aliceWallet.connect(charlie).execute(deployer.address, ethers.parseEther("0.01"), "0x");
      expect(await aliceWallet.getNonce()).to.equal(aliceNonceBefore + 1n);
    });
  });
});
