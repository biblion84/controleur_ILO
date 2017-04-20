/**
 * Created by lucas on 16-Apr-17.
 */
//TODO Il faut faire en sorte que chaque modification d'un attribut du serveur envois une maj au client.
class StatusServeur{
    constructor(isIloUp = false, minuteConnection = 0, extinctionAutomatiqueBloque = false, maxMinuteSrv = 15, connected = 1) {
        if(isIloUp.isInstanceOfStatusServeur){
            this.connected = isIloUp.connected;
            this.isIloUp = isIloUp.isIloUp;
            this.minuteConnection = isIloUp.minuteConnection;
            this.extinctionAutomatiqueBloque = isIloUp.extinctionAutomatiqueBloque;
            this.maxMinuteSrv = isIloUp.maxMinuteSrv;
        } else {
            this.connected = connected;
            this.isIloUp = isIloUp;
            this.minuteConnection = minuteConnection;
            this.extinctionAutomatiqueBloque = extinctionAutomatiqueBloque;
            this.maxMinuteSrv = maxMinuteSrv;
        }
        this.isInstanceOfStatusServeur = true;
    }

    construire(commande){
        if (commande.isInstanceOfStatusServeur){
            this.connected = commande.connected;
            this.isIloUp = commande.isIloUp;
            this.minuteConnection = commande.minuteConnection;
            this.extinctionAutomatiqueBloque = commande.extinctionAutomatiqueBloque;
            this.maxMinuteSrv = commande.maxMinuteSrv;
        }
    }

//TODO tester set
    set(attribut, valeur, emitter){
        switch (attribut){ //TRES TRES SALE dsl
            case "connected":
                this.connected = valeur;
                break;
            case "isIloUp":
                this.isIloUp = valeur;
                break;
            case "minuteConnection":
                this.minuteConnection = valeur;
                break;
            case "extinctionAutomatiqueBloque":
                this.extinctionAutomatiqueBloque = valeur;
                break;
            case "maxMinuteSrv":
                this.maxMinuteSrv = valeur;
                break;
        }
        if (emitter){
            emitter.emit("change");
        }
    }

    send(socket){
        socket.emit("serveurState", this);
    }
}
