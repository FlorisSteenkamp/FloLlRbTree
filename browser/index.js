(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FloLlRbTree = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
/*
 * Concise, Destructive, Left Leaning Red Black Tree implementation.
 * See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
 * See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
 * See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html
 */
var Color;
(function (Color) {
    Color[Color["BLACK"] = 0] = "BLACK";
    Color[Color["RED"] = 1] = "RED";
})(Color || (Color = {}));
var Dir;
(function (Dir) {
    Dir[Dir["LEFT"] = 0] = "LEFT";
    Dir[Dir["RIGHT"] = 1] = "RIGHT";
})(Dir || (Dir = {}));
/**
 * Red Black Tree node.
 * @constructor
 * @param {*} data
 */
var Node = /** @class */ (function () {
    function Node(data, asArray) {
        if (asArray) {
            this.data = [data];
        }
        else {
            this.data = data;
        }
        this.color = Color.RED;
    }
    return Node;
}());
function isRed(node) {
    return node && node.color === Color.RED;
}
/**
 * @param compare
 * @param datas
 * @param replaceDups - If true then if a duplicate is
 * inserted (as per the equivalence relation induced by the compare)
 * then replace it. If false then keep an array of values at the relevant
 * node.
 */
var LlRbTree = /** @class */ (function () {
    function LlRbTree(compare, datas, replaceDups) {
        this.getMinNode = this.getMinOrMaxNode(Dir.LEFT);
        this.getMaxNode = this.getMinOrMaxNode(Dir.RIGHT);
        var tree = this;
        tree.setComparator(compare, replaceDups);
        tree.replaceDups = replaceDups;
        tree.root = null;
        if (!datas) {
            return;
        }
        for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
            var data = datas_1[_i];
            tree.insert(data);
        }
    }
    /**
     * Destructively sets the tree compare. This function can be used for for e.g.
     * the Bentley Ottmann algorithm.
     */
    LlRbTree.prototype.setComparator = function (compare, replaceDups) {
        if (replaceDups) {
            this.compare = compare;
        }
        else {
            this.compare = function (a, b) { return compare(a, b[0]); };
        }
    };
    LlRbTree.prototype.isEmpty = function () { return !this.root; };
    /**
     * Find the node in the tree with the given data using the tree compare
     * function.
     * @returns {Node} node or null if not found.
     */
    LlRbTree.prototype.find = function (data) {
        var tree = this;
        var node = this.root;
        while (node) {
            var c = tree.compare(data, node.data);
            if (c === 0) {
                return node;
            }
            else {
                node = node[c > 0 ? Dir.RIGHT : Dir.LEFT];
            }
        }
        return null;
    };
    /**
     * .
     */
    LlRbTree.prototype.toArrayInOrder = function () {
        var nodes = [];
        f(this.root);
        function f(node) {
            if (!node) {
                return;
            }
            f(node[Dir.LEFT]);
            nodes.push(node);
            f(node[Dir.RIGHT]);
        }
        return nodes;
    };
    /**
     * Inserts a node with the given data into the tree.
     */
    LlRbTree.prototype.insert = function (data) {
        var tree = this;
        tree.root = f(tree.root, data);
        tree.root.color = Color.BLACK;
        tree.root.parent = undefined;
        function f(h, data) {
            if (!h) {
                return new Node(data, !tree.replaceDups);
            }
            var c = tree.compare(data, h.data);
            if (c === 0) {
                if (tree.replaceDups) {
                    h.data = data;
                }
                else {
                    h.data.push(data);
                }
            }
            else {
                var dir = c > 0 ? Dir.RIGHT : Dir.LEFT;
                h[dir] = f(h[dir], data);
                h[dir].parent = h;
            }
            if (isRed(h[Dir.RIGHT]) &&
                !isRed(h[Dir.LEFT])) {
                h = rotate(Dir.LEFT, h);
            }
            if (isRed(h[Dir.LEFT]) &&
                isRed(h[Dir.LEFT][Dir.LEFT])) {
                h = rotate(Dir.RIGHT, h);
            }
            if (isRed(h[Dir.LEFT]) &&
                isRed(h[Dir.RIGHT])) {
                flipColors(h);
            }
            return h;
        }
    };
    /**
     * Removes an item from the tree based on the given data.
     * @param {LlRbTree} tree
     * @param {*} data
     * @param {boolean} all - If the data is an array, remove all.
     */
    LlRbTree.prototype.remove = function (data, all) {
        var tree = this;
        tree.root = f(tree.root, data);
        if (tree.root) {
            tree.root.color = Color.BLACK;
            tree.root.parent = undefined;
        }
        function f(h, data) {
            //let h = h_;
            var c = tree.compare(data, h.data);
            if (!tree.replaceDups && c === 0 && !all && h.data.length > 1) {
                removeFromArray(data, h.data);
                return h;
            }
            if (c < 0 && !h[Dir.LEFT] || c > 0 && !h[Dir.RIGHT]) {
                return h;
            }
            if (c < 0) {
                if (!isRed(h[Dir.LEFT]) &&
                    !isRed(h[Dir.LEFT][Dir.LEFT])) {
                    h = moveRedLeft(h);
                }
                h[Dir.LEFT] = f(h[Dir.LEFT], data);
                if (h[Dir.LEFT]) {
                    h[Dir.LEFT].parent = h;
                }
                return fixUp(h);
            }
            if (isRed(h[Dir.LEFT])) {
                h = rotate(Dir.RIGHT, h);
                c = tree.compare(data, h.data);
                if (!tree.replaceDups && c === 0 && !all && h.data.length > 1) {
                    removeFromArray(data, h.data);
                    return h;
                }
            }
            if (c === 0 && !h[Dir.RIGHT]) {
                return null;
            }
            if (!isRed(h[Dir.RIGHT]) &&
                !isRed(h[Dir.RIGHT][Dir.LEFT])) {
                h = moveRedRight(h);
                c = tree.compare(data, h.data);
                if (!tree.replaceDups && c === 0 && !all && h.data.length > 1) {
                    removeFromArray(data, h.data);
                    return h;
                }
            }
            if (c === 0) {
                h.data = tree.min(h[Dir.RIGHT]);
                h[Dir.RIGHT] = removeMin(h[Dir.RIGHT]);
            }
            else {
                h[Dir.RIGHT] = f(h[Dir.RIGHT], data);
            }
            if (h[Dir.RIGHT]) {
                h[Dir.RIGHT].parent = h;
            }
            return fixUp(h);
        }
    };
    /**
     * Returns the two ordered nodes bounding the data. If the
     * data falls on a node, that node and the next (to the right) is
     * returned.
     * @returns {Node[]}
     */
    LlRbTree.prototype.findBounds = function (data) {
        var tree = this;
        var node = tree.root;
        var bounds = [undefined, undefined];
        if (node === null) {
            return bounds;
        }
        while (node) {
            var c = tree.compare(data, node.data);
            if (c >= 0) {
                bounds[0] = node;
            }
            else {
                bounds[1] = node;
            }
            node = node[c >= 0 ? Dir.RIGHT : Dir.LEFT];
        }
        return bounds;
    };
    /**
     * @param {LlRbTree} tree
     * @param {*} data
     * @returns {Node[]} The two ordered nodes bounding the data. If the
     * data falls on a node, returns the nodes before and after this one.
     */
    LlRbTree.prototype.findBoundsExcl = function (data) {
        var tree = this;
        var node = tree.root;
        var bounds = [undefined, undefined];
        if (node === null) {
            return bounds;
        }
        f(node);
        function f(node) {
            while (node) {
                var c = tree.compare(data, node.data);
                if (c === 0) {
                    // Search on both sides
                    f(node[Dir.LEFT]);
                    f(node[Dir.RIGHT]);
                    return;
                }
                if (c > 0) {
                    bounds[0] = node;
                }
                else if (c < 0) {
                    bounds[1] = node;
                }
                node = node[c > 0 ? Dir.RIGHT : Dir.LEFT];
            }
        }
        return bounds;
    };
    /**
     *
     */
    LlRbTree.prototype.findAllInOrder = function (data) {
        var tree = this;
        var nodes = [];
        f(tree.root);
        function f(node) {
            while (node) {
                var c = tree.compare(data, node.data);
                if (c === 0) {
                    f(node[Dir.LEFT]);
                    nodes.push(node);
                    f(node[Dir.RIGHT]);
                    return;
                }
                node = node[c > 0 ? Dir.RIGHT : Dir.LEFT];
            }
        }
        return nodes;
    };
    LlRbTree.prototype.getMinOrMaxNode = function (dir) {
        return function (node) {
            if (!node) {
                return undefined;
            }
            while (node[dir]) {
                node = node[dir];
            }
            return node;
        };
    };
    LlRbTree.prototype.min = function (node) {
        return this.getMinNode(node).data;
    };
    LlRbTree.prototype.max = function (node) {
        return this.getMaxNode(node).data;
    };
    return LlRbTree;
}());
/**
 * Removes the data from the tuple using ===.
 * Note this function uses === and not the compare function!
 */
