
// Concise, Destructive, Left Leaning Red Black Tree implementation.
// See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
// See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html 


import Node  from './tree-node';
import Color from './tree-node-color';
import Dir   from './tree-node-direction';

function isRed<T>(node: Node<T>): boolean {
	return node && node.color === Color.RED;
}


class LlRbTree<T> {
	private replaceDups: boolean; 
	private compare: (a: T, b: T|T[]) => number;

	public root: Node<T>;

	/** 
	 * @param compare
	 * @param datas
	 * @param replaceDups - If true then if a duplicate is inserted (as per the 
	 * equivalence relation induced by the compare) then replace it. If false 
	 * then instead keep an array of values at the relevant node.  
	 */	
	constructor(
			compare: (a: T, b: T) => number, 
			datas: T[], 
			replaceDups: boolean) {
				
		const tree = this;
		tree.setComparator(compare, replaceDups);	
		tree.replaceDups = replaceDups;
		
		tree.root = null;
		
		if (!datas) { return; }
		
		for (let data of datas) {
			tree.insert(data);
		}
	}


	/**
	 * Destructively sets the tree compare. This function can be used for for 
	 * e.g.the Bentley Ottmann algorithm. 
	 */
	public setComparator(
			compare: (a: T, b: T) => number, 
			replaceDups: boolean): void {

		if (replaceDups) {
			this.compare = compare;	
		} else {
			this.compare = (a: T, b: Array<T>) => compare(a, b[0]);
		}
	}


	public isEmpty() { return !this.root; }


	/**
	 * Find the node in the tree with the given data using the tree compare 
	 * function. 
	 * @returns {Node} node or null if not found.
	 */
	public find(data: T): Node<T> {
		const tree = this;

		let node = this.root;
		while (node) {
			let c = tree.compare(data, node.data);
			if (c === 0) { 
				return node;
			} else {
				node = node[c > 0 ? Dir.RIGHT : Dir.LEFT];
			}
		}

		return null;
	}


	/**
	 * .
	 */
	public toArrayInOrder(): Array<Node<T>> {
		let nodes: Array<Node<T>> = [];
		f(this.root);
		
		function f(node: Node<T>): void {
			if (!node) { return; }

			f(node[Dir.LEFT]);
			nodes.push(node);
			f(node[Dir.RIGHT]);
		}

		return nodes;
	}


	/**
	 * Inserts a node with the given data into the tree.
	 */
	public insert(data: T): void {
		const tree = this;
		tree.root = f(tree.root, data);
		tree.root.color = Color.BLACK;
		tree.root.parent = undefined;
		
		function f(h: Node<T>, data: T): Node<T> {
			if (!h) {
				return new Node(data, !tree.replaceDups);
			}
			
			let c = tree.compare(data, h.data);
			if (c === 0) {
				if (tree.replaceDups) {
					h.data = data;				
				} else {
					(h.data as Array<T>).push(data as T);
				}
			} else {
				let dir = c > 0 ? Dir.RIGHT : Dir.LEFT;
				h[dir] = f(h[dir], data);
				h[dir].parent = h;
			}
			
			if (isRed(h[Dir.RIGHT]) && 
			    !isRed(h[Dir.LEFT])) {
				h = rotate(Dir.LEFT, h);
			}
			if (isRed(h[Dir.LEFT]) && 
				isRed(h[Dir.LEFT][Dir.LEFT])) {
				h = rotate(Dir.RIGHT, h);
			}

			if (isRed(h[Dir.LEFT]) && 
				isRed(h[Dir.RIGHT])) {
				flipColors(h);
			}
			
			return h;
		}
	}


