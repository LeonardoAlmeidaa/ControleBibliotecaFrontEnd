<template>
  <h3>Bem Vindo(a)</h3>
  <hr>
  <h5>Dashboard - Livros por Gênero</h5>
  <s-chart-rose :data="data" />
</template>

<script>
import { get } from '@/crud.js'

export default {
  data: () => ({
    data: [
      { value: 40, name: 'Livro 1' },
      { value: 38, name: 'Livro 2 '},
      { value: 32, name: 'Livro 3' },
    ]
  }),

  methods: {
    async loadItems() {
      const raw = await get('book/byGender')
      this.data = raw;
    }
  },

  mounted() {
    this.loadItems()
  },
}
</script>

<style></style>