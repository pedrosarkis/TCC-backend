const getUserData = () => {
   let userName = document.getElementById('email').value;
   let userPassword = document.getElementById('password').value;

   return {
      userName,
      userPassword
   }
}

const login = async () => {
   const userData = getUserData();

   const settings = {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    };

    const response = await fetch(`/user/login`, settings);
    if (!response.ok) throw Error(response.message);

    try {
      const data = await response.json();
     if(data.success) {
        location.href = '/news';
     } else {
        console.log(data);
     }
    
    } catch (error) {
        console.log(error);
    }
}

document.getElementById('goLogin').addEventListener('click', login);

