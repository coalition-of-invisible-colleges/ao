<template lang="pug">

#theoracle
    h1 Oracle
    hypercard.bounty(v-if='topcard'  :b='topcard'  :key='topcard.taskId'  :c='[topcard.taskId]'  :inId='$store.getters.member.memberId'  @click.capture.stop='goInNews(topcard.taskId)')
    .container
        missions
</template>

<script>
  import Hypercard from './Card'
  import Missions from './Missions'

  export default {
    components: {
      Hypercard,
      Missions
    },
    mounted() {
      this.$store.commit('setMode', 0)
      this.$store.commit('setDimension', 1)
      this.$store.dispatch('loaded')
    },
    methods: {
      goInNews(t) {
        let taskId = t
        let panel = [taskId]
        let top = panel.indexOf(t)
        let parents = [this.$store.getters.member.memberId]

        this.$store.dispatch('goIn', {
          parents,
          top,
          panel
        })

        this.$store.commit('startLoading', 'unicorn')
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
      topcard() {
        let news = []
        this.$store.getters.memberIds.forEach(mId => {
          let member = this.$store.getters.hashMap[mId]
          let lastUsed
          this.$store.state.members.forEach(m => {
            if (m.memberId === mId) {
              lastUsed = m.lastUsed
            }
          })
          if (member && lastUsed) {
            let presence = Date.now() - lastUsed <= 3600000 * 4
            if (presence && member.priorities) {
              member.priorities.forEach(p => {
                let priority = Object.assign({}, this.$store.getters.hashMap[p])
                if (!priority.dogers) {
                  priority.dogers = []
                }
                priority.dogers.push(member.name)
                if (
                  !news.some((sp, i) => {
                    if (sp.taskId === p) {
                      news[i].weight += 1 / member.priorities.length
                      return true
                    }
                    return false
                  })
                ) {
                  priority.weight = 1 / member.priorities.length
                  news.push(priority)
                }
              })
            }
          }
        })
        news = news.filter(c => {
          if (!c.claimed) return true
          return c.claimed.indexOf(this.$store.getters.member.memberId) === -1
        })
        news.sort((a, b) => {
          return b.weight - a.weight
        })
        if (news.length < 1) return
        let ndex = 0
        let subpriorities = news[ndex].priorities.filter(tId => {
          let subpriority = this.$store.getters.hashMap[tId]
          if (!subpriority.claimed) return true
          return (
            subpriority.claimed.indexOf(this.$store.getters.member.memberId) ===
            -1
          )
        })
        if (!news[ndex].guild || subpriorities.length < 1) {
          return news[ndex]
        }
        return this.$store.getters.hashMap[
          subpriorities[subpriorities.length - 1]
        ]
      }
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../styles/colours'
  @import '../styles/skeleton'
  @import '../styles/button'
  @import '../styles/breakpoints'
  @import '../styles/title'

  h1
      color: yellow

  .bounty
      margin-bottom: 2em
      max-width: 30em
      position: relative
      left: 50%
      transform: translateX(-50%)
      margin-top: 10.5em

  .thegoldendoge
      position: absolute
      left: 50%
      transform: translateX(-50%)
      top: 7em
      height: 8em
      z-index: -1
</style>
