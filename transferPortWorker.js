const {parentPort} = require('worker_threads');
parentPort.on("message", msg => {
    msg.port.postMessage('Sent Hi from using  transfered port')
})