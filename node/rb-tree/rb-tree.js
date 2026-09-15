import { BLACK, RED } from '../color.js';
function createNode(datum) {
    return {
        color: RED,
        parent: undefined,
        left: undefined,
        right: undefined,
        datum
    };
}
class RbTree {
    compare;
    root;
    size;
    constructor(compare) {
        this.compare = compare;
        this.root = undefined;
        this.size = 0;
    }
    isEmpty() {
        return this.root === undefined;
    }
    find(datum) {
        let node = this.root;
        while (node) {
            const c = this.compare(datum, node.datum);
            if (c === 0) {
                return node;
            }
            node = c < 0 ? node.left : node.right;
        }
        return undefined;
    }
    insert(datum) {
        if (this.root === undefined) {
            this.root = createNode(datum);
            this.root.color = BLACK;
            this.size = 1;
            return;
        }
        let parent;
        let node = this.root;
        while (node) {
            parent = node;
            const c = this.compare(datum, node.datum);
            if (c === 0) {
                node.datum = datum;
                return;
            }
            node = c < 0 ? node.left : node.right;
        }
        const inserted = createNode(datum);
        inserted.parent = parent;
        if (this.compare(datum, parent.datum) < 0) {
            parent.left = inserted;
        }
        else {
            parent.right = inserted;
        }
        this.size++;
        this.fixInsert(inserted);
    }
    remove(datum, _all = false, _compareStrict) {
        const node = this.find(datum);
        if (node === undefined) {
            return undefined;
        }
        const removed = node.datum;
        this.removeNode(node);
        this.size--;
        return removed;
    }
    findBounds(datum) {
        let node = this.root;
        const bounds = [undefined, undefined];
        while (node) {
            const c = this.compare(datum, node.datum);
            if (c >= 0) {
                bounds[0] = node;
                node = node.right;
            }
            else {
                bounds[1] = node;
                node = node.left;
            }
        }
        return bounds;
    }
    getMinNode(node) {
        let curr = node === undefined ? this.root : node;
        while (curr && curr.left) {
            curr = curr.left;
        }
        return curr;
    }
    getMaxNode(node) {
        let curr = node === undefined ? this.root : node;
        while (curr && curr.right) {
            curr = curr.right;
        }
        return curr;
    }
    /**
     * Checks that the tree satisfies the binary search tree ordering property
     * and the red-black constraints (root is black, no red node has a red
     * child, and every root-to-leaf path has the same number of black nodes).
     *
     * Returns `true` if all checks pass, `false` otherwise.
     */
    checkIntegrity() {
        if (this.root === undefined) {
            return true;
        }
        if (this.root.color !== BLACK) {
            return false;
        }
        const compare = this.compare;
        // in-order predecessor for the BST ordering check
        let prev = undefined;
        // Returns the black-height of the subtree, or -1 if a violation was found.
        function check(node) {
            if (node === undefined) {
                return 1;
            }
            const { left, right } = node;
            // no red node has a red child
            if (node.color === RED &&
                (left?.color === RED || right?.color === RED)) {
                return -1;
            }
            const leftHeight = check(left);
            if (leftHeight === -1) {
                return -1;
            }
            // BST ordering (in-order traversal must be strictly increasing)
            if (prev !== undefined && compare(prev.datum, node.datum) >= 0) {
                return -1;
            }
            prev = node;
            const rightHeight = check(right);
            if (rightHeight === -1) {
                return -1;
            }
            // equal black-height on both sides
            if (leftHeight !== rightHeight) {
                return -1;
            }
            return leftHeight + (node.color === BLACK ? 1 : 0);
        }
        return check(this.root) !== -1;
    }
    toStr(nodeToStrFunc) {
        let treeStr = '';
        if (this.root === undefined) {
            return treeStr;
        }
        f(this.root);
        return treeStr;
        function f(node) {
            treeStr += nodeToStrFunc(node);
            if (node.left !== undefined) {
                treeStr += '(';
                f(node.left);
                treeStr += ')';
            }
            if (node.right !== undefined) {
                treeStr += '[';
                f(node.right);
                treeStr += ']';
            }
        }
    }
    toArr() {
        const values = [];
        f(this.root);
        return values;
        function f(node) {
            if (node === undefined) {
                return;
            }
            f(node.left);
            values.push(node.datum);
            f(node.right);
        }
    }
    removeNode(z) {
        let y = z;
        let yOriginalColor = y.color;
        let x;
        let xParent;
        if (z.left === undefined) {
            x = z.right;
            xParent = z.parent;
            this.transplant(z, z.right);
        }
        else if (z.right === undefined) {
            x = z.left;
            xParent = z.parent;
            this.transplant(z, z.left);
        }
        else {
            y = this.getMinNode(z.right);
            yOriginalColor = y.color;
            x = y.right;
            if (y.parent === z) {
                xParent = y;
                if (x) {
                    x.parent = y;
                }
            }
            else {
                xParent = y.parent;
                this.transplant(y, y.right);
                y.right = z.right;
                y.right.parent = y;
            }
            this.transplant(z, y);
            y.left = z.left;
            y.left.parent = y;
            y.color = z.color;
        }
        if (yOriginalColor === BLACK) {
            this.fixDelete(x, xParent);
        }
    }
    fixInsert(z) {
        let node = z;
        while (node.parent && node.parent.color === RED) {
            const parent = node.parent;
            const grandParent = parent.parent;
            if (parent === grandParent.left) {
                const uncle = grandParent.right;
                if (this.colorOf(uncle) === RED) {
                    parent.color = BLACK;
                    uncle.color = BLACK;
                    grandParent.color = RED;
                    node = grandParent;
                }
                else {
                    if (node === parent.right) {
                        node = parent;
                        this.rotateLeft(node);
                    }
                    node.parent.color = BLACK;
                    grandParent.color = RED;
                    this.rotateRight(grandParent);
                }
            }
            else {
                const uncle = grandParent.left;
                if (this.colorOf(uncle) === RED) {
                    parent.color = BLACK;
                    uncle.color = BLACK;
                    grandParent.color = RED;
                    node = grandParent;
                }
                else {
                    if (node === parent.left) {
                        node = parent;
                        this.rotateRight(node);
                    }
                    node.parent.color = BLACK;
                    grandParent.color = RED;
                    this.rotateLeft(grandParent);
                }
            }
        }
        this.root.color = BLACK;
    }
    fixDelete(x, parent) {
        let node = x;
        let nodeParent = parent;
        while (node !== this.root && this.colorOf(node) === BLACK) {
            if (nodeParent === undefined) {
                break;
            }
            if (node === nodeParent?.left) {
                let sibling = nodeParent.right;
                if (this.colorOf(sibling) === RED) {
                    sibling.color = BLACK;
                    nodeParent.color = RED;
                    this.rotateLeft(nodeParent);
                    sibling = nodeParent.right;
                }
                if (this.colorOf(sibling?.left) === BLACK && this.colorOf(sibling?.right) === BLACK) {
                    if (sibling) {
                        sibling.color = RED;
                    }
                    node = nodeParent;
                    nodeParent = node?.parent;
                }
                else {
                    if (this.colorOf(sibling?.right) === BLACK) {
                        if (sibling?.left) {
                            sibling.left.color = BLACK;
                        }
                        if (sibling) {
                            sibling.color = RED;
                            this.rotateRight(sibling);
                        }
                        sibling = nodeParent.right;
                    }
                    if (sibling) {
                        sibling.color = nodeParent.color;
                    }
                    nodeParent.color = BLACK;
                    if (sibling?.right) {
                        sibling.right.color = BLACK;
                    }
                    this.rotateLeft(nodeParent);
                    node = this.root;
                    nodeParent = undefined;
                }
            }
            else {
                let sibling = nodeParent?.left;
                if (this.colorOf(sibling) === RED) {
                    sibling.color = BLACK;
                    nodeParent.color = RED;
                    this.rotateRight(nodeParent);
                    sibling = nodeParent.left;
                }
                if (this.colorOf(sibling?.left) === BLACK && this.colorOf(sibling?.right) === BLACK) {
                    if (sibling) {
                        sibling.color = RED;
                    }
                    node = nodeParent;
                    nodeParent = nodeParent?.parent;
                }
                else {
                    if (this.colorOf(sibling?.left) === BLACK) {
                        if (sibling?.right) {
                            sibling.right.color = BLACK;
                        }
                        if (sibling) {
                            sibling.color = RED;
                            this.rotateLeft(sibling);
                        }
                        sibling = nodeParent?.left;
                    }
                    if (sibling) {
                        sibling.color = nodeParent.color;
                    }
                    nodeParent.color = BLACK;
                    if (sibling?.left) {
                        sibling.left.color = BLACK;
                    }
                    this.rotateRight(nodeParent);
                    node = this.root;
                    nodeParent = undefined;
                }
            }
        }
        if (node) {
            node.color = BLACK;
        }
    }
    transplant(u, v) {
        if (u.parent === undefined) {
            this.root = v;
        }
        else if (u === u.parent.left) {
            u.parent.left = v;
        }
        else {
            u.parent.right = v;
        }
        if (v) {
            v.parent = u.parent;
        }
    }
    rotateLeft(x) {
        const y = x.right;
        x.right = y.left;
        if (y.left) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === undefined) {
            this.root = y;
        }
        else if (x === x.parent.left) {
            x.parent.left = y;
        }
        else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }
    rotateRight(x) {
        const y = x.left;
        x.left = y.right;
        if (y.right) {
            y.right.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === undefined) {
            this.root = y;
        }
        else if (x === x.parent.right) {
            x.parent.right = y;
        }
        else {
            x.parent.left = y;
        }
        y.right = x;
        x.parent = y;
    }
    colorOf(node) {
        return node ? node.color : BLACK;
    }
}
export { RbTree };
//# sourceMappingURL=rb-tree.js.map