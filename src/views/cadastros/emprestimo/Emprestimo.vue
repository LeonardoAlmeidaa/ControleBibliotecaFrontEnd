<template>
  <div class="m-3">
    <div class="row">
      <div class="col-8">
        <s-title title="Empréstimo" :breadcrumb="true" />
      </div>
    </div>
    <s-input-filter @index="handleIndex" @filter="filterAll" @clear="loadItems" name="filterWorkMeasurement"
      :filters="filterObject" />
    <div class="card card-body mx-2">
      <div class="row">
        <div class="col-12">
          <s-table v-model="actualPage" :headers="headers" :items="items" :totalPages="pages" v-if="!loader">
            <template v-slot:idUser="{ item }">
              {{ item.userName }}
            </template>
            <template v-slot:idBook="{ item }">
              {{ item.bookName }}
            </template>
            <template v-slot:loanStart="{ item }">
              <div class="text-center">
                {{ $filters.formatDate(item.loanStart) }}
              </div>
            </template>
            <template v-slot:loanEnd="{ item }">
              <div class="text-center">
                {{ $filters.formatDate(item.loanEnd) }}
              </div>
            </template>
            <template v-slot:status="{ item }">
              <div class="text-center">
                <s-chip :color="getStatusColor(item.status)" :text="translateStatusText(item.status)">
                  {{ item.status }}
                </s-chip>
              </div>
            </template>
            <template v-slot:actions="{ item }">
              <div class="text-center">
                <i class="bi bi-pencil-fill text-secondary px-1" style="cursor: pointer" @click="edit(item.id)"></i>
                <i class="bi bi-trash-fill text-danger px-1" style="cursor: pointer" @click="removeConfirm(item)"></i>
              </div>
            </template>
          </s-table>
        </div>
        <div class="col-12" v-if="!loader">
          <s-button type="button" label="Novo" color="primary" icon="plus-lg"
            @click="this.$router.push({ name: 'loanNew' })" />
        </div>
      </div>
      <!-- <TheLoader v-if="loader" /> -->
    </div>
    <s-modal-delete ref="modalDelete" @confirm="remove" />
    <s-modal-notlogged ref="modalNotLogged" @confirm="logout" />
  </div>
</template>
<script>
import { get, remove, search } from '@/crud.js'

export default {
  name: 'Loan',

  data: () => ({
    route: 'loan',
    headers: [
      { title: 'Inicio', field: 'loanStart' },
      { title: 'Fim', field: 'loanEnd' },
      { title: 'Usuário', field: 'idUser' },
      { title: 'Livro', field: 'idBook' },
      { title: 'Status', field: 'status' },
      { title: 'Ações', field: 'actions' },
    ],
    items: [],
    object: {},
    selectedItem: null,
    Modal: null,
    choosed: null,
    loader: false,
    modalDelete: null,
    modalNotLogged: null,
    pages: null,
    actualPage: 1,
    limit: 10,

    filterObject: [
      {
        label: 'Inicio',
        ref: 'startDate',
        route: 'loan',
        subRoute: 'by-start-date',
        param: 'loanStart',
        type: 'date',
        signal: '=',
        operator: '',
        index: 1
      },
      {
        label: 'Fim',
        ref: 'EndDate',
        route: 'loan',
        subRoute: 'by-end-date',
        param: 'loanEnd',
        type: 'date',
        signal: '=',
        operator: '',
        index: 2
      },
      {
        label: 'Usuário',
        ref: 'bookName',
        route: 'book',
        subRoute: 'by-name',
        param: 'name',
        type: 'text',
        signal: '=',
        operator: '',
        index: 3
      },
      {
        label: 'Livro',
        ref: 'bookGender',
        route: 'book',
        subRoute: 'by-gender',
        param: 'gender',
        type: 'text',
        signal: '',
        operator: 'LIKE',
        index: 4
      },
    ],

    filterOption: 1,
    filterParam: null,
  }),

  methods: {
    async loadItems(page = 1) {
      if (await this.$checkSession()) {
        const query = { params: { page: page, limit: this.limit } }
        let raw = []
        if (this.filterParam) {
          this.filterParam.params.page = page
          this.filterParam.params.limit = this.limit
          raw = await search(this.filterParam.route, this.filterParam.params)
          this.items = raw
        } else {
          raw = await get(this.route, query)
          this.items = raw.data
        }
        this.pages = Math.ceil(raw.total / this.limit)
      } else {
        this.modalNotLogged.show()
      }
    },

    async edit(id) {
      console.log(id);
      const route = {
        name: 'loanUpdate',
        params: { id: id },
      }

      this.$router.push(route)
    },

    async remove() {
      if (await this.$checkSession()) {
        await remove(this.route, this.choosed.id)

        this.$store.dispatch('setShowToast', true)
        this.$store.dispatch('setToastMessage', 'Empréstimo excluído com sucesso !')
        this.loadItems()
      } else {
        this.modalNotLogged.show()
      }
    },

    removeConfirm(item) {
      this.choosed = item
      this.modalDelete.show()
    },

    getStatusColor(status) {
      return status == "Ativo" ? "bg-primary" : status == "Finalizado" ? "bg-success" : "bg-danger";
    },

    translateStatusText(status) {
      return status == "Ativo" ? "Ativo" : status == "Finalizado" ? "Finalizado" : "Cancelado";
    },

    async filterAll(event) {
      if (await this.$checkSession()) {
        this.filterParam = event
        this.loadItems(1)
      } else {
        this.modalNotLogged.show()
      }
    },

    handleIndex(event) {
      this.filterOption = event
    },

    changeHeaders() {
      if (this.filterOption == 1) {
        this.headers = [
          { title: 'Inicio', field: 'loanStart' },
          { title: 'Fim', field: 'loanEnd' },
          { title: 'Usuário', field: 'idUser' },
          { title: 'Livro', field: 'idBook' },
          { title: 'Status', field: 'status' },
          { title: 'Ações', field: 'actions' },
        ]
      } else if (this.filterOption == 2) {
        this.headers = [
          { title: 'Fim', field: 'loanEnd' },
          { title: 'Inicio', field: 'loanStart' },
          { title: 'Usuário', field: 'idUser' },
          { title: 'Livro', field: 'idBook' },
          { title: 'Status', field: 'status' },
          { title: 'Ações', field: 'actions' },
        ]
      } else if (this.filterOption == 3) {
        this.headers = [
          { title: 'Usuário', field: 'idUser' },
          { title: 'Inicio', field: 'loanStart' },
          { title: 'Fim', field: 'loanEnd' },
          { title: 'Livro', field: 'idBook' },
          { title: 'Status', field: 'status' },
          { title: 'Ações', field: 'actions' },
        ]
      }
      else {
        this.headers = [
          { title: 'Livro', field: 'idBook' },
          { title: 'Inicio', field: 'loanStart' },
          { title: 'Fim', field: 'loanEnd' },
          { title: 'Usuário', field: 'idUser' },
          { title: 'Status', field: 'status' },
          { title: 'Ações', field: 'actions' },
        ]
      }
    },

    logout() {
      logout(this)
    },
  },

  async mounted() {
    this.modalDelete = new this.$Modal(this.$refs.modalDelete.$refs.modalPattern)
    this.modalNotLogged = new this.$Modal(this.$refs.modalNotLogged.$refs.modalPattern)

    await this.loadItems()
  },

  watch: {
    filterOption() {
      this.filterParam = null
      this.loadItems()
      this.changeHeaders()
    },
    actualPage() {
      this.loadItems(this.actualPage)
    },
  },
}

</script>
<style></style>