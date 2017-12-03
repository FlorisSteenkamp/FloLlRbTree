"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tree_node_color_1 = require("./tree-node-color");
/**
 * Red Black Tree node.
 * @constructor
 * @param {*} data
 */
class TreeNode {
    constructor(data, asArray) {
        if (asArray) {
            this.data = [data];
        }
        else {
            this.data = data;
        }
        this.color = tree_node_color_1.default.RED;
    }
}
exports.default = TreeNode;
