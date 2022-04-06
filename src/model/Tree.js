import { traverseTree } from '../utils/tools'

export class TreeNode {
  constructor(data) {
    const { id } = data
    this.id = typeof id === 'undefined' ? new Date().valueOf() : id
    this.parent = null
    this.children = null
    this.deep = 0
    // console.log(this.id + 'id ---> data-deep :', this.deep)

    for (const param in data) {
      if (param !== 'id' && param !== 'children') {
        this[param] = data[param]
      }
    }
  }

  changeName(name) {
    this.name = name
  }
  changeNumber(number) {
    this.number = number
  }

  addChildren(children) {
    if (!this.children) {
      this.children = []
    }

    if (Array.isArray(children)) {
      for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i]
        child.parent = this
        child.pid = this.id
        child.deep = this.name === 'root' ? 0 : this.deep + 1
      }
      this.children.concat(children)
    } else {
      const child = children
      child.parent = this
      child.pid = this.id
      child.deep = this.name === 'root' ? 0 : this.deep + 1
      this.children.push(child)
    }
  }

  remove() {
    const parent = this.parent
    const index = parent.findChildIndex(this)
    parent.children.splice(index, 1)
  }

  _removeChild(child) {
    for (let i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i] === child) {
        this.children.splice(i, 1)
        break
      }
    }
  }

  isTargetChild(target) {
    let parent = target.parent
    while (parent) {
      if (parent === this) {
        return true
      }
      parent = parent.parent
    }
    return false
  }

  moveInto(target) {
    if (this.name === 'root' || this === target) {
      return
    }

    if (this.isTargetChild(target)) {
      return
    }

    this.parent._removeChild(this)
    this.parent = target
    this.pid = target.id
    this.deep = target.deep + 1
    if (!target.children) {
      target.children = []
    }
    target.children.unshift(this)
  }

  findChildIndex(child) {
    let index
    for (let i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i] === child) {
        index = i
        break
      }
    }
    return index
  }

  _canInsert(target) {
    if (this.name === 'root' || this === target) {
      return false
    }

    if (this.isTargetChild(target)) {
      return false
    }

    this.parent._removeChild(this)
    this.parent = target.parent
    this.pid = target.parent.id
    this.deep = target.parent.deep
    return true
  }

  insertBefore(target) {
    if (!this._canInsert(target)) return

    const pos = target.parent.findChildIndex(target)
    target.parent.children.splice(pos, 0, this)
  }

  insertAfter(target) {
    if (!this._canInsert(target)) return

    const pos = target.parent.findChildIndex(target)
    target.parent.children.splice(pos + 1, 0, this)
  }

  toString() {
    return JSON.stringify(traverseTree(this))
  }
}

export class Tree {
  constructor(data) {
    this.root = new TreeNode({ name: 'root', id: 0, deep: 0 })
    this.initNode(this.root, data)
    return this.root
  }

  initNode(node, data) {
    for (let i = 0, len = data.length; i < len; i++) {
      let _data = data[i]

      let child = new TreeNode(_data)
      if (_data.children && _data.children.length > 0) {
        this.initNode(child, _data.children)
      }
      node.addChildren(child)
    }
  }
}
