<template lang="pug">

.memberrow.membershipcard(@dblclick='goIn')
    .row.center
        label.hackername {{ r.name }}
        button(v-if='!isAnyOptions' @click='resourcePurged')
        button(v-for='o in optionList'  @click='use(o[0])'  :class='cardInputSty(o[2])') {{ o[1] }}
    .bottomleft(v-if='card.boost')
    .bottomright(@click='goIn')
        img.smallguild(src='../assets/images/orb.svg')
    .clearboth
</template>

<script>
  export default {
    props: ['r', 'c'],
    components: {},
    computed: {
      isAnyOptions() {
        return this.optionList.length > 0
      },
      card() {
        return this.$store.getters.hashMap[this.r.resourceId]
      },
      optionList() {
        let ol = this.card.priorities.map(taskId => {
          let option = this.$store.getters.hashMap[taskId]
          let split = option.name.split(':')
          if (split.length >= 2) {
            return [split[0], split[1], option.color] // notes, name, color
          }
        })
        return ol.filter(list => {
          return !!list
        })
      }
    },
    methods: {
      cardInputSty(color) {
        return {
          redwx: color == 'red',
          bluewx: color == 'blue',
          greenwx: color == 'green',
          yellowwx: color == 'yellow',
          purplewx: color == 'purple',
          blackwx: color == 'black'
        }
      },
      resourcePurged() {
        let newEv = {
          type: 'resource-purged',
          resourceId: this.r.resourceId
        }
        this.$store.dispatch('makeEvent', newEv)
      },
      use(letter) {
        let newEv = {
          type: 'resource-used',
          resourceId: this.r.resourceId,
          memberId: this.$store.getters.member.memberId,
          amount: 1,
          charged: this.r.charged,
          notes: letter
        }
        this.$store.dispatch('makeEvent', newEv)
      },
      goIn() {
        let top = this.c.indexOf(this.r.resourceId)
        if (top > -1) {
          this.$store.dispatch('goIn', {
            parents: [],
            panel: this.c,
            top
          })
          if (
            this.$store.state.upgrades.mode === 'doge' &&
            this.$store.getters.contextCard.priorities.length > 0
          ) {
            this.$store.commit('setMode', 1)
          }
          this.$router.push('/' + this.$store.state.upgrades.mode)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../styles/colours'
  @import '../styles/skeleton'
  @import '../styles/grid'
  @import '../styles/tooltips'
  @import '../styles/button'

  button
      width: 4em
      height:2em
      margin: 1.1em
      font-size: 1.5em

  img
      height: 2em

  label
      font-size: 1.246em
      font-weight: normal;
      margin: 1em
      display: block

  .hackername
      font-family: monospace
      font-size: 1.5em

  .membershipcard
      padding: 1em
      background: rgba(22, 22, 22, 0.2)
      text-align: center

  .agedwrapper
      position: relative

  .agedbackground
      background-image: url('/paper.jpg')
      background-repeat: no-repeat
      background-position: center center
      background-size: cover
      top: 0
      left: 0
      bottom: 0
      right: 0
      position: absolute
      width: 100%
      height: 100%
      pointer-events: none
      //border-radius: 12px
      z-index: -1

  .freshpaper
      background-image: url('/paper.jpg')
      opacity: 0.3

  .weekoldpaper
      background-image: url('/paper_aged_1.png')
      opacity: 0.3

  .montholdpaper
      background-image: url('/paper_aged_2.png')
      opacity: 0.3

  .threemontholdpaper
      background-image: url('/paper_aged_3.png')
      opacity: 0.3

  .smallcaps
      color: #fff
      width: 100%
      border-radius: 50%
      opacity: 0.75
      padding: 0.5em
      border-style: solid
      border-color: white
      border-width: 2px

  .smallguild
      height: 2em

  .bottomleft, .bottomright
      width: fit-content
      position: relative
      bottom: 0

  .bottomleft
      float: left
      left: 0

  .bottomright
      right: 0
      cursor:pointer
      float: right

  .stash
      display: inline
      margin-left: 0.5em
      position: relative
      top: -0.35em

  .clearboth
      clear: both

  .gui
      font-size: 1.7em
      cursor: pointer

  .title
      text-align: center
      font-size: 1.8em
      margin-top: 0.5em
      font-weight: bold

  .help
      font-size: 1.3em

  .suggest
      font-style: italic
      font-size: 1.3em

  .dogecoin
      width: 3em
      height: 3em
      cursor: pointer

  .faded
      opacity: 0.39

  .tooltiptext.membertooltip
      width: 20em
      z-index: 151
      left: 7em
      top: -11em

  ul.left
      text-align: left
</style>
