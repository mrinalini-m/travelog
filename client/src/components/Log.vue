<template>
  <div class="log" :class="$vuetify.breakpoint.xs ? 'mobile' : ''">
    <v-row align="center" justify="center">
      <Alert />
    </v-row>
    <v-row align="center" justify="center">
      <Gallery />
      <Map />
    </v-row>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import Alert from '@/components/Alert'
  import Gallery from '@/components/Gallery/'
  import Map from '@/components/Map'

  export default {
    name: 'Log',
    components: { Alert, Map, Gallery },
    computed: {
      ...mapState('data', ['status'])
    },
    methods: {
      ...mapActions('data', ['upload', 'getGeojson', 'updateWarning'])
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getGeojson()
      })
    },
    mounted() {
      this.updateWarning('')
    }
  }
</script>

<style scoped lang="scss">
  .log {
    overflow: hidden;
    margin: 2rem;
    &.mobile {
      margin: 0.5rem;
    }
  }
</style>