	/**
	 * Removes an item from the tree based on the given data.
	 * @param {LlRbTree} tree
	 * @param {*} data 
	 * @param {boolean} all - If the data is an array, remove all.
	 */
	public remove(data: T, all: boolean): void {
		const tree = this;
		tree.root = f(tree.root, data);
		if (tree.root) { 
			tree.root.color = Color.BLACK;
			tree.root.parent = undefined;
		}
		
		function f(h: Node<T>, data: T) {
			//let h = h_;
			let c = tree.compare(data, h.data);
			
			if (!tree.replaceDups && c === 0 && !all && (h.data as Array<T>).length > 1) {
				removeFromArray(data, (h.data as Array<T>));
				return h;
			}

			
			if (c < 0 && !h[Dir.LEFT] || c > 0 && !h[Dir.RIGHT]) {
				return h;
			}
			
			
			if (c < 0) {
				if (!isRed(h[Dir.LEFT]) && 
					!isRed(h[Dir.LEFT][Dir.LEFT])) {
					h = moveRedLeft(h);
				}
				h[Dir.LEFT] = f(h[Dir.LEFT], data);
				if (h[Dir.LEFT]) { h[Dir.LEFT].parent = h; }
				
				return fixUp(h);
			} 
			
			
			if (isRed(h[Dir.LEFT])) {
				h = rotate(Dir.RIGHT, h);
				c = tree.compare(data, h.data);
				if (!tree.replaceDups && c === 0 && !all && (h.data as Array<T>).length > 1) {
					removeFromArray(data, (h.data as Array<T>));
					return h;
				}
			}
			
			if (c === 0 && !h[Dir.RIGHT]) {
				return null;
			}
			
			if (!isRed(h[Dir.RIGHT]) && 
				!isRed(h[Dir.RIGHT][Dir.LEFT])) {
				h = moveRedRight(h);
				c = tree.compare(data, h.data);
				if (!tree.replaceDups && c === 0 && !all && (h.data as Array<T>).length > 1) {
					removeFromArray(data, (h.data as Array<T>));
					return h;
				}
			}
			
			if (c === 0) {
				h.data = tree.min(h[Dir.RIGHT]);  
				h[Dir.RIGHT] = removeMin(h[Dir.RIGHT]);
			} else {
				h[Dir.RIGHT] = f(h[Dir.RIGHT], data);
			}
			if (h[Dir.RIGHT]) { h[Dir.RIGHT].parent = h; }
			
			return fixUp(h);
		}
	}


	/**
	 * Returns the two ordered nodes bounding the data. If the  
	 * data falls on a node, that node and the next (to the right) is 
	 * returned.
	 * @returns {Node[]}  
	 */
	public findBounds(data: T): Array<Node<T>> {
		const tree = this;
		let node = tree.root;
		let bounds: Array<Node<T>> = [undefined, undefined];
		
		if (node === null) { return bounds; }
		
		while (node) {
			const c = tree.compare(data, node.data); 
			if (c >= 0) { 
				bounds[0] = node;
			} else {
				bounds[1] = node;
			}
			
			node = node[c >= 0 ? Dir.RIGHT : Dir.LEFT];
		}

		return bounds;
	}


	/**
	 * @param tree
	 * @param data
	 * @returns The two ordered nodes bounding the data. If the  
	 * data falls on a node, returns the nodes before and after this one. 
	 */
	public findBoundsExcl(data: T): Array<Node<T>> {
		const tree = this;
		let node = tree.root;

		let bounds: Array<Node<T>> = [undefined, undefined];
		
		if (node === null) { return bounds; }
		
		f(node);
		
		function f(node: Node<T>) {
			while (node) {
				let c = tree.compare(data, node.data);

				if (c === 0) {
					// Search on both sides
					f(node[Dir.LEFT]);
					f(node[Dir.RIGHT]);
					return;
				}
				
				if (c > 0) { 
					bounds[0] = node;
				} else if (c < 0) {
					bounds[1] = node;
				}
				
				node = node[c > 0 ? Dir.RIGHT : Dir.LEFT];
			}	
		}
		

		return bounds;
	}


	/**
	 * 
	 */
	public findAllInOrder(data: T): Array<Node<T>> {
		const tree = this;
		let nodes: Array<Node<T>> = [];
		f(tree.root);
		
		function f(node: Node<T>) {
			while (node) {
				let c = tree.compare(data, node.data);

				if (c === 0) { 
					f(node[Dir.LEFT]);
					nodes.push(node);
					f(node[Dir.RIGHT]);
					
					return;
				} 

				node = node[c > 0 ? Dir.RIGHT : Dir.LEFT];
			}
		}

		return nodes;
	}


