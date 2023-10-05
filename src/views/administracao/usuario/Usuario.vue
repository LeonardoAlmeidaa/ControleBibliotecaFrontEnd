<template>
  <div class="m-3">
    <div class="row">
      <div class="col-8">
        <s-title title="Usuários" :breadcrumb="true" />
      </div>
    </div>
    <s-input-filter
      @index="handleIndex"
      @filter="filterAll"
      @clear="loadItems"
      name="filterWorkMeasurement"
      :filters="filterObject"
    />
    <div class="card card-body mx-2">
      <div class="row">
        <div class="col-12">
          <s-table
            v-model="actualPage"
            :headers="headers"
            :items="items"
            :totalPages="pages"
            v-if="!loader"
          >
            <template v-slot:name="{ item }">
              {{ item.name }}
            </template>
            <template v-slot:email="{ item }">
              {{ item.email }}
            </template>
            <template v-slot:status="{ item }">
              <h5 class="text-center">
                <span :class="getStatusColor(item.status)">
                  {{ translateStatusText(item.status) }}
                </span>
              </h5>
            </template>
            <template v-slot:actions="{ item }">
              <div class="text-center">
                <i
                  class="bi bi-lock-fill text-secondary px-1"
                  style="cursor: pointer"
                  @click="showModalUpdatePassword(item)"></i>
                <i
                  class="bi bi-pencil-fill text-secondary px-1"
                  style="cursor: pointer"
                  @click="edit(item.id)"></i>
                <i
                  class="bi bi-trash-fill text-danger px-1"
                  style="cursor: pointer"
                  @click="removeConfirm(item)"></i>
              </div>
            </template>
          </s-table>
        </div>
        <div class="col-12" v-if="!loader">
          <s-button
            type="button"
            label="Novo"
            color="primary"
            icon="plus-lg"
            @click="this.$router.push({ name: 'userNew' })"
          />
        </div>
      </div>
      <!-- <TheLoader v-if="loader" /> -->
    </div>
    <div
      class="modal fade"
      ref="modalUpdatePassword"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-hidden="true"
    >
      <form ref="form" @submit.prevent="submitForm">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header bg-primary">
              <span class="fs-5 text-white">Atualização de Senha</span>
            </div>
            <div class="modal-body text-dark">
              <div class="row">
                <div class="col-12">
                  <s-input-password
                    v-if="selectedItem && user.email === selectedItem.email"
                    v-model="currenntPassword"
                    ref="currenntPassword"
                    divClass="col-12"
                    label="Senha Atual"
                    placeholder="••••••••"
                    required
                  />
                  <s-input-password
                    v-model="object.password"
                    ref="password"
                    divClass="col-12"
                    label="Nova Senha"
                    placeholder="••••••••"
                    required
                  />
                  <s-input-password
                    v-model="passwordConfirm"
                    ref="passwordConfirm"
                    divClass="col-12"
                    label="Confirmação Nova Senha"
                    placeholder="••••••••"
                    required
                  />
                  <div class="row">
                    <s-label-required />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <s-button type="submit" label="Salvar" color="primary" icon="check2" />
              <s-button
                type="button"
                label="Cancelar"
                color="outline-danger"
                icon="x-lg"
                data-bs-dismiss="modal"
                @click="clearData"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
    <s-modal-delete ref="modalDelete" @confirm="remove" />
    <s-modal-notlogged ref="modalNotLogged" @confirm="logout" />
    <s-modal-error ref="modalError" modalTitle="Falha ao atualizar a senha!" :modalBody="modalErrorBody" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { validateForm, logout } from '@/rule/functions.js'
import { get, remove, update, validateCurrentPassword, search } from '@/crud.js'

