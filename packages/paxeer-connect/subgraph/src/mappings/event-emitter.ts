import { OwnershipTransferred as OwnershipTransferredEvent, Paused as PausedEvent, TransactionExecuted as TransactionExecutedEvent, Unpaused as UnpausedEvent, WalletDeregistered as WalletDeregisteredEvent, WalletRegistered as WalletRegisteredEvent } from '../../generated/EventEmitter/EventEmitter';
import { EventEmitterOwnershipTransferred, EventEmitterPaused, EventEmitterTransactionExecuted, EventEmitterUnpaused, EventEmitterWalletDeregistered, EventEmitterWalletRegistered } from '../../generated/schema';
import { Bytes, BigInt } from '@graphprotocol/graph-ts';

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new EventEmitterOwnershipTransferred(id.toHexString());

  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePaused(event: PausedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new EventEmitterPaused(id.toHexString());

  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransactionExecuted(event: TransactionExecutedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new EventEmitterTransactionExecuted(id.toHexString());

  entity.wallet = event.params.wallet;
  entity.to = event.params.to;
  entity.value = event.params.value;
  entity.data = event.params.data;
  entity.nonce = event.params.nonce;
  entity.timestamp = event.params.timestamp;
  entity.success = event.params.success;
  entity.returnData = event.params.returnData;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUnpaused(event: UnpausedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new EventEmitterUnpaused(id.toHexString());

  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWalletDeregistered(event: WalletDeregisteredEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new EventEmitterWalletDeregistered(id.toHexString());

  entity.wallet = event.params.wallet;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWalletRegistered(event: WalletRegisteredEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new EventEmitterWalletRegistered(id.toHexString());

  entity.wallet = event.params.wallet;
  entity.owner = event.params.owner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

