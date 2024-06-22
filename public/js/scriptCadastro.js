function enviar() {
  const form = document.querySelector('form'),
    nome = document.getElementById('nome'),
    email = document.getElementById('email'),
    senha = document.getElementById('senha'),
    dia = document.getElementById('dianascimento'),
    mes = document.getElementById('mesnascimento'),
    ano = document.getElementById('anonascimento'),
    nascimento = ano + '-' + mes + '-' + dia;
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    validainputnome()
    validainputemail()
    validainputsenha()
  })
  function validainputnome() {
    const nomevalue = nome.value.trim()
    if (nomevalue == '') {
      errovalidar(nome, 'preencha o campo Nome.')
    } else {
      sucevalidar(nome)
    }
  }
  function validainputemail() {
    const emailvalue = email.value.trim()
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailvalue == '') {
      erroemail(email, 'preencha o campo Email.')
    } else if (!regex.test(emailvalue)) {
      erroemail(email, 'preencha o Email corretamente.')
    } else {
      suceemail(email)
    }
  }
  function validainputsenha() {
    const senhavalue = senha.value.trim()
    if (senhavalue == '') {
      errosenha(senha, 'preencha o campo Senha.')
    } else if (senhavalue.length < 8) {
      errosenha(senha, 'No minimo 8 caracteres')
    } else {
      sucesenha(senha)
    }
  }
  function errovalidar(input, message) {
    const formcontrol = input.parentElement
    const small = formcontrol.querySelector('small')
    small.innerText = message
    formcontrol.className = 'nomeerro erro'
  }
  function sucevalidar(input) {
    const formcontrol = input.parentElement
    formcontrol.className = 'nomeerro suce'
  }
  function erroemail(input, message) {
    const formcontrol = input.parentElement
    const small = formcontrol.querySelector('small')
    small.innerText = message
    formcontrol.className = 'emailerro erro'
  }
  function suceemail(input) {
    const formcontrol = input.parentElement
    formcontrol.className = 'emailerro suce'
  }
  function errosenha(input, message) {
    const formcontrol = input.parentElement
    const small = formcontrol.querySelector('small')
    small.innerText = message
    formcontrol.className = 'senhaerro erro'
  }
  function sucesenha(input) {
    const formcontrol = input.parentElement
    formcontrol.className = 'senhaerro suce'
  }
  nome.addEventListener('input', () => {
    validainputnome()
  })
  email.addEventListener('input', () => {
    validainputemail()
  })
  senha.addEventListener('input', () => {
    validainputsenha()
  })
  const nomevalue = nome.value.trim(),
    emailvalue = email.value.trim(),
    senhavalue = senha.value.trim(),
    regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (nomevalue !== '') {
    if (emailvalue !== '' && regex.test(emailvalue)) {
      if (senhavalue !== '' && senhavalue.length > 8) {
        document.getElementById('form').submit();
      }
    }
  }
}