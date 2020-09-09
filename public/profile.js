const getProfileData =  async () => {
    debugger;
    let response = await fetch(`/user/history`);
    let data = await response.json();
    document.getElementById('email').value = data.user.userName;
    let allAvaliations = data.news;
    let dataAppend = allAvaliations.map(news => {
        return ` 
                <ul> 
                    <li> ${news.content} </li>
                    <li> ${news.isFakeNews} </li>
                </ul>
        `
    })
    document.getElementById('avaliationHistory').innerHTML = dataAppend;
}

const cleanHistoryUser = async () => {
    let response = await fetch(`/user/clean`);
    let data = await response.json();
    if(data.success) {
        location.reload(true);
    }
    
}

document.getElementById('cleanHistory').addEventListener('click', cleanHistoryUser);
getProfileData();