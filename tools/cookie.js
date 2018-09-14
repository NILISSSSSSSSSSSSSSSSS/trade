export function setCookie(name, value) {
  var Days = 30 * 12 * 10;

  var exp = new Date();

  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  if (process.client) {
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  }
}

export function getCookie(name) {
  var arr
  var reg
  if (process.client) {
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
    if (document.cookie.match(reg)) {
      arr = document.cookie.match(reg)
      return unescape(arr[2])
    } else {
      return null
    }
  } else {
    reg = new RegExp("(^| )" + name.name + "=([^;]*)(;|$)")
    if (name.src.match(reg)) {
      arr = name.src.match(reg)
      return unescape(arr[2])
    } else {
      return null
    }
  }
}

export function delCookie(name) {
  var exp = newDate();

  exp.setTime(exp.getTime() - 1);

  var cval = getCookie(name);

  if (cval != null) { document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString(); }
}

export function getServiceCookie(name, req) {
  const cookie = req.headers.cookie || '';
  var arr
  var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
  if (cookie.match(reg)) {
    arr = cookie.match(reg)
    return unescape(arr[2])
  } else {
    return null
  }
}
