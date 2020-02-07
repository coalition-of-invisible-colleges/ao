const Vue = require( 'vue')
const _ = require( 'lodash')
const payments = ["bitcoin", "lightning"]

const state = {
    parent: [],
    panel: [],
    top: 0,
    completed: false,
    action: false,
    loading: false,
}

const mutations = {
    toggleCompleted(state){
        state.completed = !state.completed
    },
    setParent(state, p){
        state.parent = p
    },
    setPanel(state, panel, top){
          state.panel = panel
    },
    setTop(state, top){
          state.top = top
    },
    setAction(state, a){
        state.action = a
    },
    addParent(state, pId){
        state.parent = _.filter(state.parent, p => p !== pId)
        state.parent.push(pId)
    },
    goToParent(state, tId){
        let popped = false
        while (popped !== tId && state.parent.length !== 0){
            popped = state.parent.pop()
        }
    },
    startLoading(state, dimension){
        state.loading = dimension
    },
    stopLoading(state){
       state.loading = false
    },
}

const actions = {
    goIn({commit, state, getters}, pContext ){
        commit("setPanel", pContext.panel)
        commit("setTop", pContext.top)
        pContext.parents.forEach(p => {
            commit("addParent", p)
        })
    },
    goUp({commit, state}, pContext){
        commit("goToParent", pContext.target)
        commit("setPanel", pContext.panel)
        commit("setTop", pContext.top)
    },
}

const getters = {}

module.exports = {
    state,
    mutations,
    actions,
    getters,
}