	private getMinOrMaxNode(dir: Dir): (node: Node<T>) => Node<T> {
		return function(node: Node<T>): Node<T> {
			if (!node) { return undefined; }
			
			while (node[dir]) {
				node = node[dir];
			}
			return node;	
		}
	}
	
	
	public getMinNode = this.getMinOrMaxNode(Dir.LEFT);
	public getMaxNode = this.getMinOrMaxNode(Dir.RIGHT);


	public min(node: Node<T>): T|T[] {
		return this.getMinNode(node).data; 
	}


	public max(node: Node<T>): T|T[] {
		return this.getMaxNode(node).data;
	}
}


/**
 * Removes the data from the tuple using ===.
 * Note this function uses === and not the compare function! 
 */
function removeFromArray(elem: any, arr: any[]): void {
	let index = arr.indexOf(elem);

	if (index !== -1) {
        arr.splice(index, 1);
	}
}


/**
 * Destructively rotates the given node, say h, in the 
 * given direction as far as tree rotations go. 
 * @param {boolean} dir true -> right, false -> left
 * @param {Node} h
 * @returns The node that is at the top after the rotation.
 */
function rotate<T>(dir: Dir, h: Node<T>): Node<T> {
	const otherDir = dir ? Dir.LEFT : Dir.RIGHT;
	const x = h[otherDir];
	
	h[otherDir] = x[dir];
	if (x[dir]) { x[dir].parent = h; }
	x[dir] = h;
	h.parent = x;
	
	x.color = h.color;
	h.color = Color.RED;
	
	return x;
}


function removeMin<T>(h: Node<T>): Node<T> {
	if (!h[Dir.LEFT]) {
		return null;
	}
	if (!isRed(h[Dir.LEFT]) && 
		!isRed(h[Dir.LEFT][Dir.LEFT])) {
		h = moveRedLeft(h);
	}
	h[Dir.LEFT] = removeMin(h[Dir.LEFT]);
	if (h[Dir.LEFT]) { h[Dir.LEFT].parent = h; }
	
	return fixUp(h);
}


function flipColor(color: Color): Color {
	return color === Color.RED ? Color.BLACK : Color.RED;
}

/**
 * Destructively flips the color of the given node and both
 * it's childrens' colors. 
 * @param {Node} h
 */
function flipColors<T>(h: Node<T>): void {
	h.color = flipColor(h.color);
	h[Dir.LEFT ].color = flipColor(h[Dir.LEFT ].color);
	h[Dir.RIGHT].color = flipColor(h[Dir.RIGHT].color);
}


/**
 * @description
 * @param h
 * @returns The node that is at the top after the move.
 */
function moveRedLeft<T>(h: Node<T>): Node<T> {
	flipColors(h);
	if (isRed(h[Dir.RIGHT][Dir.LEFT])) {
		let a = rotate(Dir.RIGHT, h[Dir.RIGHT]);
		h[Dir.RIGHT] = a;
		a.parent = h;
		h = rotate(Dir.LEFT, h);
		flipColors(h);
	}
	
	return h;
}


/**
 * @description
 * @param h
 * @returns The node that is at the top after the move.
 */
function moveRedRight<T>(h: Node<T>): Node<T> {
	flipColors(h);
	if (isRed(h[Dir.LEFT][Dir.LEFT])) {
		h = rotate(Dir.RIGHT, h);
		flipColors(h);
	}
	
	return h;
}


/**
 * @description Fix right-leaning red nodes.
 * @returns The node that is at the top after the fix.
 */
function fixUp<T>(h: Node<T>): Node<T> {
	if (isRed(h[Dir.RIGHT])) {
		h = rotate(Dir.LEFT, h);
	}

	if (isRed(h[Dir.LEFT]) && 
		isRed(h[Dir.LEFT][Dir.LEFT])) {
		h = rotate(Dir.RIGHT, h);
	}

	// Split 4-nodes.
	if (isRed(h[Dir.LEFT]) && 
		isRed(h[Dir.RIGHT])) {
		flipColors(h);
	}

	return h;
}


export default LlRbTree;
