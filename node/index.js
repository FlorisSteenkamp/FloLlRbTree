"use strict";
/*
 * Concise, Destructive, Left Leaning Red Black Tree implementation.
 * See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
 * See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
 * See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tree_node_1 = require("./src/tree-node");
const tree_node_color_1 = require("./src/tree-node-color");
const tree_node_direction_1 = require("./src/tree-node-direction");
function isRed(node) {
    return node && node.color === tree_node_color_1.default.RED;
}
/**
 * @param compare
 * @param datas
 * @param replaceDups - If true then if a duplicate is
 * inserted (as per the equivalence relation induced by the compare)
 * then replace it. If false then keep an array of values at the relevant
 * node.
 */
class LlRbTree {
    constructor(compare, datas, replaceDups) {
        this.getMinNode = this.getMinOrMaxNode(tree_node_direction_1.default.LEFT);
        this.getMaxNode = this.getMinOrMaxNode(tree_node_direction_1.default.RIGHT);
        const tree = this;
        tree.setComparator(compare, replaceDups);
        tree.replaceDups = replaceDups;
        tree.root = null;
        if (!datas) {
            return;
        }
        for (let data of datas) {
            tree.insert(data);
        }
    }
    /**
     * Destructively sets the tree compare. This function can be used for for e.g.
     * the Bentley Ottmann algorithm.
     */
    setComparator(compare, replaceDups) {
        if (replaceDups) {
            this.compare = compare;
        }
        else {
            this.compare = (a, b) => compare(a, b[0]);
        }
    }
    isEmpty() { return !this.root; }
    /**
     * Find the node in the tree with the given data using the tree compare
     * function.
     * @returns {Node} node or null if not found.
     */
    find(data) {
        const tree = this;
        let node = this.root;
        while (node) {
            let c = tree.compare(data, node.data);
            if (c === 0) {
                return node;
            }
            else {
                node = node[c > 0 ? tree_node_direction_1.default.RIGHT : tree_node_direction_1.default.LEFT];
            }
        }
        return null;
    }
    /**
     * .
     */
    toArrayInOrder() {
        let nodes = [];
        f(this.root);
        function f(node) {
            if (!node) {
                return;
            }
            f(node[tree_node_direction_1.default.LEFT]);
            nodes.push(node);
            f(node[tree_node_direction_1.default.RIGHT]);
        }
        return nodes;
    }
    /**
     * Inserts a node with the given data into the tree.
     */
    insert(data) {
        const tree = this;
        tree.root = f(tree.root, data);
        tree.root.color = tree_node_color_1.default.BLACK;
        tree.root.parent = undefined;
        function f(h, data) {
            if (!h) {
                return new tree_node_1.default(data, !tree.replaceDups);
            }
            let c = tree.compare(data, h.data);
            if (c === 0) {
                if (tree.replaceDups) {
                    h.data = data;
                }
                else {
                    h.data.push(data);
                }
            }
            else {
                let dir = c > 0 ? tree_node_direction_1.default.RIGHT : tree_node_direction_1.default.LEFT;
                h[dir] = f(h[dir], data);
                h[dir].parent = h;
            }
            if (isRed(h[tree_node_direction_1.default.RIGHT]) &&
                !isRed(h[tree_node_direction_1.default.LEFT])) {
                h = rotate(tree_node_direction_1.default.LEFT, h);
            }
            if (isRed(h[tree_node_direction_1.default.LEFT]) &&
                isRed(h[tree_node_direction_1.default.LEFT][tree_node_direction_1.default.LEFT])) {
                h = rotate(tree_node_direction_1.default.RIGHT, h);
            }
            if (isRed(h[tree_node_direction_1.default.LEFT]) &&
                isRed(h[tree_node_direction_1.default.RIGHT])) {
                flipColors(h);
            }
            return h;
        }
    }
    /**
     * Removes an item from the tree based on the given data.
     * @param {LlRbTree} tree
     * @param {*} data
     * @param {boolean} all - If the data is an array, remove all.
     */
    remove(data, all) {
        const tree = this;
        tree.root = f(tree.root, data);
        if (tree.root) {
            tree.root.color = tree_node_color_1.default.BLACK;
            tree.root.parent = undefined;
        }
        function f(h, data) {
            //let h = h_;
            let c = tree.compare(data, h.data);
            if (!tree.replaceDups && c === 0 && !all && h.data.length > 1) {
                removeFromArray(data, h.data);
                return h;
            }
            if (c < 0 && !h[tree_node_direction_1.default.LEFT] || c > 0 && !h[tree_node_direction_1.default.RIGHT]) {
                return h;
            }
            if (c < 0) {
                if (!isRed(h[tree_node_direction_1.default.LEFT]) &&
                    !isRed(h[tree_node_direction_1.default.LEFT][tree_node_direction_1.default.LEFT])) {
                    h = moveRedLeft(h);
                }
                h[tree_node_direction_1.default.LEFT] = f(h[tree_node_direction_1.default.LEFT], data);
                if (h[tree_node_direction_1.default.LEFT]) {
                    h[tree_node_direction_1.default.LEFT].parent = h;
                }
                return fixUp(h);
            }
            if (isRed(h[tree_node_direction_1.default.LEFT])) {
                h = rotate(tree_node_direction_1.default.RIGHT, h);
                c = tree.compare(data, h.data);
                if (!tree.replaceDups && c === 0 && !all && h.data.length > 1) {
                    removeFromArray(data, h.data);
                    return h;
                }
            }
            if (c === 0 && !h[tree_node_direction_1.default.RIGHT]) {
                return null;
            }
            if (!isRed(h[tree_node_direction_1.default.RIGHT]) &&
                !isRed(h[tree_node_direction_1.default.RIGHT][tree_node_direction_1.default.LEFT])) {
                h = moveRedRight(h);
                c = tree.compare(data, h.data);
                if (!tree.replaceDups && c === 0 && !all && h.data.length > 1) {
                    removeFromArray(data, h.data);
                    return h;
                }
            }
            if (c === 0) {
                h.data = tree.min(h[tree_node_direction_1.default.RIGHT]);
                h[tree_node_direction_1.default.RIGHT] = removeMin(h[tree_node_direction_1.default.RIGHT]);
            }
            else {
                h[tree_node_direction_1.default.RIGHT] = f(h[tree_node_direction_1.default.RIGHT], data);
            }
            if (h[tree_node_direction_1.default.RIGHT]) {
                h[tree_node_direction_1.default.RIGHT].parent = h;
            }
            return fixUp(h);
        }
    }
    /**
     * Returns the two ordered nodes bounding the data. If the
     * data falls on a node, that node and the next (to the right) is
     * returned.
     * @returns {Node[]}
     */
    findBounds(data) {
        const tree = this;
        let node = tree.root;
        let bounds = [undefined, undefined];
        if (node === null) {
            return bounds;
        }
        while (node) {
            const c = tree.compare(data, node.data);
            if (c >= 0) {
                bounds[0] = node;
            }
            else {
                bounds[1] = node;
            }
            node = node[c >= 0 ? tree_node_direction_1.default.RIGHT : tree_node_direction_1.default.LEFT];
        }
        return bounds;
    }
    /**
     * @param {LlRbTree} tree
     * @param {*} data
     * @returns {Node[]} The two ordered nodes bounding the data. If the
     * data falls on a node, returns the nodes before and after this one.
     */
    findBoundsExcl(data) {
        const tree = this;
        let node = tree.root;
        let bounds = [undefined, undefined];
        if (node === null) {
            return bounds;
        }
        f(node);
        function f(node) {
            while (node) {
                let c = tree.compare(data, node.data);
                if (c === 0) {
                    // Search on both sides
                    f(node[tree_node_direction_1.default.LEFT]);
                    f(node[tree_node_direction_1.default.RIGHT]);
                    return;
                }
                if (c > 0) {
                    bounds[0] = node;
                }
                else if (c < 0) {
                    bounds[1] = node;
                }
                node = node[c > 0 ? tree_node_direction_1.default.RIGHT : tree_node_direction_1.default.LEFT];
            }
        }
        return bounds;
    }
    /**
     *
     */
    findAllInOrder(data) {
        const tree = this;
        let nodes = [];
        f(tree.root);
        function f(node) {
            while (node) {
                let c = tree.compare(data, node.data);
                if (c === 0) {
                    f(node[tree_node_direction_1.default.LEFT]);
                    nodes.push(node);
                    f(node[tree_node_direction_1.default.RIGHT]);
                    return;
                }
                node = node[c > 0 ? tree_node_direction_1.default.RIGHT : tree_node_direction_1.default.LEFT];
            }
        }
        return nodes;
    }
    getMinOrMaxNode(dir) {
        return function (node) {
            if (!node) {
                return undefined;
            }
            while (node[dir]) {
                node = node[dir];
            }
            return node;
        };
    }
    min(node) {
        return this.getMinNode(node).data;
    }
    max(node) {
        return this.getMaxNode(node).data;
    }
}
/**
 * Removes the data from the tuple using ===.
 * Note this function uses === and not the compare function!
 */
