import type { Color } from '../color.js';
interface RbNode<T> {
    color: Color;
    parent: RbNode<T> | undefined;
    left: RbNode<T> | undefined;
    right: RbNode<T> | undefined;
    datum: T;
}
declare class RbTree<T> {
    private compare;
    root: RbNode<T> | undefined;
    size: number;
    constructor(compare: (a: T, b: T) => number);
    isEmpty(): boolean;
    find(datum: T): RbNode<T> | undefined;
    insert(datum: T): void;
    remove(datum: T, _all?: boolean, _compareStrict?: (t1: T, t2: T) => boolean): T | undefined;
    findBounds(datum: T): [RbNode<T> | undefined, RbNode<T> | undefined];
    getMinNode(node?: RbNode<T>): RbNode<T> | undefined;
    getMaxNode(node?: RbNode<T>): RbNode<T> | undefined;
    /**
     * Checks that the tree satisfies the binary search tree ordering property
     * and the red-black constraints (root is black, no red node has a red
     * child, and every root-to-leaf path has the same number of black nodes).
     *
     * Returns `true` if all checks pass, `false` otherwise.
     */
    checkIntegrity(): boolean;
    toStr(nodeToStrFunc: (node: RbNode<T>) => string): string;
    toArr(): T[];
    private removeNode;
    private fixInsert;
    private fixDelete;
    private transplant;
    private rotateLeft;
    private rotateRight;
    private colorOf;
}
export { RbNode, RbTree };
