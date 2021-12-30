/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "d": () => (/* binding */ LlRbTree)
});

;// CONCATENATED MODULE: ./src/tree-node-color.ts
const BLACK = 0;
const RED = 1;


;// CONCATENATED MODULE: ./src/tree-node.ts

/**
 * Red Black Tree node.
 */
class TreeNode {
    constructor(datum, asArray) {
        if (asArray) {
            this.datum = [datum];
        }
        else {
            this.datum = datum;
        }
        this.color = RED;
    }
}


;// CONCATENATED MODULE: ./src/tree-node-direction.ts
const LEFT = 0;
const RIGHT = 1;


;// CONCATENATED MODULE: ./src/index.ts
// Concise, Destructive, Left Leaning Red Black Tree implementation.
// See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
// See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html 



function isRed(node) {
    return !!node && node.color === RED;
}
class LlRbTree {
    /**
     * @param compare a comparator function
     * @param data an initial array of data
     * @param replaceDups if `true` then if a duplicate is inserted (as per the
     * equivalence relation induced by the compare function) then replace it;
     * if `false` then instead keep an array of values at the relevant node
     */
    constructor(compare, data, replaceDups = true) {
        this.getMinNode = this.getMinOrMaxNode(LEFT);
        this.getMaxNode = this.getMinOrMaxNode(RIGHT);
        const tree = this;
        tree.setComparator(compare, replaceDups);
        tree.replaceDups = replaceDups;
        tree.root = null;
        if (!data) {
            return;
        }
        for (let datum of data) {
            tree.insert(datum);
        }
    }
    /**
     * Destructively sets the tree compare. This function can be used for for
     * e.g.the Bentley Ottmann algorithm.
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
     * Find and returns the node in the tree with the given datum using the tree
     * compare function. Returns `undefined` if the node was not found.
     */
    find(datum) {
        const tree = this;
        let node = this.root;
        while (node) {
            let c = tree.compare(datum, node.datum);
            if (c === 0) {
                return node;
            }
            else {
                node = node[c > 0 ? RIGHT : LEFT];
            }
        }
        return undefined;
    }
    /**
     * Returns an ordered (by the tree compare function) array of data as
     * contained in the nodes of the tree by doing an in order traversal.
     */
    toArrayInOrder() {
        let nodes = [];
        f(this.root);
        function f(node) {
            if (!node) {
                return;
            }
            f(node[LEFT]);
            nodes.push(node.datum);
            f(node[RIGHT]);
        }
        return nodes;
    }
    /**
     * Inserts a node with the given datum into the tree.
     */
    insert(datum) {
        const tree = this;
        tree.root = f(tree.root, datum);
        tree.root.color = BLACK;
        tree.root.parent = undefined;
        function f(h, datum) {
            if (!h) {
                return new TreeNode(datum, !tree.replaceDups);
            }
            let c = tree.compare(datum, h.datum);
            if (c === 0) {
                if (tree.replaceDups) {
                    h.datum = datum;
                }
                else {
                    h.datum.push(datum);
                }
            }
            else {
                let dir = c > 0 ? RIGHT : LEFT;
                h[dir] = f(h[dir], datum);
                h[dir].parent = h;
            }
            if (isRed(h[RIGHT]) &&
                !isRed(h[LEFT])) {
                h = rotate(LEFT, h);
            }
            if (isRed(h[LEFT]) &&
                isRed(h[LEFT][LEFT])) {
                h = rotate(RIGHT, h);
            }
            if (isRed(h[LEFT]) &&
                isRed(h[RIGHT])) {
                flipColors(h);
            }
            return h;
        }
    }
    /**
     * Removes an item from the tree based on the given datum.
     *
     * * **precondition**: the datum must exist in the tree
     *
     * @param datum
     * @param all if the datum is an array, remove all
     */
    remove(datum, all = true) {
        const tree = this;
        // if (!tree.root) { return; }
        tree.root = f(tree.root, datum);
        if (tree.root) {
            tree.root.color = BLACK;
            tree.root.parent = undefined;
        }
        function f(h, datum) {
            let c = tree.compare(datum, h.datum);
            if (!tree.replaceDups && c === 0 && !all && h.datum.length > 1) {
                removeFromArray(datum, h.datum);
                return h;
            }
            if (c < 0 && !h[LEFT] || c > 0 && !h[RIGHT]) {
                return h;
            }
            if (c < 0) {
                if (!isRed(h[LEFT]) &&
                    !isRed(h[LEFT][LEFT])) {
                    h = moveRedLeft(h);
                }
                h[LEFT] = f(h[LEFT], datum);
                if (h[LEFT]) {
                    h[LEFT].parent = h;
                }
                return fixUp(h);
            }
            if (isRed(h[LEFT])) {
                h = rotate(RIGHT, h);
                c = tree.compare(datum, h.datum);
                if (!tree.replaceDups && c === 0 && !all && h.datum.length > 1) {
                    removeFromArray(datum, h.datum);
                    return h;
                }
            }
            if (c === 0 && !h[RIGHT]) {
                return null;
            }
            if (!isRed(h[RIGHT]) &&
                !isRed(h[RIGHT][LEFT])) {
                h = moveRedRight(h);
                c = tree.compare(datum, h.datum);
                if (!tree.replaceDups && c === 0 && !all && h.datum.length > 1) {
                    removeFromArray(datum, h.datum);
                    return h;
                }
            }
            if (c === 0) {
                h.datum = tree.min(h[RIGHT]);
                h[RIGHT] = removeMin(h[RIGHT]);
            }
            else {
                h[RIGHT] = f(h[RIGHT], datum);
            }
            if (h[RIGHT]) {
                h[RIGHT].parent = h;
            }
            return fixUp(h);
        }
    }
    /**
     * Returns the two ordered nodes bounding the datum.
     *
     * * If the datum falls on a node, that node and the next (to the right) is
     * returned.
     * * If the given datum is smaller than all nodes then the first item in the
     * bounds array is `undefined` and the next is the smallest node
     * * If the given datum is larger than all nodes then the second item in the
     * bounds array is `undefined` and the first item is the largest node
     *
     */
    findBounds(datum) {
        const tree = this;
        let node = tree.root;
        let bounds = [undefined, undefined];
        if (node === null) {
            return bounds;
        }
        while (node) {
            const c = tree.compare(datum, node.datum);
            if (c >= 0) {
                bounds[0] = node;
            }
            else {
                bounds[1] = node;
            }
            node = node[c >= 0 ? RIGHT : LEFT];
        }
        return bounds;
    }
    /**
     * Returns the two ordered nodes bounding the datum.
     *
     * * If the datum falls on a node, returns the nodes before and after this
     * one.
     * * If the given datum is smaller than all nodes then the first item in the
     * bounds array is `undefined` and the next is the smallest node
     * * If the given datum is larger than all nodes then the second item in the
     * bounds array is `undefined` and the first item is the largest node
     *
     * @param tree
     * @param datum
     */
    findBoundsExcl(datum) {
        const tree = this;
        let node = tree.root;
        let bounds = [undefined, undefined];
        if (node === null) {
            return bounds;
        }
        f(node);
        function f(node) {
            while (node) {
                let c = tree.compare(datum, node.datum);
                if (c === 0) {
                    // Search on both sides
                    f(node[LEFT]);
                    f(node[RIGHT]);
                    return;
                }
                if (c > 0) {
                    bounds[0] = node;
                }
                else if (c < 0) {
                    bounds[1] = node;
                }
                node = node[c > 0 ? RIGHT : LEFT];
            }
        }
        return bounds;
    }
    /**
     *
     */
    findAllInOrder(datum) {
        const tree = this;
        let nodes = [];
        f(tree.root);
        function f(node) {
            while (node) {
                let c = tree.compare(datum, node.datum);
                if (c === 0) {
                    f(node[LEFT]);
                    nodes.push(node);
                    f(node[RIGHT]);
                    return;
                }
                node = node[c > 0 ? RIGHT : LEFT];
            }
        }
        return nodes;
    }
    /** @internal */
    getMinOrMaxNode(dir) {
        return (node) => {
            if (node === undefined) {
                node = this.root;
            }
            ;
            if (!node) {
                return undefined;
            }
            while (node[dir]) {
                node = node[dir];
            }
            return node;
        };
    }
    /**
     * Returns the minimum value in the tree starting at the given node. If the
     * tree is empty, `undefined` will be returned.
     *
     * If the min value is required for the entire tree call this function
     * as `tree.min(tree.root)`
     *
     * @param node
     */
    min(node) {
        if (node === undefined) {
            node = this.root;
        }
        ;
        const minNode = this.getMinNode(node);
        if (minNode !== undefined) {
            return minNode.datum;
        }
        return undefined;
    }
    /**
     * Returns the maximum value in the tree starting at the given node. If the
     * tree is empty, `undefined` will be returned.
     *
     * If the max value is required for the entire tree call this function
     * as `tree.max(tree.root)`
     *
     * @param node
     */
    max(node) {
        if (node === undefined) {
            node = this.root;
        }
        ;
        const maxNode = this.getMaxNode(node);
        if (maxNode !== undefined) {
            return maxNode.datum;
        }
        return undefined;
    }
}
/**
 * Removes the datum from the tuple using ===.
 * Note this function uses === and not the compare function!
 *
 * @internal
 */
