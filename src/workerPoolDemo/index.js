import React from "react";
import WorkerPool from "./WorkerPool";
import { findPrimes } from "./utils/findPrimes";
import { generateData } from "./utils/generateData";

// 分配线程工作
const assignWorker = (worker, postData, callback) => {
  // 线程工作
  worker.postMessage(postData);
  // 获取计算结果
  worker.onmessage = (event) => callback(event?.data);
};

const computeOnWorkers = (data, poolSize = 10, sliceSize = 20) => {
  // 创建线程池
  const POOL_SIZE = poolSize;
  const pool = new WorkerPool(POOL_SIZE);

  // 数据切片
  const SLICE_SIZE = sliceSize;
  const result = Array.from({
    length: data.length % SLICE_SIZE ? SLICE_SIZE + 1 : SLICE_SIZE,
  }).map(async (_, index) => {
    return new Promise(async (resolve) => {
      const sliceNum = (data.length / SLICE_SIZE) | 0;
      // 计算切片下标
      const startIndex = index * sliceNum;
      const endIndex =
        startIndex + sliceNum > data.length
          ? data.length
          : startIndex + sliceNum;
      // 获取切片数据
      const dataSlice = data.slice(startIndex, endIndex);
      const postData = {
        data: dataSlice,
      };
      // 获取线程
      const thread = pool.assign();
      if (thread.status === "fail") {
        // 线程池无空闲线程，等待直到空闲
        await thread.wait;
        // 获取空闲线程
        const _thread = pool.assign();
        const workerObj = _thread?.worker;
        assignWorker(workerObj?.worker, postData, (result) => {
          resolve(result);
          pool.release(workerObj?.id);
        });
      } else {
        // 线程池有空闲线程
        const workerObj = thread?.worker;
        assignWorker(workerObj?.worker, postData, (result) => {
          resolve(result);
          pool.release(workerObj?.id);
        });
      }
    });
  });

  const resultPromise = Promise.all(result);

  // 销毁线程池
  resultPromise.then(() => pool.destroy());

  return resultPromise.then((res) => res);
};

const App = () => {
  const directCompute = () => {
    const data = generateData(3000, 10000);
    console.time("directCompute");
    const result = data.map((num)=>
      findPrimes(num)
    );
    console.timeEnd("directCompute");
    console.log(result, "result");
  }

  const runWorker = () => {
    const data = generateData(3000, 10000);
    console.time("runWorker");
    computeOnWorkers(data).then((result) => {
      console.timeEnd("runWorker");
      console.log(result, "result");
    });
  };


  return (
    <div>
      <button onClick={runWorker}>Run Worker</button>
      <button onClick={directCompute}>直接计算</button>
    </div>
  );
};

export default App;