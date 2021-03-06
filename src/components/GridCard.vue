<template lang="pug">
.meme(:class="cardInputSty"  ref="gridSquare")
    .hint(v-if='!isSelected && !taskId') click to type / search or drop file
    .hint(v-if='!isSelected && card') replace
    textarea(v-if='isSelected'  v-model='debouncedName' type='text'  :class='cardInputSty'  placeholder="type or search"  @keyup.enter.exact='createGridMeme'  @keydown.enter.exact.prevent  @keyup.esc='closeCreate'  @input='exploring = false' row='10' col='20'  ref='gridText'  :key='searchResult')
    linky.toTop.hideonhover(:x='card.name' v-if='!dogeName && !isSelected')
    .dogename.hideonhover(v-else) {{ dogeName }}
    template.hideonhover(v-if="card && card.name")
        .agedbackground.freshpaper.hideonhover(v-if='cardAge < 8')
        .agedbackground.weekoldpaper.hideonhover(v-else-if='cardAge < 30')
        .agedbackground.montholdpaper.hideonhover(v-else-if='cardAge < 90')
        .agedbackground.threemontholdpaper.hideonhover(v-else='cardAge >= 90')
    .scrollbarwrapper(v-show='showCreate && task.search.length >= 2 && (matchCards.guilds.length + matchCards.doges.length + matchCards.cards.length) > 0'  v-model='task.search')
        .searchresults
            .result(v-for='t in matchCards.guilds'  @click.stop='debounce(loadResult, 500, [t])'  :class='resultInputSty(t)'  @dblclick.stop='goIn(t.taskId)')
                img.smallguild(src='../assets/images/badge.svg')
                span {{ t.guild }}
                div {{ shortName(t.name) }}
            .result(v-for='t in matchCards.doges'  @click.stop='debounce(loadResult, 500, [t])'  :class='resultInputSty(t)'  @dblclick.stop='goIn(t.taskId)')
                current(:memberId='t.taskId')
            .result(v-for='t in matchCards.cards'  @click.stop='debounce(loadResult, 500, [t])'  :class='resultInputSty(t)'  @dblclick.stop='goIn(t.taskId)') {{ shortName(t.name) }}
</template>

