// /**
//  * Created by lucas on 16-Apr-17.
//  */
// var StatusServeur{
//     constructor(isIloUp = false, minuteConnection = 0, extinctionAutomatiqueBloque = false, maxMinuteSrv = 15, connected = 1) {
//         if(isIloUp.isInstanceOfStatusServeur){
//             this.connected = isIloUp.connected;
//             this.isIloUp = isIloUp.isIloUp;
//             this.minuteConnection = isIloUp.minuteConnection;
//             this.extinctionAutomatiqueBloque = isIloUp.extinctionAutomatiqueBloque;
//             this.maxMinuteSrv = isIloUp.maxMinuteSrv;
//         } else {
//             this.connected = connected;
//             this.isIloUp = isIloUp;
//             this.minuteConnection = minuteConnection;
//             this.extinctionAutomatiqueBloque = extinctionAutomatiqueBloque;
//             this.maxMinuteSrv = maxMinuteSrv;
//         }
//         this.isInstanceOfStatusServeur = true;
//     }
//     value: function(nom){
//
//     }
//     set(attribut, valeur, emitter){
//         switch (attribut){ //TRES TRES SALE dsl
//             case "connected":
//                 this.connected = valeur;
//                 break;
//             case "isIloUp":
//                 this.isIloUp = valeur;
//                 break;
//             case "minuteConnection":
//                 this.minuteConnection = valeur;
//                 break;
//             case "extinctionAutomatiqueBloque":
//                 this.extinctionAutomatiqueBloque = valeur;
//                 break;
//             case "maxMinuteSrv":
//                 this.maxMinuteSrv = valeur;
//                 break;
//         }
//         if (emitter){
//             emitter.emit("change");
//         }
//     }
//
//     send(socket){
//         socket.emit("serveurState", this);
//     }
// }
//
// module.exports = StatusServeur;