function removeFromArray(elem, arr) {
    let index = arr.indexOf(elem);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}
/**
 * Returns the node that is at the top after the rotation.
 *
 * Destructively rotates the given node, say h, in the
 * given direction as far as tree rotations go.
 *
 * @param dir `true` -> right, `false` -> left
 * @param h
 *
 * @internal
 */
function rotate(dir, h) {
    const otherDir = dir ? LEFT : RIGHT;
    const x = h[otherDir];
    h[otherDir] = x[dir];
    if (x[dir]) {
        x[dir].parent = h;
    }
    x[dir] = h;
    h.parent = x;
    x.color = h.color;
    h.color = RED;
    return x;
}
/**
 * @param h
 *
 * @internal
 */
function removeMin(h) {
    if (!h[LEFT]) {
        return null;
    }
    if (!isRed(h[LEFT]) &&
        !isRed(h[LEFT][LEFT])) {
        h = moveRedLeft(h);
    }
    h[LEFT] = removeMin(h[LEFT]);
    if (h[LEFT]) {
        h[LEFT].parent = h;
    }
    return fixUp(h);
}
/**
 * @param color
 *
 * @internal
 */
function flipColor(color) {
    // return color === RED ? BLACK : RED;
    return (color + RED) % 2;
}
/**
 * Destructively flips the color of the given node and both
 * it's childrens' colors.
 *
 * @param h
 *
 * @internal
 */
