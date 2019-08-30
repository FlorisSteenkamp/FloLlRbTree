import Color from './tree-node-color';
/**
 * Red Black Tree node.
 */
declare class TreeNode<T> {
    data: T | T[];
    color: Color;
    parent: TreeNode<T> | undefined;
    [key: number]: TreeNode<T>;
    constructor(data: T, asArray?: boolean);
}
export default TreeNode;
