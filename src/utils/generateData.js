export const generateData = (start, end) => {
  // 初始化一个空数组
  const rangeArray = [];

  // 从 start 到 end 之间的所有整数依次添加到数组中
  for (let i = start; i <= end; i++) {
    rangeArray.push(i);
  }

  return rangeArray;
};
