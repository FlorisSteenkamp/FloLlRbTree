import { Node, isRed } from "./index.js";


function nodeToString(node: Node<number>) { 
    let str: string;
    if (node.extras !== undefined) {
        str = `{${[node.datum, ...(node.extras)].toString()}}`;
    } else {
        str = node.datum.toString();
    }

    return str + (isRed(node) ? '•' : '·');
}


export { nodeToString }
