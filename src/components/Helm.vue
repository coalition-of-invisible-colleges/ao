isUni<template lang="pug">

.helm(@contextmenu.prevent)
    button.modeleft(v-if='$store.state.upgrades.mode || !$store.getters.isLoggedIn'  id='helmleft'  :class='{ boat : $store.state.upgrades.mode === "badge" }'  @mousedown='$store.dispatch("flashHelm",1)')
        img.upg.boat(v-if='$store.state.upgrades.mode === "badge"'  src='../assets/images/boat.svg')
        img.upg(v-else-if='$store.state.upgrades.mode === "chest"'  src='../assets/images/badge.svg')
        img.upg(v-else-if='$store.state.upgrades.mode === "timecube"'  src='../assets/images/chest.svg')
        img.upg(v-else-if='$store.state.upgrades.mode === "boat"'  src='../assets/images/buddadoge.svg')
    button.topcenter.adjtooltip(id='helm'  :class='$store.state.upgrades.flashClasses'  @mousedown='$store.dispatch("flashHelm",1)')
        // XXX :class='{ closed : $store.state.upgrades.mode === "doge" && $store.getters.isLoggedIn }'
        img.upg(v-if='$store.state.upgrades.mode === "boat"'  src='../assets/images/boat.svg')
        img.upg(v-else-if='$store.state.upgrades.mode === "badge"'  src='../assets/images/badge.svg')
        img.upg(v-else-if='$store.state.upgrades.mode === "chest"'  src='../assets/images/chest.svg')
        img.upg(v-else-if='$store.state.upgrades.mode === "timecube"'  src='../assets/images/timecube.svg')
        img.upg(v-else  src='../assets/images/buddadoge.svg')
    button.moderight(v-if='$store.state.upgrades.mode || !$store.getters.isLoggedIn' id='helmright'  @mousedown='$store.dispatch("flashHelm",1)')
        img.upg(v-if='$store.state.upgrades.mode === "timecube"'  src='../assets/images/buddadoge.svg')
        img.upg(v-else-if='$store.state.upgrades.mode === "boat"'  src='../assets/images/badge.svg')
        img.upg(v-else-if='$store.state.upgrades.mode === "badge"'  src='../assets/images/chest.svg')
        img.upg.timecube(v-else-if='$store.state.upgrades.mode === "chest"'  src='../assets/images/timecube.svg')
</template>

