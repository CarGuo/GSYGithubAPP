/**
 * Created by buhe on 16/4/12.
 */
import base64 from 'base-64';
import CryptoJS from "crypto-js";
import conf from "./conf.js";
import parse from 'url-parse';

function urlsafeBase64Encode(jsonFlags) {
  var encoded = base64.encode(jsonFlags);
  return base64ToUrlSafe(encoded);
};

function base64ToUrlSafe(v) {
  return v.replace(/\//g, '_').replace(/\+/g, '-');
};

function hmacSha1(encodedFlags, secretKey) {
  var encoded = CryptoJS.HmacSHA1(encodedFlags, secretKey).toString(CryptoJS.enc.Base64);
  return encoded;
};

function generateAccessToken(url, body) {
  var u = parse(url, true);

  var path = u.pathname;
  var access = path + '\n';

  if (body) {
    access += body;
  }

  var digest = hmacSha1(access, conf.SECRET_KEY);
  var safeDigest = base64ToUrlSafe(digest);
  let token = 'QBox ' + conf.ACCESS_KEY + ':' + safeDigest;
  //console.log(token);
  return token;
};

class PutPolicy2 {
  constructor(putPolicyObj) {
    if (typeof putPolicyObj !== 'object') {
      return false;
    }

    this.scope = putPolicyObj.scope || null;
    this.expires = putPolicyObj.expires || 3600;
    this.insertOnly = putPolicyObj.insertOnly || null;

    this.saveKey = putPolicyObj.saveKey || null;
    this.endUser = putPolicyObj.endUser || null;

    this.returnUrl = putPolicyObj.returnUrl || null;
    this.returnBody = putPolicyObj.returnBody || null;

    this.callbackUrl = putPolicyObj.callbackUrl || null;
    this.callbackHost = putPolicyObj.callbackHost || null;
    this.callbackBody = putPolicyObj.callbackBody || null;
    this.callbackBodyType = putPolicyObj.callbackBodyType || null;

    this.persistentOps = putPolicyObj.persistentOps || null;
    this.persistentNotifyUrl = putPolicyObj.persistentNotifyUrl || null;
    this.persistentPipeline = putPolicyObj.persistentPipeline || null;

    this.fsizeLimit = putPolicyObj.fsizeLimit || null;

    this.fsizeMin = putPolicyObj.fsizeMin || null;

    this.detectMime = putPolicyObj.detectMime || null;

    this.mimeLimit = putPolicyObj.mimeLimit || null;
  }

  token() {
    var flags = this.getFlags();
    var encodedFlags = urlsafeBase64Encode(JSON.stringify(flags));
    var encoded = hmacSha1(encodedFlags, conf.SECRET_KEY);
    var encodedSign = base64ToUrlSafe(encoded);
    var uploadToken = conf.ACCESS_KEY + ':' + encodedSign + ':' + encodedFlags;
    return uploadToken;
  }

  getFlags() {
    var flags = {};
    var attrs = ['scope', 'insertOnly', 'saveKey', 'endUser', 'returnUrl', 'returnBody', 'callbackUrl', 'callbackHost', 'callbackBody', 'callbackBodyType', 'callbackFetchKey', 'persistentOps', 'persistentNotifyUrl', 'persistentPipeline', 'fsizeLimit', 'fsizeMin', 'detectMime', 'mimeLimit'];

    for (var i = attrs.length - 1; i >= 0; i--) {
      if (this[attrs[i]] !== null) {
        flags[attrs[i]] = this[attrs[i]];
      }
    }

    flags['deadline'] = this.expires + Math.floor(Date.now() / 1000);

    return flags;
  }
}

class GetPolicy {
  constructor(expires) {
    this.expires = expires || 3600;
  }

  makeRequest(baseUrl) {
    var deadline = this.expires + Math.floor(Date.now() / 1000);

    if (baseUrl.indexOf('?') >= 0) {
      baseUrl += '&e=';
    } else {
      baseUrl += '?e=';
    }
    baseUrl += deadline;

    var signature = hmacSha1(baseUrl, conf.SECRET_KEY);
    var encodedSign = base64ToUrlSafe(signature);
    var downloadToken = conf.ACCESS_KEY + ':' + encodedSign;

    return baseUrl + '&token=' + downloadToken;
  }
}

export default {urlsafeBase64Encode,generateAccessToken,PutPolicy2,GetPolicy}
