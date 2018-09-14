import Vue from 'vue'
import { imgHost } from './config';

//  状态过滤器
export function status(s) {
  switch (s) {
    case 'success':
      return '成功'
    case 'fail':
      return '失败'
    default:
      return s
  }
}

// _时间格式化
function _formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _padLeftZero(str));
    }
  }
  return fmt;
};
// _时间格式化
function _padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

// 时间格式化
export function formatDate(s) {
  var date = new Date(s);
  return _formatDate(date, "yyyy.MM.dd hh:mm");
}

// 币币页面的时间
export function timeCoin(s) {
  var date = new Date(s)
  return _formatDate(date, "hh:mm:ss");
}

// 时间间距
export function getDateDiff(s) {
  let dateTimeStamp = new Date(s).getTime();
  let result = ''
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let now = new Date().getTime();
  let diffValue = now - dateTimeStamp;
  if (diffValue < 0) { return; }
  let monthC = diffValue / month;
  let weekC = diffValue / (7 * day);
  let dayC = diffValue / day;
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else {
    result = "刚刚";
  }
  return result;
}

// 枚举业务类型
// _biz_balance_deposits: 充值
// _biz_balance_withdraw: 提币
// _biz_trade_in: 订单完成（收款方）
// _biz_trade_out: 订单完成（付款方）

// _biz_freeze_withdraw: 提币预冻结
// _biz_unfreeze_withdraw: 提币预冻结
// _biz_advertising_publish: 发布广告
// _biz_advertising_callback: 发布广告失败
// _biz_advertising_up: 广告上架
// _biz_advertising_down:下架广告
// _biz_advertising_cancel: 取消广告
// _biz_order_freeze: 生成订单
// _biz_order_unfreeze: 取消订单
// _biz_vip_freeze: 申请VIP
export function enumBizType(s) {
  switch (s) {
    case 'biz_balance_deposits':
      return '充值'
    case 'biz_balance_withdraw':
      return '提币'
    case 'biz_trade_in':
      return '订单完成（收款方）'
    case 'biz_trade_out':
      return '订单完成（付款方）'
    case 'biz_freeze_withdraw':
      return '提币预冻结'
    case 'biz_unfreeze_withdraw':
      return '提币解冻结'
    case 'biz_advertising_publish':
      return '发布广告'
    case 'biz_advertising_callback':
      return '发布广告失败'
    case 'biz_advertising_up':
      return '广告上架'
    case 'biz_advertising_down':
      return '广告下架'
    case 'biz_advertising_cancel':
      return '取消广告'
    case 'biz_order_freeze':
      return '生成订单'
    case 'biz_order_unfreeze':
      return '取消订单'
    case 'biz_vip_freeze':
      return '申请VIP'
    default:
      return s
  }
}

// WAIT, FAIL, SUCCESS
// 充值状态
export function depositsStatus(s) {
  switch (s) {
    case 1: return '等待确认'
    case 2: return '充值失败'
    case 3: return '充值成功'
  }
}

// INIT, BROADCAST, WAIT, SUCCESS, APPROVAL, FAIL
// 提币状态
export function withdrawStatus(s) {
  switch (s) {
    case 1: return '初始化'
    case 2: return '已广播'
    case 3: return '等待确认'
    case 4: return '提币成功'
    case 5: return '等待审核'
    case 6: return '提币失败'
  }
}

// 申述类型
export function appealType(s) {
  switch (s) {
    case 'no_pay': return '没有付款'
    case 'no_coin': return '没有支付虚拟币'
    case 'no_response': return '没有响应'
    case 'spite': return '恶意交易'
    case 'other': return '其他'
    default: return s
  }
}

// 申述状态
export function appealStatus(s) {
  switch (s) {
    case 'normal': return '暂无申述'
    case 'processing': return '申述中'
    case 'success': return '已处理'
    case 'fail': return '申诉失败'
    case 'cancel': return '取消申述'
    default: return s
  }
}