function removeFromArray(elem, arr) {
    var index = arr.indexOf(elem);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}
/**
 * Destructively rotates the given node, say h, in the
 * given direction as far as tree rotations go.
 * @param {boolean} dir true -> right, false -> left
 * @param {Node} h
 * @returns The node that is at the top after the rotation.
 */
function rotate(dir, h) {
    var otherDir = dir ? Dir.LEFT : Dir.RIGHT;
    var x = h[otherDir];
    h[otherDir] = x[dir];
    if (x[dir]) {
        x[dir].parent = h;
    }
    x[dir] = h;
    h.parent = x;
    x.color = h.color;
    h.color = Color.RED;
    return x;
}
function removeMin(h) {
    if (!h[Dir.LEFT]) {
        return null;
    }
    if (!isRed(h[Dir.LEFT]) &&
        !isRed(h[Dir.LEFT][Dir.LEFT])) {
        h = moveRedLeft(h);
    }
    h[Dir.LEFT] = removeMin(h[Dir.LEFT]);
    if (h[Dir.LEFT]) {
        h[Dir.LEFT].parent = h;
    }
    return fixUp(h);
}
function flipColor(color) {
    return color === Color.RED ? Color.BLACK : Color.RED;
}
/**
 * Destructively flips the color of the given node and both
 * it's childrens' colors.
 * @param {Node} h
 */
