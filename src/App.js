// MyComponent.js

import React, { useState } from "react";

const MyComponent = () => {
  const [result, setResult] = useState(null);

  const handleWorkerMessage = (event) => {
    // 接收来自工作线程的消息并更新状态
    setResult(event.data);
  };

  const runWorker = () => {
    // 创建一个新的 Worker 实例
    const worker = new Worker(new URL("./worker.js", import.meta.url));

    worker.onmessage = handleWorkerMessage; // 设置消息处理函数
    // 向工作线程发送消息（这里可以是任何数据）
    worker.postMessage("start");
  };

  return (
    <div>
      <button onClick={runWorker}>Run Worker</button>
      {result && <p>Result: {result}</p>}
    </div>
  );
};

export default MyComponent;