function removeFromArray(elem, arr) {
    let index = arr.indexOf(elem);
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
    const otherDir = dir ? tree_node_direction_1.default.LEFT : tree_node_direction_1.default.RIGHT;
    const x = h[otherDir];
    h[otherDir] = x[dir];
    if (x[dir]) {
        x[dir].parent = h;
    }
    x[dir] = h;
    h.parent = x;
    x.color = h.color;
    h.color = tree_node_color_1.default.RED;
    return x;
}
function removeMin(h) {
    if (!h[tree_node_direction_1.default.LEFT]) {
        return null;
    }
    if (!isRed(h[tree_node_direction_1.default.LEFT]) &&
        !isRed(h[tree_node_direction_1.default.LEFT][tree_node_direction_1.default.LEFT])) {
        h = moveRedLeft(h);
    }
    h[tree_node_direction_1.default.LEFT] = removeMin(h[tree_node_direction_1.default.LEFT]);
    if (h[tree_node_direction_1.default.LEFT]) {
        h[tree_node_direction_1.default.LEFT].parent = h;
    }
    return fixUp(h);
}
function flipColor(color) {
    return color === tree_node_color_1.default.RED ? tree_node_color_1.default.BLACK : tree_node_color_1.default.RED;
}
/**
 * Destructively flips the color of the given node and both
 * it's childrens' colors.
 * @param {Node} h
 */
