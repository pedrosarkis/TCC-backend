const getUserData = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passAgain = document.getElementById('passAgain').value; 

    return {
        email,
        passAgain,
        password
    }
}

const createUser = async () => {
    debugger;
    const user = getUserData();
    if(user.password !== user.passAgain) {
        alert('As senhas não conferem');
        return false;
    }
    const settings = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
      const response = await fetch(`/user/create`, settings);
      if (!response.ok) throw Error(response.message);

      try {
        const data = await response.json();
        if(data.sucess) {
          location.href = '/news'
        }
       
      } catch (error) {
          
      }
}

document.getElementById('createUser').addEventListener('click', createUser);