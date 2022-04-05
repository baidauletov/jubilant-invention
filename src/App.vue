<template>
  <div id="app">
    <header class="header">
      <span>Организационная структура</span>
    </header>
    <div style="margin: 1.25rem 1.5rem">
      <button @click="addNode" class="add-button">+ Добавить</button>
    </div>
    <vue-tree-list
      @click="onClick"
      @change-name="onChangeName"
      @delete-node="onDel"
      @add-node="onAddNode"
      @drop="drop"
      @drop-before="dropBefore"
      @drop-after="dropAfter"
      :model="data"
      default-tree-node-name="Отдел"
      default-leaf-node-name="Отдел"
      :default-expanded="false"
    >
      <template v-slot:leafNameDisplay="slotProps">
        <span>
          {{ slotProps.model.name }}
        </span>
      </template>
      <template v-slot:addTreeNodeIcon="slotProps">
        <span class="icon">{{ slotProps ? `📂` : '' }}</span>
      </template>
      <template v-slot:addLeafNodeIcon="slotProps">
        <span class="icon">{{ slotProps ? `＋` : '' }}</span>
      </template>
      <template v-slot:editNodeIcon="slotProps">
        <span class="icon">{{ slotProps ? `📃` : '' }}</span>
      </template>
      <template v-slot:delNodeIcon="slotProps">
        <span class="icon">{{ slotProps ? `✂️` : '' }}</span>
      </template>
      <template v-slot:leafNodeIcon="slotProps">
        <span class="icon">{{ slotProps ? `🍃` : '' }}</span>
      </template>
      <template v-slot:treeNodeIcon="slotProps">
        <span class="icon">
          {{
            slotProps.model.children && slotProps.model.children.length > 0 && !slotProps.expanded
              ? '🌲'
              : ''
          }}
        </span>
      </template>
    </vue-tree-list>
  </div>
</template>

<script>
import VueTreeList from './components/VueTreeList.vue'
import { Tree, TreeNode } from './utils/Tree.js'

export default {
  components: {
    VueTreeList,
  },
  data() {
    return {
      newTree: {},
      data: new Tree([
        {
          name: 'Node 1',
          id: 1,
          pid: 0,
          dragDisabled: true,
          addTreeNodeDisabled: true,
          addLeafNodeDisabled: true,
          editNodeDisabled: true,
          delNodeDisabled: true,
          children: [
            {
              name: 'Node 1-2',
              id: 2,
              isLeaf: true,
              pid: 1,
            },
          ],
        },
        {
          name: 'Node 2',
          id: 3,
          pid: 0,
          disabled: true,
        },
        {
          name: 'Node 3',
          id: 4,
          pid: 0,
        },
      ]),
    }
  },
  methods: {
    onDel(node) {
      // eslint-disable-next-line no-console
      console.log(node)
      node.remove()
    },

    onChangeName(params) {
      // eslint-disable-next-line no-console
      console.log(params)
    },

    onAddNode(params) {
      // eslint-disable-next-line no-console
      console.log(params)
    },

    onClick(params) {
      // eslint-disable-next-line no-console
      console.log(params)
    },

    drop: function ({ node, src, target }) {
      // eslint-disable-next-line no-console
      console.log('drop', node, src, target)
    },

    dropBefore: function ({ node, src, target }) {
      // eslint-disable-next-line no-console
      console.log('drop-before', node, src, target)
    },

    dropAfter: function ({ node, src, target }) {
      // eslint-disable-next-line no-console
      console.log('drop-after', node, src, target)
    },

    addNode() {
      const node = new TreeNode({ name: 'new node', isLeaf: false })
      if (!this.data.children) this.data.children = []
      this.data.addChildren(node)
    },

    getNewTree() {
      const vm = this
      function _dfs(oldNode) {
        const newNode = {}

        for (const k in oldNode) {
          if (k !== 'children' && k !== 'parent') {
            newNode[k] = oldNode[k]
          }
        }

        if (oldNode.children && oldNode.children.length > 0) {
          newNode.children = []
          for (let i = 0, len = oldNode.children.length; i < len; i++) {
            newNode.children.push(_dfs(oldNode.children[i]))
          }
        }
        return newNode
      }

      vm.newTree = _dfs(vm.data)
    },
  },
}
</script>

<style lang="scss">
@import './assets/style.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 4.5rem 6rem;
}

.header {
  color: $white;
  background-color: $base-color;
  text-transform: uppercase;
  display: flex;
  padding: 1.25rem;
}

.add-button {
  cursor: pointer;
}
</style>
