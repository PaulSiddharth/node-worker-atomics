const { Worker } = require('worker_threads');

const sharedBuffer = new SharedArrayBuffer(8);
const sharedCounter = new Int32Array(sharedBuffer);

sharedCounter[0] = 0; // Counter
sharedCounter[1] = 0; // Lock (0 = unlocked, 1 = locked)

const NUM_WORKERS = 5;
let workersCompleted = 0;

for (let i = 0; i < NUM_WORKERS; i++) {
    const worker = new Worker('./worker.js', { workerData: {sharedBuffer, id:i} });

    worker.on('message', (msg) => {
        console.log(`Worker ${i + 1} finished: ${msg}`);
    });

    worker.on('exit', () => {
        workersCompleted++;
        if (workersCompleted === NUM_WORKERS) {
            console.log(`Final counter value: ${sharedCounter[0]}`);
        }
    });
}