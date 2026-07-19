import { Node } from "../../src/ll-rb-tree/ll-rb-tree.js";


function toDatum<T>(node: Node<T> | undefined): T | T[] | undefined {
    return node === undefined ? undefined : node.datum;
}


export { toDatum }
