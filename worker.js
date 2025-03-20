// const { parentPort, workerData } = require('worker_threads');

// const sharedCounter = new Int32Array(workerData);

// for (let i = 0; i < 1000; i++) {
//     Atomics.add(sharedCounter, 0, 1); // Safely increment counter
// }

// parentPort.postMessage(`Counter updated to ${sharedCounter[0]}`);

const { parentPort, workerData } = require('worker_threads');

const sharedCounter = new Int32Array(workerData.sharedBuffer);

function acquireLock() {
    while (Atomics.compareExchange(sharedCounter, 1, 0, 1) !== 0) {
        Atomics.wait(sharedCounter, 1, 1); // Wait if locked
    }
}

function releaseLock() {
    Atomics.store(sharedCounter, 1, 0); // Unlock
    Atomics.notify(sharedCounter, 1); // Wake up waiting workers
}

for (let i = 0; i < 4; i++) {
    acquireLock();

    if (sharedCounter[0] >= 10) {
        releaseLock();
        break;
    }

    Atomics.add(sharedCounter, 0, 1); // Safely increment counter
    // log the counter value and the thread id
    console.log(`Thread ${workerData.id} incremented counter to ${sharedCounter[0]}`);
    releaseLock();
}

parentPort.postMessage(`Counter updated to ${sharedCounter[0]}`);
