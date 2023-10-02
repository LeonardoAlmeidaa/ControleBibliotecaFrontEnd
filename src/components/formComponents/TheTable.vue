<template>
  <div>
    <table class="table table-striped table-hover table-bordered table-sm">
      <thead class="text-center table-light">
        <tr v-if="headers">
          <th
            v-for="header in headers"
            :key="header"
            :class="{ 'col-md-1': header.field === 'action' }"
          >
            {{ header.title }}
          </th>
        </tr>
      </thead>

      <tbody v-if="items">
        <tr v-for="(item, index) in items" :key="index">
          <td
            v-for="header in headers"
            :key="header"
            :class="header.align"
            :style="header.width ? `width: ${header.width};` : ''"
          >
            <slot :name="header.field" :item="item">{{
              item[header.field]
            }}</slot>
          </td>
        </tr>
      </tbody>
    </table>

    <h5 class="text-secondary text-center mt-3" v-if="!items">
      Nenhum item a ser exibido.
    </h5>

    <nav v-if="!disablePagination">
      <ul class="pagination pagination-sm justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a
            class="page-link"
            href="#"
            aria-label="Anterior"
            @click.prevent="previousPage"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <!-- <li

          v-for="pageNumber in pagesToShow"

          :key="pageNumber"

          class="page-item"

          :class="{ active: currentPage === pageNumber }"

        >

          <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">{{ pageNumber }}</a>

        </li> -->

        <li class="page-item" :class="{ active: true }">
          <a class="page-link" href="#">{{ currentPage }}</a>
        </li>

        <li
          v-if="items.length"
          class="page-item"
          :class="{ disabled: items.length < 10 || items.length == 0 }"
        >
          <a
            class="page-link"
            href="#"
            aria-label="Proxima"
            @click.prevent="nextPage"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>

  <TheModalError
    ref="modalError"
    modalTitle="Atenção !"
    :modalBody="modalBody"
  />
</template>



<script>
import { Modal } from "bootstrap";

export default {
  props: {
    show: { type: Boolean, default: true },

    headers: { type: Array, required: true },

    actualPage: Number,

    items: Array,

    path: String,

    itemsPerPage: { type: String, default: "20" },

    totalPages: Number,

    disablePagination: {
      type: Boolean,

      default: false,
    },
  },

  data: () => ({
    currentPage: 1,

    modalBody: null,

    modalError: null,
  }),

  computed: {
    totalItems() {
      if (this.items) {
        return this.items.length;
      }
    },

    displayedItems() {
      return this.items;
    },

    pagesToShow() {
      let pages = [1];

      if (this.totalPages > 5) {
        if (this.currentPage > 3) {
          pages.push("...");
        }

        if (this.currentPage > 2 && !pages.includes(this.currentPage - 1)) {
          pages.push(this.currentPage - 1);
        }

        if (!pages.includes(this.currentPage)) {
          pages.push(this.currentPage);
        }

        if (
          this.currentPage < this.totalPages - 1 &&
          !pages.includes(this.currentPage + 1)
        ) {
          pages.push(this.currentPage + 1);
        }

        if (
          this.currentPage < this.totalPages - 2 &&
          !pages.includes(this.totalPages)
        ) {
          pages.push("...");
        }
      } else {
        for (let i = 2; i <= this.totalPages - 1; i++) {
          pages.push(i);
        }
      }

      if (this.totalPages > 1 && !pages.includes(this.totalPages)) {
        pages.push(this.totalPages);
      }

      return pages;
    },
  },

  methods: {
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      this.currentPage++;
    },

    goToPage(pageNumber) {
      if (pageNumber === "...") {
        return;
      }

      this.currentPage = pageNumber;
    },
  },

  watch: {
    currentPage() {
      this.$emit("update:modelValue", this.currentPage);
    },

    items() {
      console.log("??????")
      console.log(this.items)
      if (this.totalItems == 0) {
        this.previousPage();

        if (this.currentPage > 1) {
          this.modalBody = "Esta é a última página.";

          this.modalError.show();
        }
      }
    },

    actualPage() {
      this.currentPage = 1;
    },
  },

  mounted() {
    this.modalError = new Modal(this.$refs.modalError.$refs.modalPattern);
  },
};
</script>