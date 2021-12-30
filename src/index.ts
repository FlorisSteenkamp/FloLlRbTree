// Concise, Destructive, Left Leaning Red Black Tree implementation.
// See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
// See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html 

import { TreeNode as Node }  from './tree-node.js';
import { RED, BLACK, type Color } from './tree-node-color.js';
import { LEFT, RIGHT, type Dir } from './tree-node-direction.js';


function isRed<T>(node: Node<T> | null): boolean {
	return !!node && node.color === RED;
}


class LlRbTree<T> {
	// @ts-ignore - it is definitely set in the constructor
	private replaceDups: boolean;
	// @ts-ignore - it is definitely set in the constructor
	private compare: ((a: T, b: T) => number) | ((a: T, b: T[]) => number);
	// @ts-ignore - it is definitely set in the constructor
	public root: Node<T> | null;

	/** 
	 * @param compare a comparator function
	 * @param data an initial array of data
	 * @param replaceDups if `true` then if a duplicate is inserted (as per the 
	 * equivalence relation induced by the compare function) then replace it;
	 * if `false` then instead keep an array of values at the relevant node
	 */	
	constructor(
			compare: (a: T, b: T) => number, 
			data?: T[], 
			replaceDups = true) {
				
		const tree = this;

		tree.setComparator(compare, replaceDups);	
		tree.replaceDups = replaceDups;
		
		tree.root = null;
		
		if (!data) { return; }
		
		for (let datum of data) {
			tree.insert(datum);
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
			this.compare = (a: T, b: T[]) => compare(a, b[0]);
		}
	}


	public isEmpty() { return !this.root; }


	/**
	 * Find and returns the node in the tree with the given datum using the tree 
	 * compare function. Returns `undefined` if the node was not found.
	 */
	public find(datum: T): Node<T> | undefined {
		const tree = this;

		let node = this.root;
		while (node) {
			let c = (tree.compare as (a: T, b: T) => number)(datum, node.datum as T);
			if (c === 0) { 
				return node;
			} else {
				node = node[c > 0 ? RIGHT : LEFT];
			}
		}

		return undefined;
	}


	/**
	 * Returns an ordered (by the tree compare function) array of data as 
	 * contained in the nodes of the tree by doing an in order traversal.
	 */
	public toArrayInOrder(): T[] | T[][] {
		let nodes: T[] = [];
		f(this.root);
		
		function f(node: Node<T> | null): void {
			if (!node) { return; }

			f(node[LEFT]);
			nodes.push(node.datum as T);
			f(node[RIGHT]);
		}

		return nodes;
	}


	/**
	 * Inserts a node with the given datum into the tree.
	 */
	public insert(datum: T): void {
		const tree = this;
		tree.root = f(tree.root, datum);
		tree.root.color = BLACK;
		tree.root.parent = undefined;
		
		function f(h: Node<T> | null, datum: T): Node<T> {
			if (!h) {
				return new Node(datum, !tree.replaceDups);
			}
			
			let c = (tree.compare as (a: T, b: T) => number)(datum, h.datum as T);
			if (c === 0) {
				if (tree.replaceDups) {
					h.datum = datum;
				} else {
					(h.datum as T[]).push(datum as T);
				}
			} else {
				let dir = c > 0 ? RIGHT : LEFT;
				h[dir] = f(h[dir], datum);
				h[dir]!.parent = h;
			}
			
			if (isRed(h[RIGHT]) && 
			    !isRed(h[LEFT])) {
				h = rotate(LEFT, h);
			}
			if (isRed(h[LEFT]) && 
				isRed(h[LEFT]![LEFT])) {
				h = rotate(RIGHT, h);
			}

			if (isRed(h[LEFT]) && 
				isRed(h[RIGHT])) {
				flipColors(h);
			}
			
			return h;
		}
	}


