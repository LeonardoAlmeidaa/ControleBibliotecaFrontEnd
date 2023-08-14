<template>
  <div :class="`mb-3 ${divClass}`">
    <TheLabel :label="label" :required="required" />
    <div class="input-group mb-3">
      <input
        ref="file"
        @change="update"
        type="file"
        class="form-control"
        :class="{ 'is-invalid': hasError }"
        @blur="updateValue"
        :multiple="multiple"
      />
      <div class="invalid-feedback" v-if="hasError">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { validateFile } from '@/rule/validate'

export default defineComponent({
  name: 'TheInputFile',
  inheritAttrs: false,

  props: {
    ref: String,
    divClass: String,
    label: String,
    required: Boolean,
    modelValue: File,
    multiple: { type: Boolean, default: false },
  },

  data: () => ({
    inputValue: File,
    error: null,
    hasError: false,
  }),

  methods: {
    update() {
      if (this.$refs.file) {
        this.inputValue = this.$refs.file.files[0]
        this.$emit('update:modelValue', this.inputValue)
      } else {
        this.inputValue = ''
      }
    },

    updateValue() {
      validateFile(this.inputValue, this.required, this, 'Este campo é obrigatório')
      this.update()
    },
  },

  emmits: ['update:modelValue'],

  created() {
    this.inputValue = this.modelValue
  },
})
</script>

<style></style>
