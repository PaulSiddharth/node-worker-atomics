const {
    Worker, isMainThread, parentPort, workerData,
  } = require('node:worker_threads');
  
  if (isMainThread) {
    module.exports = function parseJSAsync(script) {
      return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: script,
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0)
            reject(new Error(`Worker stopped with exit code ${code}`));
        });
      });
    };
  } else {
    const { parse } = require('some-js-parsing-library');
    const script = "hello parent";
    parentPort.postMessage(script);
  }

  parseJSAsync('some script').then(console.log).catch(console.error);
// Compare this snippet from Worker/worker.js:
// const {parentPort, workerData} = require('worker_threads');
// parentPort.postMessage(workerData.num * workerData.num)
// Compare this snippet from Worker/index.js:
