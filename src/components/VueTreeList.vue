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
        :draggable="!model.dragDisabled"
        @dragstart="dragStart"
        @dragover="dragOver"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @drop="drop"
        @dragend="dragEnd"
        @mouseover="mouseOver"
        @mouseout="mouseOut"
        @click.stop="click"
      >
        <span class="vtl-caret" v-if="model.children && model.children.length > 0">
          <!-- <i class="vtl-icon" :class="caretClass" @click.prevent.stop="toggle"></i> -->
          <span v-show="this.expanded" @click="toggle">
            <icon-caret-down class="vtl-icon vtl-is-small" />
          </span>
          <span v-show="!this.expanded" @click="toggle">
            <icon-caret-right class="vtl-icon vtl-is-small" />
          </span>
        </span>
        <span v-else class="vtl-caret vtl-is-small">
          <span></span>
        </span>

        <span>
          <slot name="treeNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
            <i class="vtl-icon vtl-menu-icon vtl-icon-folder"></i>
          </slot>
        </span>

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
        <div class="vtl-node-content" v-if="!editable">
          <slot name="leafCountNumber" :expanded="expanded" :model="model" :root="rootNode">
            {{ model.countNumber }}
          </slot>
        </div>
        <input
          v-else
          class="vtl-input"
          type="text"
          ref="nodeInput"
          :value="model.counnNumber"
          @input="updateData('countNumber')"
          @blur="setUnEditable('countNumber')"
        />
        <div class="vtl-node-content" v-if="!editable">
          <slot name="leafNUmber" :expanded="expanded" :model="model" :root="rootNode">
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

        <div class="vtl-operation" v-show="isHover">
          <span
            :title="defaultAddTreeNodeTitle"
            @click.stop.prevent="addChild(false)"
            v-if="!model.addTreeNodeDisabled"
          >
            <slot name="addTreeNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
              <i class="vtl-icon vtl-icon-folder-plus-e"></i>
            </slot>
          </span>
          <!-- <span
            :title="defaultAddLeafNodeTitle"
            @click.stop.prevent="addChild(true)"
            v-if="!model.isLeaf && !model.addLeafNodeDisabled"
          >
            <slot name="addLeafNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
              <i class="vtl-icon vtl-icon-plus"></i>
            </slot>
          </span> -->
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
        <!-- <template v-slot:leafNameDisplay="slotProps">
          <slot name="leafNameDisplay" v-bind="slotProps" />
        </template> -->
        <template v-slot:addTreeNodeIcon="slotProps">
          <slot name="addTreeNodeIcon" v-bind="slotProps" />
        </template>
        <!-- <template v-slot:addLeafNodeIcon="slotProps">
          <slot name="addLeafNodeIcon" v-bind="slotProps" />
        </template> -->
        <template v-slot:editNodeIcon="slotProps">
          <slot name="editNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:delNodeIcon="slotProps">
          <slot name="delNodeIcon" v-bind="slotProps" />
        </template>
      </item>
    </div>
  </div>
</template>

<script>
import { TreeNode } from '../utils/Tree.js'
import { addHandler, removeHandler } from '../utils/tools.js'
import IconCaretDown from './icons/IconCaretDown.vue'
import IconCaretRight from './icons/IconCaretRight.vue'

let compInOperation = null

export default {
  components: {
    IconCaretDown,
    IconCaretRight,
  },
  data() {
    return {
      isHover: false,
      editable: false,
      isDragEnterUp: false,
      isDragEnterBottom: false,
      isDragEnterNode: false,
      expanded: this.defaultExpanded,
    }
  },
  props: {
    model: {
      type: Object,
    },
    listConfig: {
      type: Object,
    },
    defaultTreeNodeName: {
      type: String,
      default: 'Tree Node',
    },
    defaultAddTreeNodeTitle: {
      type: String,
      default: 'Add Tree Node',
    },
    defaultExpanded: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    rootNode() {
      let node = this.$parent
      while (node._props.model.name !== 'root') {
        node = node.$parent
      }
      return node
    },

    caretClass() {
      return this.expanded ? 'vtl-icon-caret-down' : 'vtl-icon-caret-right'
    },

    isFolder() {
      return this.model.children && this.model.children.length
    },

    treeNodeClass() {
      const {
        model: { dragDisabled, disabled },
        isDragEnterNode,
      } = this

      return {
        'vtl-node-main': true,
        'vtl-active': isDragEnterNode,
        'vtl-drag-disabled': dragDisabled,
        'vtl-disabled': disabled,
      }
    },
  },
  beforeCreate() {
    this.$options.components.item = require('./VueTreeList').default
  },
  mounted() {
    const vm = this
    addHandler(window, 'keyup', function (e) {
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
          node: this.model,
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
          eventType: 'blur',
        })
      }
    },

    toggle() {
      // if (this.isFolder) {
      console.log('toggle')
      this.expanded = !this.expanded
      // }
    },

    mouseOver() {
      if (this.model.disabled) return
      this.isHover = true
    },

    mouseOut() {
      this.isHover = false
    },

    click() {
      this.rootNode.$emit('click', {
        toggle: this.toggle,
        ...this.model,
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
        // for firefox
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
        src: oldParent,
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
        src: oldParent,
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
        src: oldParent,
      })
    },
  },
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

// .vtl-icon-file:before {
//   content: '\e906';
// }
// .vtl-icon-folder:before {
//   content: '\e907';
// }
// .vtl-icon-caret-down:before {
//   content: '\E901';
// }
// .vtl-icon-caret-right:before {
//   content: '\E900';
// }
// .vtl-icon-edit:before {
//   content: '\e902';
// }
// .vtl-icon-folder-plus-e:before {
//   content: '\e903';
// }
// .vtl-icon-plus:before {
//   content: '\e904';
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
  // display: flex;
  // align-items: center;
  display: grid;
  grid: auto-flow / 15px 15px calc(50% - 80px) 20% 15% 15%;
  padding: 5px 0 5px 1rem;
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
    margin-left: -1rem;
  }
  .vtl-is-small {
    width: 1rem;
  }
  .vtl-operation {
    margin-left: 2rem;
    letter-spacing: 1px;
  }
}

.vtl-item {
  cursor: pointer;
}
.vtl-tree-padding {
  padding-left: 2em;
}
</style>
