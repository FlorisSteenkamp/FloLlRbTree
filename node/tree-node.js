import { RED } from './tree-node-color.js';
/**
 * Red Black Tree node.
 */
class TreeNode {
    constructor(datum, asArray) {
        if (asArray) {
            this.datum = [datum];
        }
        else {
            this.datum = datum;
        }
        this.color = RED;
    }
}
export { TreeNode };
//# sourceMappingURL=tree-node.js.map