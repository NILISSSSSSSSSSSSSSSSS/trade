import { supportLangArr } from '@/plugins/config'
export default async ({ app, route, req, isServer, redirect }) => {
  console.log('--------------------------initLang.js')
  let lang = 'zh-CN'
  if (route.query.lang) {
    lang = route.query.lang
    await app.i18n.loadLocaleMessage(lang)
  } else if (isServer && req.headers['accept-language']) {
    let accept = req.headers['accept-language']
    let acceptArr = accept.split(',')
    acceptArr.map((item, index) => {
      if (supportLangArr.indexOf(item) > -1) {
        lang = acceptArr[index]
      }
    })
    redirect(`${route.path}?lang=${lang}`)
  } else {
    redirect(`${route.path}?lang=${lang}`)
  }
}
