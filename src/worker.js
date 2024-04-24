// worker.js

// 定义一个简单的函数，在工作线程中执行
const doWork = () => {
  // 这里可以是你的一些耗时操作
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  return result;
};

// 监听来自主线程的消息
onmessage = function (e) {
  // 执行工作线程中的任务
  const result = doWork();
  // 将结果发送回主线程
  postMessage(result);
};
