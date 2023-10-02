<template>
  <div class="card card-body mx-2 mb-3">
    <div class="row">
      <div class="col-1">
        <h5>Filtro:</h5>
      </div>

      <div class="col-10">
        <TheRadio
          v-for="filter in filters"
          :key="filter.value"
          :name="name"
          :value="filter.index"
          :label="filter.label"
          v-model="option"
          :inputId="filter.label"
          @clicked="filterToggle = true"
        />
      </div>

      <div class="col-1 text-end">
        <i
          :class="
            filterToggle
              ? 'bi bi-chevron-up icon h4'
              : 'bi bi-chevron-down icon h4'
          "
          @click="toggleFilter"
        ></i>
      </div>

      <hr class="border border-1" />
    </div>

    <TheTransition>
      <div class="row align-items-center" v-if="filterToggle">
        <div class="col-xs-9 col-sm-9 col-md-9 col-xxl-9">
          <TheInput
            v-if="object.type == 'text'"
            v-model="inputValue"
            :ref="object.ref"
            :label="object.label"
            @enter="filterAll"
          />

          <TheSelect
            v-else-if="object.type == 'select'"
            :items="object.items"
            v-model="inputValue"
            :ref="object.ref"
            :label="object.label"
          />

          <!-- <TheDateRange

              v-else-if="object.type == 'range'"

              v-model="inputValue"

              :ref="object.ref"

              :label="object.label"

            /> -->

          <TheDate
            v-else
            v-model="inputValue"
            :ref="object.ref"
            :label="object.label"
          />
        </div>

        <div class="col-xs-3 col-sm-3 col-md-3 col-xxl-3 mt-2 text-end">
          <TheButton
            type="button"
            color="primary"
            label="Buscar"
            icon="bi bi-search"
            @click="emitConfirm"
          />

          <TheButton
            type="button"
            color="outline-danger"
            label="Limpar"
            icon="bi bi-x-lg"
            @click="emitClear"
          />
        </div>
      </div>
    </TheTransition>

    <TheModalNotLogged ref="modalNotLogged" @confirm="logout" />
  </div>
</template>



<script>
import { defineComponent } from "vue";

import { checkSession, logout } from "@/rule/functions.js";

import { get, search } from "@/crud.js";

import { Modal } from "bootstrap";

export default defineComponent({
  name: "TheFilter",

  props: {
    name: String,

    filters: Array,
  },

  data: () => ({
    option: null,

    inputValue: null,

    object: {},

    items: [],

    modalNotLogged: null,

    refArray: [],

    filterToggle: false,
  }),

  methods: {
    async loadItems() {
      if (await checkSession()) {
        this.items = await get(this.object.route);
      } else {
        this.modalNotLogged.show();
      }
    },

    validateField() {
      this.object = this.filters.find((e) => e.index == this.option);

      this.clearFilterAll();

      this.$emit("index", this.option);
    },

    emitConfirm() {
      this.filterAll();
    },

    emitClear() {
      this.clearFilterAll();

      this.$emit("filter", null);
    },

    toggleFilter() {
      this.filterToggle = !this.filterToggle;
    },

    async filterAll() {
      if (await checkSession()) {
        let subRoute = this.object.subRoute

        let obParam = this.object.param;

        let obValue = this.object.paramValue;

        let params = {
          // subRoute: subRoute,
        };

        if (this.object.type == "select") {
          if (this.inputValue == 2) {
            this.emitClear();
          }
        }

        if (this.object.paramValue) {
          params[obParam[0]] = obValue;

          params[obParam[1]] = this.inputValue;
        } else {
          params[obParam] = this.inputValue;
        }

        if (this.inputValue != "" || this.inputValue != null) {

          const filterObject = {
            route: `${this.object.route}/search/${subRoute}`,
            params,
          };

          this.$emit("filter", filterObject);

          if (!this.items) {
            this.items = [];
          }
        } else {
          this.clearFilterAll();
        }
      } else {
        this.modalNotLogged.show();
      }
    },

    async clearFilterAll() {
      this.inputValue = null;
    },

    logout() {
      logout(this);
    },
  },

  async mounted() {
    this.modalNotLogged = new Modal(
      this.$refs.modalNotLogged.$refs.modalPattern
    );
  },

  watch: {
    option() {
      this.validateField();

      this.filterAll();
    },
  },
});
</script>



<style>
.icon {
  cursor: pointer;
}
</style>