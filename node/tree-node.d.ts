import { type Color } from './tree-node-color.js';
/**
 * Red Black Tree node.
 */
declare class TreeNode<T> {
    datum: T | T[];
    color: Color;
    parent: TreeNode<T> | undefined;
    [key: number]: TreeNode<T> | null;
    constructor(datum: T, asArray?: boolean);
}
export { TreeNode };
