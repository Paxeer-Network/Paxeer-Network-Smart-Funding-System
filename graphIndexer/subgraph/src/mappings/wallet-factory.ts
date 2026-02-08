import { OwnershipTransferred as OwnershipTransferredEvent, Paused as PausedEvent, Unpaused as UnpausedEvent, WalletAssigned as WalletAssignedEvent, WalletCreated as WalletCreatedEvent, WalletPreDeployed as WalletPreDeployedEvent } from '../../generated/WalletFactory/WalletFactory';
import { WalletFactoryOwnershipTransferred, WalletFactoryPaused, WalletFactoryUnpaused, WalletFactoryWalletAssigned, WalletFactoryWalletCreated, WalletFactoryWalletPreDeployed } from '../../generated/schema';
import { Bytes, BigInt } from '@graphprotocol/graph-ts';

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new WalletFactoryOwnershipTransferred(id.toHexString());

  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePaused(event: PausedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new WalletFactoryPaused(id.toHexString());

  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUnpaused(event: UnpausedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new WalletFactoryUnpaused(id.toHexString());

  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWalletAssigned(event: WalletAssignedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new WalletFactoryWalletAssigned(id.toHexString());

  entity.wallet = event.params.wallet;
  entity.owner = event.params.owner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWalletCreated(event: WalletCreatedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new WalletFactoryWalletCreated(id.toHexString());

  entity.owner = event.params.owner;
  entity.wallet = event.params.wallet;
  entity.salt = event.params.salt;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWalletPreDeployed(event: WalletPreDeployedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new WalletFactoryWalletPreDeployed(id.toHexString());

  entity.wallet = event.params.wallet;
  entity.index = event.params.index;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

