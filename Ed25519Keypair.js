'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Ed25519Keypair;

var _bs = require('bs58');

var _bs2 = _interopRequireDefault(_bs);

var _tweetnacl = require('tweetnacl');

var _tweetnacl2 = _interopRequireDefault(_tweetnacl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public
 * @class Keypair Ed25519 keypair in base58 (as BigchainDB expects base58 keys)
 * @type {Object}
 * @param {Buffer} [seed] A seed that will be used as a key derivation function
 * @property {string} publicKey
 * @property {string} privateKey
 */
function Ed25519Keypair(seed) {
  var keyPair = seed ? _tweetnacl2.default.sign.keyPair.fromSeed(seed) : _tweetnacl2.default.sign.keyPair();
  //this.publicKey = _bs2.default.encode(keyPair.publicKey);
  // tweetnacl's generated secret key is the secret key + public key (resulting in a 64-byte buffer)
//  this.privateKey = _bs2.default.encode(keyPair.secretKey.slice(0, 32));
   this.publicKey = _bs2.default.encode(Buffer.from(keyPair.publicKey));
this.privateKey = _bs2.default.encode(Buffer.from(keyPair.secretKey.slice(0, 32)));
}
module.exports = exports['default'];