export default {
  name: 'User',

  data: () => ({
    route: 'user',
    headers: [
      { title: 'Nome', field: 'name' },
      { title: 'E-mail', field: 'email' },
      { title: 'Status', field: 'status' },
      { title: 'Ações', field: 'actions' },
    ],
    items: [],
    object: {},
    passwordConfirm: null,
    currenntPassword: null,
    selectedItem: null,
    Modal: null,
    choosed: null,
    loader: false,
    modalDelete: null,
    modalNotLogged: null,
    modalUpdatePassword: null,
    modalError: null,
    modalErrorBody: null,
    pages: null,
    actualPage: 1,
    limit: 10,

    filterObject: [
      { 
        label: 'Nome', 
        ref: 'userName', 
        route: 'user', 
        subRoute: 'by-name', 
        param: 'name', 
        type: 'text', 
        signal: '',
        operator: 'LIKE',
        index: 1 
      },
      { 
        label: 'E-mail', 
        ref: 'userMail', 
        route: 'user', 
        subRoute: 'by-email', 
        param: 'email', 
        type: 'text', 
        signal: '',
        operator: 'LIKE',
        index: 2 
      },
      {
        label: 'Status',
        ref: 'userStatus',
        route: 'user',
        subRoute: 'by-status',
        param: 'status',
        type: 'select',
        signal: '=',
        operator: 'AND',
        items: [
          { label: 'Ambos', value: '2' },
          { label: 'Ativo', value: '1' },
          { label: 'Inativo', value: '0' },
        ],
        index: 3,
      },
    ],

    filterOption: 1,
    filterParam: null,
  }),

  computed: {
    ...mapState(['user']),
  },

  methods: {
    async loadItems(page = 1) {
      if (await this.$checkSession()) {
        const query = { params: { page: page, limit: this.limit } }
        let raw = []
        if (this.filterParam) {
          this.filterParam.params.page = page
          this.filterParam.params.limit = this.limit
          raw = await search(this.filterParam.route, this.filterParam.params)
        } else {
          raw = await get(this.route, query)
        }
        this.items = raw
        this.pages = Math.ceil(raw.total / this.limit)
      } else {
        this.modalNotLogged.show()
      }
    },

    async submitForm() {
      if (await validateForm(this.$refs.form)) {
        this.save()
      }
    },

    async save() {
      if (this.currenntPassword) {
        const validCurrentUpdateObject = {
          email: this.object.email,
          password: this.currenntPassword,
        }

        const result = await validateCurrentPassword('validatePassword', validCurrentUpdateObject)

        if (result.data) {
          this.updatePassword()
        } else {
          this.modalErrorBody = 'A senha atual informada está incorreta. Por favor, verifique.'
          this.modalError.show()
        }
      } else {
        this.updatePassword()
      }
    },

    async edit(id) {
      const route = {
        name: 'userUpdate',
        params: { id: id },
      }

      this.$router.push(route)
    },

    showModalUpdatePassword(item) {
      this.modalUpdatePassword.show()
      this.object = item
    },

    async updatePassword() {
      if (this.object.password && this.passwordConfirm) {
        if (this.object.password !== this.passwordConfirm) {
          this.modalErrorBody = 'As senhas informadas não são iguais. Por favor, verifique.'
          this.modalError.show()
        } else {
          const validCurrentUpdateObject = {
            name: this.object.name,
            email: this.object.email,
            password: this.object.password,
          }

          const result = await update(this.route, this.object.id, validCurrentUpdateObject)

          if (result.status) {
            if (result.status != '204') {
              this.modaErrorlBody = result.response.data
              this.modalError.show()
            } else {
              this.$store.dispatch('setShowToast', true)
              this.$store.dispatch('setToastMessage', 'Senha alterada com sucesso !')
            }
          } else {
            this.modalErrorBody = result.response.data
            this.modalError.show()
          }
        }

        this.clearData()
        this.modalUpdatePassword.hide()
      }
    },

    async remove() {
      if (await this.$checkSession()) {
        await remove(this.route, this.choosed.id)

        this.$store.dispatch('setShowToast', true)
        this.$store.dispatch('setToastMessage', 'Usuário excluído com sucesso !')
        this.loadItems()
      } else {
        this.modalNotLogged.show()
      }
    },

    removeConfirm(item) {
      this.choosed = item
      this.modalDelete.show()
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

    getStatusColor(status) {
      let text = status ? 'success' : 'danger text-white'
      return `badge rounded-pill text-bg-${text}`
    },

    translateStatusText(status) {
      let text = status ? 'Ativo' : 'Inativo'
      return text
    },

    clearData() {
      this.object.password = null
      this.passwordConfirm = null
      this.selectedItem = null
      this.currenntPassword = null
    },

    changeHeaders() {
      if (this.filterOption == 1) {
        this.headers = [
          { title: 'Nome', field: 'name' },
          { title: 'E-mail', field: 'email' },
          { title: 'Status', field: 'status' },
          { title: 'Ações', field: 'actions' },
        ]
      } else if (this.filterOption == 2) {
        this.headers = [
          { title: 'E-mail', field: 'email' },
          { title: 'Nome', field: 'name' },
          { title: 'Status', field: 'status' },
          { title: 'Ações', field: 'actions' },
        ]
      } else {
        this.headers = [
          { title: 'Status', field: 'status' },
          { title: 'Nome', field: 'name' },
          { title: 'E-mail', field: 'email' },
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
    this.modalError = new this.$Modal(this.$refs.modalError.$refs.modalPattern)
    this.modalUpdatePassword = new this.$Modal(this.$refs.modalUpdatePassword)
    
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
