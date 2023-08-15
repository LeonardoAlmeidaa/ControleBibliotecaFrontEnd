
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
      { label: "Inativo", value: 2 },
    ],
    genders: [
      { label: "Ficção Científica", value: 1 },
      { label: "Fantasia", value: 2 },
      { label: "Mistério", value: 3 },
      { label: "Suspense", value: 4 },
      { label: "Romance", value: 5 },
      { label: "Drama", value: 6 },
      { label: "Aventura", value: 7 },
      { label: "Histórico", value: 8 },
      { label: "Policial", value: 9 },
      { label: "Terror", value: 10 },
      { label: "Não Ficção", value: 11 },
      { label: "Autoajuda", value: 12 },
      { label: "Biografia", value: 13 },
      { label: "Poesia", value: 14 },
      { label: "Quadrinhos", value: 15 },
      { label: "Infantil", value: 16 },
      { label: "Jovem Adulto", value: 17 },
      { label: "Clássicos", value: 18 },
      { label: "Filosofia", value: 19 },
      { label: "Ciência", value: 20 },
      { label: "Técnico", value: 21 },
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
    }
  },
};
</script>

<style>
</style>