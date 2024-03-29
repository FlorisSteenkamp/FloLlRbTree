// Modified from https://www.geeksforgeeks.org/binary-tree-string-brackets/

import { LlRbTree, Node, LEFT, RIGHT } from "./tree.js";


/** 
 * Function to construct string from binary tree 
 */
function treeToStr<T>(nodeToStrFunc: (node: Node<T>) => string) {
    return (tree: LlRbTree<T>): string => {

        const root = tree.root!;
        let treeStr = '';
        f(root);

        return treeStr;

        function f(node: Node<T> | undefined): void {
            if (node === undefined) { 
                return; 
            }

            treeStr += nodeToStrFunc(node);

            // if leaf node, then return
            if (node[LEFT] === undefined && node[RIGHT] == undefined) {
                return;
            }

            // left subtree
            if (node[LEFT] !== undefined) {
                treeStr += '(';
                f(node[LEFT]);
                treeStr += ')';
            }

            // right subtree
            if (node[RIGHT] !== undefined) {
                treeStr += '[';
                f(node[RIGHT]);
                treeStr += ']';
            }
        }
    }
}


export { treeToStr }
