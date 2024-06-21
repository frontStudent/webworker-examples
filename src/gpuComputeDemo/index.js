import React, { useEffect } from "react";
import { generateMatrices } from "./utils";

const App = () => {
  useEffect(() => {
    const gpu = new GPU.GPU();
    const multiplyMatrix = gpu
      .createKernel(function (a, b) {
        let sum = 0;
        for (let i = 0; i < 512; i++) {
          sum += a[this.thread.y][i] * b[i][this.thread.x];
        }
        return sum;
      })
      .setOutput([512, 512]);
  }, []);
  return <div></div>;
};

export default App;
