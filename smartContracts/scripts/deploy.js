const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy EventEmitter
  console.log("\n--- Deploying EventEmitter ---");
  const EventEmitter = await hre.ethers.getContractFactory("EventEmitter");
  const eventEmitter = await EventEmitter.deploy(deployer.address);
  await eventEmitter.waitForDeployment();
  const eventEmitterAddr = await eventEmitter.getAddress();
  console.log("EventEmitter deployed to:", eventEmitterAddr);

  // 2. Deploy SSORegistry
  console.log("\n--- Deploying SSORegistry ---");
  const SSORegistry = await hre.ethers.getContractFactory("SSORegistry");
  const ssoRegistry = await SSORegistry.deploy(deployer.address);
  await ssoRegistry.waitForDeployment();
  const ssoRegistryAddr = await ssoRegistry.getAddress();
  console.log("SSORegistry deployed to:", ssoRegistryAddr);

  // 3. Deploy SmartWallet implementation (logic contract, not initialized)
  console.log("\n--- Deploying SmartWallet Implementation ---");
  const SmartWallet = await hre.ethers.getContractFactory("SmartWallet");
  const smartWalletImpl = await SmartWallet.deploy();
  await smartWalletImpl.waitForDeployment();
  const smartWalletImplAddr = await smartWalletImpl.getAddress();
  console.log("SmartWallet implementation deployed to:", smartWalletImplAddr);

  // 4. Deploy WalletFactory
  console.log("\n--- Deploying WalletFactory ---");
  const WalletFactory = await hre.ethers.getContractFactory("WalletFactory");
  const walletFactory = await WalletFactory.deploy(
    deployer.address,
    smartWalletImplAddr,
    eventEmitterAddr,
    ssoRegistryAddr
  );
  await walletFactory.waitForDeployment();
  const walletFactoryAddr = await walletFactory.getAddress();
  console.log("WalletFactory deployed to:", walletFactoryAddr);

  // 5. Wire up: set factory on EventEmitter so it can register wallets
  console.log("\n--- Wiring contracts ---");
  const setFactoryTx = await eventEmitter.setFactory(walletFactoryAddr);
  await setFactoryTx.wait();
  console.log("EventEmitter.setFactory =>", walletFactoryAddr);

  // Summary
  console.log("\n========================================");
  console.log("Deployment Summary");
  console.log("========================================");
  console.log("EventEmitter:           ", eventEmitterAddr);
  console.log("SSORegistry:            ", ssoRegistryAddr);
  console.log("SmartWallet (impl):     ", smartWalletImplAddr);
  console.log("WalletFactory:          ", walletFactoryAddr);
  console.log("========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
