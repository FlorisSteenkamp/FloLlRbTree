import { TreeNode as Node } from './tree-node.js';
declare class LlRbTree<T> {
    compare: (a: T, b: T) => number;
    private duplicatesAllowed;
    root: Node<T> | null;
    /**
     * @param compare a comparator function
     * @param duplicatesAllowed defaults to `true`; if `false` then if a
     * duplicate is inserted (as per the equivalence relation induced by the
     * compare function) then replace it; if `true` then instead still insert
     * it (so there can be multiple nodes with the same value in the tree)
     * @param data an optional initial array of data
     */
    constructor(compare: (a: T, b: T) => number, duplicatesAllowed?: boolean, data?: T[]);
    isEmpty(): boolean;
    /**
     * Find and returns the (first) node in the tree with the given datum using
     * the tree compare function. Returns `undefined` if the node was not found.
     */
    find(datum: T): Node<T> | undefined;
    /**
     * Returns an ordered (by the tree compare function) array of data as
     * contained in the nodes of the tree by doing an in order traversal.
     */
    toArrayInOrder(): T[];
    /**
     * Inserts a node with the given datum into the tree.
     */
    insert(datum: T): void;
    /**
     * Removes an item from the tree based on the given datum.
     *
     * @param datum
     * @param all if the datum is an array, remove all
     */
    remove(datum: T, all?: boolean): void;
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
    findBounds(datum: T): (Node<T> | undefined)[];
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
    findBoundsExcl(datum: T): (Node<T> | undefined)[];
    /**
     *
     */
    findAllInOrder(datum: T): Node<T>[];
    /** @internal */
    private getMinOrMaxNode;
    getMinNode: (node?: Node<T> | null | undefined) => Node<T> | undefined;
    getMaxNode: (node?: Node<T> | null | undefined) => Node<T> | undefined;
    /**
     * Returns the minimum value in the tree starting at the given node. If the
     * tree is empty, `undefined` will be returned.
     *
     * If the min value is required for the entire tree call this function
     * as `tree.min(tree.root)`
     *
     * @param node
     */
    min(node?: Node<T> | null | undefined): T | undefined;
    /**
     * Returns the maximum value in the tree starting at the given node. If the
     * tree is empty, `undefined` will be returned.
     *
     * If the max value is required for the entire tree call this function
     * as `tree.max(tree.root)`
     *
     * @param node
     */
    max(node?: Node<T> | null | undefined): T | undefined;
}
export { LlRbTree };
