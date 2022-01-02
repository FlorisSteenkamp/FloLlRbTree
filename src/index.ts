// Concise, Destructive, Left Leaning Red Black Tree implementation.
// See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
// See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html 

const LEFT = -1;
const RIGHT = 1;
type Dir = -1|1;

const BLACK = 1;
const RED = 0;
type Color = 0|1;


/**
 * Red Black Tree node.
 */
 class Node<T> {
	public color: Color = RED;
	public parent: Node<T> | undefined;
	public extras?: T[];
	"-1": Node<T> | undefined;
	"1" : Node<T> | undefined;

	constructor(public datum: T) {}
}


function isRed<T>(node: Node<T> | undefined): boolean {
	return !!node && node.color === RED;
}


class LlRbTree<T> {
	public root: Node<T> | undefined;


	/** 
	 * @param compare a comparator function
	 * @param duplicatesAllowed defaults to `true`; if `false` then if a 
	 * duplicate is inserted (as per the equivalence relation induced by the 
	 * compare function) then replace it; if `true` then instead still insert 
	 * it (so there can be multiple nodes with the same value in the tree)
	 * @param data an optional initial array of data
	 */	
	constructor(
			public compare: (a: T, b: T) => number, 
			public duplicatesAllowed = true, 
			data?: T[]) {
				
		this.root = undefined;
		
		if (!data) { return; }
		
		for (const datum of data) {
			this.insert(datum);
		}
	}


	public isEmpty() { return !this.root; }


	/**
	 * Find and returns the (first) node in the tree with the given datum using 
	 * the tree compare function. Returns `undefined` if the node was not found.
	 */
	public find(datum: T): Node<T> | undefined {
		const tree = this;

		let node = this.root;
		while (node) {
			const c = tree.compare(datum, node.datum);
			if (c === 0) { return node; }
				
			node = node[c > 0 ? RIGHT : LEFT];
		}

		return undefined;
	}


	/**
	 * Returns an ordered (by the tree compare function) array of data as 
	 * contained in the nodes of the tree by doing an in order traversal.
	 */
	public toArrayInOrder(): T[] {
		const values: T[] = [];
		f(this.root);
		
		function f(node: Node<T> | undefined): void {
			if (!node) { return; }

			f(node[LEFT]);
			values.push(node.datum);
			if (node.extras !== undefined) {
				values.push(...node.extras);
			}
			f(node[RIGHT]);
		}

		return values;
	}


	public insertMulti(data: T[]): void {
		const tree = this;
		for (let datum of data) {
			tree.insert(datum);
		}
	}


	/**
	 * Inserts a node with the given datum into the tree.
	 */
	public insert(datum: T): void {
		const tree = this;
		tree.root = f(tree.root, datum);
		tree.root.color = BLACK;
		tree.root.parent = undefined;
		
		function f(h: Node<T> | undefined, datum: T): Node<T> {
			if (h === undefined) {
				return new Node(datum);
			}
			
			let c = tree.compare(datum, h.datum);

			if (c === 0) {
				if (tree.duplicatesAllowed) {
					if (h.extras === undefined) {
						h.extras = [datum];
					} else {
						h.extras.push(datum);
					}
				} else {
					h.datum = datum;  // replace old value
				}
			} 
			
			if (c !== 0) {
				const dir = c > 0 ? RIGHT : LEFT;
				h[dir] = f(h[dir], datum);
				h[dir]!.parent = h;
			}
			
			if (isRed(h[RIGHT]) && !isRed(h[LEFT])) {
				h = rotate(LEFT, h);
			}
			if (isRed(h[LEFT]) && isRed(h[LEFT]![LEFT])) {
				h = rotate(RIGHT, h);
			}
			if (isRed(h[LEFT]) && isRed(h[RIGHT])) {
				flipColors(h);
			}
			
			return h;
		}
	}


