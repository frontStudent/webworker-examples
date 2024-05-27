import { findPrimes } from "../utils/findPrimes";
// 监听来自主线程的消息
onmessage = function (e) {
  const { data } = e.data;
  const result = data.map(findPrimes);
  postMessage(result);
};
