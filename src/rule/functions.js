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
    user: {
      parent: 'Administração',
      name: 'Usuários',
      path: 'user',
      childrenName: 'Cadastro de Usuário',
      childrenPath: 'userNew',
      UpdateName: 'Edição de Usuário',
      UpdatePath: 'userUpdate',
    },
    userGroup: {
      parent: 'Usuários',
      name: 'Grupo de Usuários',
      path: 'userGroup',
      childrenName: 'Cadastro de Grupo',
      childrenPath: 'userGroupNew',
      UpdateName: 'Edição de Grupo',
      UpdatePath: 'userGroupUpdate',
    },
    userGroupChildren: {
      parent: 'Usuários',
      name: 'Grupo de Usuários',
      path: 'userGroupChildren',
      childrenName: '',
      childrenPath: ''
    },
    screen: {
      parent: 'Administração',
      name: 'Programas',
      path: 'screen',
      childrenName: 'Cadastro de Programas',
      childrenPath: 'screenNew',
      UpdateName: 'Edição de Programas',
      UpdatePath: 'screenUpdate',
    },
    acl: {
      parent: 'Administração',
      name: 'Acl',
      path: 'acl',
      childrenName: 'Cadastro de Acl',
      childrenPath: 'aclNew',
      UpdateName: 'Edição de Acl',
      UpdatePath: 'aclUpdate',
    },
    aclChildren: {
      parent: 'Grupos',
      name: 'Acl',
      path: 'aclChildren',
      childrenName: '',
      childrenPath: ''
    },
    group: {
      parent: 'Administração',
      name: 'Grupos',
      path: 'group',
      childrenName: 'Cadastro de Grupo',
      childrenPath: 'groupNew',
      UpdateName: 'Edição de Grupo',
      UpdatePath: 'groupUpdate',
    },
    os: {
      parent: 'Cadastros',
      name: 'OS',
      path: 'os',
      childrenName: 'Cadastro de OS',
      childrenPath: 'osNew',
      UpdateName: 'Edição de OS',
      UpdatePath: 'osUpdate',
    },
    job: {
      parent: 'Cadastros',
      name: 'Aterro/Reaterro',
      path: 'job',
      childrenName: 'Cadastro de Aterro/Reaterro',
      childrenPath: 'jobNew',
      UpdateName: 'Edição de Aterro/Reaterro',
      UpdatePath: 'jobUpdate',
    },
    service: {
      parent: 'Cadastros',
      name: 'Serviços',
      path: 'service',
      childrenName: 'Cadastro de Serviço',
      childrenPath: 'serviceNew',
      UpdateName: 'Edição de Serviço',
      UpdatePath: 'serviceUpdate',
    },
    mos: {
      parent: 'Cadastros',
      name: 'Mos',
      path: 'mos',
      childrenName: 'Cadastro de Mos',
      childrenPath: 'mosNew',
      UpdateName: 'Edição de Mos',
      UpdatePath: 'mosUpdate',
    },
    team: {
      parent: 'Cadastros',
      name: 'Equipes',
      path: 'team',
      childrenName: 'Cadastro de Equipe',
      childrenPath: 'teamNew',
      UpdateName: 'Edição de Equipe',
      UpdatePath: 'teamUpdate',
    },
    employeeTeamChildren: {
      parent: 'Equipes',
      name: 'Funcionários da Equipe',
      path: 'employeeTeamChildren',
      childrenName: '',
      childrenPath: ''
    },
    vehicles: {
      parent: 'Cadastros',
      name: 'Veículos',
      path: 'vehicles',
      childrenName: 'Cadastro de Veículo',
      childrenPath: 'vehiclesNew',
      UpdateName: 'Edição de Veículo',
      UpdatePath: 'vehiclesUpdate',
    },
    employee: {
      parent: 'Cadastros',
      name: 'Funcionários',
      path: 'employee',
      childrenName: 'Cadastro de Funcionário',
      childrenPath: 'employeeNew',
      UpdateName: 'Edição de Funcionário',
      UpdatePath: 'employeeUpdate',
    },
    employeeTeam: {
      parent: 'Cadastros',
      name: 'Funcionários da Equipe',
      path: 'employeeTeam',
      childrenName: 'Cadastro de Funcionário',
      childrenPath: 'employeeTeamNew',
      UpdateName: 'Edição de Funcionário',
      UpdatePath: 'employeeTeamUpdate',
    },
    item: {
      parent: 'Cadastros',
      name: 'Itens',
      path: 'item',
      childrenName: 'Cadastro de Item',
      childrenPath: 'itemNew',
      UpdateName: 'Edição de Item',
      UpdatePath: 'itemUpdate',
    },
    osApropriacoes: {
      parent: 'Parametrização',
      name: 'OS Apropriações',
      path: 'osApropriacoes',
      childrenName: 'Cadastro de OS Apropriação',
      childrenPath: 'osApropriacoesNew',
      UpdateName: 'Edição de OS Apropriação',
      UpdatePath: 'osApropriacoesUpdate',
    },
    osMedicao: {
      parent: 'Parametrização',
      name: 'OS Medição',
      path: 'osMedicao',
      childrenName: 'Cadastro de OS Medição',
      childrenPath: 'osMedicaoNew',
      UpdateName: 'Edição de OS Medição',
      UpdatePath: 'osMedicaoUpdate',
    },
    paramBonificacao: {
      parent: 'Parametrização',
      name: 'Parâmetros Bonificação',
      path: 'paramBonificacao',
      childrenName: 'Cadastro de Parâmetro Bonificação',
      childrenPath: 'paramBonificacaoNew',
      UpdateName: 'Edição de Parâmetro Bonificação',
      UpdatePath: 'paramBonificacaoUpdate',
    },
    paramDesconto: {
      parent: 'Parametrização',
      name: 'Parâmetros Desconto',
      path: 'paramDesconto',
      childrenName: 'Cadastro de Parâmetro Desconto',
      childrenPath: 'paramDescontoNew',
      UpdateName: 'Edição de Parâmetro Desconto',
      UpdatePath: 'paramDescontoUpdate',
    },
    parametros: {
      parent: 'Parametrização',
      name: 'Parâmetros',
      path: 'parametros',
      childrenName: 'Cadastro de Parâmetro',
      childrenPath: 'parametrosNew',
      UpdateName: 'Edição de Parâmetro',
      UpdatePath: 'parametrosUpdate',
    },
    canteiroTotal: {
      parent: 'Parametrização',
      name: 'Canteiro Total',
      path: 'canteiroTotal',
      childrenName: 'Cadastro de Canteiro',
      childrenPath: 'canteiroTotalNew',
      UpdateName: 'Edição de Canteiro',
      UpdatePath: 'canteiroTotalUpdate',
    },
    obra: {
      parent: 'Parametrização',
      name: 'Medição Obra',
      path: 'obra',
      childrenName: 'Cadastro de Medição Obra',
      childrenPath: 'obraNew',
      UpdateName: 'Edição de Medição Obra',
      UpdatePath: 'obraUpdate',
    },
    osDetail: {
      parent: 'Dashboard',
      name: 'Detalhamento OS',
      path: 'osDetail',
      childrenName: '',
      childrenPath: '',
    },
    osChildren: {
      parent: 'OS',
      name: 'Apropriações',
      path: 'osChildren',
      childrenName: '',
      childrenPath: ''
    },
    sgm: {
      parent: 'Relatórios',
      name: 'SGM',
      path: 'sgm',
      childrenName: '',
      childrenPath: ''
    },
    dashboard: {
      parent: '',
      name: '',
      path: '',
      childrenName: '',
      childrenPath: '',
      UpdateName: '',
      UpdatePath: '',
    },
    myProfile: {
      parent: '',
      name: '',
      path: '',
      childrenName: '',
      childrenPath: '',
      UpdateName: '',
      UpdatePath: '',
    }
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