	/**
	 * Removes an item from the tree based on the given datum.
	 * 
	 * @param datum 
	 * @param all defaults to `true`; if `true` and duplicates exist, remove all
	 */
	public remove(datum: T, all = true): void {
		const tree = this;

		if (tree.root === undefined) { return; }

		tree.root = f(tree.root, datum);
		if (tree.root) { 
			tree.root.color = BLACK;
			tree.root.parent = undefined;
		}

		function f(h: Node<T>, datum: T) {
			let c = tree.compare(datum, h.datum);
			
			if ((c < 0 && !h[LEFT]) || (c > 0 && !h[RIGHT])) {
				return h;  // end reached - no match
			}
			
			if (c < 0) {
				if (!isRed(h[LEFT]) && 
					!isRed(h[LEFT]![LEFT])) {
					h = moveRedLeft(h);
				}
				h[LEFT] = f(h[LEFT]!, datum);
				if (h[LEFT]) { 
					h[LEFT]!.parent = h; 
				}
				
				return fixUp(h);
			} 
			
			
			if (isRed(h[LEFT])) {
				h = rotate(RIGHT, h);
				c = tree.compare(datum, h.datum);
			}
			
			if (c === 0 && !h[RIGHT]) {
				if (tree.duplicatesAllowed && !all && h.extras !== undefined) {
					h.extras.pop();
					if (h.extras.length === 0) { 
						h.extras = undefined; 
					}

					return h;
				}
				
				return undefined;
			}
			
			if (!isRed(h[RIGHT]) && 
				!isRed(h[RIGHT]![LEFT])) {
				h = moveRedRight(h);
				c = tree.compare(datum, h.datum);
			}
			
			if (c === 0) {
				if (tree.duplicatesAllowed) {
					if (!all && h.extras !== undefined) {
						h.extras.pop();
						if (h.extras.length === 0) { 
							h.extras = undefined; 
						}
						h[RIGHT] = f(h[RIGHT]!, datum);
					} else {
						const minNode = tree.getMinNode(h[RIGHT]);
						h.datum = minNode?.datum!;
						h.extras = minNode?.extras!;
						h[RIGHT] = removeMin(h[RIGHT]!);
					}
				} else {
					h.datum = tree.getMinNode(h[RIGHT])?.datum!;
					h[RIGHT] = removeMin(h[RIGHT]!);
				}
			} else {
				h[RIGHT] = f(h[RIGHT]!, datum);
			}
			if (h[RIGHT]) { h[RIGHT]!.parent = h; }
			
			return fixUp(h);
		}
	}


	/**
	 * Returns the two ordered nodes bounding the datum. 
	 * 
	 * * If the datum falls on a node, that node and the next (to the right) is 
	 * returned.
	 * * If the given datum is smaller than all nodes then the first item in the
	 * bounds array is `undefined` and the next is the smallest node
	 * * If the given datum is larger than all nodes then the second item in the
	 * bounds array is `undefined` and the first item is the largest node
	 * 
	 */
	public findBounds(datum: T): (Node<T> | undefined)[] {
		const tree = this;
		let node = tree.root;
		const bounds: (Node<T> | undefined)[] = [undefined, undefined];
		
		if (node === undefined) { return bounds; }
		
		while (node) {
			const c = tree.compare(datum, node.datum);
			if (c >= 0) { 
				bounds[0] = node;
			} else {
				bounds[1] = node;
			}
			
			node = node[c >= 0 ? RIGHT : LEFT];
		}

		return bounds;
	}


	/**
	 * Returns the two ordered nodes bounding the datum. 
	 * 
	 * * If the datum falls on a node, returns the nodes before and after this 
	 * one. 
	 * * If the given datum is smaller than all nodes then the first item in the
	 * bounds array is `undefined` and the next is the smallest node
	 * * If the given datum is larger than all nodes then the second item in the
	 * bounds array is `undefined` and the first item is the largest node
	 * 
	 * @param tree
	 * @param datum
	 */
	public findBoundsExcl(datum: T): (Node<T> | undefined)[] {
		const tree = this;
		const node = tree.root;

		const bounds: (Node<T> | undefined)[] = [undefined, undefined];
		
		if (node === undefined) { return bounds; }
		
		f(node);
		
		function f(node: Node<T>) {
			while (node) {
				const c = tree.compare(datum, node.datum);

				if (c === 0) {
					// Search on both sides
					f(node[LEFT]!);
					f(node[RIGHT]!);
					return;
				}
				
				if (c > 0) { 
					bounds[0] = node;
				} else if (c < 0) {
					bounds[1] = node;
				}
				
				node = node[c > 0 ? RIGHT : LEFT]!;
			}	
		}
		

		return bounds;
	}


	/**
	 * 
	 */
	public findAllInOrder(datum: T): Node<T>[] {
		const tree = this;
		const nodes: Node<T>[] = [];
		f(tree.root!);
		
		function f(node: Node<T> | undefined) {
			while (node) {
				const c = tree.compare(datum, node.datum);

				if (c === 0) { 
					f(node[LEFT]!);
					nodes.push(node);
					f(node[RIGHT]!);
					
					return;
				} 

				node = node[c > 0 ? RIGHT : LEFT];
			}
		}

		return nodes;
	}


