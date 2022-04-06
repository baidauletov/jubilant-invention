<template>
  <div id="app">
    <header class="header">
      <span>Организационная структура</span>
    </header>
    <div>
      <button @click="addNode" class="add-button">+ Добавить</button>
    </div>
    <div class="list-header">
      <span v-for="item in configFile" :key="item.id" class="list-header__item">{{
        item.name
      }}</span>
    </div>
    <vue-tree-list
      @click="onClick"
      @change-name="onChangeName"
      @change-number="onChangeNumber"
      @delete-node="onDel"
      @add-node="onAddNode"
      @drop="drop"
      @drop-before="dropBefore"
      @drop-after="dropAfter"
      :model="data"
      default-tree-node-name="Отдел"
      :default-expanded="false"
    >
      <template v-slot:editNodeIcon="slotProps">
        <span class="icon"><icon-pencil />{{ slotProps ? '' : '' }}</span>
      </template>
      <template v-slot:delNodeIcon="slotProps">
        <span class="icon ml-2"><icon-erase />{{ slotProps ? '' : '' }}</span>
      </template>
    </vue-tree-list>
    <div class="comment">
      <ul>
        <li>Строки перетаскиваются <strong> drag and drop </strong></li>
        <li>
          Первая строка в data установлена неубираемой (delNodeDisabled)
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import VueTreeList from './components/VueTreeList.vue'
import { Tree, TreeNode } from './model/Tree.js'
import { mapGetters, mapMutations } from 'vuex'
import IconErase from './components/icons/IconErase.vue'
import IconPencil from './components/icons/IconPencil.vue'

export default {
  components: {
    VueTreeList,
    IconErase,
    IconPencil
  },
  data() {
    return {
      newTree: {},
      data: new Tree([
        {
          name: 'Семей',
          number: 5,
          id: 1,
          pid: 0,
          deep: 0,
          dragDisabled: true,
          addTreeNodeDisabled: true,
          editNodeDisabled: true,
          delNodeDisabled: true,
          children: [
            {
              name: 'Node 1-2',
              number: 5,
              id: 2,
              pid: 1,
              deep: 1
            }
          ]
        },
        {
          name: 'Алматы',
          number: 10,
          id: 3,
          pid: 0,
          deep: 0
        },
        {
          name: 'Москва',
          number: 15,
          id: 4,
          pid: 0,
          deep: 0
        }
      ]),
      configFile: {
        id: {
          id: 'id',
          name: ''
        },
        countNumber: {
          id: 'countNumber',
          name: 'Общее количество'
        },
        factNumber: {
          id: 'factNumber',
          name: 'Фактическое количество'
        },
        action: {
          id: 'action',
          name: 'Действия'
        }
      }
    }
  },
  mounted() {
    let tree = this.getNewTree()
    this.updateTree(tree)
  },
  computed: {
    ...mapGetters(['getTree'])
  },
  methods: {
    ...mapMutations(['updateTree']),

    onDel(node) {
      console.log(node)
      node.remove()

      let tree = this.getNewTree()
      this.updateTree(tree)
    },

    onChangeName(params) {
      console.log(params)
      let tree = this.getNewTree()
      this.updateTree(tree)
    },

    onChangeNumber(params) {
      console.log(params)
      let tree = this.getNewTree()
      this.updateTree(tree)
    },

    onAddNode(params) {
      console.log(params)
    },

    onClick(params) {
      console.log(params)
    },

    drop: function({ node, src, target }) {
      console.log('drop', node, src, target)

      let tree = this.getNewTree()
      this.updateTree(tree)
    },

    dropBefore: function({ node, src, target }) {
      console.log('drop-before', node, src, target)
    },

    dropAfter: function({ node, src, target }) {
      console.log('drop-after', node, src, target)
    },

    addNode() {
      const node = new TreeNode({ name: 'Отдел', number: 0 })
      if (!this.data.children) this.data.children = []
      this.data.addChildren(node)

      let tree = this.getNewTree()
      this.updateTree(tree)
    },

    getNewTree() {
      let vm = this
      function _dfs(oldNode) {
        let newNode = {}

        for (let k in oldNode) {
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

      return vm.newTree
    }
  }
}
</script>

<style lang="scss">
@import './assets/style.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 4.5rem 15%;
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
  margin: 1.25rem 1.5rem;
}

.list-header {
  display: grid;
  grid: auto-flow/45% 10rem 10rem 10rem;
  background-color: $base-color;
  &__item {
    color: $white;
    font-size: 0.8rem;
    padding: 0.75rem;
    border-right: 1px solid white;
    border-left: 1px solid white;
    &:last-child {
      border-right: none;
    }
  }
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
}

.comment {
  margin-top: 5rem;
  display: flex;
  justify-content: flex-end;
  font-style: bold;
  border: 1px solid green;
  border-radius: 8px;
  width: fit-content;
  padding: 8px 16px;
}
</style>
