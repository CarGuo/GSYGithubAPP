/**
 * Created by buhe on 16/4/12.
 */
import util from './auth.js';
import conf from './conf.js';
import rpc from './rpc.js';

function stat(bucket, key) {
  var encodedEntryUri = getEncodedEntryUri(bucket, key);
  var uri = conf.RS_HOST + '/stat/' + encodedEntryUri;
  var digest = util.generateAccessToken(uri, null);

  return rpc.post(uri, digest);
}

function remove(bucket, key) {
  /*
   * func (this Client) Delete(bucket, key string) (err error)
   * */
  var encodedEntryUri = getEncodedEntryUri(bucket, key);
  var uri = conf.RS_HOST + '/delete/' + encodedEntryUri;
  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest);
}

function move(bucketSrc, keySrc, bucketDest, keyDest) {
  var encodedEntryURISrc = getEncodedEntryUri(bucketSrc, keySrc);
  var encodedEntryURIDest = getEncodedEntryUri(bucketDest, keyDest);
  var uri = conf.RS_HOST + '/move/' + encodedEntryURISrc + '/' + encodedEntryURIDest;
  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest);
}

function forceMove(bucketSrc, keySrc, bucketDest, keyDest, force) {

  var encodedEntryURISrc = getEncodedEntryUri(bucketSrc, keySrc);
  var encodedEntryURIDest = getEncodedEntryUri(bucketDest, keyDest);
  var uri = conf.RS_HOST + '/move/' + encodedEntryURISrc + '/' + encodedEntryURIDest + '/force/' + force;

  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest);
}

function copy(bucketSrc, keySrc, bucketDest, keyDest) {
  var encodedEntryURISrc = getEncodedEntryUri(bucketSrc, keySrc);
  var encodedEntryURIDest = getEncodedEntryUri(bucketDest, keyDest);
  var uri = conf.RS_HOST + '/copy/' + encodedEntryURISrc + '/' + encodedEntryURIDest;

  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest);
}

function forceCopy(bucketSrc, keySrc, bucketDest, keyDest, force) {

  var encodedEntryURISrc = getEncodedEntryUri(bucketSrc, keySrc);
  var encodedEntryURIDest = getEncodedEntryUri(bucketDest, keyDest);
  var uri = conf.RS_HOST + '/copy/' + encodedEntryURISrc + '/' + encodedEntryURIDest + '/force/' + force;

  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest);
}


function fetch(url, bucket, key) {
  var bucketUri = getEncodedEntryUri(bucket, key);
  var fetchUrl = util.urlsafeBase64Encode(url);
  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest);
}

function batchStat(entries) {
  return fileHandle('stat', entries);
}

function batchDelete(entries) {
  return fileHandle('delete', entries);
}

function batchMove(entries) {
  return fileHandle('move', entries);
}

function forceBatchMove(entries, force) {

  return fileHandleForce('move', entries, force);

}

function batchCopy(entries) {
  return fileHandle('copy', entries);
}

function forceBatchCopy(entries, force) {

  return fileHandleForce('copy', entries, force);

}


function fileHandle(op, entries) {
  var body = '';
  for (var i in entries) {
    body += entries[i].toStr(op);
  }

  var uri = conf.RS_HOST + '/batch';
  var digest = util.generateAccessToken(uri, body);
  return rpc.post(uri,digest, body);
}

function fileHandleForce(op, entries, force) {
  var body = '';
  for (var i in entries) {
    body += entries[i].toStr(op, force);
  }

  console.log(body);
  var uri = conf.RS_HOST + '/batch';
  var digest = util.generateAccessToken(uri, body);
  return rpc.post(uri, digest,body);
}

function getEncodedEntryUri(bucket, key) {
  return util.urlsafeBase64Encode(bucket + (key ? ':' + key : ''));
}

class EntryPathPair {
  constructor(src, dest) {
    this.src = src || null;
    this.dest = dest || null;
  }

  toStr(op, force) {
    if (typeof(force) == 'undefined') {

      return 'op=/' + op + '/' + this.src.encode() + '/' + this.dest.encode() + '&';

    } else {

      return 'op=/' + op + '/' + this.src.encode() + '/' + this.dest.encode() + '/force/' + force + '&';
    }
  }

}

class BatchItemRet {
  constructor(error, code) {
    this.error = error || null;
    this.code = code || null;
  }
}

class BatchStatItemRet {
  constructor(data, error, code) {
    this.data = data;
    this.error = error;
    this.code = code;
  }
}


class Entry {
  constructor(hash, fsize, putTime, mimeType, endUser) {
    this.hash = hash || null;
    this.fsize = fsize || null;
    this.putTime = putTime || null;
    this.mimeType = mimeType || null;
    this.endUser = endUser || null;
  }
}

class EntryPath {
  constructor(bucket, key) {
    this.bucket = bucket || null;
    this.key = key || null;
  }

  encode() {
    return getEncodedEntryUri(this.bucket, this.key);
  }

  toStr(op) {
    return 'op=/' + op + '/' + getEncodedEntryUri(this.bucket, this.key) + '&';
  }
}

export default {
  stat,
  remove,
  move,
  forceMove,
  copy,
  forceCopy,
  fetch,
  batchStat,
  batchDelete,
  batchMove,
  forceBatchMove,
  batchCopy,
  forceBatchCopy,
  EntryPathPair,
  BatchItemRet,
  BatchStatItemRet,
  Entry,
  EntryPath
}