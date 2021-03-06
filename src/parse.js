import { toJSON } from 'json-xdr';
import StellarSdk from 'stellar-sdk';

import memoParser from './functions/memo';
import ed25519parser from './functions/ed25519';
import operationsParser from './functions/operations';
import sourceAccountParser from './functions/sourceAccount';

export default (xdr) => {
  const object = toJSON(StellarSdk.xdr.TransactionEnvelope.fromXDR(xdr, 'base64'));

  const parsed = {};
  let tx;

  if (object.v0) {
    tx = object.v0.tx;
  } else if (object.v1) {
    tx = object.v1.tx;
  } else {
    return {};
  }

  if (tx.fee) {
    parsed.fee = tx.fee;
  }

  if (tx.seqNum) {
    parsed.seqNum = tx.seqNum;
  }

  if (tx.memo) {
    parsed.memo = memoParser(tx.memo);
  }

  if (tx.timeBounds) {
    parsed.timeBounds = tx.timeBounds;
  }

  if (tx.sourceAccount) {
    parsed.sourceAccount = ed25519parser(tx.sourceAccount);
  } else if (tx.sourceAccountEd25519) {
    parsed.sourceAccount = sourceAccountParser(tx.sourceAccountEd25519);
  }

  if (tx.operations) {
    parsed.operations = operationsParser(tx.operations)
  }

  return parsed;
};
