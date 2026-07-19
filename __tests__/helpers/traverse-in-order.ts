import { LlRbTree, LEFT, RIGHT, Node } from "../../src/ll-rb-tree/ll-rb-tree.js";


/** 
 * 
 */
 function traverseInOrder<T>(
        tree: LlRbTree<T>,
        g: (node: Node<T>) => any) {

    // Note: This function is not optimized - it's just for testing. 
    f(tree.root);
        
    function f(node: Node<T> | undefined): void {
        if (node === undefined) { return; }

        f(node[LEFT]);
        g(node);
        f(node[RIGHT]);
    }
}


export { traverseInOrder }
