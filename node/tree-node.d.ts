import { type Color } from './tree-node-color.js';
/**
 * Red Black Tree node.
 */
declare class TreeNode<T> {
    datum: T;
    color: Color;
    parent: TreeNode<T> | undefined;
    "-1": TreeNode<T> | null;
    "1": TreeNode<T> | null;
    constructor(datum: T);
}
export { TreeNode };
