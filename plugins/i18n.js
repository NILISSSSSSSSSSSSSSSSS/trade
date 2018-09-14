import axios from 'axios'
import cn from '~/locales/cn.js'
import en from '~/locales/en.js'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {supportLangArr} from '@/plugins/config'
Vue.use(VueI18n)

export default ({ app, store, route, redirect, req, axios }) => {
  console.log('--------------------------i18n.js')
  app.i18n = new VueI18n({ silentTranslationWarn: true })
  let locales = supportLangArr
  app.i18n.loadLocaleMessage = async (locale) => {
    if (locales.indexOf(locale) === -1) {
      locale = 'zh-CN'
    }
    let data = null
    try {
      // const common = await axios.get(`https://www.otcex.io/common?isPubAdvertise=true`)
      // const langList = common.data.data.lang
      // let filePath
      // langList.map((item) => {
      //   if (locale.indexOf(item._id.toUpperCase()) > -1) {
      //     filePath = item.jsonFilePath
      //   }
      // })
      // const file = await axios.get(filePath)
      // let data = await file.data
      let data = cn
      app.i18n.locale = locale
      // req.headers['content-language'] = locale.toUpperCase()
      await app.i18n.setLocaleMessage(locale, data)
    } catch (e) {
      // do nothing
    }
    return data
  }
  app.i18n.path = (link) => {
    if (link.indexOf('?') !== -1) {
      return `${link}&lang=${app.i18n.locale}`
    }
    return `${link}?lang=${app.i18n.locale}`
  }
  app.i18n.push = (link) => {
    console.log('i18n click')
    console.log(link)
    if (link.indexOf('?') !== -1) {
      return redirect(`${link}&lang=${app.i18n.locale}`)
    }
    return redirect(`${link}?lang=${app.i18n.locale}`)
  }
}
