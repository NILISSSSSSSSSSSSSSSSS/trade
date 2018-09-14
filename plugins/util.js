import Vue from 'vue';

class utils {
  getWindowW() {
    return document.documentElement.clientWidth
  }

  getWindowH() {
    return document.documentElement.clientHeight
  }

  // 数组切片, obj: { pageNumber, pageSize }
  sliceData(arr, obj) {
    return arr.slice((obj.pageNumber - 1) * obj.pageSize, obj.pageNumber * obj.pageSize)
  }

  // 拼接url
  joinUrl(url1, url2) {
    const len1 = url1.length
    if (url1[len1 - 1] === '/') {
      url1 = url1.slice(0, len1 - 1)
    }
    if (url2[0] === '/') {
      url2 = url2.slice(1)
    }
    return `${url1}/${url2}`
  }

  // 更新并保留未更新的数据(对象数组)
  /**
   * @returns {Array}
   * @param {Array} target
   * @param {Array} source
   * @param {string} id
   */
  update(target, source, id) {
    const obj = {}
    const totalArr = target.concat(source)
    // 利用相同的id值实现覆盖更新
    for (const val of totalArr) {
      obj[val[id]] = val
    }
    const arr = []
    for (const key of Object.keys(obj)) {
      arr.push(obj[key])
    }
    return arr
  }
}

Vue.prototype.utils = new utils()

export default new utils()
