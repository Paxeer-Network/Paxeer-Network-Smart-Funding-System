import { BatchExecuted as BatchExecutedEvent, Executed as ExecutedEvent, MetadataUpdated as MetadataUpdatedEvent, OwnerAssigned as OwnerAssignedEvent, Paused as PausedEvent, Received as ReceivedEvent, SessionKeyAuthorized as SessionKeyAuthorizedEvent, SessionKeyRevoked as SessionKeyRevokedEvent, Unpaused as UnpausedEvent } from '../../generated/SmartWallet/SmartWallet';
import { SmartWalletBatchExecuted, SmartWalletExecuted, SmartWalletMetadataUpdated, SmartWalletOwnerAssigned, SmartWalletPaused, SmartWalletReceived, SmartWalletSessionKeyAuthorized, SmartWalletSessionKeyRevoked, SmartWalletUnpaused } from '../../generated/schema';
import { Bytes, BigInt } from '@graphprotocol/graph-ts';

export function handleBatchExecuted(event: BatchExecutedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SmartWalletBatchExecuted(id.toHexString());

  entity.count = event.params.count;
  entity.startNonce = event.params.startNonce;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleExecuted(event: ExecutedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SmartWalletExecuted(id.toHexString());

  entity.to = event.params.to;
  entity.value = event.params.value;
  entity.nonce = event.params.nonce;
  entity.success = event.params.success;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMetadataUpdated(event: MetadataUpdatedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SmartWalletMetadataUpdated(id.toHexString());

  entity.argusId = event.params.argusId;
  entity.onchainId = event.params.onchainId;
  entity.userAlias = event.params.userAlias;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnerAssigned(event: OwnerAssignedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SmartWalletOwnerAssigned(id.toHexString());

  entity.owner = event.params.owner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePaused(event: PausedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SmartWalletPaused(id.toHexString());

  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleReceived(event: ReceivedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SmartWalletReceived(id.toHexString());

  entity.from = event.params.from;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSessionKeyAuthorized(event: SessionKeyAuthorizedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SmartWalletSessionKeyAuthorized(id.toHexString());

  entity.signer = event.params.signer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSessionKeyRevoked(event: SessionKeyRevokedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SmartWalletSessionKeyRevoked(id.toHexString());

  entity.signer = event.params.signer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUnpaused(event: UnpausedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SmartWalletUnpaused(id.toHexString());

  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

