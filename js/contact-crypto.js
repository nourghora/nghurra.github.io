/* =====================================================================
   Contact form — client-side encryption helper
   ---------------------------------------------------------------------
   Scheme : HMAC-SHA256 keystream (CTR mode) + HMAC-SHA256 tag
            (encrypt-then-MAC). Uses only the built-in Web Crypto API,
            so no external library is required.

   Envelope POSTed to the Google Apps Script backend:
       { "v": 1, "n": "<b64 nonce>", "c": "<b64 ciphertext>", "m": "<b64 tag>" }

   Key schedule (must stay identical to apps-script/Code.gs):
       K      = SHA-256( UTF8(SECRET) )
       kEnc   = HMAC-SHA256(K, "enc")
       kMac   = HMAC-SHA256(K, "mac")
       KS(i)  = HMAC-SHA256(kEnc, nonce || UINT32BE(i))     // 32 bytes / block
       C      = P XOR KS
       tag    = HMAC-SHA256(kMac, nonce || C)[0..15]
   ===================================================================== */
(function () {
    'use strict';

    var CHUNK = 0x8000;

    function toBase64(bytes) {
        var binary = '';
        for (var i = 0; i < bytes.length; i += CHUNK) {
            binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
        }
        return btoa(binary);
    }

    function concat(a, b) {
        var out = new Uint8Array(a.length + b.length);
        out.set(a, 0);
        out.set(b, a.length);
        return out;
    }

    function counterBytes(n) {
        return new Uint8Array([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);
    }

    function utf8(text) {
        return new TextEncoder().encode(text);
    }

    function available() {
        return !!(window.crypto && window.crypto.subtle && window.TextEncoder);
    }

    function importHmac(rawKey) {
        return window.crypto.subtle.importKey('raw', rawKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    }

    function sign(key, data) {
        return window.crypto.subtle.sign('HMAC', key, data).then(function (buffer) {
            return new Uint8Array(buffer);
        });
    }

    function deriveKeys(secret) {
        return window.crypto.subtle.digest('SHA-256', utf8(secret)).then(function (digest) {
            return importHmac(new Uint8Array(digest));
        }).then(function (masterKey) {
            return Promise.all([
                sign(masterKey, utf8('enc')).then(importHmac),
                sign(masterKey, utf8('mac')).then(importHmac)
            ]);
        }).then(function (keys) {
            return { enc: keys[0], mac: keys[1] };
        });
    }

    function encrypt(data, secret) {
        if (!available()) {
            return Promise.reject(new Error('Web Crypto API is not available in this browser (HTTPS is required).'));
        }

        var plaintext = utf8(JSON.stringify(data));
        var nonce = window.crypto.getRandomValues(new Uint8Array(16));

        return deriveKeys(secret).then(function (keys) {
            var cipher = new Uint8Array(plaintext.length);
            var blocks = Math.ceil(plaintext.length / 32);
            var chain = Promise.resolve();

            for (var i = 0; i < blocks; i++) {
                (function (blockIndex) {
                    chain = chain.then(function () {
                        return sign(keys.enc, concat(nonce, counterBytes(blockIndex)));
                    }).then(function (keystream) {
                        for (var j = 0; j < 32; j++) {
                            var index = blockIndex * 32 + j;
                            if (index >= plaintext.length) break;
                            cipher[index] = plaintext[index] ^ keystream[j];
                        }
                    });
                })(i);
            }

            return chain.then(function () {
                return sign(keys.mac, concat(nonce, cipher));
            }).then(function (full) {
                return {
                    v: 1,
                    n: toBase64(nonce),
                    c: toBase64(cipher),
                    m: toBase64(full.slice(0, 16))
                };
            });
        });
    }

    window.ContactCrypto = {
        encrypt: encrypt,
        available: available
    };
})();
