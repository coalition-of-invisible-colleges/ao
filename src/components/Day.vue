<template lang="pug">
.day
    .date {{ day }}
    router-link(to='/doge')
        img.today(v-if='isToday'  src='../assets/images/uni.svg')
    .tooltip.upgrade(v-for='t in ev')
        img.upgrade(@click="goIn(t.taskId)"  src='../assets/images/timecube.svg'  :class='styl(t.color)')
        .tooltiptext
            .until {{ cardDate(t) }}
            linky(:x='t.name')
        .guild(v-if='t.funderGuild !== "test"') {{ t.funderGuild }}
</template>

<script>
  import _ from 'lodash'
  import Linky from './Linky'

  function getDMY(ts) {
    let d = new Date(ts)
    let day = d.getDate()
    let month = d.getMonth()
    let year = d.getFullYear()
    let hour = d.getHours()
    let minute = d.getMinutes()
    return { day, month, year, hour, minute }
  }

  export default {
    components: { Linky },
    props: ['day', 'month', 'year', 'inId', 'ev', 'isToday'],
    methods: {
      styl(color) {
        if (!color) return
        return {
          redwx: color == 'red',
          bluewx: color == 'blue',
          greenwx: color == 'green',
          yellowwx: color == 'yellow',
          purplewx: color == 'purple',
          blackwx: color == 'black'
        }
      },
      goIn(taskId) {
        let parents = []
        if (this.$store.getters.contextCard.taskId) {
          parents.push(this.$store.getters.contextCard.taskId)
        } else if (this.$store.getters.memberCard.taskId) {
          parents.push(this.$store.getters.memberCard.taskId)
        }
        this.$store.dispatch('goIn', {
          panel: [taskId],
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
      },
      cardDate(b) {
        if (b.book.startTs) {
          let DMY = getDMY(b.book.startTs)
          return (
            DMY.hour +
            ':' +
            DMY.minute.toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGrouping: false
            })
          )
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../styles/colours'
  @import '../styles/tooltips'

  .guild
      color: black
      font-size: 0.5em

  .upgrade
      display: inline
      width: 29%
      cursor: pointer

  .today
      width: 100%
      height: 100%
      cursor: pointer
      opacity: 0.6
      display: inline-block
      position: absolute
      top: 0

  .type
      font-size: .5em
      float: left
      white-space: nowrap;

  .day
      position: relative
      background-color: softGrey
      overflow: visible

  .date
      text-align:right
      height: 1.7em
      margin-top: 0
      margin-bottom:-30px
      font-weight: bolder
      font-size: .9em
      padding: 5px 5px 5px 5px
      float: right
      z-index: 5
      position: relative
      pointer-events: none

  .amount
      font-size: .49em
      position: absolute;
      bottom: 0;
      left: 0;

  .inc
      color: accent2

  .dec
      color: red

  .b
  		text-align: center
  		border-radius: 8%
  		color: main
  		font-size: .8em

  .p
  		background-color: green
  		border-right-style: solid
  		border-color: green
  .c
  		background-color: green
</style>
