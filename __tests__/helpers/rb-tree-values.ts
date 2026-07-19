import { RbTree } from '../../src/rb-tree/rb-tree.js';


function rbTreeToValues<T>(tree: RbTree<T>): T[] {
    const values: T[] = [];

    while (!tree.isEmpty()) {
        const minNode = tree.getMinNode();
        if (minNode === undefined) {
            break;
        }

        values.push(minNode.datum);
        tree.remove(minNode.datum);
    }

    return values;
}


export { rbTreeToValues };