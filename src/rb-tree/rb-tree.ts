const BLACK = 1;
const RED = 0;

type Color = 0 | 1;


class Node<T> {
    public color: Color = RED;
    public parent: Node<T> | undefined;
    public left: Node<T> | undefined;
    public right: Node<T> | undefined;

    constructor(public datum: T) {}
}


class RbTree<T> {
    private root: Node<T> | undefined;

    constructor(
            private compare: (a: T, b: T) => number) {

        this.root = undefined;
    }


    public isEmpty(): boolean {
        return this.root === undefined;
    }


    public find(datum: T): Node<T> | undefined {
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


    public insert(datum: T): void {
        if (this.root === undefined) {
            this.root = new Node(datum);
            this.root.color = BLACK;
            return;
        }

        let parent: Node<T> | undefined;
        let node: Node<T> | undefined = this.root;

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
        if (this.compare(datum, parent!.datum) < 0) {
            parent!.left = inserted;
        } else {
            parent!.right = inserted;
        }

        this.fixInsert(inserted);
    }


    public remove(
            datum: T,
            _all = false,
            _compareStrict?: (t1: T, t2: T) => boolean): T | undefined {

        const node = this.find(datum);
        if (node === undefined) {
            return undefined;
        }

        const removed = node.datum;
        this.removeNode(node);

        return removed;
    }


    public findBounds(
            datum: T): [Node<T> | undefined, Node<T> | undefined] {

        let node = this.root;
        const bounds: [Node<T> | undefined, Node<T> | undefined] = [undefined, undefined];

        while (node) {
            const c = this.compare(datum, node.datum);
            if (c >= 0) {
                bounds[0] = node;
                node = node.right;
            } else {
                bounds[1] = node;
                node = node.left;
            }
        }

        return bounds;
    }


    public getMinNode(node?: Node<T>): Node<T> | undefined {
        let curr = node === undefined ? this.root : node;
        while (curr && curr.left) {
            curr = curr.left;
        }
        return curr;
    }


    public getMaxNode(node?: Node<T>): Node<T> | undefined {
        let curr = node === undefined ? this.root : node;
        while (curr && curr.right) {
            curr = curr.right;
        }
        return curr;
    }


    private removeNode(z: Node<T>): void {
        let y = z;
        let yOriginalColor = y.color;
        let x: Node<T> | undefined;
        let xParent: Node<T> | undefined;

        if (z.left === undefined) {
            x = z.right;
            xParent = z.parent;
            this.transplant(z, z.right);
        } else if (z.right === undefined) {
            x = z.left;
            xParent = z.parent;
            this.transplant(z, z.left);
        } else {
            y = this.getMinNode(z.right)!;
            yOriginalColor = y.color;
            x = y.right;

            if (y.parent === z) {
                xParent = y;
                if (x) {
                    x.parent = y;
                }
            } else {
                xParent = y.parent;
                this.transplant(y, y.right);
                y.right = z.right;
                y.right!.parent = y;
            }

            this.transplant(z, y);
            y.left = z.left;
            y.left!.parent = y;
            y.color = z.color;
        }

        if (yOriginalColor === BLACK) {
            this.fixDelete(x, xParent);
        }
    }


    private fixInsert(z: Node<T>): void {
        let node = z;

        while (node.parent && node.parent.color === RED) {
            const parent = node.parent;
            const grandParent = parent.parent!;

            if (parent === grandParent.left) {
                const uncle = grandParent.right;

                if (this.colorOf(uncle) === RED) {
                    parent.color = BLACK;
                    uncle!.color = BLACK;
                    grandParent.color = RED;
                    node = grandParent;
                } else {
                    if (node === parent.right) {
                        node = parent;
                        this.rotateLeft(node);
                    }

                    node.parent!.color = BLACK;
                    grandParent.color = RED;
                    this.rotateRight(grandParent);
                }
            } else {
                const uncle = grandParent.left;

                if (this.colorOf(uncle) === RED) {
                    parent.color = BLACK;
                    uncle!.color = BLACK;
                    grandParent.color = RED;
                    node = grandParent;
                } else {
                    if (node === parent.left) {
                        node = parent;
                        this.rotateRight(node);
                    }

                    node.parent!.color = BLACK;
                    grandParent.color = RED;
                    this.rotateLeft(grandParent);
                }
            }
        }

        this.root!.color = BLACK;
    }


    private fixDelete(x: Node<T> | undefined, parent: Node<T> | undefined): void {
        let node = x;
        let nodeParent = parent;

        while (node !== this.root && this.colorOf(node) === BLACK) {
            if (nodeParent === undefined) {
                break;
            }

            if (node === nodeParent?.left) {
                let sibling = nodeParent.right;

                if (this.colorOf(sibling) === RED) {
                    sibling!.color = BLACK;
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
                } else {
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
            } else {
                let sibling = nodeParent?.left;

                if (this.colorOf(sibling) === RED) {
                    sibling!.color = BLACK;
                    nodeParent!.color = RED;
                    this.rotateRight(nodeParent!);
                    sibling = nodeParent!.left;
                }

                if (this.colorOf(sibling?.left) === BLACK && this.colorOf(sibling?.right) === BLACK) {
                    if (sibling) {
                        sibling.color = RED;
                    }
                    node = nodeParent;
                    nodeParent = nodeParent?.parent;
                } else {
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
                        sibling.color = nodeParent!.color;
                    }
                    nodeParent!.color = BLACK;
                    if (sibling?.left) {
                        sibling.left.color = BLACK;
                    }
                    this.rotateRight(nodeParent!);
                    node = this.root;
                    nodeParent = undefined;
                }
            }
        }

        if (node) {
            node.color = BLACK;
        }
    }


    private transplant(u: Node<T>, v: Node<T> | undefined): void {
        if (u.parent === undefined) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }

        if (v) {
            v.parent = u.parent;
        }
    }


    private rotateLeft(x: Node<T>): void {
        const y = x.right!;
        x.right = y.left;
        if (y.left) {
            y.left.parent = x;
        }

        y.parent = x.parent;
        if (x.parent === undefined) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }

        y.left = x;
        x.parent = y;
    }


    private rotateRight(x: Node<T>): void {
        const y = x.left!;
        x.left = y.right;
        if (y.right) {
            y.right.parent = x;
        }

        y.parent = x.parent;
        if (x.parent === undefined) {
            this.root = y;
        } else if (x === x.parent.right) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }

        y.right = x;
        x.parent = y;
    }


    private colorOf(node: Node<T> | undefined): Color {
        return node ? node.color : BLACK;
    }
}


export { BLACK, RED, Node, RbTree };
