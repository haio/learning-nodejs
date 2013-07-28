'use strict';

var crypto = require('crypto');

var ConsistentHashing = module.exports = function (servers, options) {
    //default vnode: 40
    this.vnode = options && options.vnode || 40;
    this.replicas = options && options.replicas || 4;
    this.algorithm = options && options.algorithm || 'md5';
    this.servers = servers;
    this.ring = [];
    this.generate();
}

/*
 *  Generate hashing ring
*/
ConsistentHashing.prototype.generate = function () {
    var servers = this.servers;

    servers.forEach(function (server) {
        var length = this.vnode,
            arr,
            code;

        for (var i = 0; i < length; i++) {
            arr = this.digest(server + '-' +i);

            for(var j = 0; j < this.replicas; j++) {
                // Every vnode has 4 replicas, we split the array of server hash into 4 part,
                // the hash code of each part is a key
                code = this.hashcode(arr[3 + j*4], arr[2 + j*4], arr[1 + j*4], arr[j*4]);
                this.ring.push(new Node(code, server));
            }
        }
    }.bind(this));

    // Sort node by code
    this.ring.sort(function (a,b) {
        return a.code === b.code ? 0 : a.code > b.code ? 1 : -1;
    });

    return this;
}

/*
 * Get server by key, use binary search algorithm
 * @param {String} key
*/
ConsistentHashing.prototype.get = function (key) {
    var x = this.digest(key),
        code = this.hashcode(x[3], x[2], x[1], x[0]);

    return this.search(code).server;
}

ConsistentHashing.prototype.search = function (hashcode) {
    var ring = this.ring,
        high = ring.length,
        low = 0,
        mid,
        middle,
        prev;

    while(low <= high) {
        mid = (low + high) >> 1;

        if (mid === ring.length) return ring[0];

        middle = ring[mid].code;
        prev = mid === 0 ? 0 : ring[mid-1].code;

        if (hashcode <= middle && hashcode > prev) return ring[mid];

        if (middle < hashcode) {
            low = mid + 1;
        } else {
            high = mid -1;
        }

    }
    return ring[0];
}

ConsistentHashing.prototype.hashcode = function () {
    var args = Array.prototype.slice.call(arguments),
        code = args[0] << 24 | args[1] << 16 | args[2] << 8 | args[3];
    return code < 0 ? code + Math.pow(2,32) : code;
}

ConsistentHashing.prototype.digest = function (key) {
    var hash = this.hash(key + '');

    if (typeof hash !== 'string') return hash;

    return hash.split('').map(function (c) {
        return c.charCodeAt(0);
    });
}

ConsistentHashing.prototype.hash = function (key) {
    return crypto.createHash(this.algorithm).update(key).digest();
}

/*
 *  Define the node
 *  @param {Number} key
 *  @param {String} server
*/
var Node = function(code, server) {
    this.code = code;
    this.server = server;
}

