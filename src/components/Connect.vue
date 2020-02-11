<template lang='pug'>

.Connect.container
    h1 Connections
    connection(v-for='c in $store.state.ao.concat(unmatchedSubs)'  :c='c')
    h3 Connect to another AO:
    form-box(btntxt="connect"  event='ao-connected' v-bind:data='ao')
        label(for="aoAddressInput") address:
        input#aoAddressInput(v-model='ao.address' type='text')
        label(for="aoSecretInput")  connection secret:
        input#aoSecretInput(v-model='ao.secret' type='text')
    .ourinfo
        h2(v-if='!$store.state.cash.alias || $store.state.cash.alias.trim().length < 1') this AO
        h2(v-else) {{ $store.state.cash.alias }}
            span.change(@click='toggleChangeName()') change
        form-box.topspace(v-if='changeName'  btntxt="rename"  event='ao-named'  v-bind:data='aoNamed')
            label(for="aoAliasInput") change ao alias:
            input#aoAliasInput(v-model='aoNamed.alias' type='text')
        h4 Put this information into another AO to allow it to send cards here.
        h4 Address:
            code(v-if='$store.state.cash.alias') {{ $store.state.cash.address }}
            code(v-else) set an alias for this AO to display address
        h4 Connection Secret:
            code {{ $store.state.loader.token }}
</template>

<script>

import FormBox from './FormBox'
import Connection from './Connection'

export default {
    mounted() {
        this.$store.commit('setMode' , 1)
        this.$store.commit('setDimension' , 2)
        this.$store.commit('stopLoading')
    },
    props: ['b', 'inId'],
    components: {
        FormBox,
        Connection,
    },
    data() {
        return {
            aoNamed: {
                type: 'ao-named',
                alias: ''
            },
            ao: {
                type: "ao-connected",
                address: '',
                secret: '',
            },
            changeName: false,
        }
    },
    methods: {
        toggleChangeName() {
            this.changeName = !this.changeName
        },

    },
    computed: {
        unmatchedSubs(){
            let addresses = this.$store.state.ao.map(r => r.address)
            console.log("connected addresses:" , {addresses})
            let un = this.$store.state.cash.subscribed.filter(s => {
                return addresses.indexOf(s.address) === -1
            })
            console.log('unmatched ', un)
            return un
        },
    },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/grid'
@import '../styles/button'
@import '../styles/title'

h2
    text-align: center
    
h6
    text-align: center

label
    color: blue

.count
    float: right

.activated
    border-style: solid
    border-width: thick
    border-color: white

.upgrade
    height: 3em

.task
    color: white
    margin:10px 0
    padding:20px

.btn
    width:100%
    margin-top: 2em
    max-height: 3em

select
    background-color: lightteal

select.form-control
    color: black

.curs
    cursor: pointer;

.birdy
    float: left
    height: .777em
    cursor: pointer

.faded
    opacity: 0.235654

.faded:hover
    opacity: 1

.change
    font-size: 0.9em
    margin-left: 0.5em
    margin-right: 0.5em
    cursor: pointer
    color: blue

code
    word-wrap: break-word
    word-break: break-word

.padleft
    margin-left: 1em

.topspace
    margin-top: 1em

.flex
    display: flex
    flex-wrap: wrap
    flex-basis: 50%
    justify-content: center

@media all and (max-width: 600px)
    .flex
        flex-basis: 100%

.ourinfo
    background: lightGrey
    color: main
    padding: 1em
    border-radius: 1em
    h4
        text-align: center
</style>
