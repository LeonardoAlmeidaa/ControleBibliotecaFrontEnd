/*
export function validateForm(ref) {
  if (!ref) {
    return false
  }

  const el = ref.getElementsByTagName('input')
  let valid = true

  Array.from(el).forEach((element) => {
    element.focus()
    element.blur()
    if (element.className.includes('is-invalid') || element.value == '') { valid = false; }
  })

  return valid;
}
*/

import { nextTick } from 'vue'

export async function validateForm(ref) {
  if (!ref) {
    return false
  }

  const elInput = ref.getElementsByTagName('input')
  const elSelect = ref.getElementsByTagName('select')
  let valid = true
  let countInvalid = 0

  for (let i = 0; i < elInput.length; i++) {
    const element = elInput[i]
    element.focus()
    element.blur()
    await nextTick()

    if (element.className.includes('is-invalid') || element.className.includes('dp-custom-input')) {

      countInvalid++
    }
  }

  for (let i = 0; i < elSelect.length; i++) {
    const element = elSelect[i]
    element.focus()
    element.blur()
    await nextTick()

    if (element.className.includes('is-invalid')) {

      countInvalid++
    }
  }

  if (countInvalid > 0) { valid = false }
  return valid;
}

export function getRouteName(route) {
  let theRoute = {
    usuarios: {
      parent: 'Administração',
      name: 'Usuários',
      path: 'usuarios',
      childrenName: 'Cadastro de Usuário',
      childrenPath: 'usuariosNew',
      UpdateName: 'Edição de Usuário',
      UpdatePath: 'usuarioUpdate',
    },
    livros: {
      parent: 'Cadastro',
      name: 'Livros',
      path: 'livros',
      childrenName: 'Cadastro de Livros',
      childrenPath: 'livroNew',
      UpdateName: 'Edição de Livros',
      UpdatePath: 'livroUpdate',
    },
  }

  if (route in theRoute) {
    return theRoute[route];
  } else if (route.split('New')[0] in theRoute) {
    return theRoute[route.split('New')[0]];
  } else {
    return theRoute[route.split('Update')[0]];
  }
}

import { get } from '@/crud.js'
export async function checkSession() {
  const rawUser = await get('me')

  if (!rawUser || rawUser == '') {
    return false
  }

  else {
    return true
  }
}

export function logout(vueInstance) {
  vueInstance.$store.dispatch('setLogged', false)
  vueInstance.$router.push({ name: 'login' })
}

export function cleanObject(object) {
  if (object.status && !object.password) {
    delete object.id
    delete object.createdAt
    delete object.deletedAt
    delete object.updatedAt
  } else if (object.referralDate){
    delete object.id
    delete object.referralDate
    delete object.createdAt
    delete object.deletedAt
    delete object.updatedAt
  } else if(object.password || object.idVehicle || object.pavement){
    delete object.status
    delete object.createdAt
    delete object.deletedAt
    delete object.updatedAt
  } else {
    delete object.id
    delete object.status
    delete object.createdAt
    delete object.deletedAt
    delete object.updatedAt
  }
}

/*
export function function02() {
  return alert()
}
*/