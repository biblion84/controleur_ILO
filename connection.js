/**
 * Created by lucas on 14-Apr-17.
 */
const CONF = require("./config.json");
const Client = require('ssh2').Client;

//TODOok Il faut faire une sorte de spoolerSSH d'impression ou les commandes sont place les une apres les autres.
// Pour eviter les doublons de commandes.
function sendCommand(command, callback){
    let conn = new Client();
        conn.on('ready', function () {
            conn.exec(command, function (err, stream) {
                console.log("err" + err + " -- stream " + stream);
                if (err) {
                    conn.end();
                    return;
                    // console.log("il y a eu une erreur \n" + err)
                }
                stream.on('close', function (code, signal) {
                    // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                    conn.end();
                }).on('data', function (data) {
                    // console.log("STD" + data);
                    conn.end();
                    typeof callback === 'function' && callback(data);
                }).stderr.on('data', function (data) {
                    // console.log('STDERR: ' + data);
                });
            });
        }).on('error', function(err) {
            conn.end();
        }).connect({
            host: CONF.ilo.host,
            port: 22,
            username: CONF.ilo.user,
            password: CONF.ilo.pass,
            algorithms: {
                hmac: ['hmac-sha1'],
                cipher: ['aes128-cbc']
            },
            readyTimeout : 10000 * 1000
        });
};

module.exports.sendCommand = sendCommand;
