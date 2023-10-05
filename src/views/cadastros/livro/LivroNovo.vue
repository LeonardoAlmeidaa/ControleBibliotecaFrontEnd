<template>
    <div class="m-3">
      <s-title :title="title" :breadcrumb="true"/>
      <div class="card card-body mx-2">
        <form ref="form" @submit.prevent="submitForm" >
          <div class="row">
            <s-input-text
              v-model="object.name"
              ref="name"
              divClass="col-12 col-md-6 col-xxl-6"
              label="Nome"
              placeholder="Nome Livro"
              required
            />
            <s-select
              v-model="object.gender"
              divClass="col-md-3 col-xxl-3"
              label="Gênero"
              :items="genders"
              :clearable="false"
            />
            <s-input-text
              v-model="object.quantityPages"
              ref="quantityPages"
              divClass="col-12 col-md-3 col-xxl-3"
              label="Páginas"
            />
            <s-input-text
              v-model="object.author"
              ref="author"
              divClass="col-12 col-md-6 col-xxl-6"
              label="Autor"
            />
            <s-input-date
              v-model="object.dateAcquisition"
              ref="dateAcquisition"
              divClass="col-12 col-md-3 col-xxl-3"
              label="Data Aquisição"
            />
            <s-select
              v-model="object.status"
              divClass="col-md-3 col-xxl-3"
              label="Status"
              :items="statusData"
              :clearable="false"
            />
            <s-input-textarea 
              v-model="object.obs"
              ref="obs"
              divClass="col-12 col-md-12 col-xxl-12"
              label="Observação"
            />
          </div>
          <div class="row">
            <s-label-required />
          </div>
          <hr />
          <div class="row">
            <div class="col-12 d-flex justify-content-between">
              <div>
                <s-button
                  type="submit"
                  label="Salvar"
                  color="primary"
                  icon="check2"
                />
                <s-button
                  type="button"
                  label="Salvar e Continuar"
                  color="secondary"
                  icon="check2"
                  v-if="!object.id"
                  @click="saveAndKeep"
                />
              </div>
              <div>
                <s-button
                  type="button"
                  label="Cancelar"
                  color="outline-danger"
                  icon="x-lg"
                  @click="$router.back"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <s-modal-error
        ref="modalError"
        modalTitle="Falha ao adicionar o registro !"
        :modalBody="modalBody"
      />
      <s-modal-notlogged
        ref="modalNotLogged"
        @confirm="logout"
      />
    </div>
  </template>
  
  <script>
  import { validateForm } from '@/rule/functions'
  import { insert, getById, update } from '@/crud'
  
  export default {
    name: 'BookNew',
  
    data: () => ({
      object: {},
      valid: false,
      Modal: null,
      modalError: null,
      modalNotLogged: null,
      modalBody: null,
      title: null,
      route: 'book',

      statusData: [
        { label: "Ativo", value: 1 },
        { label: "Inativo", value: 0 },
      ],
      genders: [
        { label: "Ficção Científica", value: "Ficção Científica" },
        { label: "Fantasia", value: "Fantasia" },
        { label: "Mistério", value: "Mistério" },
        { label: "Suspense", value: "Suspense" },
        { label: "Romance", value: "Romance" },
        { label: "Drama", value: "Drama" },
        { label: "Aventura", value: "Aventura" },
        { label: "Histórico", value: "Histórico" },
        { label: "Policial", value: "Policial" },
        { label: "Terror", value: "Terror" },
        { label: "Não Ficção", value: "Não Ficção" },
        { label: "Autoajuda", value: "Autoajuda" },
        { label: "Biografia", value: "Biografia" },
        { label: "Poesia", value: "Poesia" },
        { label: "Quadrinhos", value: "Quadrinhos" },
        { label: "Infantil", value: "Infantil" },
        { label: "Jovem Adulto", value: "Jovem Adulto" },
        { label: "Clássicos", value: "Clássicos" },
        { label: "Filosofia", value: "Filosofia" },
        { label: "Ciência", value: "Ciência" },
        { label: "Técnico", value: "Técnico" },
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
            this.$router.push({ name: 'book'})
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
                this.$store.dispatch('setToastMessage', 'Livro criado com sucesso !')
                this.object = {}
              }
            }
  
            else {
              this.modalBody = result.response.data
              this.modalError.show()
            }
          }
        }
  
        else { this.modalNotLogged.show()}
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
                this.$store.dispatch('setToastMessage', 'Livro alterado com sucesso !')
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
                this.$store.dispatch('setToastMessage', 'Livro criado com sucesso !')
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
  
      logout() { logout(this) }
    },
  
    mounted() {
      this.$route.name == 'bookUpdate' ? this.title = 'Edição de Livro' : this.title = 'Cadastro de Livro'
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