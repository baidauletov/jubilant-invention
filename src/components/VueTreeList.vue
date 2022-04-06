<template>
  <div class="vtl">
    <div v-if="model.name !== 'root'" :id="model.id" class="vtl-node vtl-tree-node">
      <div
        class="vtl-border vtl-up"
        :class="{ 'vtl-active': isDragEnterUp }"
        @drop="dropBefore"
        @dragenter="dragEnterUp"
        @dragover="dragOverUp"
        @dragleave="dragLeaveUp"
      />

      <div
        :class="treeNodeClass"
        :style="styleTreeGrid"
        :draggable="!model.dragDisabled"
        @dragstart="dragStart"
        @dragover="dragOver"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @drop="drop"
        @dragend="dragEnd"
        @click.stop="click"
      >
        <div class="vtl-caret" v-if="model.children && model.children.length > 0">
          <span v-show="this.expanded" @click="toggle">
            <icon-caret-down class="vtl-icon vtl-is-small" />
          </span>
          <span v-show="!this.expanded" @click="toggle">
            <icon-caret-right class="vtl-icon vtl-is-small" />
          </span>
        </div>
        <div v-else class="vtl-caret">
          <span></span>
        </div>

        <!-- <span>
          <slot name="treeNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
            <i class="vtl-icon vtl-menu-icon "></i>
          </slot>
        </span> -->

        <!-- data start -->

        <div class="vtl-node-content" v-if="!editable">
          <slot name="leafNameDisplay" :expanded="expanded" :model="model" :root="rootNode">
            {{ model.name }}
          </slot>
        </div>
        <input
          v-else
          class="vtl-input"
          type="text"
          ref="nodeInput"
          :value="model.name"
          @input="updateData('name')"
          @blur="setUnEditable('name')"
        />

        <div class="vtl-node-content">
          {{ countedNumber }}
        </div>

        <div class="vtl-node-content" v-if="!editable">
          <slot name="leafNumber" :expanded="expanded" :model="model" :root="rootNode">
            {{ model.number }}
          </slot>
        </div>
        <input
          v-else
          class="vtl-input"
          type="text"
          ref="nodeInput"
          :value="model.number"
          @input="updateData('number')"
          @blur="setUnEditable('number')"
        />

        <!-- data end -->

        <div class="vtl-operation">
          <span
            :title="defaultAddTreeNodeTitle"
            @click.stop.prevent="addChild(false)"
            v-if="!model.addTreeNodeDisabled"
          >
            <slot name="addTreeNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
              <i class="vtl-icon -plus-e"></i>
            </slot>
          </span>
          <span title="edit" @click.stop.prevent="setEditable" v-if="!model.editNodeDisabled">
            <slot name="editNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
              <i class="vtl-icon vtl-icon-edit"></i>
            </slot>
          </span>
          <span title="delete" @click.stop.prevent="delNode" v-if="!model.delNodeDisabled">
            <slot name="delNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
              <i class="vtl-icon vtl-icon-trash"></i>
            </slot>
          </span>
        </div>
      </div>

      <div
        v-if="model.children && model.children.length > 0 && expanded"
        class="vtl-border vtl-bottom"
        :class="{ 'vtl-active': isDragEnterBottom }"
        @drop="dropAfter"
        @dragenter="dragEnterBottom"
        @dragover="dragOverBottom"
        @dragleave="dragLeaveBottom"
      ></div>
    </div>

    <div
      :class="{ 'vtl-tree-padding': model.name !== 'root' }"
      v-show="model.name === 'root' || expanded"
      v-if="isFolder"
    >
      <item
        v-for="model in model.children"
        :default-tree-node-name="defaultTreeNodeName"
        :default-expanded="defaultExpanded"
        :model="model"
        :key="model.id"
      >
        <template v-slot:addTreeNodeIcon="slotProps">
          <slot name="addTreeNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:editNodeIcon="slotProps">
          <slot name="editNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:delNodeIcon="slotProps">
          <slot name="delNodeIcon" v-bind="slotProps" />
        </template>
      </item>
    </div>

    <vue-form v-if="isFormOpen" />
  </div>
</template>

<script>
import { TreeNode } from '../model/Tree.js'
import { addHandler, removeHandler } from '../utils/tools.js'
import IconCaretDown from './icons/IconCaretDown.vue'
import IconCaretRight from './icons/IconCaretRight.vue'
import VueForm from './VueForm.vue'

let compInOperation = null

