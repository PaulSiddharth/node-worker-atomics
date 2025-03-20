const { Worker, MessageChannel } = require('worker_threads');
const { port1, port2 } = new MessageChannel()

const worker = new Worker('./transferPortWorker.js')
port1.on("message", msg => {
    console.log(`Message from worker----> ${msg}`)
})
worker.postMessage({ port: port2}, [port2])