<script>
  import Linky from './Linky'
  import calculations from '../calculations'
  import Hammer from 'hammerjs'
  import Propagating from 'propagating-hammerjs'
  import Vue from 'vue'
  import request from 'superagent'

  export default {
    props: ['x', 'y'],
    components: { Linky },
    data() {
      return {
        showCreate: false,
        task: {
          name: '',
          color: 'green'
        },
        swipeTimeout: 0,
        exploring: false,
        inDebounce: false
      }
    },
    mounted() {
      var el = this.$refs.gridSquare
      if (!el) return
      let mc = Propagating(new Hammer.Manager(el))
      let singleTap = new Hammer.Tap({ event: 'singletap', time: 400 })
      var swipe = new Hammer.Swipe()
      mc.add([singleTap, swipe])

      mc.on('singletap', e => {
        this.openCreate()
        e.stopPropagation()
      })
      mc.on('swipeleft', e => {
        if (Date.now() - this.swipeTimeout > 100) {
          this.previousColor()
          this.swipeTimeout = Date.now()
        }
      })

      mc.on('swiperight', e => {
        if (Date.now() - this.swipeTimeout > 100) {
          this.nextColor()
          this.swipeTimeout = Date.now()
        }
      })
    },
    methods: {
      createGridMeme() {
        if (this.$store.state.loader.connected !== 'connected') return
        let foundId = this.matchCard
        let potentialCard = this.task.name.trim()
        if (!foundId) {
          console.log('card not found')
          request
            .post('/events')
            .set('Authorization', this.$store.state.loader.token)
            .send({
              type: 'task-created',
              name: potentialCard,
              color: this.task.color,
              deck: [this.$store.getters.member.memberId],
              inId: this.$store.getters.memberCard.taskId
            })
            .then(res => {
              console.log('then')
              const taskId = JSON.parse(res.text).event.taskId
              this.$store.dispatch('makeEvent', {
                type: 'grid-add',
                taskId,
                coord: {
                  x: this.$store.state.upgrades.grid.selX,
                  y: this.$store.state.upgrades.grid.selY
                }
              })
              console.log('done with gridAdd: ', taskId)
            })
            .catch(err => {
              console.log('task-create ERR', err)
            })
        } else {
          this.$store.dispatch('makeEvent', {
            type: 'grid-add',
            taskId: foundId,
            coord: {
              x: this.$store.state.upgrades.grid.selX,
              y: this.$store.state.upgrades.grid.selY
            }
          })
        }
        this.resetCard()
      },
      switchColor(color, refocus = true) {
        if (this.task.color === color) {
          this.showCreate = !this.showCreate
        } else if (this.showCreate) {
          // don't close, switch
        } else {
          this.showCreate = !this.showCreate
        }
        this.task.color = color
        if (refocus) {
          setTimeout(() => {
            document.getElementById('cardbox').focus()
          }, 1)
        }
      },
      resetCard() {
        this.task.name = ''
        this.closeCreate()
      },
      nextColor() {
        let colors = ['red', 'yellow', 'green', 'purple', 'blue']
        let color = colors.indexOf(this.task.color)
        color++
        this.switchColor(colors[color > 4 ? 0 : color], false)
      },
      previousColor() {
        let colors = ['red', 'yellow', 'green', 'purple', 'blue']
        let color = colors.indexOf(this.task.color)
        color--
        this.switchColor(colors[color < 0 ? 4 : color], false)
      },
      openCreate() {
        this.$store.commit('selectGridMeme', { x: this.x, y: this.y })
        setTimeout(() => {
          this.$refs.gridText.focus()
        }, 1)
      },
      closeCreate() {
        this.$store.commit('selectGridMeme', { x: false, y: false })
      },
      debounce(func, delay) {
        const context = this
        const args = arguments
        clearTimeout(this.inDebounce)
        this.inDebounce = setTimeout(() => func.apply(context, args[2]), delay)
      }
    },
    computed: {
      taskId() {
        // console.log("taskId function x is ", this.x, " y ", this.y)
        if (
          this.$store.state.grid[this.y] &&
          this.$store.state.grid[this.y][this.x]
        ) {
          return this.$store.state.grid[this.y][this.x]
        }
        return false
      },
      card() {
        if (!this.taskId) return false
        return this.$store.getters.hashMap[this.taskId]
      },
      dogeName() {
        let mc
        this.$store.state.members.forEach(m => {
          if (this.taskId === m.memberId) {
            mc = m
          }
        })
        return mc && mc.name ? mc.name : false
      },
      isSelected() {
        return (
          this.$store.state.upgrades.grid.selX === this.x &&
          this.$store.state.upgrades.grid.selY === this.y
        )
      },
      debouncedName: {
        get() {
          console.log(
            'debouncedName Get function. searchResult is ',
            this.$store.state.upgrades.searchResult
          )
          if (this.$store.state.upgrades.searchResult) {
            console.log('there is a search result', this.searchResult)
            this.task.name = this.$store.getters.hashMap[this.searchResult].name
            this.task.color = this.$store.getters.hashMap[
              this.searchResult
            ].color
            console.log('this.task.name set to ', this.task.name)
            this.$store.commit('searchSelectionReceived')
            setTimeout(() => {
              this.$refs.gridText.focus()
            }, 1)
          }
          return this.task.name
        },
        set(newValue) {
          this.task.name = newValue
          this.debounce(() => {
            this.$store.commit('search', newValue)
          }, 400)
        }
      },
      cardInputSty() {
        if (this.card && this.card.color) {
          return calculations.cardColorCSS(this.card.color)
        } else if (this.isSelected) {
          return calculations.cardColorCSS(this.task.color)
        }
      },
      matchCard() {
        let foundId
        this.$store.state.tasks.filter(t => {
          if (t.name === this.task.name.trim()) {
            foundId = t.taskId
          }
        })
        return foundId
      },
      cardAge() {
        let now = Date.now()
        let msSince = now - this.card.timestamp
        let days = msSince / (1000 * 60 * 60 * 24)
        return days
      },
      searchResult() {
        console.log(
          'searchResult function, result is  ',
          this.$store.state.upgrades.searchResult
        )
        return this.$store.state.upgrades.searchResult
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .meme
    overflow-wrap: break-word
    word-wrap: break-word
    word-break: break-word
    hyphens: auto
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
    max-height:100%
    max-width:100%
    position: relative
    cursor: pointer

  .linky
    max-height: 15em
    max-width: 15em
    object-fit: fill
    color: white

  .linky .noheight
    max-height: 15em

  .hint
    visibility: hidden
    position: absolute
    top: 50%
    width: 100%
    transform: translateY(-50%)
    color: grey
    font-size: 1.25vw
    text-align: center
    z-index: 75

  .meme:hover > .hint
    visibility: visible
    pointer-events: none

  .meme:hover .hideonhover
    visibility: hidden

  .meme:hover
    background-color: rgba(28, 78, 176, 0.75)

  .meme.selected
    background-color: rgba(39, 107, 22, 0.75)

  textarea
    width: 100%
    height: 100%
    position: absolute
    border: none
    resize: none
    text-align: center
    z-index: 2
    color: white

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

  .freshpaper
      background-image: url('/paper.jpg')
      opacity: 0.2

  .weekoldpaper
      background-image: url('/paper_aged_1.png')
      opacity: 0.25

  .montholdpaper
      background-image: url('/paper_aged_2.png')
      opacity: 0.3

  .threemontholdpaper
      background-image: url('/paper_aged_3.png')
      opacity: 0.35

  .toTop
      z-index: 1

  .dogename
      color: white

  .scrollbarwrapper
      width: 37vw
      height: calc(100% - 2em)
      position: fixed
      top: 0
      left: 22em
      background: rgba(22, 22, 22, 0.8)
      padding: 1em 0
      border-radius: 20px

  @media only screen and (max-width: 68em)
      .scrollbarwrapper
          width: 100%
          position: absolute
          top: calc(-100% - 0.5em)
          left: 0

  .searchresults
      overflow: auto
      color: white
      font-size: 1.1em
      height: 100%
      padding: 0 1em
      word-wrap: break-word

  ::-webkit-scrollbar
      background-color: rgba(22, 22, 22, 0.4)

  ::-webkit-scrollbar-thumb
      background-color: rgba(89, 89, 89, 0.4)

  ::-webkit-scrollbar-thumb:hover
      background-color: rgba(255, 255, 255, 0.75)

  .result
      margin-bottom: 0.3em
      cursor: pointer

  .smallguild
      height: 1em
      margin-right: 0.3em
      position: relative
      top: 0.16em

  .guildname
      font-weight: bold

  .current.result
      display: block
</style>
