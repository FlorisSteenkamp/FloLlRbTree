import { RED, type Color } from './tree-node-color.js';


/**
 * Red Black Tree node.
 */
class TreeNode<T> {
	public datum: T | T[];
	public color: Color;
	public parent: TreeNode<T> | undefined;
	[key: number]: TreeNode<T> | null;

	constructor(datum: T, asArray?: boolean) {
		if (asArray) {
			this.datum = [datum];
		} else {
			this.datum = datum;
		}
		this.color = RED;
	}
}


export { TreeNode }
