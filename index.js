/**
 * Created by lucas on 14-Apr-17.
 */
const CONF = require("./config.json");
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bcrypt = require('bcrypt');
const Commande = require('./modules/command');
const StatusServeur = require('./modules/StatusServeur');
// import {StatusServeur} from './public/script/StatusServeur'; Don't work
const statusServeur =  new StatusServeur();
statusServeur.maxMinuteSrv = CONF.ilo.maxMinute;
const spoolerSSH = require('./SpoolerCommand');
spoolerSSH.start();

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const eventEmitter = new MyEmitter();
eventEmitter.setMaxListeners(20); // For test purpose only, it currently support 20 concurrent user but i only need 1 (me)
server.listen(CONF.controleur.port);


//TODO Revoir cette fonction pour la rendre obsolete avec le TODO de statusServeur.js
function refreshServeurStatus() {
    if (statusServeur.connected) {
        spoolerSSH.addCommand("power", function (data) {
            let isIloUpBuffer = (data.indexOf("On") != -1);
            controlerExtinction(isIloUpBuffer);
            if (statusServeur.isIloUp !== isIloUpBuffer) {
                statusServeur.set("isIloUp", isIloUpBuffer, eventEmitter);
            }
        });
    }
}
refreshServeurStatus();
setInterval(() => {refreshServeurStatus()}, 1000 * 60);
///</Boucle qui sert a verifier l'etat du serveur toute les minutes>

function controlerExtinction(serveurAllume){
    if (serveurAllume){
        statusServeur.set("minuteConnection",statusServeur.minuteConnection + 1, eventEmitter);
    } else {
        statusServeur.set("minuteConnection", 0, eventEmitter);
    }
    if (statusServeur.minuteConnection >= statusServeur.maxMinuteSrv && !statusServeur.extinctionAutomatiqueBloque){
        spoolerSSH.addCommand("power off", ()=> {
            spoolerSSH.addCommand("power off"); // On l'eteint 2 fois pck le serveur est tarpin con
        });
    }
}


///<views PUG>
app.set("views", __dirname + "/views");
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('dashboard', {
        ip_serveur: CONF.controleur.ip,
        port: CONF.controleur.port
    });

});

///</views PUG>




io.on("connection", function (socket) {
    statusServeur.connected += 1;
    // console.log("connexion de " + socket.handshake.ip);
    socket.emit("serveurState", statusServeur);

    eventEmitter.on("change", () => {
        statusServeur.send(socket);
    });


    setInterval(function(){socket.emit("time", "Il est " + new Date())}, 1000);

//TODO Eliminer socket.on shutdown etc et tout remplacer par le spoolerSSH command ? // Enfait c'etait une mauvaise idee, le spooler n'a rien a voir avec les commandes cote client
    //POUR : simplification enorme du code
    //CONTRE : chaque commande a ses conditions propres ex pour eteindre le srv il doit etre allume
    //MAIS : Si on fait un spoolerSSH c'est pas grave si on envois des commandes qui servent a rien.
    //OU alors on place la structure de controle un peu plus bas dans le code, dans une classe serveur ou quoi
    socket.on("commande", (data) => {
        let commande = new Commande(data);
    });

    socket.on("shutdown", (data) => {
        let commande = new Commande(data);
        if (isNaN(commande.temps))
            data.temps = 0;

        bcrypt.compare(commande.pass, CONF.controleur.pass, function(err, res) {
            if (res && statusServeur.isIloUp) {
                // statusServeur.extinctionAutomatiqueBloque = true; //On empeche le serveur de s'eteindre avant les minutes donnees
                setTimeout(() => {
                    if (!statusServeur.extinctionAutomatiqueBloque) {
                        // console.log("extinction du serveur a " + new Date() + temps + "minutes");
                        let extinctionOk = false;
                        while (!extinctionOk){
                            try {
                                spoolerSSH.addCommand("power off", () => {
                                    statusServeur.set("extinctionAutomatiqueBloque", false, eventEmitter);
                                    extinctionOk = true;
                                    // statusServeur.extinctionAutomatiqueBloque = false; // On debloque l'extinction automatique du srv
                                })
                            } catch (ex){
                                extinctionOk = false;
                                console.log("il y a eu une erreur " + ex.message);
                            }
                        }
                    }
                }, commande.temps * 1000 * 60 + 1000);

                commande.execute = true;
            } else if (!res){
                commande.failReason += " Mauvais Mot de passe";
            } else {
                commande.failReason += " Serveur deja eteint";
            }
            socket.emit("retour", commande); // commande.execute = false par defaut
        });
    });

    socket.on("startup", (data) => {
        let commande = new Commande(data);
        bcrypt.compare(commande.pass, CONF.controleur.pass, function(err, res) {
            if (res && !statusServeur.isIloUp) {
                setTimeout(() => {
                    spoolerSSH.addCommand("power on")
                }, 1000);
                // console.log("allumage du serveur a " + new Date());
                commande.execute = true;
                statusServeur.send(socket);
            } else if (!res){
                commande.failReason += " Mauvais Mot de passe";
            } else {
                commande.failReason += " Serveur deja allumé";
            }
            socket.emit("retour", commande); // commande.execute = false par defaut
        });
    });

    socket.on("bloque", (data) => {
        // console.log("recu");
        // console.log(data);
        let commande = new Commande(data);
        bcrypt.compare(commande.pass, CONF.controleur.pass, function(err, res) {
            if(res){
                statusServeur.set("extinctionAutomatiqueBloque", commande.bloque, eventEmitter);
                commande.execute = true;
            } else {
                commande.failReason += " Mauvais Mot de passe";
            }
            socket.emit("retour", commande); // commande.execute = false par defaut
        });
    });

    socket.on('disconnect', function () {
        statusServeur.connected -= 1;
        // console.log("deconnexion de " + socket.handshake.ip);
    });

});







