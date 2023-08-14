<template>
  <div class="m-3">
    <div class="row d-flex justify-content-between">
      <div class="col-6">
        <TheTitle title="Dashboard" :breadcrumb="true" />
      </div>
      <div class="col-6 text-end">
        <span class="small text-primary me-3">
          <b>{{ allOsFilterStatus }}</b>
        </span>
        <TheButton type="button" color="primary" label="Filtrar" icon="funnel-fill" @click="modalFilterAllOs.show()" />
      </div>
    </div>
    <div class="mx-2 mb-3">
      <div class="row">
        <TheKPICard divClass="col-md-6" color="primary" :value="totalOpenUrgent" title="OSs Urgentes em Aberto" />
        <TheKPICard divClass="col-md-6" color="danger text-white" :value="totalExpired" title="OSs em Atraso" />
      </div>
    </div>
    <div class="mx-2">
      <div class="row">
        <div class="col-12">
          <TheCard header="OSs Urgentes" divClass="col-12">
            <div class="table-responsive">
              <TheTable
                :headers="headerUrgentOrders"
                :items="itemsUrgentOrders"
                :totalPages="pages"
                v-model="actualPage"
              >
                <template v-slot:numeroProtocolo="{ item }">
                  <div class="text-center details" @dblclick="detailOS(item.id)">
                    {{ item.numeroProtocolo }}
                  </div>
                </template>
                <template v-slot:idServiceRequested="{ item }">
                  <div class="text-center">
                    {{ item.idServiceRequested }}
                  </div>
                </template>
                <template v-slot:idTeam="{ item }">
                  <div class="text-center">
                    {{ item.idTeam }}
                  </div>
                </template>
                <template v-slot:time="{ item }">
                  <div class="text-center">
                    {{ item.time }}
                  </div>
                </template>
                <!-- <template v-slot:Solicitado="{ item }">
                  <div class="text-center">
                    {{ formatDate(item.protocolDate) }}
                  </div>
                </template> -->
                <template v-slot:Vencimento="{ item }">
                  <div class="text-center">
                    {{ formatDateAdd(item.protocolDate, item.time) }}
                  </div>
                </template>
                <template v-slot:Status="{ item }">
                  <div class="text-center">
                    <span :class="getStatusColor(item)">
                      {{ translateStatusText(item) }}
                    </span>
                  </div>
                </template>
                <template v-slot:status="{ item }">
                  <div class="text-center">
                    <span :class="getProgressColor(item.status)">
                      {{ translateProgressText(item.status) }}
                    </span>
                  </div>
                </template>
              </TheTable>
            </div>
          </TheCard>
        </div>
      </div>
      <div class="text-center text-secondary">
        <h6>Atualizado em: {{ lastUpdate }}</h6>
      </div>
    </div>
    <TheModalFilter ref="modalFilterAllOs" @confirm="filterAllOs" @clear="clearFilterAllOs">
      <div class="row">
        <TheInput
          v-model="allOsProtocolNumber"
          ref="allOsProtocolNumber"
          divClass="col-12"
          label="Protocolo"
          placeholder="Número do Protocolo"
        />
        <TheInputZoom v-model="allOsService" ref="allOsService" divClass="col-12" label="Serviço">
          <template #default>
            <Servico :zoom="true" @selectedItem="handleSelectedService" />
          </template>
        </TheInputZoom>
        <!-- <TheSelect
          v-model="allOsService"
          ref="allOsService"
          divClass="col-12"
          label="Serviço"
          :items="allOsServiceOptions"
        /> -->
        <TheInputZoom v-model="allOsTeam" ref="allOsTeam" divClass="col-12" label="Equipe">
          <template #default>
            <Equipe :zoom="true" @selectedItem="handleSelectedTeam" />
          </template>
        </TheInputZoom>
        <!-- <TheSelect
          v-model="allOsTeam"
          ref="allOsTeam"
          divClass="col-12"
          label="Equipe"
          :items="allOsTeamOptions"
        /> -->
        <!-- <TheSelect
          v-model="allOsSla"
          ref="allOsSla"
          divClass="col-12"
          label="SLA"
          :items="allOsSlaOptions"
        /> -->
      </div>
    </TheModalFilter>
  </div>
