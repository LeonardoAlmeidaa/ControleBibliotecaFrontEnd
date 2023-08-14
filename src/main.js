import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import App from './App.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import router from './router'
import * as Filtros from './plugins/filter'

import store from './store'
import axios from 'axios'
import VueTheMask from 'vue-the-mask'
import money from 'v-money'

import TheInput from '@/components/formComponents/TheInput.vue'
import TheDate from '@/components/formComponents/TheDate.vue'
import TheDateRange from '@/components/formComponents/TheDateRange.vue'
import TheInputEmail from '@/components/formComponents/TheInputEmail.vue'
import TheInputZoom from '@/components/formComponents/TheInputZoom.vue'
import TheInputPassword from '@/components/formComponents/TheInputPassword.vue'
import TheLabel from '@/components/formComponents/TheLabel.vue'
import TheRadio from '@/components/formComponents/TheRadio.vue'
import TheTable from '@/components/formComponents/TheTable.vue'
import TheSelect from '@/components/formComponents/TheSelect.vue'
import TheTitle from '@/components/formComponents/TheTitle.vue'
import TheTextArea from '@/components/formComponents/TheTextArea.vue'
import TheToastSuccess from '@/components/formComponents/TheToastSuccess.vue'
import TheCheck from '@/components/formComponents/TheCheck.vue'
import TheCard from '@/components/formComponents/TheCard.vue'
import TheButton from '@/components/formComponents/TheButton.vue'
import TheInputFile from '@/components/formComponents/TheInputFile.vue'
import TheLoader from '@/components/formComponents/TheLoader.vue'
import TheModalDelete from '@/components/formComponents/TheModalDelete.vue'
import TheModalError from '@/components/formComponents/TheModalError.vue'
import TheModalFilter from '@/components/formComponents/TheModalFilter.vue'
import TheModalNotLogged from '@/components/formComponents/TheModalNotLogged.vue'
import TheModalImporter from '@/components/formComponents/TheModalImporter.vue'
import TheModalExporter from '@/components/formComponents/TheModalExporter.vue'
import TheRequiredLabel from '@/components/formComponents/TheRequiredLabel.vue'
import TheKPICard from '@/components/formComponents/TheKPICard.vue'
import TheReportsTable from '@/components/formComponents/TheReportsTable.vue'
import TheFilter from '@/components/formComponents/TheFilter.vue'
import TheTransition from '@/components/formComponents/TheTransition.vue'

import TheChip from '@/components/general/TheChip.vue'

import { cleanObject } from '@/rule/functions'

axios.defaults.withCredentials = true

const app = createApp(App)

app.config.globalProperties.$filters = {}

Object.keys(Filtros).forEach((filtro) => {
  app.config.globalProperties.$filters[filtro] = Filtros[filtro]
})

app.use(VueTheMask)
app.use(money)
app.use(store)
app
  .use(router)

  .component('VueDatePicker', VueDatePicker)
  .component('TheInput', TheInput)
  .component('TheDate', TheDate)
  .component('TheDateRange', TheDateRange)
  .component('TheInputEmail', TheInputEmail)
  .component('TheInputZoom', TheInputZoom)
  .component('TheInputPassword', TheInputPassword)
  .component('TheRadio', TheRadio)
  .component('TheTable', TheTable)
  .component('TheReportsTable', TheReportsTable)
  .component('TheSelect', TheSelect)
  .component('TheTitle', TheTitle)
  .component('TheTextArea', TheTextArea)
  .component('TheToastSuccess', TheToastSuccess)
  .component('TheCard', TheCard)
  .component('TheButton', TheButton)
  .component('TheInputFile', TheInputFile)
  .component('TheLoader', TheLoader)
  .component('TheModalDelete', TheModalDelete)
  .component('TheModalError', TheModalError)
  .component('TheModalFilter', TheModalFilter)
  .component('TheModalNotLogged', TheModalNotLogged)
  .component('TheModalImporter', TheModalImporter)
  .component('TheModalExporter', TheModalExporter)
  .component('TheRequiredLabel', TheRequiredLabel)
  .component('TheKPICard', TheKPICard)
  .component('TheLabel', TheLabel)
  .component('TheCheck', TheCheck)
  .component('TheFilter', TheFilter)
  .component('TheTransition', TheTransition)
  .component('TheChip', TheChip)

app.config.globalProperties.$cleanObject = cleanObject

app.mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
