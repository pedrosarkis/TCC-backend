
const getNewsData = () => {
    if(document.getElementById('searchByUrl').checked) {
        return {
            content: document.getElementById('textFound').value,
            url: document.getElementById('urlToScrap').value,
        }
    } else {
        return {
            content:document.getElementById('newsData').value
        } 
    }
}

const getUrlData = () => {
    let url = document.getElementById('urlToScrap').value;

    return { 
        url
    }
}

const verifyNewsConfiability =  async () => {
    let newsData = getNewsData();

    const settings = {
        method: 'POST',
        body: JSON.stringify(newsData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        } 
      }

      const response = await fetch(`/news/create`, settings);
      if (!response.ok) throw Error(response.message);

      try {
        const data = await response.json();
        if(data.success) {
            alert('Noticia salva no seu histórico')
            showResult(data.veredict)
        }
        
      } catch (error) {
          
      }


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
    $('#exampleModal').modal();
    document.getElementById('groupName').value = data.userHasGroup.groupName;
    document.getElementById('groupDescription').value = data.userHasGroup.groupDescription;
    document.getElementById('groupParticipants').value = data.userHasGroup.groupParticipants;
}

const showResult = (veredict) => {
    debugger;
    document.getElementById('result').value = !veredict ? 'A notícia provavelmente é falsa.' : 'A notícia provavelmente é verdadeira.';
    let totalFakeNews =  document.getElementById('totalFakeNews');
    let addResult = resultedSearch ? parseInt(totalFakeNews.innerText)+1 : totalFakeNews.innerText;
   
    totalFakeNews.innerHTML = addResult;
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