const BLACK = 1;
const RED = 0;
class Node {
    datum;
    color = RED;
    parent;
    left;
    right;
    constructor(datum) {
        this.datum = datum;
    }
}
class RbTree {
    compare;
    root;
    constructor(compare) {
        this.compare = compare;
        this.root = undefined;
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
            this.root = new Node(datum);
            this.root.color = BLACK;
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
        const inserted = new Node(datum);
        inserted.parent = parent;
        if (this.compare(datum, parent.datum) < 0) {
            parent.left = inserted;
        }
        else {
            parent.right = inserted;
        }
        this.fixInsert(inserted);
    }
    remove(datum, _all = false, _compareStrict) {
        const node = this.find(datum);
        if (node === undefined) {
            return undefined;
        }
        const removed = node.datum;
        this.removeNode(node);
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
export { BLACK, RED, Node, RbTree };
//# sourceMappingURL=rb-tree.js.map