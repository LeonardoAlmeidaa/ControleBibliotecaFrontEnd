<template>
  <section class="mx-2" >
    <h4>{{ title }}</h4>
    <TheBreadcrumb v-if="breadcrumb"/>
  </section>
</template>

<script>
import TheBreadcrumb from '../general/TheBreadcrumb.vue';

export default {
  props: {
    title: String,
    breadcrumb: Boolean
  },

  components: {
    TheBreadcrumb
  }
}
</script>

<style></style>