</template>

<script>
import moment from 'moment'
import { checkSession } from '@/rule/functions.js'
import { get, search } from '@/crud.js'
import Servico from '@/views/sistema/servico/Servico.vue'
import Equipe from '@/views/sistema/equipe/Equipe.vue'

import { Modal } from 'bootstrap'

export default {
  name: 'Dashboard',

  components: {
    Servico,
    Equipe,
  },

  data: () => ({
    headerUrgentOrders: [
      { title: 'Protocolo', field: 'numeroProtocolo' },
      { title: 'Serviço', field: 'idServiceRequested' },
      { title: 'Equipe', field: 'idTeam' },
      { title: 'SLA', field: 'time' },
      { title: 'Vencimento', field: 'Vencimento' },
      { title: 'Status', field: 'Status' },
      { title: 'Andamento', field: 'status' },
    ],
    itemsUrgentOrders: [],
    itemsExpiredOrders: [],
    lastUpdate: null,

    allOsFilterStatus: null,
    allOsProtocolNumber: null,
    allOsService: null,
    allOsServiceOptions: [],
    allOsTeam: null,
    allOsTeamOptions: [],
    allOsSla: null,
    allOsSlaOptions: [],

    Modal: null,
    modalFilterAllOs: null,

    pages: null,
    actualPage: 1,
    limit: 10,

    totalOpenUrgent: 0,
    totalExpired: 0,
  }),

  methods: {
    async loadUrgentOrders(page = 1) {
      if (await checkSession()) {
        const query = { params: { page: page, limit: this.limit } }
        const raw = await get('dashboard/getDailyUrgentOrders', query)

        this.itemsUrgentOrders = raw.data
        this.pages = Math.ceil(raw.total / this.limit)
        this.totalOpenUrgent = raw.total
      }
    },

    async loadExpiredOrders(page = 1) {
      if (await checkSession()) {
        const query = { params: { page: page, limit: this.limit } }
        const raw = await get('dashboard/getExpiredOrders', query)

        this.itemsExpiredOrders = raw.data
        this.pages = Math.ceil(raw.total / this.limit)
        this.totalExpired = raw.total
      }
    },

    formatDate(date) {
      return moment(date).add(3, 'hour').format('DD/MM/YYYY HH:mm')
    },

    formatDateAdd(date, time) {
      return moment(date)
        .add(time + 3, 'hour')
        .format('DD/MM/YYYY HH:mm')
    },

    translateProgressText(status) {
      let text = status

      switch (status) {
        case 'PENDENTE DE CARGA NO EQUIPAMENTO':
          text = 'PENDENTE DE CARGA'
          break
        case 'AGUARDANDO EQUIPE CONFIRMAR RECEBIMENTO':
          text = 'AGUARDAR RECEBIMENTO'
          break
      }

      return text
    },

    getProgressColor(status) {
      switch (status) {
        case 'PENDENTE DE ROTEIRIZAÇÃO':
          return 'badge rounded-pill text-bg-warning'
        case 'PENDENTE DE CARGA NO EQUIPAMENTO':
          return 'badge rounded-pill text-bg-warning'
        case 'PENDENTE DE EXECUÇÃO':
          return 'badge rounded-pill text-bg-warning'
        case 'AGUARDANDO EQUIPE CONFIRMAR RECEBIMENTO':
          return 'badge rounded-pill text-bg-primary'
        case 'EM EXECUÇÃO':
          return 'badge rounded-pill text-bg-primary'
        case 'EXECUTADO':
          return 'badge rounded-pill text-bg-success'
        case 'REJEITADO PELA EQUIPE':
          return 'badge rounded-pill text-bg-danger text-white'
        case 'NÃO EXECUTADO':
          return 'badge rounded-pill text-bg-danger text-white'
      }
    },

    translateStatusText(item) {
      let text = ''

      if (this.calculateDueTime(item.protocolDate, item.time) <= 0) {
        text = 'EM ATRASO'
      } else if (this.calculateDueTime(item.protocolDate, item.time) < (item.time * 60) / 2) {
        text = 'EXPIRANDO'
      } else if (this.calculateDueTime(item.protocolDate, item.time) >= (item.time * 60) / 2) {
        text = 'NO PRAZO'
      }

      return text
    },

    getStatusColor(item) {
      let classes = ''

      if (this.calculateDueTime(item.protocolDate, item.time) <= 0) {
        classes = 'badge rounded-pill text-bg-danger text-white'
      } else if (this.calculateDueTime(item.protocolDate, item.time) < (item.time * 60) / 2) {
        classes = 'badge rounded-pill text-bg-warning'
      } else if (this.calculateDueTime(item.protocolDate, item.time) >= (item.time * 60) / 2) {
        classes = 'badge rounded-pill text-bg-success'
      }

      return classes
    },

    calculateDueTime(protocolDate, time) {
      let currentDate = moment()
      let limitDate = moment(protocolDate).add(time + 3, 'hour')

      return limitDate.diff(currentDate, 'minutes')
    },

    async filterAllOs() {
      if (await checkSession()) {
        let subRoute = ''
        let params = {}

        if (this.allOsProtocolNumber) {
          params.numero_protocolo = this.allOsProtocolNumber
          subRoute = 'by-numero-protocolo'
        }

        if (this.allOsService) {
          params.id_service_requested = this.allOsService
          subRoute = 'by-service-requested'
        }

        if (this.allOsTeam) {
          params.id_team = this.allOsTeam
          subRoute = 'by-team'
        }

        if (this.allOsSla) {
          params.time = this.allOsSla
          subRoute = 'by-sla'
        }

        if (subRoute) {
          this.itemsUrgentOrders = await search(`os/urgentOrders/${subRoute}`, params)

          if (!this.itemsUrgentOrders) {
            this.itemsUrgentOrders = []
          }
        } else [await this.loadUrgentOrders()]
      }
    },

    handleSelectedService(item) {
      this.$refs.allOsService.modalZoom.hide()
      this.allOsService = item.externalCode.toString()
    },

    handleSelectedTeam(item) {
      this.$refs.allOsTeam.modalZoom.hide()
      this.allOsTeam = item.id.toString()
    },

    clearFilterAllOs() {
      this.allOsProtocolNumber = null
      this.allOsService = null
      this.allOsTeam = null
      this.allOsSla = null

      this.filterAllOs()
    },

    async reloadData() {
      this.lastUpdate = moment().format('DD/MM/YYYY HH:mm:ss')

      await this.filterAllOs()
      await this.loadUrgentOrders(this.actualPage)
      await this.loadExpiredOrders(this.actualPage)
    },

    detailOS(id) {
      if (this.$route.name == 'dashboard') {
        const route = {
          name: 'osDetail',
          params: { id: id },
        }

        const url = this.$router.resolve(route).href
        window.open(url, '_blank')
      }
    },
  },

  async mounted() {
    setInterval(this.reloadData, 2 * 60 * 1000)
    this.lastUpdate = moment().format('DD/MM/YYYY HH:mm:ss')

    await this.loadUrgentOrders(1)
    await this.loadExpiredOrders()

    let filter = await get('dashboard/filter')

    filter.idServiceRequested.forEach((e) => {
      this.allOsServiceOptions.push({ label: e, value: e })
    })

    filter.time.forEach((e) => {
      this.allOsSlaOptions.push({ label: e, value: e })
    })

    this.modalFilterAllOs = new Modal(this.$refs.modalFilterAllOs.$refs.modalPattern)
  },

  watch: {
    actualPage() {
      this.loadUrgentOrders(this.actualPage)
    },
  },
}
</script>

<style>
.details {
  cursor: pointer;
  text-decoration: underline;
}
</style>