	/**
	 * Removes an item from the tree based on the given datum.
	 * 
	 * * **precondition**: the datum must exist in the tree
	 * 
	 * @param datum 
	 * @param all if the datum is an array, remove all
	 */
	public remove(datum: T, all = true): void {
		const tree = this;
		// if (!tree.root) { return; }
		tree.root = f(tree.root!, datum);
		if (tree.root) { 
			tree.root.color = BLACK;
			tree.root.parent = undefined;
		}
		
		function f(h: Node<T>, datum: T) {
			let c = (tree.compare as (a: T, b: T) => number)(datum, h.datum as T);
			
			if (!tree.replaceDups && c === 0 && !all && (h.datum as T[]).length > 1) {
				removeFromArray(datum, (h.datum as T[]));
				return h;
			}

			
			if (c < 0 && !h[LEFT] || c > 0 && !h[RIGHT]) {
				return h;
			}
			
			
			if (c < 0) {
				if (!isRed(h[LEFT]) && 
					!isRed(h[LEFT]![LEFT])) {
					h = moveRedLeft(h);
				}
				h[LEFT] = f(h[LEFT]!, datum);
				if (h[LEFT]) { h[LEFT]!.parent = h; }
				
				return fixUp(h);
			} 
			
			
			if (isRed(h[LEFT])) {
				h = rotate(RIGHT, h);
				c = (tree.compare as (a: T, b: T) => number)(datum, h.datum as T);
				if (!tree.replaceDups && c === 0 && !all && (h.datum as T[]).length > 1) {
					removeFromArray(datum, (h.datum as T[]));
					return h;
				}
			}
			
			if (c === 0 && !h[RIGHT]) {
				return null;
			}
			
			if (!isRed(h[RIGHT]) && 
				!isRed(h[RIGHT]![LEFT])) {
				h = moveRedRight(h);
				c = (tree.compare as (a: T, b: T) => number)(datum, h.datum as T);
				if (!tree.replaceDups && c === 0 && !all && (h.datum as T[]).length > 1) {
					removeFromArray(datum, (h.datum as T[]));
					return h;
				}
			}
			
			if (c === 0) {
				h.datum = tree.min(h[RIGHT])!;  
				h[RIGHT] = removeMin(h[RIGHT]!);
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
		let bounds: (Node<T> | undefined)[] = [undefined, undefined];
		
		if (node === null) { return bounds; }
		
		while (node) {
			const c = (tree.compare as (a: T, b: T) => number)(datum, node.datum as T);
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
		let node = tree.root;

		let bounds: (Node<T> | undefined)[] = [undefined, undefined];
		
		if (node === null) { return bounds; }
		
		f(node);
		
		function f(node: Node<T>) {
			while (node) {
				let c = (tree.compare as (a: T, b: T) => number)(datum, node.datum as T);

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
		let nodes: Node<T>[] = [];
		f(tree.root!);
		
		function f(node: Node<T> | null) {
			while (node) {
				let c = (tree.compare as (a: T, b: T) => number)(datum, node.datum as T);

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
	private getMinOrMaxNode(dir: Dir): (node?: Node<T> | null | undefined) => Node<T> | undefined {
		return (node: Node<T> | null | undefined): Node<T> | undefined => {
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
	public min(node?: Node<T> | null | undefined): T|T[] | undefined {
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
	public max(node?: Node<T> | null | undefined): T|T[] | undefined {
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
 * Removes the datum from the tuple using ===.
 * Note this function uses === and not the compare function! 
 * 
 * @internal
 */
function removeFromArray(elem: any, arr: any[]): void {
	let index = arr.indexOf(elem);

	if (index !== -1) {
        arr.splice(index, 1);
	}
}


/**
 * Returns the node that is at the top after the rotation.
 * 
 * Destructively rotates the given node, say h, in the 
 * given direction as far as tree rotations go.
 * 
 * @param dir `true` -> right, `false` -> left
 * @param h
 * 
 * @internal
 */
function rotate<T>(dir: Dir, h: Node<T>): Node<T> {
	const otherDir = dir ? LEFT : RIGHT;
	const x = h[otherDir]!;
	
	h[otherDir] = x[dir];
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
function removeMin<T>(h: Node<T>): Node<T> | null {
	if (!h[LEFT]) {
		return null;
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
 * @param color 
 * 
 * @internal
 */
function flipColor(color: Color): Color {
	// return color === RED ? BLACK : RED;
	return (color + RED)%2 as Color;
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
	h.color = flipColor(h.color);
	h[LEFT ]!.color = flipColor(h[LEFT ]!.color);
	h[RIGHT]!.color = flipColor(h[RIGHT]!.color);
}


/**
 * @param h
 * 
 * @internal
 */
function moveRedLeft<T>(h: Node<T>): Node<T> {
	flipColors(h);
	if (isRed(h[RIGHT]![LEFT])) {
		let a = rotate(RIGHT, h[RIGHT]!);
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

	if (isRed(h[LEFT]) && 
		isRed(h[LEFT]![LEFT])) {
		h = rotate(RIGHT, h);
	}

	// Split 4-nodes.
	if (isRed(h[LEFT]) && 
		isRed(h[RIGHT])) {
		flipColors(h);
	}

	return h;
}


export { LlRbTree }
