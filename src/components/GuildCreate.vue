<template lang="pug">

.guildcreate
    input(v-model='task.guild'  type='text'  placeholder='code name'  @keypress.enter='titleIt(false)')
    button(@click='titleIt') {{ detectRename }}
</template>

<script>
  export default {
    props: ['b'],
    data() {
      return {
        task: {
          guild: this.b.guild ? this.b.guild : ''
        }
      }
    },
    methods: {
      titleIt(clear = true) {
        if (this.b.guild === this.task.guild) {
          if (!clear) {
            this.$emit('closeit')
            return
          }
          this.task.guild = ''
          this.$store.dispatch('makeEvent', {
            type: 'task-guilded',
            taskId: this.b.taskId,
            guild: false
          })

          this.$emit('closeit')
          return
        }
        this.$emit('closeit')

        this.$store.dispatch('makeEvent', {
          type: 'task-guilded',
          taskId: this.b.taskId,
          guild: this.task.guild
        })
      }
    },
    computed: {
      detectRename() {
        if (this.b.guild === this.task.guild) {
          return 'clear'
        } else if (this.b.guild && this.task.guild) {
          return 'rename'
        }
        return 'mission'
      }
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../styles/button'
  @import '../styles/input'

  button
      width: 90%

  .guildcreate
      background: transparent
      padding: 0
      color: white
      height: 2.2em

  .guildcreate button
      width: 40%
      height: 2.2em
      padding: 0

  .guildcreate input
      border-color: rgba(22, 22, 22, 1)
      border-width: 1px
      background-color: rgba(22, 22, 22, 0.3)
      height: 2.2em
      width: 60%
</style>
