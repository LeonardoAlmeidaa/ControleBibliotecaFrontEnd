<template>
  <div class="m-3">
    <s-title :title="title" :breadcrumb="true" />
    <div class="card card-body mx-2">
      <form ref="form" @submit.prevent="submitForm">
        <div class="row">
          <!-- Usuário -->
          <s-input-zoom v-model="object.idUser" ref="idUser" divClass="col-12 col-md-1 col-xxl-1" label="Usuário">
            <template #default>
              <Usuario :zoom="true" @selectedItem="handleSelectedUser"/>
            </template>
          </s-input-zoom>
          <s-input-text v-model="nameUser" ref="nameUser" divClass="col-12 col-md-5 col-xxl-5" label="Nome"
            :isDisabled="true" />
          <!-- Livro -->
          <s-input-zoom v-model="object.idBook" ref="idBook" divClass="col-12 col-md-1 col-xxl-1" label="Livro">
            <template #default>
              <Livro :zoom="true" @selectedItem="handleSelectedBook"/>
            </template>
          </s-input-zoom>
          <s-input-text v-model="nameUser" ref="nameBook" divClass="col-12 col-md-5 col-xxl-5" label="Nome"
            :isDisabled="true" />
          <!-- <s-input-text v-model="object.name" ref="name" divClass="col-12 col-md-6 col-xxl-6" label="Usuário"
            placeholder="Usuário" required /> -->
        </div>
        <div class="row">
          <s-label-required />
        </div>
        <hr />
        <div class="row">
          <div class="col-12 d-flex justify-content-between">
            <div>
              <s-button type="submit" label="Salvar" color="primary" icon="check2" />
              <s-button type="button" label="Salvar e Continuar" color="secondary" icon="check2" v-if="!object.id"
                @click="saveAndKeep" />
            </div>
            <div>
              <s-button type="button" label="Cancelar" color="outline-danger" icon="x-lg" @click="$router.back" />
            </div>
          </div>
        </div>
      </form>
    </div>
    <s-modal-error ref="modalError" modalTitle="Falha ao adicionar o registro !" :modalBody="modalBody" />
    <s-modal-notlogged ref="modalNotLogged" @confirm="logout" />
  </div>
</template>
<script>

import Usuario from '@/views/Usuario.vue'
import Livro from '../livro/Livro.vue'
import { validateForm } from '@/rule/functions'
import { insert, getById, update } from '@/crud'

export default {
  name: 'LoanNew',

  components: {
    Usuario,
    Livro
  },

  data: () => ({
    object: {},
    valid: false,
    Modal: null,
    modalError: null,
    modalNotLogged: null,
    modalBody: null,
    title: null,
    route: 'loan',
    nameUser: null,

    statusData: [
      { label: "Ativo", value: 1 },
      { label: "Inativo", value: 0 },
    ],
  }),
  methods: {
    async loadItem(id) {
      if (await this.$checkSession()) {
        await getById(this.route, id)
          .then((res) => {
            this.object = res
          })
          .catch((err) => {
            console.error(err)
            this.$router.push({ name: 'loan' })
          })
      }

      else { this.modalMessage.show() }
    },

    async submitForm() {
      if (await validateForm(this.$refs.form)) { this.save() }
    },

    async saveAndKeep() {
      if (await this.$checkSession()) {
        if (await validateForm(this.$refs.form)) {
          this.object.status ? this.object.status = 1 : this.object.status = 0

          const result = await insert(this.route, this.object)

          if (result.status) {
            if (result.status != '204') {
              this.modalBody = result.response.data
              this.modalError.show()
            }

            else {
              this.$store.dispatch('setShowToast', true)
              this.$store.dispatch('setToastMessage', 'Empréstimo criado com sucesso !')
              this.object = {}
            }
          }

          else {
            this.modalBody = result.response.data
            this.modalError.show()
          }
        }
      }

      else { this.modalNotLogged.show() }
    },

    async save() {
      if (await this.$checkSession()) {
        this.object.status ? this.object.status = 1 : this.object.status = 0

        if (this.object.id) {

          const newObj = {
            name: this.object.name,
            gender: this.object.gender,
            author: this.object.author,
            quantityPages: this.object.quantityPages,
            status: this.object.status,
            dateAcquisition: this.object.dateAcquisition,
          }

          const result = await update(this.route, this.$route.params.id, newObj)

          if (result.status) {
            if (result.status != '204') {
              this.modalBody = result.response.data
              this.modalError.show()
            }

            else {
              this.$store.dispatch('setShowToast', true)
              this.$store.dispatch('setToastMessage', 'Empréstimo alterado com sucesso !')
              this.$router.back()
            }
          }

          else {
            this.modalBody = result.response.data
            this.modalError.show()
          }
        }

        else {
          const result = await insert(this.route, this.object)

          if (result.status) {
            if (result.status != '204') {
              this.modalBody = result.response.data
              this.modalError.show()
            }

            else {
              this.$store.dispatch('setShowToast', true)
              this.$store.dispatch('setToastMessage', 'Empréstimo criado com sucesso !')
              this.$router.back()
            }
          }

          else {
            this.modalBody = result.response.data
            this.modalError.show()
          }
        }
      }

      else { this.modalNotLogged.show() }
    },

    handleSelectedUser(item) {
      this.$refs.idUser.modalZoom.hide()
      this.object.idUser = item.id.toString()
      this.nameUser = item.name
    },

    handleSelectedBook(item) {
      this.$refs.idBook.modalZoom.hide()
      this.object.idBook = item.id.toString()
      this.nameBook = item.name
    },

    logout() { logout(this) }
  },

  mounted() {
    this.$route.name == 'loanUpdate' ? this.title = 'Edição de Empréstimo' : this.title = 'Cadastro de Empréstimo'
    this.modalNotLogged = new this.$Modal(this.$refs.modalNotLogged.$refs.modalPattern)
    this.modalError = new this.$Modal(this.$refs.modalError.$refs.modalPattern)
  },

  async created() {
    const id = this.$route.params.id

    if (id) { await this.loadItem(id) }
  },
}

</script>
<style></style>