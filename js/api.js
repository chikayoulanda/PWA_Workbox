var base_url = "https://api.football-data.org/v2/";
var dataParam = 2002;
var dbPromise=idb.open("mydatabase", 1, function(upgradeDb){
    if(!upgradeDb.objectStoreNames.contains("teams")){
        upgradeDb.createObjectStore("teams", {keyPath:'id', autoIncrement:true});
    }
    console.log('object stored created')
});

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);

        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getTeams() {

    if ('caches' in window) {
        caches.match(base_url + "teams" ,{
            headers: {
                'X-Auth-Token': 'd5c6b6dac77d40cf972a5031da348e7d'
            }
        })
            .then(function (response) {
                if (response) {
                    response.json()
                        .then(function (data) {
                            var teamHTML = `
                            <div class="row">
                            `;
                            data.teams.forEach(function (team) {
                                teamHTML += `
                                    <ul class="collection with-header">
                                        <li class="collection-item">
                                            <div>
                                            ${team.name}
                                            <a href="article.html?id=${team.id}">
                                                <span class="center">
                                                    Go to detail
                                                </span> 
                                            </a>
                                            </div>
                                        </li>
                                    </ul>
                            </div>
                                `;
                            });
                            document.getElementById("teams").innerHTML = teamHTML;
                        }).catch(error);
                }
            })
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true })
                .then(function (response) {
                    return response || fetch(event.request);
                })
        )
    }

    fetch(base_url + "teams", {
        headers: {
            'X-Auth-Token': 'd5c6b6dac77d40cf972a5031da348e7d'
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            var teamHTML = `
            <div class="row">
            `;  
            data.teams.forEach(function(team) {
                teamHTML += `
                    <ul class="collection with-header">
                        <li class="collection-item">
                            <div>
                            ${team.name}
                            <a href="article.html?id=${team.id}">
                                <span class="right">
                                    Go to detail
                                </span> 
                            </a>
                    
                            </div>
                        </li>
                    </ul>
            </div>
                `;

            });

            document.getElementById("teams").innerHTML = teamHTML;
        })
}

function detailTeam(){
    var urlParams = new URLSearchParams(window.location.search);
    var nameParam = urlParams.get("id");

    if ("caches" in window) {
        caches.match(base_url + "teams/" + nameParam).then(function(response) {
          if (response) {
            response.json().then(function(data) {
                var teamHTML=`
                <table>
                    <tr>
                        <td>Name</td>
                        <td>${data.name}</td>
                    </tr>
                    <tr>
                        <td>Short Name</td>
                        <td>${data.shortName}</td>
                    </tr>
                    <tr>
                        <td>tla</td>
                        <td>${data.tla}</td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>${data.phone}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>${data.email}</td>
                    </tr> 
                    <tr>
                        <td></td>
                        <td>
                            <button onclick="addTeam()">
                                <i class="material-icons">add</i>
                            </button> 
                        </td> 
                    </tr>     
                </table>    
            `;
              // Sisipkan komponen card ke dalam elemen dengan id #content
              document.getElementById("body-content").innerHTML = teamHTML;
            });
          }
        });
      }
    

    fetch(base_url + "teams/" + nameParam,{
        headers:{
            'X-Auth-Token': 'd5c6b6dac77d40cf972a5031da348e7d'
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {

            var teamHTML=`
                <table>
                    <tr>
                        <td>Name</td>
                        <td>${data.name}</td>
                    </tr>
                    <tr>
                        <td>Short Name</td>
                        <td>${data.shortName}</td>
                    </tr>
                    <tr>
                        <td>tla</td>
                        <td>${data.tla}</td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>${data.phone}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>${data.email}</td>
                    </tr> 
                    <tr>
                        <td></td>
                        <td>
                            <button onclick="addTeam()">
                                <i class="material-icons">add</i>
                            </button> 
                        </td> 
                    </tr>     
                </table>    
            `;
            document.getElementById("body-content").innerHTML = teamHTML;
        })
}

function addTeam() {
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\\\'t support IndexedDB');
        return;
    }

    var urlParams = new URLSearchParams(window.location.search);
    var nameParam = urlParams.get("id");

    fetch(base_url + "teams/" + nameParam,{
        headers:{
            'X-Auth-Token': 'd5c6b6dac77d40cf972a5031da348e7d'
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            dbPromise.then(function (db) {
                var tx = db.transaction('teams', 'readwrite');
                var store = tx.objectStore('teams');
                var teams = {
                    name: `${data.name}`
                };
                store.put(teams);
                return tx.complete;
            }).then(function () {
                // window.location.href = "fav-teams.html";
                console.log('Team successfully added');
            }).catch(function (error) {
                alert('Fail to add Team :(');
                console.log('Team failed to added');
                console.log(error);
            });
        });

}

function getAllTeam() {
    dbPromise.then(function (db) {
        var tx = db.transaction('teams', 'readonly');
        var store = tx.objectStore('teams');

        return store.getAll();
    }).then(function (team) {
        var favouriteHTML = "";

        if (team == 0){
            favouriteHTML += `
                    <p class="center-align">You don't have any favourite Team :(</p>
                `;
            document.getElementById('body-content').innerHTML = favouriteHTML;
        }else{
            team.forEach(function (teams) {
                favouriteHTML += `
                    <ul class="collection with-header">
                      <li class="collection-item">
                        <div>
                            ${teams.name}
                            <a href="#" onclick='deleteTeam(${teams.id})'>
                                <i class="material-icons right">delete</i>
                            </a>
                        </div>
                      </li>
                    </ul>
                    `
            });

            document.getElementById('body-content').innerHTML = favouriteHTML;
        }
    })
}
function deleteTeam(id) {
    dbPromise.then(function (db) {
        var tx = db.transaction('teams', 'readwrite');
        var store = tx.objectStore('teams');
        store.delete(id);
        return tx.complete;
    }).then(function () {
        window.location.href = "fav-teams.html";
        console.log('Team deleted');
    }).catch(function (error) {
        alert('Fail to add team :(');
        console.log(error);
    });
}