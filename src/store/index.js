import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tree: [
      {
        name: 'Node 1',
        countNumber: '',
        number: 5,
        id: 1,
        pid: 0,
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
          },
        ],
      },
      {
        name: 'Node 2',
        number: 10,
        id: 3,
        pid: 0,
      },
      {
        name: 'Node 3',
        number: 15,
        id: 4,
        pid: 0,
      },
    ],
  },
  getters: {
    TREE_GETTER(state) {
      return state.tree
    },
  },
  mutations: {},
  actions: {},
  modules: {},
})
