import Node from "./childNode.js";

export default class Tree {
  constructor(array) {
    array = this._preprocessArray(array);
    this.root = this.buildTree(array, 0, array.length - 1); // need to reference root to access all other nodes.
  }

  _preprocessArray(array) {
    array = [...new Set(array)];
    array.sort((a, b) => {
      return a - b;
    });
    return array;
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  buildTree(array, start, end) {
    // Function that takes an array of data, start/end index
    // and turns it into a balanced binary tree full of Node objects appropriately placed.
    // Don’t forget to sort and remove duplicates!
    // The buildTree function should return the level-0 root node.

    if (start > end) return null;
    const midIndex = Math.floor((start + end) / 2);
    const root = new Node(array[midIndex]);
    root.left = this.buildTree(array, start, midIndex - 1);
    root.right = this.buildTree(array, midIndex + 1, end);

    return root;
  }

  insert(value) {
    // Inserts node with `value` in binary tree
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let currNode = this.root;

    while (currNode) {
      if (value <= currNode.data) {
        // if the left side is empty, add it
        if (!currNode.left) {
          currNode.left = newNode;
          return;
        }
        // otherwise, continue left
        currNode = currNode.left;
      } else {
        if (!currNode.right) {
          currNode.right = newNode;
          return;
        }
        currNode = currNode.right;
      }
    }
  }

  deleteItem(value) {
    // Deletes `value` in binary tree
    // del leaf, del node with one child, del node with two childs

    if (value === undefined || value === null) {
      throw new Error("deleteItem value not provided");
    }

    let currNode = this.root;
    let parentNode;

    while (currNode) {
      if (value === currNode.data) {
        // deal with root level : height 0
        if (parentNode === undefined) {
          // root is leaf
          if (!currNode.left && !currNode.right) {
            this.root = null;
            return;
          }

          // root has one child
          if (
            (currNode.left && !currNode.right) ||
            (currNode.right && !currNode.left)
          ) {
            let childNode = currNode.left ? currNode.left : currNode.right;
            this.root = childNode;
            return;
          }

          // root has two childs
        }

        // currNode is a leaf node
        if (!currNode.left && !currNode.right) {
          parentNode.right === currNode
            ? (parentNode.right = null)
            : (parentNode.left = null);
          return;
        }

        // currNode has one child
        if (
          (currNode.left && !currNode.right) ||
          (currNode.right && !currNode.left)
        ) {
          let childNode = currNode.left ? currNode.left : currNode.right;
          parentNode.right === currNode
            ? (parentNode.right = childNode)
            : (parentNode.left = childNode);
          return;
        }

        // currNode has two children
      }

      // continue traversing
      parentNode = currNode;
      if (value < currNode.data) {
        currNode = currNode.left;
      } else if (value > currNode.data) {
        currNode = currNode.right;
      }
    }

    console.log(`Value: ${value} not found in binary tree.`);
    return null;
  }
}
