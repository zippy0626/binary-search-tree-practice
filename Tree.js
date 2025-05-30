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
    // haven't handled root cases yet, where there is no parent

    if (value === undefined || value === null) {
      throw new Error("deleteItem value not provided");
    }

    // `currNode` is the matched node
    let currNode = this.root;
    let parentNode;

    while (currNode) {
      if (currNode.data === value) {
        checkIfLeaf(currNode, parentNode);
        checkIfOneChild(currNode, parentNode);
        checkIfTwoChild(currNode);
        return;
      } else {
        parentNode = currNode;
        if (value < currNode.data) {
          currNode = currNode.left;
        } else if (value > currNode.data) {
          currNode = currNode.right;
        }
      }
    }

    function checkIfLeaf(currNode, parentNode) {
      if (!currNode.left && !currNode.right) {
        parentNode.right === currNode
          ? (parentNode.right = null)
          : (parentNode.left = null);
      }
    }

    function checkIfOneChild(currNode, parentNode) {
      if (
        (!currNode.left && currNode.right) ||
        (!currNode.right && currNode.left)
      ) {
        // get the childNode of the current Node
        // assign it to which side parent is
        let childNode = currNode.left ? currNode.left : currNode.right;
        parentNode.right === currNode
          ? (parentNode.right = childNode)
          : (parentNode.left = childNode);
      }
    }

    function checkIfTwoChild(currNode) {
      if (currNode.left && currNode.right) {
        let successorParent = currNode;
        let successor = currNode.right;

        // find successor
        while (successor.left) {
          successorParent = successor;
          successor = successor.left;
        }

        currNode.data = successor.data;

        // delete the successor node
        if (successorParent.left === successor) {
          successorParent.left = successor.right;
        } else {
          successorParent.right = successor.right;
        }
      }
    }
    console.log(`Value: ${value} not found in binary search tree.`);
    return false;
  }

  find(value) {
    if (value === undefined || value === null) {
      throw new Error("find value not provided");
    }
    let currNode = this.root;
    if (!currNode) return false;
    while (currNode) {
      if (value === currNode.data) return currNode;
      value < currNode.data
        ? (currNode = currNode.left)
        : (currNode = currNode.right);
    }
    return false;
  }

  levelOrder(callback, initialNode) {
    // Write a levelOrder(callback) function that accepts a callback function and initialNode
    // as its parameters. levelOrder should traverse the tree in BREADTH-FIRST LEVEL ORDER
    // and call the callback on each node as it traverses, passing the
    // whole node as an argument, similarly to how Array.prototype.forEach might work for arrays

    if (!callback) {
      throw new Error("A callback function is required.");
    }
    const queue = [];

    // if `initialNode` is missing, use root
    let currNode = initialNode ? initialNode : this.root;
    if (!currNode) return;

    // init queue
    queue.push(currNode);

    while (queue.length) {
      let frontNode = queue.shift();
      callback(frontNode);
      if (frontNode.left) queue.push(frontNode.left);
      if (frontNode.right) queue.push(frontNode.right);
    }
  }

  preOrder(callback, node = this.root) {
    // traverse as: root, left, right
    if (!callback) {
      throw new Error("A callback function is required.");
    }
    if (node === null) return;
    callback(node)
    this.preOrder(callback, node.left)
    this.preOrder(callback, node.right)
  }

  inOrder(callback, node = this.root) {
    // left, root, right
    if (!callback) {
      throw new Error("A callback function is required.");
    }
    if (node === null) return;
    this.inOrder(callback, node.left)
    callback(node)
    this.inOrder(callback, node.right)
  }

  postOrder(callback, node = this.root) {
    // left, right, root
    if (!callback) {
      throw new Error("A callback function is required.");
    }
    this.inOrder(callback, node.left)
    this.inOrder(callback, node.right)
    callback(node)
  }


} 
