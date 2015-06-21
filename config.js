/**
 * server config Module
 *
 * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
 */
module.exports = (function() {
    'use strict';

    return {
        port: 3000,
        datastore: './data/notes.db',
        hashAlgorithm: 'md5', //'sha1', 'md5', 'sha256', 'sha512', ...
        hashEncoding: 'hex' //'hex', 'binary' or 'base64'
    };
})();