const BUSY = 'Busy'
const IDLE = 'Idle'
const SUCCESS = 'success'
const FAIL = 'fail'

// 线程池
export default class WorkerPool {
  // worker用于存储线程
  worker = []
  // status是线程池状态
  status = IDLE
  // 阻塞请求队列
  blockRequestQueue = []
  // size为线程池容量
  constructor(size) {
    // 初始化线程状态为空闲
    this.worker = Array.from({ length: size }).map((_, index) => {
      return {
        id: index,
        worker: new Worker(new URL('./worker.js', import.meta.url)),
        status: IDLE
      }
    })
  }

  // 线程池状态更新函数
  update() {
    // 记录忙碌线程数
    const sum = (Array.isArray(this.worker) ? this.worker : []).reduce((sum, worker) => {
      return sum + (worker?.status === BUSY ? 1 : 0)
    }, 0)
    // 更新线程池状态
    if (sum === this.worker.length) this.status = BUSY
    else this.status = IDLE
  }

  // 线程请求方法
  assign() {
    if (this.status !== BUSY) {
      // 找到第一个可用线程
      const worker = (Array.isArray(this.worker) ? this.worker : []).find((worker) => {
        if (worker?.status === IDLE) {
          worker.status = BUSY
          this.update()
          return true
        }
        return false
      })
      return {
        status: SUCCESS,
        worker: worker,
        wait: null
      }
    } else {
      let resolve = null
      const promise = new Promise((res) => (resolve = res))
      // 通知对象的状态改变方法加入阻塞请求队列
      this.blockRequestQueue.push(resolve)
      // 返回给请求者线程池已满信息和通知对象
      return {
        status: FAIL,
        worker: null,
        wait: promise
      }
    }
  }

  // 线程释放方法，接收一个参数为线程标识
  release(index) {
    this.worker[index].status = IDLE
    // 阻塞请求队列中的第一个请求出队，队列中存储的是promise的resolve方法，此时执行，通知请求者已经有可用的线程了
    if (this.blockRequestQueue.length)
      // 阻塞请求队列队首出列，并执行通知对象的状态改变方法
      this.blockRequestQueue.shift()()
    // 更新线程池状态，此时一定空闲
    this.status = IDLE
  }

  // 终止线程
  destroy() {
    ;(Array.isArray(this.worker) ? this.worker : []).forEach((workerObj) => {
      workerObj?.worker?.terminate()
    })
  }
}
