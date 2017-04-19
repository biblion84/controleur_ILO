/**
 * Created by lucas on 18-Apr-17.
 */
const connection = require('./connection');

const Commande = require('./modules/command');
var listCommand = [];
var spoolerSSH = {
    addCommand: function (commande, callback) {
        let com = new Commande(commande);
        com.callback = callback;
        listCommand.push(com);
    },
    start:  () =>{
        spooler();
    }



};

function spooler(){
    if (listCommand && listCommand.length){
        connection.sendCommand(listCommand[0].commande, function(data){
            if (listCommand[0])
                typeof listCommand[0].callback === 'function' && listCommand[0].callback(data);
            listCommand.reverse();
            listCommand.pop();
            listCommand.reverse();
            spooler();
        })
    } else {
        setTimeout(function () {
            spooler();
        }, 1000);
    }
}

module.exports = spoolerSSH;