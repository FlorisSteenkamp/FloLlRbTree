// Modified from https://www.geeksforgeeks.org/binary-tree-string-brackets/

import { LlRbTree, Node, LEFT, RIGHT, isRed } from "../../src/index.js";
import { nodeToString } from '../helpers/node-to-string.js';


/** 
 * Function to construct string from binary tree 
 */
function treeToString<T>(
        tree: LlRbTree<T>,
        drawFunc: (node: Node<T>) => string = nodeToString as any): string {

    const root = tree.root;
    let treeStr = '';
    f(root);

    return treeStr;

    function f(node: Node<T>): string {
        if (node === undefined) { 
            return; 
        }

        treeStr += drawFunc(node).toString();

        // if leaf node, then return
        if (node[LEFT] === undefined && node[RIGHT] == undefined) {
            return;
        }

        // for left subtree
        if (node[LEFT] !== undefined) {
            treeStr += '(';
            f(node[LEFT]);
            treeStr += ')';
        }

        // only if right child is present to avoid extra parenthesis
        if (node[RIGHT] !== undefined) {
            treeStr += '[';
            f(node[RIGHT]);
            treeStr += ']';
        }
    }
}


export { treeToString }
