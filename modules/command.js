/**
 * Created by lucas on 16-Apr-17.
 */
class Commande{
    constructor(commande = "", pass = "",  bloque = false, temps = 0){
        if (commande.instanceCommande !== undefined){
            this.commande = commande.commande;
            this.pass = commande.pass;
            this.bloque = commande.bloque;
            this.temps = commande.temps;
            this.execute = commande.execute;
            this.failReason = commande.failReason;
        } else {
            this.commande = commande;
            this.pass = pass;
            this.bloque = bloque;
            this.temps = temps;
            this.execute = false;
            this.failReason = "";
        }
        this.instanceCommande = true;
    }
    send(socket){
        socket.emit(this.commande, this);
    }
}

module.exports = Commande;