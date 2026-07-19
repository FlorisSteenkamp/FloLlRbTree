import { Node } from "./ll-rb-tree.js";
declare function nodeToStr<T>(valToStr: (t: T) => string): (node: Node<T>) => string;
export { nodeToStr };
