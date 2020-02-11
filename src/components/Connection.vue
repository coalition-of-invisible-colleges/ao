<template lang='pug'>

.connection
    .icons
        img.redbirdy(v-if='isWarp' src='../assets/images/birdbtn_red.svg')
        .spacer(v-else)
        img.send(v-if='!isSendOnly && isBroken' src='../assets/images/forwardRed.svg')
        img.send(v-else-if='!isSendOnly && isConnected' src='../assets/images/forwardGreen.svg')
        div(v-else-if='!isSendOnly') error
        .spacer(v-else)
        img.receive(v-if='isSendOnly || isMutual' src='../assets/images/forwardGreen.svg')
    h3(v-if='isConnected') {{ c.state.cash.alias }}
    h3(v-else) {{ c.address }}
    div(v-if='isConnected') {{ c.address }}
    p {{ uptimePercent }}% uptime (of {{ c.successfuls + c.fails }})
    p
        span.conn(@click='pollState()') retry
        span.discon(@click='discon()') delete
</template>

<script>

export default {
    props: ['c'],
    methods: {
        discon() {
            console.log("try diconnection", this.c.address)
            this.$store.dispatch("makeEvent", {
                type: 'ao-disconnected',
                address: this.c.address,
            })
        },
        pollState() {
            console.log("pollstate")
            this.$store.dispatch("makeEvent", {
                type: 'ao-updated',
                address: this.c.address,
            })
        },
    },
    computed: {
        isBroken() {
            return !this.c.state
        },
        isConnected() {
            return this.c.state && this.c.state.cash && this.c.state.cash.alias
        },
        isMutual() {
            return this.$store.state.cash.subscribed.some(s => {
                return s.address === this.c.address
            })
        },
        isSendOnly() {
            return !this.isConnected && this.$store.state.cash.subscribed.some(s => {
                return s.address === this.c.address
            })
        },
        uptimePercent() {
            return ((this.c.successfuls / (this.c.successfuls + this.c.fails)) * 100).toFixed(1)
        },
        isWarp() {
            if(!this.$store.getters.warpDrive || !this.$store.getters.warpDrive.address) return false
            return this.c.address === this.$store.getters.warpDrive.address
        }
    },
}
</script>

<style lang="stylus" scoped>

@import '../styles/colours'

h3
    margin-bottom: 0.5em
    
p
    margin-top: 0.5em
    margin-bottom: 0.5em

.connection
    clear: both
    
.icons
    float: left
    width: 12em
    
.redbirdy, .send, .receive, .spacer
    width: 4em
    
.send
    transform: rotate(-90deg)
    
.receive
    float: right
    transform: rotate(90deg)

.uptime
    margin-top: 0.5em
    
.discon
    cursor: pointer
    color: red

.conn
    margin-top: 0.5em
    cursor: pointer
    color: green
    margin-right: 1em
</style>
