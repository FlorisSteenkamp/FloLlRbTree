import { TreeNode as Node } from './tree-node.js';
declare class LlRbTree<T> {
    private replaceDups;
    private compare;
    root: Node<T> | null;
    /**
     * @param compare a comparator function
     * @param data an initial array of data
     * @param replaceDups if `true` then if a duplicate is inserted (as per the
     * equivalence relation induced by the compare function) then replace it;
     * if `false` then instead keep an array of values at the relevant node
     */
    constructor(compare: (a: T, b: T) => number, data?: T[], replaceDups?: boolean);
    /**
     * Destructively sets the tree compare. This function can be used for for
     * e.g.the Bentley Ottmann algorithm.
     */
    setComparator(compare: (a: T, b: T) => number, replaceDups: boolean): void;
    isEmpty(): boolean;
    /**
     * Find and returns the node in the tree with the given datum using the tree
     * compare function. Returns `undefined` if the node was not found.
     */
    find(datum: T): Node<T> | undefined;
    /**
     * Returns an ordered (by the tree compare function) array of data as
     * contained in the nodes of the tree by doing an in order traversal.
     */
    toArrayInOrder(): T[] | T[][];
    /**
     * Inserts a node with the given datum into the tree.
     */
    insert(datum: T): void;
    /**
     * Removes an item from the tree based on the given datum.
     *
     * * **precondition**: the datum must exist in the tree
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
    min(node?: Node<T> | null | undefined): T | T[] | undefined;
    /**
     * Returns the maximum value in the tree starting at the given node. If the
     * tree is empty, `undefined` will be returned.
     *
     * If the max value is required for the entire tree call this function
     * as `tree.max(tree.root)`
     *
     * @param node
     */
    max(node?: Node<T> | null | undefined): T | T[] | undefined;
}
export { LlRbTree };