function flipColors(h) {
    h.color = flipColor(h.color);
    h[LEFT].color = flipColor(h[LEFT].color);
    h[RIGHT].color = flipColor(h[RIGHT].color);
}
/**
 * @param h
 *
 * @internal
 */
function moveRedLeft(h) {
    flipColors(h);
    if (isRed(h[RIGHT][LEFT])) {
        let a = rotate(RIGHT, h[RIGHT]);
        h[RIGHT] = a;
        a.parent = h;
        h = rotate(LEFT, h);
        flipColors(h);
    }
    return h;
}
/**
 * Returns the node that is at the top after the move.
 *
 * @param h
 *
 * @internal
 */
function moveRedRight(h) {
    flipColors(h);
    if (isRed(h[LEFT][LEFT])) {
        h = rotate(RIGHT, h);
        flipColors(h);
    }
    return h;
}
/**
 * Returns the node that is at the top after the fix.
 *
 * Fix right-leaning red nodes.
 *
 * @internal
 */
function fixUp(h) {
    if (isRed(h[RIGHT])) {
        h = rotate(LEFT, h);
    }
    if (isRed(h[LEFT]) &&
        isRed(h[LEFT][LEFT])) {
        h = rotate(RIGHT, h);
    }
    // Split 4-nodes.
    if (isRed(h[LEFT]) &&
        isRed(h[RIGHT])) {
        flipColors(h);
    }
    return h;
}


var __webpack_exports__LlRbTree = __webpack_exports__.d;
export { __webpack_exports__LlRbTree as LlRbTree };