export default {
  components: {
    IconCaretDown,
    IconCaretRight,
    VueForm
  },
  data() {
    return {
      isHover: false,
      editable: false,
      isDragEnterUp: false,
      isDragEnterBottom: false,
      isDragEnterNode: false,
      expanded: this.defaultExpanded,
      isFormOpen: false
    }
  },
  props: {
    model: {
      type: Object
    },
    listConfig: {
      type: Object
    },
    defaultTreeNodeName: {
      type: String,
      default: 'Tree Node'
    },
    defaultAddTreeNodeTitle: {
      type: String,
      default: 'Add Tree Node'
    },
    defaultExpanded: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    rootNode() {
      let node = this.$parent
      while (node._props.model.name !== 'root') {
        node = node.$parent
      }
      return node
    },

    isFolder() {
      return this.model.children && this.model.children.length
    },

    treeNodeClass() {
      const {
        model: { dragDisabled, disabled },
        isDragEnterNode
      } = this

      return {
        'vtl-node-main': true,
        'vtl-active': isDragEnterNode,
        'vtl-drag-disabled': dragDisabled,
        'vtl-disabled': disabled
      }
    },

    countedNumber() {
      return this.model.countNumber
    },

    parentNumber() {
      let result = this.model.pid
      return result
    },

    styleTreeGrid() {
      let result = {
        display: 'grid',
        grid: `auto-flow / 2rem calc(45% - (1rem * (2 + ${this.parentNumber}))) auto auto auto`
      }
      return result
    }
  },
  beforeCreate() {
    this.$options.components.item = require('./VueTreeList').default
  },
  mounted() {
    const vm = this
    addHandler(window, 'keyup', function(e) {
      // click enter
      if (e.keyCode === 13 && vm.editable) {
        vm.editable = false
      }
    })
  },
  beforeDestroy() {
    removeHandler(window, 'keyup')
  },
  methods: {
    updateData({ param } = {}) {
      const oldData = this.model[param]
      const newData = event.target.value
      if (oldData !== newData) {
        this.model.changeData()
        this.rootNode.$emit('change-data', {
          id: this.model.id,
          oldData: oldData,
          newData: newData,
          param: param,
          node: this.model
        })
      }
    },

    delNode() {
      this.rootNode.$emit('delete-node', this.model)
    },

    setEditable() {
      this.editable = true
      this.$nextTick(() => {
        let $input = this.$refs.nodeInput
        $input.focus()
        $input.setSelectionRange(0, $input.value.length)
      })
    },

    setUnEditable({ param } = {}) {
      this.editable = false
      let oldData = this.model[param]
      let newData = event.target.value
      if (oldData !== newData) {
        this.model.changeData(newData)
        this.rootNode.$emit('change-data', {
          id: this.model.id,
          oldData: oldData,
          newData: newData,
          param: param,
          eventType: 'blur'
        })
      }
    },

    toggle() {
      this.expanded = !this.expanded
    },

    click() {
      this.rootNode.$emit('click', {
        toggle: this.toggle,
        ...this.model
      })
    },

    addChild() {
      let name = this.defaultTreeNodeName
      this.expanded = true
      let node = new TreeNode({ name })
      this.model.addChildren(node, true)
      this.rootNode.$emit('add-node', node)
    },

    dragStart(e) {
      if (!(this.model.dragDisabled || this.model.disabled)) {
        compInOperation = this
        e.dataTransfer.setData('data', 'data')
        e.dataTransfer.effectAllowed = 'move'
        return true
      }
      return false
    },
    dragEnd() {
      compInOperation = null
    },
    dragOver(e) {
      e.preventDefault()
      return true
    },
    dragEnter() {
      if (!compInOperation) return
      if (compInOperation.model.id === this.model.id || !compInOperation) return
      this.isDragEnterNode = true
    },
    dragLeave() {
      this.isDragEnterNode = false
    },
    drop() {
      if (!compInOperation) return
      let oldParent = compInOperation.model.parent
      compInOperation.model.moveInto(this.model)
      this.isDragEnterNode = false
      this.rootNode.$emit('drop', {
        target: this.model,
        node: compInOperation.model,
        src: oldParent
      })
    },

    dragEnterUp() {
      if (!compInOperation) return
      this.isDragEnterUp = true
    },
    dragOverUp(e) {
      e.preventDefault()
      return true
    },
    dragLeaveUp() {
      if (!compInOperation) return
      this.isDragEnterUp = false
    },
    dropBefore() {
      if (!compInOperation) return
      const oldParent = compInOperation.model.parent
      compInOperation.model.insertBefore(this.model)
      this.isDragEnterUp = false
      this.rootNode.$emit('drop-before', {
        target: this.model,
        node: compInOperation.model,
        src: oldParent
      })
    },

    dragEnterBottom() {
      if (!compInOperation) return
      this.isDragEnterBottom = true
    },
    dragOverBottom(e) {
      e.preventDefault()
      return true
    },
    dragLeaveBottom() {
      if (!compInOperation) return
      this.isDragEnterBottom = false
    },
    dropAfter() {
      if (!compInOperation) return
      let oldParent = compInOperation.model.parent
      compInOperation.model.insertAfter(this.model)
      this.isDragEnterBottom = false
      this.rootNode.$emit('drop-after', {
        target: this.model,
        node: compInOperation.model,
        src: oldParent
      })
    },
    onCloseForm() {
      console.log('also close From')
      this.isFormOpen = false
      console.log(this.isFormOpen)
    }
  }
}
</script>

<style lang="scss" scoped>
.vtl-icon {
  line-height: 1;
  cursor: pointer;

  &.vtl-menu-icon {
    margin-right: 4px;
    &:hover {
      color: inherit;
    }
  }
  &:hover {
    color: blue;
  }
}

// .vtl-icon-edit:before {
//   content: '\e902';
// }
// .vtl-icon-trash:before {
//   content: '\e905';
// }

.vtl-border {
  height: 5px;
  &.vtl-up {
    margin-top: -5px;
    background-color: transparent;
  }
  &.vtl-bottom {
    background-color: transparent;
  }
  &.vtl-active {
    border-bottom: 3px dashed blue;
  }
}

.vtl-node-main {
  padding: 5px 0;
  .vtl-input {
    border: none;
    max-width: 150px;
    border-bottom: 1px solid blue;
  }
  &:hover {
    background-color: #f0f0f0;
  }
  &.vtl-active {
    outline: 2px dashed pink;
  }
  .vtl-caret {
    display: flex;
    justify-content: center;
    width: 2rem;
  }
  .vtl-is-small {
    width: 1rem;
  }
  .vtl-operation {
    display: flex;
    align-items: center;
  }
}

.vtl-node-content {
  display: flex;
  align-items: center;
}

.vtl-item {
  cursor: pointer;
}
.vtl-tree-padding {
  padding-left: 1rem;
}
</style>