	/** @internal */
	private getMinOrMaxNode(dir: Dir): (node?: Node<T> | undefined | undefined) => Node<T> | undefined {
		return (node: Node<T> | undefined | undefined): Node<T> | undefined => {
			if (node === undefined) { 
				node = this.root;
			};
			if (!node) { 
				return undefined;
			}
			
			while (node[dir]) {
				node = node[dir]!;
			}

			return node;	
		}
	}
	
	
	public getMinNode = this.getMinOrMaxNode(LEFT);
	public getMaxNode = this.getMinOrMaxNode(RIGHT);


	/**
	 * Returns the minimum value in the tree starting at the given node. If the
	 * tree is empty, `undefined` will be returned.
	 * 
	 * If the min value is required for the entire tree call this function 
	 * as `tree.min(tree.root)`
	 * 
	 * @param node
	 */
	public min(node?: Node<T> | undefined | undefined): T | undefined {
		if (node === undefined) {
			node = this.root;
		};
		const minNode = this.getMinNode(node);
		if (minNode !== undefined) { 
			return minNode.datum;
		}
		
		return undefined;
	}


	/**
	 * Returns the maximum value in the tree starting at the given node. If the
	 * tree is empty, `undefined` will be returned.
	 * 
	 * If the max value is required for the entire tree call this function 
	 * as `tree.max(tree.root)`
	 * 
	 * @param node
	 */
	public max(node?: Node<T> | undefined | undefined): T | undefined {
		if (node === undefined) { 
			node = this.root;
		};
		const maxNode = this.getMaxNode(node);
		if (maxNode !== undefined) { 
			return maxNode.datum;
		}
		
		return undefined;
	}
}


/**
 * Returns the node that is at the top after the rotation.
 * 
 * Destructively rotates the given node, say h, in the 
 * given direction as far as tree rotations go.
 * 
 * @param dir
 * @param h
 * 
 * @internal
 */
function rotate<T>(dir: Dir, h: Node<T>): Node<T> {
	const x = h[-dir as Dir]!;
	
	h[-dir as Dir] = x[dir];
	if (x[dir]) { x[dir]!.parent = h; }
	x[dir] = h;
	h.parent = x;
	
	x.color = h.color;
	h.color = RED;
	
	return x;
}


/**
 * @param h 
 * 
 * @internal
 */
function removeMin<T>(h: Node<T>): Node<T> | undefined {
	if (!h[LEFT]) {
		return undefined;
	}
	if (!isRed(h[LEFT]) && 
		!isRed(h[LEFT]![LEFT])) {
		h = moveRedLeft(h);
	}
	h[LEFT] = removeMin(h[LEFT]!);
	if (h[LEFT]) { h[LEFT]!.parent = h; }
	
	return fixUp(h);
}


/**
 * Destructively flips the color of the given node and both
 * it's childrens' colors. 
 * 
 * @param h
 * 
 * @internal
 */
function flipColors<T>(h: Node<T>): void {
	h.color = (h.color + 1)%2 as Color;
	h[LEFT ]!.color = (h[LEFT ]!.color + 1)%2 as Color;
	h[RIGHT]!.color = (h[RIGHT]!.color + 1)%2 as Color;
}


/**
 * @param h
 * 
 * @internal
 */
function moveRedLeft<T>(h: Node<T>): Node<T> {
	flipColors(h);
	if (isRed(h[RIGHT]![LEFT])) {
		const a = rotate(RIGHT, h[RIGHT]!);
		h[RIGHT] = a;
		a.parent = h;
		h = rotate(LEFT, h);
		flipColors(h);
	}
	
	return h;
}


/**
 * Returns the node that is at the top after the move.
 * 
 * @param h
 * 
 * @internal
 */
function moveRedRight<T>(h: Node<T>): Node<T> {
	flipColors(h);
	if (isRed(h[LEFT]![LEFT])) {
		h = rotate(RIGHT, h);
		flipColors(h);
	}
	
	return h;
}


/**
 * Returns the node that is at the top after the fix.
 * 
 * Fix right-leaning red nodes.
 * 
 * @internal
 */
function fixUp<T>(h: Node<T>): Node<T> {
	if (isRed(h[RIGHT])) {
		h = rotate(LEFT, h);
	}

	if (isRed(h[LEFT]) && isRed(h[LEFT]![LEFT])) {
		h = rotate(RIGHT, h);
	}

	// Split 4-nodes.
	if (isRed(h[LEFT]) && isRed(h[RIGHT])) {
		flipColors(h);
	}

	return h;
}


export { LlRbTree, Node, LEFT, RIGHT, RED, BLACK, isRed }
