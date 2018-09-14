import { getServiceCookie, getCookie } from "@/tools/cookie"

export default function({ route, req, redirect }) {
  let redirectURL = ""
  var token, path
  // 在服务端
  if (process.server) {
    token = getServiceCookie("token", req)
    path = req.originalUrl
  } else {
    token = getCookie("token")
    path = route.path
  }
  if (path) {
    redirectURL = `/user/login?returnurl=${encodeURIComponent(path)}?lang=${
      route.query.lang
    }`
  }
  if (!token) {
    redirect(redirectURL)
  }
}
