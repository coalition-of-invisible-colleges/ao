<template lang="pug">

#frontrecent
  .container(v-if='recentMembers.length > 0')
    h1 Recent
    row(v-for="(m, i) in recentMembers", :m="m"  v-if="showTotal > i")
    img.andThen(@click='andThen'  src='../assets/images/loader.svg')
</template>

<script>
  import Row from './MemberRow'
  export default {
    components: {
      Row
    },
    data() {
      return { showTotal: 11 }
    },
    mounted() {
      this.$store.commit('setMode', 2)
      this.$store.commit('setDimension', 1)
      this.$store.dispatch('loaded')
    },
    methods: {
      andThen() {
        this.showTotal++
      }
    },
    computed: {
      recentMembers() {
        let recentMembers = []
        try {
          recentMembers = this.$store.state.members.slice()
          recentMembers.sort((a, b) => {
            return b.lastUsed - a.lastUsed
          })
        } catch (err) {
          console.log('ddnn wrrk: ', err)
        }
        return recentMembers
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

  .andThen
      height: 3em
      position: relative
      left: 50%
      transform: translateX(-50%)
      cursor: pointer
</style>
