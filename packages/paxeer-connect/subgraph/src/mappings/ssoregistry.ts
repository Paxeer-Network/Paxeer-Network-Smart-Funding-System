import { OwnershipTransferred as OwnershipTransferredEvent, SessionKeyRegistered as SessionKeyRegisteredEvent, SessionKeyRevoked as SessionKeyRevokedEvent, SessionKeyUpdated as SessionKeyUpdatedEvent } from '../../generated/SSORegistry/SSORegistry';
import { SSORegistryOwnershipTransferred, SSORegistrySessionKeyRegistered, SSORegistrySessionKeyRevoked, SSORegistrySessionKeyUpdated } from '../../generated/schema';
import { Bytes, BigInt } from '@graphprotocol/graph-ts';

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SSORegistryOwnershipTransferred(id.toHexString());

  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSessionKeyRegistered(event: SessionKeyRegisteredEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SSORegistrySessionKeyRegistered(id.toHexString());

  entity.wallet = event.params.wallet;
  entity.signer = event.params.signer;
  entity.validAfter = event.params.validAfter;
  entity.validUntil = event.params.validUntil;
  entity.permissions = event.params.permissions;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSessionKeyRevoked(event: SessionKeyRevokedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SSORegistrySessionKeyRevoked(id.toHexString());

  entity.wallet = event.params.wallet;
  entity.signer = event.params.signer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSessionKeyUpdated(event: SessionKeyUpdatedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new SSORegistrySessionKeyUpdated(id.toHexString());

  entity.wallet = event.params.wallet;
  entity.signer = event.params.signer;
  entity.validUntil = event.params.validUntil;
  entity.permissions = event.params.permissions;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

