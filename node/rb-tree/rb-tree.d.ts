declare const BLACK = 1;
declare const RED = 0;
type Color = 0 | 1;
declare class Node<T> {
    datum: T;
    color: Color;
    parent: Node<T> | undefined;
    left: Node<T> | undefined;
    right: Node<T> | undefined;
    constructor(datum: T);
}
declare class RbTree<T> {
    private compare;
    private root;
    constructor(compare: (a: T, b: T) => number);
    isEmpty(): boolean;
    find(datum: T): Node<T> | undefined;
    insert(datum: T): void;
    remove(datum: T, _all?: boolean, _compareStrict?: (t1: T, t2: T) => boolean): T | undefined;
    findBounds(datum: T): [Node<T> | undefined, Node<T> | undefined];
    getMinNode(node?: Node<T>): Node<T> | undefined;
    getMaxNode(node?: Node<T>): Node<T> | undefined;
    /**
     * Checks that the tree satisfies the binary search tree ordering property
     * and the red-black constraints (root is black, no red node has a red
     * child, and every root-to-leaf path has the same number of black nodes).
     *
     * Returns `true` if all checks pass, `false` otherwise.
     */
    checkIntegrity(): boolean;
    toStr(nodeToStrFunc: (node: Node<T>) => string): string;
    toArr(): T[];
    private removeNode;
    private fixInsert;
    private fixDelete;
    private transplant;
    private rotateLeft;
    private rotateRight;
    private colorOf;
}
export { BLACK, RED, Node, RbTree };
