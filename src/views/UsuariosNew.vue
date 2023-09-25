<template>
  <div class="m-3">
    <TheTitle :title="title" :breadcrumb="true" />
    <div class="card card-body mx-2">
      <form ref="form" @submit.prevent="submitForm">
        <div class="row">
          <TheInput
            v-model="object.name"
            ref="name"
            divClass="col-md-6 col-xxl-6"
            label="Nome"
            placeholder="Nome"
            required
          />
          <TheInput
            v-model="object.email"
            ref="email"
            divClass="col-md-6 col-xxl-6"
            label="E-mail"
            placeholder="usuario@usuar.com.br"
            required
          />
          <TheInput
            v-model="object.password"
            ref="password"
            divClass="col-md-6 col-xxl-6"
            label="Senha"
            placeholder="******"
            required
          />
          <TheSelect
            v-model="object.status"
            ref="status"
            divClass="col-md-3 col-xxl-3"
            label="Status"
            :items="items"
            clearable=false
          />
          <TheTextArea
            v-model="object.obs"
            ref="obs"
            divClass="col-12 col-xs-12 col-sm-12 col-md-12 col-xxl-12"
            label="Descrição"
          />
        </div>
        <div class="row">
          <TheRequiredLabel />
        </div>
        <hr />
        <div class="row">
          <div class="col-12 d-flex justify-content-between">
            <div>
              <TheButton
                type="submit"
                label="Salvar"
                color="primary"
                icon="check2"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
    <TheModalError
      ref="modalError"
      modalTitle="Falha ao adicionar o registro."
      :modalBody="modalBody"
    />
    <TheModalNotLogged ref="modalNotLogged" @confirm="logout" />
  </div>
</template>

<script>
import { validateForm, checkSession } from "@/rule/functions.js";
import { Modal } from "bootstrap";
import { insert, getById, update } from "@/crud";

export default {
  name: "usuarioNew",

  data: () => ({
    object: {},
    items: [
      { label: "Ativo", value: 1 },
      { label: "Inativo", value: 0 },
    ],
    route: "user",
    title: null,
  }),

  methods: {
    async loadItem(id) {
      if (await checkSession()) {
        await getById(this.route, id)
          .then((res) => {
            if (res.status != 1) {
              this.$route.push({ name: "user" });
            } else {
              this.object = res;
              if (this.object.status == 1) {
                this.object.status = true;
              } else {
                this.object.status = false;
              }
            }
          })
          .catch((err) => {
            console.error(err);
            this.$router.push({ name: "user" });
          });
      } else {
        this.modalMessage.show();
      }
    },

    async submitForm() {
      if (await validateForm(this.$refs.form)) {
        this.save();
      }
    },

    async saveAndKeep() {
      if (await checkSession()) {
        if (await validateForm(this.$refs.form)) {
          this.object.status
            ? (this.object.status = 1)
            : (this.object.status = 0);

          const result = await insert(this.route, this.object);

          if (result.status) {
            if (result.status != "204") {
              this.modalBody = result.response.data;
              // this.modalError.show();
            } else {
              this.$store.dispatch("setShowToast", true);
              this.$store.dispatch(
                "setToastMessage",
                "Usuário criado com sucesso!"
              );
              this.object = {};
            }
          } else {
            this.modalBody = result.response.data;
            //this.modalError.show();
          }
        } else {
          this.modalNotLogged.show();
        }
      }
    },

    async save() {
      if (await checkSession()) {
        this.object.status
          ? (this.object.status = 1)
          : (this.object.status = 0);

        if (this.object.id) {
          const result = await update(
            this.route,
            this.$route.params.id,
            this.object
          );

          if (result.status) {
            if (result.status != "204") {

              // this.modalError.show();
            } else {
              this.$store.dispatch("setShowToast", true);
              this.$store.dispatch(
                "setToastMessage",
                "Usuário alterado com sucesso !"
              );
              this.$router.back();
            }
          } else {
            this.modalBody = result.response.data;
            // this.modalError.show();
          }
        } else {
          const result = await insert(this.route, this.object);

          if (result.status) {
            if (result.status != "204") {
              this.modalBody = result.response.data[0];
              // this.modalError.show();
            } else {
              this.$route.dispatch("setShowToast", true);
              this.$route.dispatch(
                "setToastMessage",
                "Livro criado com sucesso !"
              );
              this.$router.back();
            }
          } else {
            this.modalBody = result.response.data[0]
            this.modalError.show();
          }
        }
      } else {
        this.modalNotLogged.show();
      }
    },
    logout() {
      logout(this);
    },
  },

  mounted() {
    this.$route.name == "usuarioUpdate"
      ? (this.title = "Edição de Usuário")
      : (this.title = "Cadastro de Usuários");
    this.modalNotLogged = new Modal(
      this.$refs.modalNotLogged.$refs.modalPattern
    );
    this.modalError = new Modal(this.$refs.modalError.$refs.modalPattern);

    !this.object.status ? (this.object.status = 1) : "";
  },

  async created() {
    const id = this.$route.params.id;

    if (id) {
      await this.loadItem(id);
    }
  },
};
</script>

<style></style>
