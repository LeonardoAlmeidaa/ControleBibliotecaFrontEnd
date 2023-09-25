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
  {
    path: '/livros',
    name: 'livros',
    component: () => import('@/views/Livros.vue')
  },
  {
    path: '/livro/cadastro/novo',
    name: 'livrosNew',
    component: () => import('@/views/LivrosNew.vue')
  },
  {
    path: '/livro/:id/editar',
    name: 'livrosUpdate',
    component: () => import('@/views/LivrosNew.vue')
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import('@/views/Usuario.vue')
  },
  {
    path: '/usuario/cadastro/novo',
    name: 'usuariosNew',
    component: () => import('@/views/UsuariosNew.vue')
  },
  {
    path: '/usuario/:id/editar',
    name: 'usuarioUpdate',
    component: () => import('@/views/UsuariosNew.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
