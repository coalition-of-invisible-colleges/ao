<template lang="pug">

.priorities
    div(v-if='priorities.length < 1')
        img.bdoge(  src='../assets/images/buddadoge.svg')
        h5 upboat to create priority
    .clearboth(v-for='(t, i) of priorities'  :key='t')
      .row.priority
          img.singleship(@click='allocate(t)'  src='../assets/images/boatbtnselected.svg'  :class='{ openboat : $store.state.context.action === t }')
          hyperpriority.closedcard(:taskId='t'  :inId='$store.getters.contextCard.taskId')
      .row.subpriority(v-for='(st, j) of getSubPriorities(t)'   :key='st')
          .clearboth.opensubcard
              hyperpriority(:taskId='st'  :inId="t")
          .row.subsubpriority(v-for='(st2, k) of getSubPriorities(st)'  :key='st2')
              .clearboth.opensubcard
                  hyperpriority(:taskId='st2'  :inId="st"  :inInId='t')
    div.clearboth
</template>

<script>
  import Hypercard from './Card'
  import Hyperpriority from './Priority'
  import _ from 'lodash'

  export default {
    components: {
      Hypercard
    },

    mounted() {
      this.$store.commit('setMode', 1)
      this.$store.commit('setDimension', 0)
      this.$store.dispatch('loaded')
    },
    data() {
      return {
        action: false
      }
    },
    methods: {
      getSubPriorities(taskId) {
        let card = this.$store.getters.hashMap[taskId]
        if (card && card.priorities) {
          return card.priorities.slice().reverse()
        }
      },
      allocate(taskId) {
        this.$store.dispatch('makeEvent', {
          type: 'task-prioritized',
          inId: this.$store.getters.contextCard.taskId,
          taskId
        })
      },
      getCard(taskId) {
        return this.$store.getters.hashMap[taskId]
      }
    },
    computed: {
      priorities() {
        return this.$store.getters.contextCard.priorities.slice().reverse()
      }
    },
    components: {
      Hyperpriority,
      Hypercard
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../styles/colours'
  @import '../styles/skeleton'
  @import '../styles/button'

  h5
      text-align: center
      color: lightGrey

  .priorities
      padding-bottom: 0.6em
      padding-top: 0.1em

  button
      background: darkteal

  tr
      border-color: accent4
      border-top-style: solid
      border-bottom-style: solid
      border-width: 3px
      vertical-align:middle

  thead
      tr
          text-align: center

  td
      vertical-align: middle
      color: accent2
      font-size: 1.34em
      text-align: center

  li
      text-align: left

  img
      height: 3.9em

  table
      text-align:center
      width: 100%
  th
      font-family: sans-serif
      font-weight: lighter
      font-size: 1.1em
      color: accent1
      border-color: accent1

  td
      color: accent3

  .padding
      padding: 1.987654321em

  li
      margin-left: 1em

  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  img
      height: 3em

  .ptr
      cursor: pointer

  .fr
      float: right

  .fl
      float: left

  .clearboth
      clear: both

  .shipcontainer
      // position: absolute
      // display: inline

  .allocated
      position: absolute
      left: -3.05em
      width: 3.3724em
      text-align: center
      color: white
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5)
      font-size: 1.5em
      pointer-events: none
      z-index: 7
      margin-top: 0.1em

  .openallocated
      margin-top: 0.3em

  .onelinecard
      width: 100%
      margin-left: 3em
      padding: 0.5em

  .top
      z-index: 9001

  .empty
      height: 3em
      padding-top: 0.6em
      padding-bottom: 0.2em

  .bdoge
      width: 100%
      opacity: 0.77
      height: 7em
      margin-top: 1em

  .priority
      margin-left: 4em
      width: calc(100% - 4em)
      position: relative

  .subpriority
      margin-left: calc(3.3724em * 2)
      width: calc(100% - (3.3724em* 2))

  .subsubpriority
      margin-left: 3.3724em
      width: calc(100% - 3.3724em)

  .singleship
      position: absolute
      width: 3.3724em
      margin-left: -4em
      cursor: pointer
      top: -0.3em

  .openboat
      top: 50%
      transform: translateY(-50%)

  .opencard
      width: calc(100% - 4.5em)
      margin-top: 0.5em

  .opensubcard
      width: calc(100% - 0.5em)
      margin-top: 0.5em

  .open
      top: 36%
</style>
