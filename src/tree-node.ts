
import Color from './tree-node-color';
import Dir   from './tree-node-direction';


/**
 * Red Black Tree node.
 * @constructor 
 * @param {*} data
 */
class TreeNode<T> {
	public data: T|T[];
	public color: Color;
	public parent: TreeNode<T>;
	[key: number]: TreeNode<T>;

	constructor(data: T, asArray?: boolean) {
		if (asArray) {
			this.data = [data];
		} else {
			this.data = data;
		}
		this.color = Color.RED;
	}
}

export default TreeNode;