import { TreeNode } from "../../src/tree-node";


function toDatum<T>(node: TreeNode<T> | undefined): T | T[] | undefined {
    return node === undefined ? undefined : node.datum;
}


export { toDatum }
