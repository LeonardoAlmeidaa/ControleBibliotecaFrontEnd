<template>
  <div :class="`${this.divClass}`">
    <TheLabel :label="label" :required="required" />
    <div class="input-group mb-3">
      <VueDatePicker
        v-mask="'##/##/#### - ##/##/####'"
        ref="datePicker"
        range
        text-input
        :format="'dd/MM/yyyy'"
        model-type="yyyy-MM-dd"
        v-model="inputValue"
        select-text="Selecionar"
        cancel-text="Cancelar"
        locale="pt-BR"
        :teleport="true"
        :disabled="isDisabled"
        :class="{ 'is-invalid': hasError }"
        :input-class-name="hasError ? 'dp-custom-input' : ''"
        @update:model-value="updateValue"
        @blur="updateValue"
        :enable-time-picker="false"
        :day-names="['D', 'S', 'T', 'Q', 'Q', 'S', 'S']"
        :min-date="new Date(1900, 1, 1)"
        :max-date="new Date(2023, 12, 31)"
        @keydown.enter.prevent
        >
        <template #input-icon>
            <i class="bi bi-calendar3 ms-2"></i>
        </template>
      </VueDatePicker>
      <div class="form-group right-inner-addon">
        <b><i class="bi bi-exclamation-circle text-danger" v-if="hasError"></i></b>
      </div>
      <div class="invalid-feedback" v-if="hasError">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { defineComponent } from 'vue'
import { validateDate } from '@/rule/validate'
import TheLabel from '@/components/formComponents/TheLabel.vue';

export default defineComponent({
  components: {
    TheLabel
  },

  data: () => ({
    inputValue: '',
    error: null,
    hasError: false,
    textInputOptions: {
      format: 'dd/MM/yyyy'
    }
  }),

  props: {
    divClass: String,
    label: String,
    isDisabled: Boolean,
    required: Boolean,
    placeholder: String,
    modelValue: Array,
  },

  methods: {
    update() { this.$emit('update:modelValue', this.inputValue) },

    updateValue() {
      validateDate(
        this.inputValue,
        this.required,
        this,
        `${this.label} é obrigatório.`,
      )

      this.update()
    },
  },

  emmits: [ "update:modelValue" ],

  created() {
      if (this.modelValue) {
      this.inputValue = moment(this.modelValue).format('YYYY-MM-DD')
    }
   },

  watch: {
    inputValue() { this.update() },

    modelValue() {
      if (this.modelValue == undefined) {
        this.inputValue = null
      }

      if (this.modelValue != null) {
        if (this.modelValue != this.inputValue) {
          this.inputValue = moment(this.modelValue).format('YYYY-MM-DD')
        }
      }
    }
  },
})
</script>

<style></style>