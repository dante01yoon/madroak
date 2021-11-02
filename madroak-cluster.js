const { appLog } = require("./util");
const cluster = require("cluster");

function startWorker() {
  const worker = cluster.fork();
  appLog(`CLUSTER: Worker ${worker.id} started`);
}

if (cluster.isMaster) {
  require("os").cpus().forEach(startWorker);

  // 연결이 끊어진 워커를 로그에 기록
  // 연결이 끊어진 워커가 exit된 후 새 워커를 만든다.
  cluster.on("disconnect", worker => console.log(
    `CLUSTER: Worker ${worker.id} disconnected from the cluster`
  ))

  // 워커가 종료되면 이를 대체할 새 워커를 만든다.
  cluster.on("exit", (worker, code, signal) => {
    appLog(`CLUSTER: Worker ${worker.id} died with exit code ${code} (${signal})`)
    startWorker();
  })
} else {
  const port = process.env.PORT || 3000;
  require("./madroak")(port);
}