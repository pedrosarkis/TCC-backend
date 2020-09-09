const getProfileData =  async () => {
    debugger;
    let response = await fetch(`/user/history`);
    let data = await response.json();
    document.getElementById('email').value = data.user.userName;
    let allAvaliations = data.news;
    let dataAppend = allAvaliations.map(news => {
        return ` 
                <ul> <li> ${news.content} </li>
                <li> ${news.isFakeNews} </li>
                
        `
    })
    document.getElementById('avaliationHistory').innerHTML = dataAppend;
}

getProfileData();