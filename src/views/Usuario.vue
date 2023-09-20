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
            <template v-slot:name="{ item }">
              {{ item.name }}
            </template>
            <template v-slot:email="{ item }">
              {{ item.email }}
            </template>
            <template v-slot:status="{ item }">
              <TheChip
                :color="getStatusColor(item.status)"
                :text="translateStatusText(item.status)"
              >
                {{ item.status }}
              </TheChip>
            </template>
            <template v-slot:actions="{ item }">
              <div class="text center">
                <i
                  class="bi bi-pencil-fill text-secondary px-1"
                  style="cursor: pointer"
                  @click="edit(item.id)"
                ></i>
                <i
                  class="bi bi-trash-fill text-danger px-1"
                  style="cursor: pointer"
                  @click="removeConfirm(item)"
                ></i>
              </div>
            </template>
          </TheTable>
          <TheLoader v-if="loader" />
          <TheButton
            label="Novo"
            color="primary"
            icon="bi bi-plus-lg"
            @click="$router.push({ name: 'usuariosNew' })"
          />
        </div>
      </div>
    </div>
    <TheModalNotLogged ref="modalNotLogged" @confirm="logout" />
  </div>
</template>

<script>
import { checkSession, logout } from "@/rule/functions";
import { Modal } from "bootstrap";
import { get } from "@/crud";

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