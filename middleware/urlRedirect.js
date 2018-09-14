export default function ({ route, redirect, store }) {
  if (route.path === '/finance') {
    redirect(`/finance/property/fund?lang=${route.query.lang}`)
  } else if (route.path === '/security') {
    redirect(`/security/google/validate?lang=${route.query.lang}`)
  } else if (route.path === '/c2c-trade') {
    redirect(`/c2c-trade/${store.state.common.currencies[0]}_${store.state.common.legalCoins[0]}?lang=${route.query.lang}`)
  } else if (route.path === '/otc') {
    redirect(`/otc/${store.state.common.currencies[0]}_${store.state.common.legalCoins[0]}?lang=${route.query.lang}`)
  } else if (route.path === '/coin_coin') {
    let bbPairs = store.state.bbPairs
    if (bbPairs.length) {
      redirect(`/coin_coin/${bbPairs[0].pairs[0]}?lang=${route.query.lang}`)
    }
  }
}
