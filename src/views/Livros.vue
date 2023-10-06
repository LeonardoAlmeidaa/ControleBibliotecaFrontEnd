<template>
  <div class="m-3" v-if="!zoom">
    <div class="row">
      <div class="col-12">
        <TheTitle title="Livros" :breadcrumb="true" />
      </div>
    </div>
    <TheFilter @index="handleIndex" @filter="filterAll" @clear="loadItems" name="filterBook" :filters="filterObject" />
    <div class="card card-body mx-2">
      <div class="div row">
        <div class="div col-12">
          <TheTable :headers="headers" :items="items" :totalPages="pages" v-model="actualPage" v-if="!loader">
            <template v-slot:name="{ item }">
              {{ item.name }}
            </template>
            <template v-slot:gender="{ item }">
              {{ item.gender }}
            </template>
            <template v-slot:author="{ item }">
              {{ item.author }}
            </template>
            <template v-slot:quantityPages="{ item }">
              <div class="text-center">
                {{ item.quantityPages }}
              </div>
            </template>
            <template v-slot:dateAcquisition="{ item }">
              <div class="text-center">
                {{ $filters.formatDate(item.dateAcquisition) }}
              </div>
            </template>
            <template v-slot:status="{ item }">
              <div class="text-center">
                <s-chip :color="getStatusColor(item.status)" :text="translateStatusText(item.status)">
                  {{ item.status }}
                </s-chip>
              </div>
            </template>
            <template v-slot:obs="{ item }">
              {{ item.obs }}
            </template>
            <template v-slot:actions="{ item }" v-if="!zoom">
              <div class="text-center">
                <i class="bi bi-pencil-fill text-secondary px-1" style="cursor: pointer" @click="edit(item.id)"></i>
                <i class="bi bi-trash-fill text-danger px-1" style="cursor: pointer" @click="removeConfirm(item)"></i>
              </div>
              <div class="texte-center" v-if="zoom">
                <s-button title="Selecionar" color="primary" type="button" @click="emitSelectedItem(item)"></s-button>
              </div>
            </template>
          </TheTable>
          <TheLoader v-if="loader" />
          <TheButton label="Novo" color="primary" icon="bi bi-plus-lg" @click="$router.push({ name: 'livrosNew' })" />
        </div>
      </div>
    </div>
  </div>
  <TheModalDelete ref="modalDelete" @confirm="remove" />
  <TheModalNotLogged ref="modalNotLogged" @confirm="logout" />
</template>

<script>
import { checkSession, logout } from "@/rule/functions.js";
import { Modal } from "bootstrap";
import { get, remove, update, search } from "@/crud";

export default {
  name: "livros",

  props: {
    zoom: {
      type: Boolean,
      default: false,
    },
    valueZoom: String,
  },

  data: () => ({
    route: "book",
    headers: [
      { title: "Nome", field: "name" },
      { title: "Gênero", field: "gender" },
      { title: "Autor", field: "author" },
      { title: "Páginas", field: "quantityPages" },
      { title: "Aquisição", field: "dateAcquisition" },
      { title: "Status", field: "status" },
      { title: "Ações", field: "actions" },
    ],
    items: [],
    modalNotLogged: null,
    limit: 10,
    pages: null,
    actualPage: null,
    loader: false,

    filterObject: [
      {
        label: "Nome",
        ref: "bookName",
        route: "book",
        subRoute: "by-name",
        param: "name",
        type: "text",
        index: 1,
      },
      {
        label: "Autor",
        ref: "bookAuthor",
        route: "book",
        subRoute: "by-author",
        param: "author",
        type: "text",
        index: 2,
      },
    ],
    filterOption: 1,
    filterParam: null,
  }),

  methods: {
    async loadItems(page = 1) {
      if (await checkSession()) {
        const query = { params: { page: page, limit: this.limit } };
        let raw = [];
        if (this.filterParam) {
          this.filterParam.params.page = page;
          this.filterParam.params.limit = this.limit;
          raw = await search(this.filterParam.route, this.filterParam.params);
        } else {
          raw = await get(this.route, query);
        }
        console.log(raw)
        this.loader = true;
        this.items = raw;
        this.loader = false;
        if (this.items) { this.pages = Math.ceil(raw.total / this.limit); }
      } else {
        this.modalNotLogged.show();
      }
    },

    emitSelectedItem(item) {
      this.$emit("selectedItem", item)
    },

    getStatusColor(status) {
      return status == 1 ? "bg-success" : "bg-danger";
    },

    translateStatusText(status) {
      return status == 1 ? "Ativo" : "Inativo";
    },

    edit(id) {
      const route = {
        name: "livrosUpdate",
        params: { id: id },
      };
      this.$router.push(route);
    },

    async remove() {
      if (await checkSession()) {
        await remove(this.route, this.choosed.id);

        this.$store.dispatch("setShowToast", true);
        this.$store.dispatch(
          "setToastMessage",
          "Usuário excluído com sucesso!"
        );
        this.loadItems();
      } else {
        this.modalNotLogged.show();
      }
    },

    removeConfirm(item) {
      this.choosed = item;
      this.modalDelete.show();
    },

    async filterAll(event) {
      if (await checkSession()) {
        this.filterParam = event;
        this.loadItems(1);
      } else {
        this.modalNotLogged.show();
      }
    },

    handleIndex(event) {
      this.filterOption = event;
    },

    changeHeaders() {
      if (this.filterOption == 1) {
        this.headers = [
          { title: "Nome", field: "name" },
          { title: "Autor", field: "author" },
          { title: "Ações", field: "actions" },
        ];
      } else {
        this.headers = [
          { title: "Autor", field: "author" },
          { title: "Nome", field: "name" },
          { title: "Ações", field: "actions" },
        ];
      }
    },

    logout() {
      logout(this);
    },
  },

  async mounted() {
    await this.loadItems();
    this.modalNotLogged = new Modal(
      this.$refs.modalNotLogged.$refs.modalPattern
    );
    this.modalDelete = new Modal(this.$refs.modalDelete.$refs.modalPattern);
  },

  watch: {
    filterOption() {
      this.loadItems();
      this.changeHeaders();
    },
    actualPage() {
      this.loadItems(this.actualPage);
    },
  },
};
</script>

<style></style>