function enviar(){
    const form = document.querySelector('form');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    form.addEventListener('submit', (e) =>{
      e.preventDefault()
      validainputemail()
      validainputsenha()
      })
    
    function validainputemail(){
        const emailvalue = email.value.trim()
        var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(emailvalue == ''){
             erroemail(email, 'preencha o campo Email.')
              }else if( !regex.test(emailvalue)){
                erroemail(email, 'preencha o Email corretamente.')
              }else{
               suceemail(email)
              }
       }
        function validainputsenha(){
          const senhavalue = senha.value.trim()
          if(senhavalue == ''){
            errosenha(senha, 'preencha o campo Senha.')
             }else if(senhavalue.length < 8){
              errosenha(senha, 'No minimo 8 caracteres')
             }else{
              sucesenha(senha)
             }
        }
        function erroemail(input, message){
            const formcontrol = input.parentElement
            const small = formcontrol.querySelector('small')
            small.innerText = message
            formcontrol.className = 'emailerro erro'
            }
            function suceemail(input){
              const formcontrol = input.parentElement
              formcontrol.className = 'emailerro suce'
              }
              function errosenha(input, message){
                const formcontrol = input.parentElement
                const small = formcontrol.querySelector('small')
                small.innerText = message
                formcontrol.className = 'senhaerro erro'
                }
                function sucesenha(input){
                  const formcontrol = input.parentElement
                  formcontrol.className = 'senhaerro suce'
                  }
          email.addEventListener('input', () => {
            validainputemail()
          })
          senha.addEventListener('input', () => {
            validainputsenha()
          })
          const emailvalue = email.value.trim()
          const senhavalue = senha.value.trim()
         const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              if (emailvalue !== '' && regex.test(emailvalue)) {
                  if (senhavalue !== '' && senhavalue.length > 8) {
                      document.getElementById('form').submit();
                  }
              } 
        }
        