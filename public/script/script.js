var socket = io.connect('http://#{ip_serveur}:#{port}');
socket.on('welcome', function (data) {
    document.getElementById("texte").innerText = data;
});


socket.on('serveurState', function (data) {
    let serveurState = new StatusServeur(data);
    console.log(serveurState);

    let etat = document.getElementById("etatServeur");
    let macaron = etat.childNodes[0];
    let texte = etat.childNodes[2];
    let button = etat.childNodes[4];
    if (serveurState.isIloUp) {
        texte.innerText = "Serveur allumé";
        macaron.style.backgroundColor = "green";
        button.innerText = "shutdown";
        button.onclick = () => {
            new Commande("shutdown", document.getElementById('password').value).send(socket);
        }
    } else {
        texte.innerText = "Serveur eteint";
        macaron.style.backgroundColor = "red";
        button.innerText = "startup";
        button.onclick = () => {
            new Commande("startup", document.getElementById('password').value).send(socket);
        }
    }
    etat.appendChild(button);


    let blocage = document.getElementById("bloquerServeur");
    macaron = blocage.childNodes[0];
    texte = blocage.childNodes[2];
    button = blocage.childNodes[4];
    if (serveurState.extinctionAutomatiqueBloque) {
        texte.innerText = "Extinction bloqué";
        macaron.style.backgroundColor = "green";
        button.innerText = "Autoriser Extinction";
        button.onclick = () => {
            new Commande("bloque", document.getElementById('password').value, false).send(socket);
        };
    } else {
        texte.innerText = "Extinction autorisée";
        macaron.style.backgroundColor = "red";
        button.innerText = "Bloquer Extinction";
        button.onclick = () => {
            new Commande("bloque", document.getElementById('password').value, true).send(socket);
        };
    }


    let attente = document.getElementById("attente");
    macaron = attente.childNodes[0];
    texte = attente.childNodes[2];
    if (!serveurState.extinctionAutomatiqueBloque) {
        button = attente.childNodes[4];
        texte.innerText = "Il n'y a pas d'extinction en attente";
        macaron.style.backgroundColor = "green";
        button.innerText = "Annuler Extinction";
        button.onclick = () => {
            new Commande("annulation", document.getElementById('password').value, false).send(socket);
        };
    }
});

var isConnected = 0;
socket.on('time', function (data) {
    document.getElementById("date").innerText = data;
    isConnected++;
});

setInterval(function () {
    let connected = document.getElementById("isConnected");

    let macaron = connected.childNodes[0];
    if (!isConnected){
        macaron.style.backgroundColor = "red";
    } else {
        macaron.style.backgroundColor = "green";
    }
    isConnected = 0;
}, 2000);

socket.on("retour", function (data) {
    let commande = new Commande(data);
    console.log(commande);
    let table = document.getElementById("tableCommande");
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    if (commande.execute){
        td.innerText = "commande executé";
        td.style.backgroundColor = "green";
    } else {
        td.innerText = "commande echoué";
        td.style.backgroundColor = "red";

    }
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerText = commande.commande;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerText = commande.failReason;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerText = new Date();
    tr.appendChild(td);
    table.appendChild(tr);
});

function envoyer (){
    let commande = n;
    commande.send(socket);
    console.log("requete envoye");
}
