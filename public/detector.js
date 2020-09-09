const getNewsData = () => {
    if(document.getElementById('searchByUrl').checked) {
        return document.getElementById('textFound').value;
    } else {
        return  document.getElementById('newsData').value;
    }
}

const getUrlData = () => {
    let url = document.getElementById('urlToScrap').value;

    return { 
        url
    }
}

const verifyNewsConfiability = () => {
    let newsData = getNewsData();
    let isFakeNews = false;
    if(newsData.charAt(0) !== 'C'){
        isFakeNews = true;
    }
    showResult(isFakeNews);
}
const getGroupData = () => {
    let groupName = document.getElementById('groupName').value;
    let groupDescription = document.getElementById('groupDescription').value;
    let groupParticipants = document.getElementById('groupParticipants').value;

    return {
        groupDescription,
        groupName,
        groupParticipants
    }
}
const createGroup = async () => {
    const groupData = getGroupData();
    const settings = {
        method: 'POST',
        body: JSON.stringify(groupData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        } 
      }

      const response = await fetch(`/group/create`, settings);
      if (!response.ok) throw Error(response.message);

      try {
        const data = await response.json();
       if(data.success) {
          alert('Grupo Criado com sucesso');
       }
      } catch (error) {
          
      }
}

const logout = async () => {
    const logoutAction = {
        logout: 'logout'
    };
    const settings = {
        method: 'POST',
        body: JSON.stringify(logoutAction),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        } 
      }

      const response = await fetch(`/user/logout`, settings);
      if (!response.ok) throw Error(response.message);

      try {
        const data = await response.json();
       if(data.success) {
           location.reload(true);
       }
      } catch (error) {
          
      }
}

const viewGroup = async () => {
    let response = await fetch(`/group/view`);
    let data = await response.json()
    return data;
}



const showResult = (resultedSearch) => {
    document.getElementById('result').value = resultedSearch ? 'A notícia provavelmente é falsa.' : 'A notícia provavelmente é verdadeira.';
}
const scrapUrl = async () => {
    
    let url = getUrlData();
   
    if(!url.url.length) return;
    
    const settings = {
        method: 'POST',
        body: JSON.stringify(url),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
      const response = await fetch(`/news/scrap`, settings);
      if (!response.ok) throw Error(response.message);

      try {
        const data = await response.json();
        console.log(data);
        document.getElementById('textFound').innerText = data;
      } catch (error) {
          
      }
}

document.getElementById('searchByUrl').addEventListener('change', () => {
    let searchByUrl = document.getElementById('searchByUrl');
    if(searchByUrl.checked) {
        document.getElementById('textSearch').classList.add('hide');
        document.getElementById('linkSearch').classList.remove('hide');
        document.getElementById('titleSearch').innerText = 'Insira abaixo uma URL para pesquisa';
    }else {
        document.getElementById('textSearch').classList.remove('hide');
        document.getElementById('linkSearch').classList.add('hide'); 
        document.getElementById('titleSearch').innerText = 'Cole seu texto abaixo para fazer a pesquisa';
    } 
})

document.getElementById('viewGroup')?.addEventListener('click', viewGroup);
document.getElementById('logoutAction')?.addEventListener('click', logout);
document.getElementById('urlToScrap')?.addEventListener('focusout', scrapUrl);
document.getElementById('verify')?.addEventListener('click', verifyNewsConfiability);
document.getElementById('createGroup')?.addEventListener('click', createGroup);