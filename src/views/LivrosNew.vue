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
            placeholder="Nome Livro"
            required
          />
          <TheSelect
            v-model="object.gender"
            ref="select"
            divClass="col-md-3 col-xxl-3"
            label="Gênero"
            :items="genders"
          />
          <TheInput
            v-model="object.quantityPages"
            ref="quantityPages"
            divClass="col-md-3 col-xxl-3"
            label="Quantidade Páginas"
            placeholder="123"
          />
          <TheInput
            v-model="object.author"
            ref="author"
            divClass="col-md-6 col-xxl-6"
            label="Autor"
            placeholder="George Orwell"
          />
          <TheInput
            v-model="object.dateAcquisition"
            ref="dateAcquisition"
            divClass="col-md-3 col-xxl-3"
            label="Data Aquisição"
            :placeholder="$filters.formatDate(Date.now())"
          />
          <TheSelect
            v-model="object.status"
            ref="status"
            divClass="col-md-3 col-xxl-3"
            label="Status"
            :items="items"
            clearable="false"
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
    <TheModalNotLogged ref="modalNotLogged" @confirm="logoud" />
  </div>
</template>

<script>
import { validateForm, checkSession } from "@/rule/functions.js";
import { Modal } from "bootstrap";
import { insert, getById, update } from "@/crud";

export default {
  name: "livrosNew",

  data: () => ({
    object: {},
    items: [
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
    route: "book",
    title: null,
  }),

  methods: {
    async loadItem(id) {
      if (await checkSession()) {
        await getById(this.route, id)
          .then((res) => {
            if (res.status != 1) {
              this.$router.push({ name: "user" });
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
              this.modalError.show();
            } else {
              this.$store.dispatch("setShowToast", true);
              this.$store.dispatch(
                "setToastMessage",
                "Livro criado com sucesso !"
              );
              this.object = {};
            }
          } else {
            this.modalBody = result.response.data;
            this.modalError.show();
          }
        }
      } else {
        this.modalNotLogged.show();
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
              this.modalBody = result.response.data;
              this.modalError.show();
            } else {
              this.$store.dispatch("setShowToast", true);
              this.$store.dispatch(
                "setToastMessage",
                "Livro alterado com sucesso !"
              );
              this.$router.back();
            }
          } else {
            this.modalBody = result.response.data;
            this.modalError.show();
          }
        } else {
          const result = await insert(this.route, this.object);

          if (result.status) {
            if (result.status != "204") {
              this.modalBody = result.response.data;
              this.modalError.show();
            } else {
              this.$store.dispatch("setShowToast", true);
              this.$store.dispatch(
                "setToastMessage",
                "Livro criado com sucesso !"
              );
              this.$router.back();
            }
          } else {
            this.modalBody = result.response.data;
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
    this.$route.name == "livroUpdate"
      ? (this.title = "Edição de Livro")
      : (this.title = "Cadastro de Livros");
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
