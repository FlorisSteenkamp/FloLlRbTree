
import Color from './tree-node-color';


/**
 * Red Black Tree node.
 */
class TreeNode<T> {
	public data: T|T[];
	public color: Color;
	public parent: TreeNode<T> | undefined;
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