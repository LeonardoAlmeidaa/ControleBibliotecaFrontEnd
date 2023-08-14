<template>
  <div class="row vh-100 vw-100" v-if="!logged">
    <LoginForm />
    <LoginContent />
  </div>
</template>

<script>
import LoginForm from '@/components/login/LoginForm.vue'
import LoginContent from '@/components/login/LoginContent.vue'
import { mapState } from 'vuex'

export default {
  components: {
    LoginForm,
    LoginContent,
  },

  computed: {
    ...mapState(['logged']),
  },
};
</script>

<style></style>