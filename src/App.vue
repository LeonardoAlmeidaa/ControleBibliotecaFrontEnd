<!-- <template>
  <div class="vh-100 w-100">
    <div class="container-fluid h-100">
      <div class="row h-100 text-bg-dark">
        <TheMenu></TheMenu>
      </div>
    </div>
    <TheToastSuccess ref="toastSuccess" :message="toastMessage" />
  </div>
</template> -->

<template>
  <div>
    <TheMenu></TheMenu>
    <TheToastSuccess ref="toastSuccess" :message="toastMessage" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { get } from '@/crud.js'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import TheMenu from '@/components/general/TheMenu.vue'
import TheToastSuccess from '@/components/formComponents/TheToastSuccess.vue'

export default {
  components: {
    TheMenu,
    TheToastSuccess,
  },

  computed: {
    ...mapState(['logged', 'showToast', 'toastMessage']),
  },

  methods: {
    async checkSession() {
      const rawUser = await get('me')

      if (!rawUser || rawUser == '') return false
      else {
        this.$store.dispatch('setLogged', true)
        this.$store.dispatch('setUser', rawUser)
        return true
      }
    },

    logout() {
      new bootstrap.Toast(this.$refs.toastSuccess.$refs.toastPattern).show()
      this.$store.dispatch('setShowToast', false)
    }
  },

  async mounted() {
    if (!(await this.checkSession())) {
      this.$router.push({ name: 'login' })
    }
  },

  watch: {
    showToast() {
      if (this.showToast) { this.logout() }
    }
  }
}
</script>

<style lang="scss">
@import '@/scss/app.scss';
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

* {
  font-family: 'Poppins', sans-serif !important;
}

.icon_action {
  cursor: pointer;
}
</style>
