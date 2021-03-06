<template lang="pug">

.memberrow.membershipcard
    bird(v-if='$store.state.upgrades.warp >= 0'  :b='card')
    .row.center.clearboth(:class='{ pullup : $store.state.upgrades.mode !== "boat" && $store.state.upgrades.mode !== "doge" && dukkha >= 1 }')
        img.logindicator(v-if='isLoggedIn', src='../assets/images/loggedIn.svg')
        img.logindicator(v-else, src='../assets/images/loggedOut.svg')
        label.hackername(:class='{ spacer: $store.state.upgrades.mode !== "doge" || $store.getters.contextCard.priorities.length < 1 }') {{ m.name }}
    not-zen(v-if='$store.state.upgrades.mode !== "boat" && dukkha >= 1')
    .bottomleft
      div(@click='goChest')
        img.smallguild(src='../assets/images/chest.svg')
        label.stash {{ card.boost? card.boost.toFixed(2) : 0 }}
            span.padleft(v-if='pointsFromCards > 0') (+{{ pointsFromCards }})
        div(v-if='m.active > 0') active
        div(v-else) inactive
    .bottomright
        div(@click='goBadge')
            img.smallguild(src='../assets/images/badge.svg')
            div.stash {{nameList.length}}
        div(@click='goArchive') {{ deckSize }} cards
    .clearboth
</template>

<script>
  import PreviewDeck from './PreviewDeck'
  import Vouch from './Vouch'
  import Bird from './Bird'
  import NotZen from './NotZen'
  import GiftBox from './GiftBox'

  export default {
    props: ['m'],
    components: { PreviewDeck, Vouch, Bird, NotZen, GiftBox },
    computed: {
      card() {
        return this.$store.getters.hashMap[this.m.memberId]
      },
      isLoggedIn() {
        let isLoggedIn
        this.$store.state.sessions.forEach(s => {
          if (s.ownerId === this.m.memberId) {
            isLoggedIn = true
          }
        })
        return isLoggedIn
      },
      nameList() {
        return this.$store.getters.contextCard.deck.map(mId => {
          return mId
        })
      },
      dukkha() {
        return this.$store.getters.contextCard.priorities.length
      },
      deckSize() {
        return this.$store.state.tasks.filter(t => {
          return t.deck.indexOf(this.m.memberId) >= 0
        }).length
      },
      pointsFromCards() {
        let points = 0
        this.$store.state.tasks.forEach(t => {
          if (t.deck.indexOf(this.m.memberId) === -1) {
            return
          }
          if (
            t.claimed.some(c => {
              return c.indexOf(this.m.memberId) >= 0
            })
          ) {
            if (t.completeValue && t.completeValue > 0) {
              points += t.completeValue
            }
          }
        })
        return points
      }
    },
    methods: {
      goArchive() {
        this.$router.push('/archive')
      },
      goBadge() {
        this.$router.push('/badge')
      },
      goChest() {
        this.$router.push('/chest')
      },
      getName(taskId) {
        let name
        this.$store.state.tasks.some(t => {
          if (taskId === t.taskId) {
            name = t.name
            return true
          }
        })
        return name
      },
      toggleActivated() {
        if (this.m.memberId !== this.$store.getters.member.memberId) {
          return
        }
        if (this.$store.getters.member.active > 0) {
          this.deactivate()
        } else {
          this.activate()
        }
      },
      deactivate() {
        this.$store.dispatch('makeEvent', {
          type: 'member-deactivated',
          memberId: this.$store.getters.member.memberId
        })
      },
      activate() {
        this.$store.dispatch('makeEvent', {
          type: 'member-activated',
          memberId: this.$store.getters.member.memberId
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../styles/colours'
  @import '../styles/tooltips'

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

  .spacer
      margin-bottom: 3em

  .membershipcard
      padding: 1em
      background: rgba(22, 22, 22, 0.2)
      text-align: center
      position: relative

  .smallguild
      height: 2em

  .bottomleft
      float: left
      width: fit-content
      position: relative
      bottom: 0
      left: 0
      cursor: pointer

  .bottomright
      width: fit-content
      right: 1em
      bottom: 0.65em
      float: right
      cursor: pointer

  .stash
      display: inline
      margin-left: 0.5em
      position: relative
      top: -0.35em

  .clearboth
      clear: both

  .title
      cursor: pointer
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

  .membertooltip
      font-size: 0.7em

  ul.left
      text-align: left

  .clearboth
      clear: both

  .pullup
      margin-bottom: -2em

  span.padleft
      margin-left: 0.5em
</style>
