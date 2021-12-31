import { RED, type Color } from './tree-node-color.js';
import { LEFT, RIGHT, type Dir } from './tree-node-direction.js';


/**
 * Red Black Tree node.
 */
class TreeNode<T> {
	public color: Color;
	public parent: TreeNode<T> | undefined;
	"-1": TreeNode<T> | null;
	"1": TreeNode<T> | null;

	constructor(public datum: T) {
		this.color = RED;
	}
}


export { TreeNode }
