import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tree: {}
  },

  getters: {
    getTree: function(state) {
      return state.tree
    }
  },

  mutations: {
    updateTree(state, data) {
      state.tree = data
    },
    saveItem(state, item) {
      state.tree.push(item)
    }
  },

  actions: {},
  modules: {}
})
