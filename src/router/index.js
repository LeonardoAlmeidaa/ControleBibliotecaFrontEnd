import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  /* ########## USUARIO ########## */
  {
    path: '/administracao/usuario',
    name: 'user',
    component: () => import('@/views/administracao/usuario/Usuario.vue')
  },
  {
    path: '/administracao/usuario/cadastro/novo',
    name: 'userNew',
    component: () => import('@/views/administracao/usuario/UsuarioNovo.vue')
  },
  {
    path: '/administracao/usuario/:id/editar',
    name: 'userUpdate',
    component: () => import('@/views/administracao/usuario/UsuarioNovo.vue')
  },
  /* ########## LIVRO ########## */
  {
    path: '/cadastros/livro',
    name: 'book',
    component: () => import('@/views/cadastros/livro/Livro.vue')
  },
  {
    path: '/cadastros/livro/cadastro/novo',
    name: 'bookNew',
    component: () => import('@/views/cadastros/livro/LivroNovo.vue')
  },
  {
    path: '/cadastros/livro/:id/editar',
    name: 'bookUpdate',
    component: () => import('@/views/cadastros/livro/LivroNovo.vue')
  },
  /* ########## PERFIL ########## */
  {
    path: '/meu_perfil',
    name: 'myProfile',
    component: () => import('@/views/Perfil.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
