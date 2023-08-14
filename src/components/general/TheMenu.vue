<template>
  <nav class="navbar navbar-expand-lg text-bg-dark d-flex justify-content-between" v-if="logged">
    <div>
      <i class="bi bi-list icon_action ps-3" @click="toggleSidebar"></i>
      <img src="@/assets/brand_horizontal.png" class="ps-3" style="width: 200px;"/>
    </div>
    <div>
      <i class="bi bi-person-fill-gear icon" @click="$router.push({ name: 'myProfile' })"></i>
      <span class="px-2 me-1">{{ user.name }}</span>
      <TheButton
          type="button"
          label="Sair"
          size="btn-sm me-3"
          color="danger"
          icon="bi bi-box-arrow-in-right me-2"
          @click="logout"
        />
    </div>
  </nav>
  <div class="wrapper">
    <nav ref="sidebar" class="sidebar text-bg-dark" v-if="logged">
      <TheSideMenu :menuList="menuList" class="px-3" />
      <!-- <div class="sidebarBottom text-center">
        <TheButton
          type="button"
          label="Sair"
          color="danger"
          icon="bi bi-box-arrow-in-right me-2"
          @click="logout"
        />
      </div> -->
    </nav>
    <div id="content" class="content text-bg-light p-0">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { baseApiUrl } from '@/global'
import { mapState } from 'vuex'
import axios from 'axios'
import TheButton from '@/components/formComponents/TheButton.vue'
import TheSideMenu from '@/components/general/TheSideMenu.vue'

export default {
  setup() {
    const sidebar = ref(null);

    const toggleSidebar = () => {
      sidebar.value.classList.toggle('active');
    }

    return { sidebar, toggleSidebar }
  },

  components: { TheSideMenu, TheButton, },

  computed: {
    ...mapState(['logged', 'user']),
  },

  data: () => ({
    menuList: [
      {
        code: 'dashboard',
        title: 'Dashboard',
        status: false,
        icon: 'bi bi-pie-chart-fill',
        children: [],
      },
      {
        code: null,
        title: 'Relatórios',
        status: false,
        icon: 'bi bi-file-earmark-text-fill',
        children: [
          {
            code: 'sgm',
            title: 'SGM',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
        ],
      },
      {
        code: null,
        title: 'Cadastros',
        status: false,
        icon: 'bi bi-pencil-square',
        children: [
          {
            code: 'job',
            title: 'Aterro/Reaterro',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'os',
            title: 'Os',
            status: false,
            icon: 'bi bi-circle',
            child: 'osApropriacoes',
            children: [],
          },
          {
            code: 'service',
            title: 'Serviços',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'mos',
            title: 'Mos',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'team',
            title: 'Equipes',
            status: false,
            icon: 'bi bi-circle',
            child: 'employeeTeam',
            children: [],
          },
          {
            code: 'vehicles',
            title: 'Veículos',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'employee',
            title: 'Funcionários',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'item',
            title: 'Itens',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          // {
          //   code: 'district',
          //   title: 'Distritos',
          //   status: false,
          //   icon: 'bi bi-geo-alt-fill',
          //   children: [],
          // },
          // {
          //   code: 'locale',
          //   title: 'Endereços',
          //   status: false,
          //   icon: 'bi bi-geo-alt-fill',
          //   children: [],
          // },
          // {
          //   code: 'resource',
          //   title: 'Recursos',
          //   status: false,
          //   icon: 'bi bi-tools',
          //   children: [],
          // },
          // {
          //   code: 'constructUnity',
          //   title: 'Unidade Construtiva',
          //   status: false,
          //   icon: 'bi bi-building-fill',
          //   children: [],
          // },
        ],
      },
      {
        code: null,
        title: 'Parametrização',
        status: false,
        icon: 'bi bi-sliders',
        children: [
          // {
          //   code: 'osApropriacoes',
          //   title: 'Apropriação',
          //   status: false,
          //   icon: 'bi bi-tools',
          //   children: [],
          // },
          {
            code: 'paramBonificacao',
            title: 'Bonificação',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'paramDesconto',
            title: 'Descontos',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'parametros',
            title: 'Parâmetros',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'canteiroTotal',
            title: 'Canteiro Total',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'obra',
            title: 'Medição Obra',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'osMedicao',
            title: 'Medição OS',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
        ]
      },
      {
        code: null,
        title: 'Administração',
        status: false,
        icon: 'bi bi-gear-fill',
        children: [
          {
            code: 'group',
            title: 'Grupos',
            status: false,
            icon: 'bi bi-circle',
            child: 'acl',
            children: [],
          },
          {
            code: 'screen',
            title: 'Programas',
            status: false,
            icon: 'bi bi-circle',
            children: [],
          },
          {
            code: 'user',
            title: 'Usuários',
            icon: 'bi bi-circle',
            child: 'userGroup',
            status: false,
          },
        ],
      },
      {
        code: 'myProfile',
        title: 'Meu Perfil',
        status: false,
        icon: 'bi-person-fill',
        children: [],
      },
    ],
  }),

  methods: {
    logout() {
      const url = `${baseApiUrl}/logout`
      axios.defaults.withCredentials = true

      const result = axios
        .post(url)
        .then((res) => {
          this.$store.dispatch('setLogged', false)
          this.$router.push({ name: 'login' })
        })
        .catch((err) => {
          console.log(err)
          return err
        })

      return result
    },
  }
}
</script>

<style>
.wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: stretch;
}

.sidebar {
  min-width: 250px;
  max-width: 250px;
  transition: all 0.3s;
  position: relative;
}

.sidebar .sidebarBottom {
  position: fixed;
  bottom: 0;
  left: 0;
  max-height: 10%;
  width: 250px;
  padding: 10px;
}

.sidebar.active {
  margin-left: -250px;
}

.content {
  width: 100%;
  height: 100%;
  min-height: 95vh;
  transition: all 0.3s;
}

.navbar {
  height: 5vh;
}

.item-firstLevel:hover {
  color: #000;
  background-color: #8dc4f1;
}

.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
  background-color: #acacac;
}

.btn-toggle::after {
  width: 1.25em;
  line-height: 0;
  content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
  transition: transform 0.35s ease;
  transform-origin: 0.5em 50%;
}

.btn-toggle[aria-expanded='true']::after {
  transform: rotate(450deg);
}

@media (max-width: 768px) {
  .sidebar {
    margin-left: -250px;
  }

  .sidebar.active {
    margin-left: 0;
  }

  .sidebarCollapse span {
    display: none;
  }
}

@media screen and (width < 1550px) {
  .content {
    min-height: 90vh;
  }

  .navbar {
    height: 10vh;
  }

  .icon {
    font-size: 18px;
    cursor: pointer;
  }
}
</style>