<script>
  import Hammer from 'hammerjs'
  import Propagating from 'propagating-hammerjs'

  import Status from './Status'

  export default {
    mounted() {
      let el = document.getElementById('helm')
      let mc = Propagating(new Hammer.Manager(el))

      let Swipe = new Hammer.Swipe()
      mc.add(Swipe)
      mc.on('swipeleft', e => {
        this.$store.dispatch('previousUpgradeMode', this.$router)
        e.stopPropagation()
      })

      mc.on('swiperight', e => {
        this.$store.dispatch('nextUpgradeMode', this.$router)
        e.stopPropagation()
      })

      mc.on('swipeup', e => {
        this.$store.commit('closeUpgrades')
        e.stopPropagation()
      })

      mc.on('swipedown', e => {
        this.$store.dispatch('nextUpgradeMode', this.$router)
        e.stopPropagation()
      })

      let helmTap = new Hammer.Tap({ time: 400 })
      let helmDoubleTap = new Hammer.Tap({
        event: 'doubletap',
        taps: 2,
        time: 400,
        interval: 400
      })
      let helmTripleTap = new Hammer.Tap({
        event: 'tripletap',
        taps: 3,
        time: 400,
        interval: 400
      })
      let helmQuadrupleTap = new Hammer.Tap({
        event: 'quadrupletap',
        taps: 4,
        time: 400,
        interval: 400
      })
      let helmQuintupleTap = new Hammer.Tap({
        event: 'quintupletap',
        taps: 5,
        time: 400,
        interval: 400
      })
      let helmPress = new Hammer.Press({ time: 600 })
      mc.add([
        helmPress,
        helmQuintupleTap,
        helmQuadrupleTap,
        helmTripleTap,
        helmDoubleTap,
        helmTap
      ])
      helmPress.recognizeWith([
        helmQuintupleTap,
        helmQuadrupleTap,
        helmTripleTap,
        helmDoubleTap,
        helmTap
      ])
      helmTap.recognizeWith([
        helmQuintupleTap,
        helmQuadrupleTap,
        helmTripleTap,
        helmDoubleTap
      ])
      helmTap.requireFailure([
        helmQuintupleTap,
        helmQuadrupleTap,
        helmTripleTap,
        helmDoubleTap
      ])
      helmDoubleTap.recognizeWith([
        helmQuintupleTap,
        helmQuadrupleTap,
        helmTripleTap
      ])
      helmDoubleTap.requireFailure([
        helmQuintupleTap,
        helmQuadrupleTap,
        helmTripleTap
      ])
      helmTripleTap.recognizeWith([helmQuintupleTap, helmQuadrupleTap])
      helmTripleTap.requireFailure([helmQuintupleTap, helmQuadrupleTap])
      helmQuadrupleTap.recognizeWith(helmQuintupleTap)
      helmQuadrupleTap.requireFailure(helmQuintupleTap)

      mc.on('tap', e => {
        this.$store.dispatch('nextUpgradeMode', this.$router)
        e.stopPropagation()
      })

      mc.on('doubletap', e => {
        console.log('double click')
        this.$store.dispatch('flashHelm', 0.5)
        this.goUni('boat')
        e.stopPropagation()
      })

      mc.on('tripletap', e => {
        console.log('triple click')
        this.$store.dispatch('flashHelm', 0.5)
        this.goUni('badge')
        e.stopPropagation()
      })

      mc.on('quadrupletap', e => {
        this.$store.dispatch('flashHelm', 0.5)
        this.goUni('chest')
        e.stopPropagation()
      })

      mc.on('quintupletap', e => {
        this.$store.dispatch('flashHelm', 0.5)
        this.goUni('timecube')
        e.stopPropagation()
      })

      mc.on('press', e => {
        if (this.isUni && !this.isPepe) {
          if (
            this.$store.state.upgrades.mode === 'doge' &&
            this.$store.getters.contextCard.taskId ===
              this.$store.getters.memberCard.taskId
          ) {
            this.$store.dispatch('flashHelm', 5)
            this.goFront('doge')
          } else {
            this.$store.dispatch('flashHelm', 2)
            this.goUni('doge', true)
            if (
              this.$store.getters.contextCard.taskId !==
              this.$store.getters.memberCard.taskId
            ) {
              this.goHome()
            }
          }
        } else {
          this.$store.dispatch('flashHelm', 2)
          this.goUni('doge')
          if (
            this.$store.getters.contextCard.taskId !==
            this.$store.getters.memberCard.taskId
          ) {
            this.goHome()
          }
        }
        e.stopPropagation()
      })

      let rel = document.getElementById('helmright')
      let rmc = new Hammer.Manager(rel)

      let Tap2 = new Hammer.Tap({ time: 400 })
      rmc.add(Tap2)
      rmc.on('tap', e => {
        this.$store.dispatch('nextUpgradeMode', this.$router)
      })

      let lel = document.getElementById('helmleft')
      let lmc = new Hammer.Manager(lel)

      let Tap3 = new Hammer.Tap({ time: 400 })
      lmc.add(Tap3)
      lmc.on('tap', e => {
        this.$store.dispatch('previousUpgradeMode', this.$router)
      })
    },
    methods: {
      goUni(mode, silent = false) {
        this.$store.commit('startLoading', 'uni')
        this.$router.push('/' + mode)
      },
      goFront(mode) {
        this.$store.commit('startLoading', 'sun')
        this.$router.push('/front/' + mode)
      },
      goHome(taskId) {
        let parents = []
        if (this.$store.getters.contextCard.taskId) {
          parents.push(this.$store.getters.contextCard.taskId)
        }
        this.$store.dispatch('goIn', {
          panel: [this.$store.getters.memberCard.taskId],
          top: 0,
          parents
        })
        if (
          this.$store.state.upgrades.mode === 'doge' &&
          this.$store.getters.contextCard.priorities.length > 0
        ) {
          this.$store.commit('setMode', 1)
        }
        this.$router.push('/' + this.$store.state.upgrades.mode)
      }
    },
    computed: {
      isUni() {
        return this.$store.state.upgrades.dimension === 'unicorn'
      },
      isPepe() {
        return this.$router.currentRoute.path.split('/')[1] === 'grid'
      }
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../styles/colours'
  @import '../styles/grid'
  @import '../styles/tooltips'

  @media only screen and (max-width: 550px) {
    .modeleft, .moderight {
      display: none
    }
  }

  #helm
      cursor: pointer

  .upg
      height: 2em
      pointer-events: none

  .topcenter
      position: fixed
      top: 0
      left: 50%
      transform: translateX(-50%)
      width: 10em
      max-width: 33%
      background: softGray
      color: main
      padding-left: 2em
      padding-right: 2em
      padding-top: .29em
      padding-bottom: .29em
      z-index: 77777
      opacity: 0.71
      border-bottom-left-radius: 50%
      border-bottom-right-radius: 50%
      border-top: none

  .modeleft, .moderight
      position: fixed
      top: 0
      left: calc(50% - 10em)
      opacity: 0.4
      // background: white
      // box-shadow: rgba(255, 255, 255, 0.65) 0px 0px 10px
      background: none
      border: none
      z-index: 153

  .modeleft
      transform: translateX(50%)

  .modeleft.boat
      transform: none

  .moderight
      left: calc(50% + 7.5em)
      transform: translateX(-50%)

  button:focus
      outline: 0

  .closed
      opacity: 1
      position: absolute

  @keyframes flashhalf
      0% { background-color: #9ff; border-color: #aff }
      100% { background-color: softGray; border-color: buttonface }

  @keyframes flash
      // 0% { background-color: softGray; border-color: buttonface }  // this makes the flash start late when there is GUI lag. but looks better.
      0% { background-color: #9ff; border-color: #aff }
      50% { background-color: #9ff; border-color: #aff }
      100% { background-color: softGray; border-color: buttonface }

  .topcenter.flash
      animation-name: flash
      animation-duration: 0.35s
      animation-iteration-count: 1
      transition-timing-function: ease
      transition-property: background-color

  .topcenter.flash.half
      animation-name: flashhalf
      animation-duration: 0.245s

  .topcenter.flash.twice
      animation-duration: 0.1725
      animation-iteration-count: 2

  .topcenter.flash.five
      animation-duration: calc(0.1725 * 5)
      animation-iteration-count: 5

  .topcenter:hover
      background-color: #d3e3e3
</style>
