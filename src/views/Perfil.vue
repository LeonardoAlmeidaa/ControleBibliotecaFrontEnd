<template>
  <div class="m-3">
    <div class="row">
      <div class="col-8">
        <TheTitle title="Meu Perfil" :breadcrumb="true"/>
      </div>
    </div>
    <div class="card card-body mx-2">
      <form ref="form" @submit.prevent="submitForm">
        <div class="row">
          <div class="col-6">
            <TheInput
              v-model="object.name"
              ref="myName"
              label="Nome"
              required
            />
          </div>
          <div class="col-6">
            <TheInputEmail
              v-model="object.email"
              ref="myEmail"
              label="E-mail"
              :isDisabled="true"
            />
          </div>
        </div>
        <hr class="border border-1"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <div>
            <TheButton
              type="submit"
              color="primary"
              label="Salvar"
              icon="check2"
            />
            <TheButton
              type="button"
              color="primary"
              label="Alterar senha"
              icon="bi bi-lock-fill"
              @click="showModalUpdatePassword()"
            />
          </div>
          <div>
            <!-- <TheButton
              type="button"
              label="Cancelar"
              color="outline-danger"
              icon="x-lg"
              @click="$router.back"
            /> -->
          </div>
        </div>
      </div>
      </form>
      <div class="modal fade" ref="modalUpdatePassword" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
      <form ref="form" @submit.prevent="submitFormPassword">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header bg-primary">
              <span class="fs-5 text-white">Atualização de Senha</span>
            </div>
            <div class="modal-body text-dark">
              <div class="row">
                <div class="col-12">
                  <TheInputPassword
                    v-model="currenntPassword"
                    ref="currenntPassword"
                    divClass="col-12"
                    label="Senha Atual"
                    placeholder="••••••••"
                    required
                  />
                  <TheInputPassword
                    v-model="object.password"
                    ref="password"
                    divClass="col-12"
                    label="Nova Senha"
                    placeholder="••••••••"
                    required
                  />
                  <TheInputPassword
                    v-model="passwordConfirm"
                    ref="passwordConfirm"
                    divClass="col-12"
                    label="Confirmação Nova Senha"
                    placeholder="••••••••"
                    required
                  />
                  <div class="row">
                    <TheRequiredLabel />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <TheButton
                type="submit"
                label="Alterar"
                color="primary"
                icon="check2"
              />
              <TheButton
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
    </div>
    <TheModalError
      ref="modalError"
      modalTitle="Falha ao alterar perfil !"
      :modalBody="modalBody"
    />
    <TheModalNotLogged
      ref="modalNotLogged"
      @confirm="logout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { validateForm, checkSession, logout } from '@/rule/functions.js'
import { getById, update, validateCurrentPassword } from '@/crud.js'
import { Modal } from 'bootstrap'

export default {
  name: 'MyProfile',

  data: () => ({
    route: 'user',

    headers: ['Nome', 'E-mail', 'Status', 'Ações'],
    object: {},
    passwordConfirm: null,
    currenntPassword: null,
    modalUpdatePassword: null,

    modalError: null,
    modalNotLogged: null,
    modalBody: null,
  }),

  computed: {
    ...mapState(['user']),
  },

  methods: {
    async loadItem() {
      if (await checkSession()) {
        await getById(this.route, this.user.id)
        .then((res) => {
          this.object = res
          if (this.object.status == 1) {
            this.object.status = true
          }

          else {
            this.object.status = false
          }
        })
        .catch((err) => {
          this.$router.push({ name: "myProfile" })
        })
      }

      else { this.modalNotLogged.show() }
    },

    async submitForm() {
      if (await validateForm(this.$refs.form)) { this.save() }
    },

    async save() {
      if (this.user.id) {
        const updatedObject = { name: this.object.name }

        const result = await update(this.route, this.user.id, updatedObject)

        if (result.status) {
          if (result.status != '204') {
            this.modalBody = result.response.data
            this.modalError.show()
          }

          else {
            this.$store.dispatch('setShowToast', true)
            this.$store.dispatch('setToastMessage', 'Dados alterados com sucesso !')
            await this.loadItem()
          }
        }

        else {
          this.modalBody = result.response.data
          this.modalError.show()
        }
      }
    },

    async submitFormPassword() {
      if (await validateForm(this.$refs.form)) { this.savePassword() }
    },

    async savePassword() {
      if (this.currenntPassword) {
        const validCurrentUpdateObject = {
          email: this.object.email,
          password: this.currenntPassword
        }

        const result = await validateCurrentPassword('validatePassword', validCurrentUpdateObject)

        if (result.data) {
          this.updatePassword()
        }

        else {
          this.modalErrorBody = "A senha atual informada está incorreta. Por favor, verifique."
          this.modalError.show()
        }
      }

      else {
        this.updatePassword()
      }
    },

    async updatePassword() {
      if (this.object.password && this.passwordConfirm) {
        if (this.object.password !== this.passwordConfirm) {
          this.modalErrorBody = "As senhas informadas não são iguais. Por favor, verifique."
          this.modalError.show()
        }

        else {
          const updatedObject = {
            password: this.object.password,
          }

          const result = await update(this.route, this.user.id, updatedObject)

          if (result.status) {
            if (result.status != '204') {
              this.modaErrorlBody = result.response.data
              this.modalError.show()
            }

            else {
              this.$store.dispatch('setShowToast', true)
              this.$store.dispatch('setToastMessage', 'Senha alterada com sucesso !')
            }
          }

          else {
            this.modalErrorBody = result.response.data
            this.modalError.show()
          }
        }

        this.clearData()
        this.modalUpdatePassword.hide()
      }
    },

    showModalUpdatePassword() {
      this.modalUpdatePassword.show()
    },

    clearData() {
      this.object.password = null
      this.passwordConfirm = null
      this.currenntPassword = null
    },

    logout() { logout(this) },
  },

  async mounted() {
    this.modalError = new Modal(this.$refs.modalError.$refs.modalPattern)
    this.modalNotLogged = new Modal(this.$refs.modalNotLogged.$refs.modalPattern)
    this.modalUpdatePassword = new Modal(this.$refs.modalUpdatePassword)
  },

  async created() {
     await this.loadItem(this.user.id)
  },
}
</script>

<style></style>