// 订单状态
export function orderStatus(s) {
  switch (s) {
    case 'init': return '初始'
    case 'waitCoin': return '等待放币'
    case 'waitPay': return '等待付款'
    case 'success': return '交易成功'
    case 'expire': return '交易过期'
    case 'cancel': return '交易取消'
    default: return s
  }
}

// 订单状态
export function orderStatus2(s) {
  switch (s) {
    case 'init': return '初始'
    case 'waitCoin': return '处理中'
    case 'waitPay': return '处理中'
    case 'success': return '交易成功'
    case 'expire': return '交易过期'
    case 'cancel': return '交易取消'
    default: return s
  }
}

// 头部筛选框使用
export function enumFilterTitle(s) {
  if (enumBizType(s) !== s) {
    return enumBizType(s)
  } else if (orderStatus(s) !== s) {
    return orderStatus(s)
  } else if (tradeType(s) !== s) {
    return tradeType(s)
  }
  return s
}

// 交易类型
export function tradeType(s) {
  switch (s) {
    case 'buy':
      return '买入'
    case 'sell':
      return '卖出'
    default:
      return s
  }
}

// 小数转百分比
export function floatTopercent(n) {
  n = Number(n)
  if (isNaN(n)) return ''
  return (n * 100).toFixed(2) + '%'
}

export function imgConvert(s) {
  if (s) {
    if (s.indexOf('http') >= 0) {
      return s
    } else {
      return `${imgHost}/${s}`
    }
  } else {
    return ''
  }
}

export function avatarConvert(s) {
  if (s) {
    if (s.indexOf('http') >= 0) {
      return s
    } else {
      return `${imgHost}/${s}`
    }
  } else {
    return '/img/avatar_128.png'
  }
}

// 支付方式
export function payWay(s) {
  switch (s) {
    case 'alipay':
      return '支付宝'
    default:
      return s
  }
}

let filters = {
  status,
  formatDate,
  getDateDiff,
  enumBizType,
  depositsStatus,
  withdrawStatus,
  enumFilterTitle,
  appealType,
  imgConvert,
  avatarConvert,
  orderStatus,
  appealStatus,
  tradeType,
  orderStatus2,
  timeCoin,
  floatTopercent,
  payWay
}

export default ({ store }) => {
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })

  //  数字币过滤器
  Vue.filter('currency', (s, coin) => {
    if (coin === undefined) {
      console.warn('数字币过滤器需要传入数字币ID')
      return Number(s).toFixed(4)
    }
    let config = store.state.common.currencyConfig || []
    let len = config.length
    var i
    for (i = 0; i < len; i++) {
      if (coin === config[i].id) {
        s = Number(s).toFixed(config[i].displayFixed)
        return s
      }
    }
    console.warn('数字币过滤器传入的ID暂不支持')
    return Number(s).toFixed(4)
  })

  //  法币过滤器(包含汇率的运算)
  Vue.filter('fiatCurrency', (s) => {
    if (!s) {
      return Number(0).toFixed(2)
    }
    if (!store.state.exchangeRate || store.state.exchangeRate.usdValue === null) {
      return Number(s).toFixed(2) + ' USD'
    } else {
      let rate = store.state.exchangeRate.usdValue
      return Number(Number(s) / rate).toFixed(2)
    }
  })

  Vue.filter('bbfiatCurrency', (s) => {
    if (!s) {
      return Number(0).toFixed(2)
    }
    return Number(s).toFixed(2)
    // if (!store.state.exchangeRate || store.state.exchangeRate.usdValue === null) {
    //   return Number(s).toFixed(2) + ' USD'
    // } else {
    //   let rate = store.state.exchangeRate.usdValue
    //   return Number(s).toFixed(2)
    // }
  })

  Vue.filter('chatMsgCount', (s) => {
    if (s <= 0) {
      return ''
    } else {
      return s > 99 ? "99+" : s
    }
  })

  Vue.filter('chatName', (s) => {
    return s.substr(0, 1).toLocaleUpperCase()
  })
}
