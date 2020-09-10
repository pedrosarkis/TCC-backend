const recoveryPassword = async () => {
   let email = {
       email: document.getElementById('email').value
   } 
    const settings = {
        method: 'POST',
        body: JSON.stringify(email),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
      const response = await fetch(`/user/recover`, settings);
      if (!response.ok) throw Error(response.message);

      try {
        const data = await response.json();
        if(data.success) {
          document.getElementById('messageSent').innerText = "Uma nova senha foi enviada para o seu e-mail";
      }
        document.getElementById('textFound').innerText = data;
      } catch (error) {
          
      }
   
}

document.getElementById('recoverPassword').addEventListener('click', recoveryPassword);