function flipColors(h) {
    h.color = flipColor(h.color);
    h[Dir.LEFT].color = flipColor(h[Dir.LEFT].color);
    h[Dir.RIGHT].color = flipColor(h[Dir.RIGHT].color);
}
/**
 * @description
 * @param h
 * @returns The node that is at the top after the move.
 */
function moveRedLeft(h) {
    flipColors(h);
    if (isRed(h[Dir.RIGHT][Dir.LEFT])) {
        var a = rotate(Dir.RIGHT, h[Dir.RIGHT]);
        h[Dir.RIGHT] = a;
        a.parent = h;
        h = rotate(Dir.LEFT, h);
        flipColors(h);
    }
    return h;
}
/**
 * @description
 * @param h
 * @returns The node that is at the top after the move.
 */
function moveRedRight(h) {
    flipColors(h);
    if (isRed(h[Dir.LEFT][Dir.LEFT])) {
        h = rotate(Dir.RIGHT, h);
        flipColors(h);
    }
    return h;
}
/**
 * @description Fix right-leaning red nodes.
 * @returns The node that is at the top after the fix.
 */
function fixUp(h) {
    if (isRed(h[Dir.RIGHT])) {
        h = rotate(Dir.LEFT, h);
    }
    if (isRed(h[Dir.LEFT]) &&
        isRed(h[Dir.LEFT][Dir.LEFT])) {
        h = rotate(Dir.RIGHT, h);
    }
    // Split 4-nodes.
    if (isRed(h[Dir.LEFT]) &&
        isRed(h[Dir.RIGHT])) {
        flipColors(h);
    }
    return h;
}
module.exports = LlRbTree;

},{}]},{},[1])(1)
});