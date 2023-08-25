<template>
  <div class="m-3">
    <div class="row">
      <div class="col-12">
        <TheTitle title="Usuários" :breadcrumb="true" />
      </div>
    </div>
    <div class="card card-body mx-2">
      <div class="div row">
        <div class="div col-12">
          <TheTable
            :headers="headers"
            :items="items"
            :totalPages="pages"
            v-model="actualPage"
            v-if="!loader"
          >
          </TheTable>
        </div>
      </div>
    </div>
    <TheModalNotLogged ref="modalNotLogged" @confirm="logout" />
  </div>
</template>

<script>
import { checkSession, logout } from "@/rule/functions";
import { Modal } from "bootstrap";
export default {
  name: "usuarios",

  data: () => ({
    route: "user",
    headers: [
      { title: "Nome", field: "name" },
      { title: "Email", field: "email" },
      { title: "Status", field: "status" },
      { title: "Ações", field: "actions" },
    ],
    items: [],
    modalNotLogged: null,
    limit: null,
    pages: null,
    actualPage: null,
    loader: false,
  }),

  methods: {
    async loadItems(page = 1) {
      if (await checkSession()) {
        const query = {
          params: { page: page, limit: this.limit },
        };
        this.loader = true;
        const raw = await get(this.route, query);
        this.loader = false;
        this.items = raw;
        this.pages = Math.ceil(raw.total / this.limit);
      } else {
        this.modalNotLogged.show();
      }
    },

    getStatusColor(status) {
      return status == 1 ? "bg-success" : "bg-danger";
    },

    translateStatusText(status) {
      return status == 1 ? "Ativo" : "Inativo";
    },

    edit(id) {
      const route = {
        name: "userUpdate",
        params: { id: id },
      };
      this.$router.push(route);
    },

    logout() {
      logout(this);
    },
  },

  async mounted() {
    this.modalNotLogged = new Modal(
      this.$refs.modalNotLogged.$refs.modalPattern
    );

    await this.loadItems();
  },

  watch: {
    actualPage() {
      this.loadItems(this.actualPage);
    },
  },
};
</script>

<style>
</style>