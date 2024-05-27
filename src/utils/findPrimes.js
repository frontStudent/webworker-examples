export function findPrimes(num) {
  // 辅助函数：检查一个数是否为素数
  function isPrime(n) {
    if (n <= 1) return false; // 1 或更小的数不是素数
    if (n === 2) return true; // 2 是素数
    if (n % 2 === 0) return false; // 偶数不是素数（2 除外）
    // 仅检查小于等于平方根的奇数
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }

  // 结果数组，用于存储素数
  const primes = [];
  // 遍历从 2 到 num 的所有数
  for (let i = 2; i <= num; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }

  return primes;
}
