<template lang="pug">

.upgrades
    div(v-if='$store.state.cash.info.alias')
        .togglepayments
            img.max(@click='togglePayment(0)'  src='../assets/images/bitcoin.svg'  :class='{thickborder: $store.state.upgrades.payment === "bitcoin"}')
            img.max(@click='togglePayment(1)'  src='../assets/images/lightning.svg'  :class='{thickborder: $store.state.upgrades.payment === "lightning"}')
        div(v-show='$store.state.upgrades.payment === "bitcoin"')
            div(v-if='b.address')
                pay-address(:address='b.address')
        div(v-show='$store.state.upgrades.payment === "lightning"')
            div(v-if='b.bolt11')
                pay-req(:bolt11='b.bolt11')
            span
                label Change amount
                input(v-model='payreqAmount')
            button.submode(@click='invoiceCreate') ♻️
    div.suggest(v-else) no lightning node :(
</template>

<script>
  import calcs from '../calculations'
  import PayAddress from './PayAddress'
  import PayReq from './PayReq'

  export default {
    components: {
      PayReq,
      PayAddress
    },
    mounted() {
      this.$store.commit('setMode', 3)
      this.$store.commit('setDimension', 0)
      this.$store.dispatch('loaded')
    },
    data() {
      return {
        payreqAmount: 1
      }
    },
    methods: {
      togglePayment(x) {
        let payModes = ['bitcoin', 'lightning']
        if (this.$store.state.upgrades.payment === payModes[x]) {
          this.$store.commit('closePayMode')
          return
        }
        this.$store.commit('setPayMode', x)
        if (x === 0) {
          if (!this.$store.getters.contextCard.address) {
            this.$store.dispatch('makeEvent', {
              type: 'address-updated',
              taskId: this.$store.getters.contextCard.taskId
            })
          }
        }
        if (x === 1) {
          this.invoiceCreate()
        }
      },
      invoiceCreate() {
        let spot = this.$store.state.cash.spot
        let amount
        if (!spot) {
          amount = parseInt(this.payreqAmount)
        } else {
          amount = calcs.cadToSats(this.payreqAmount, spot)
        }
        this.$store.dispatch('makeEvent', {
          type: 'invoice-created',
          taskId: this.b.taskId,
          amount,
          label: '<3'
        })
      }
    },
    computed: {
      b() {
        return this.$store.getters.contextCard
      },
      addressUpdate() {
        return {
          type: 'address-updated',
          taskId: this.b.taskId
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../styles/colours'
  @import '../styles/skeleton'
  @import '../styles/grid'
  @import '../styles/button'
  @import '../styles/tooltips'
  @import '../styles/spinners'

  .thickborder
      background: main

  .marg
      margin-right: 1.97em

  .upgrades
      width: 100%

  .smallbox
      width: 4em
      margin-bottom: 1em

  .togglepayments
      margin: 0
      padding: 1em 0 1em 0
      text-align: center
      img
          margin: 0 3em 0 3em
          padding: .77em

  .submode
      height: 6em
      width: 6em
      margin-bottom: 1em
      margin-top: 1em
      background-color: rgba(0, 0, 0, 0)

  .max
      margin: 3em
      height: 5.3333em
      width: 5.333em

  .suggest
      color: rgba(255, 255, 255, 0.4)
      font-style: italic
      font-size: 1.2em
      text-align: center
</style>