function flipColors(h) {
    h.color = flipColor(h.color);
    h[tree_node_direction_1.default.LEFT].color = flipColor(h[tree_node_direction_1.default.LEFT].color);
    h[tree_node_direction_1.default.RIGHT].color = flipColor(h[tree_node_direction_1.default.RIGHT].color);
}
/**
 * @description
 * @param h
 * @returns The node that is at the top after the move.
 */
function moveRedLeft(h) {
    flipColors(h);
    if (isRed(h[tree_node_direction_1.default.RIGHT][tree_node_direction_1.default.LEFT])) {
        let a = rotate(tree_node_direction_1.default.RIGHT, h[tree_node_direction_1.default.RIGHT]);
        h[tree_node_direction_1.default.RIGHT] = a;
        a.parent = h;
        h = rotate(tree_node_direction_1.default.LEFT, h);
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
    if (isRed(h[tree_node_direction_1.default.LEFT][tree_node_direction_1.default.LEFT])) {
        h = rotate(tree_node_direction_1.default.RIGHT, h);
        flipColors(h);
    }
    return h;
}
/**
 * @description Fix right-leaning red nodes.
 * @returns The node that is at the top after the fix.
 */
function fixUp(h) {
    if (isRed(h[tree_node_direction_1.default.RIGHT])) {
        h = rotate(tree_node_direction_1.default.LEFT, h);
    }
    if (isRed(h[tree_node_direction_1.default.LEFT]) &&
        isRed(h[tree_node_direction_1.default.LEFT][tree_node_direction_1.default.LEFT])) {
        h = rotate(tree_node_direction_1.default.RIGHT, h);
    }
    // Split 4-nodes.
    if (isRed(h[tree_node_direction_1.default.LEFT]) &&
        isRed(h[tree_node_direction_1.default.RIGHT])) {
        flipColors(h);
    }
    return h;
}
exports.default = LlRbTree;
