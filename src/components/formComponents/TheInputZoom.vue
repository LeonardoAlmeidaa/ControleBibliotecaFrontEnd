<template>
  <div :class="`mb-3 ${divClass}`">
    <TheLabel :label="label" :required="required" />
    <div class="input-group">
      <input
        :ref="ref"
        :disabled="isDisabled"
        v-model="inputValue"
        type="text"
        :placeholder="placeholder"
        class="form-control"
        :class="{ 'is-invalid': hasError }"
        @blur="updateValue"
        @keydown.enter.prevent
      />
      <span class="input-group-text iconButton" @click="showModalZoom">
        <i class="bi bi-search"></i>
      </span>
      <div class="invalid-feedback" v-if="hasError">
        {{ error }}
      </div>
    </div>
  </div>
  <TheModalZoom ref="modalZoom">
    <slot></slot>
  </TheModalZoom>
</template>

<script>
import { defineComponent } from 'vue'
import { validateRequired } from '@/rule/validate'
import { Modal } from 'bootstrap'
import TheLabel from '@/components/formComponents/TheLabel.vue'
import TheModalZoom from '@/components/formComponents/TheModalZoom.vue'

export default defineComponent({
  components: {
    TheLabel,
    TheModalZoom,
    setValue: {
      type: Function,
      default: () => null,
    },
  },

  props: {
    ref: String,
    divClass: String,
    label: String,
    isDisabled: Boolean,
    placeholder: String,
    required: Boolean,
    modelValue: [String, Number],
  },

  inheritAttrs: false,

  data: () => ({
    inputValue: '',
    error: null,
    hasError: false,
    Modal: null,
    modalZoom: null,
  }),

  methods: {
    update() {
      this.$emit('update:modelValue', this.inputValue)
      // this.modalZoom.hide()
    },

    updateValue() {
      validateRequired(
        this.inputValue,
        this.required,
        this,
        `${this.label} é obrigatório.`,
        this.minlength,
        `${this.label} deve ter no mínimo ${this.minlength} caracteres.`
      )

      this.update()
    },

    showModalZoom() {
      if (!this.isDisabled) {
        this.modalZoom.show()
      }
    },
  },

  emmits: [ "update:modelValue" ],

  mounted() {
    this.modalZoom = new Modal(this.$refs.modalZoom.$refs.modalPattern)
  },

  created() { this.inputValue = this.modelValue },

  watch: {
    inputValue() { this.update() },

    modelValue() {
      if (this.modelValue != this.inputValue) {
        this.inputValue = this.modelValue
      }
    }
  },
})
</script>

<style></style>