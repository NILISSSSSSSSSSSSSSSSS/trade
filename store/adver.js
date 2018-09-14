import { adQuery, adListOTC } from "@/apis/adver";
import socket from "@/plugins/socket";

export const state = () => ({
  onlineAds: [],
  offlineAds: [],
  otc_buy_ads: {}, // otc买入广告
  otc_sell_ads: {} // otc卖出广告
});

export const getters = {
  onlineAds(state) {
    return state.onlineAds;
  },
  offlineAds(state) {
    return state.offlineAds;
  }
};

export const mutations = {
  setUserAds(state, data) {
    state.onlineAds = data.filter(item => item.adStatus === "online");
    state.offlineAds = data.filter(item => item.adStatus === "offline");
  },
  UPDATE_OTC_BUY_ADS(state, ads) {
    state.otc_buy_ads = ads;
  },
  UPDATE_OTC_SELL_ADS(state, ads) {
    state.otc_sell_ads = ads;
  },
  REMOVE_OTC_AD(state, id) {
    let index = state.otc_buy_ads.list.findIndex(x => x.id === id);
    if (index >= 0) {
      state.otc_buy_ads.list.splice(index, 1);
    } else {
      index = state.otc_sell_ads.list.findIndex(x => x.id === id);
      if (index >= 0) {
        index = state.otc_sell_ads.list.splice(index, 1);
      }
    }
  },
  UPDATE_OTC_AD(state, { id, currencyAmount, leftAmount, updateTime, ownerOnline }) {
    let ad = state.otc_buy_ads.list.find(x => x.id === id);
    if (ad === null) {
      ad = state.otc_sell_ads.list.find(x => x.id === id);
    }
    if (ad) {
      ad.updateTime = updateTime;
      ad.count = currencyAmount;
      ad.remainCount = leftAmount;
      ad.isOnline = ownerOnline
    }
  }
};

export const actions = {
  async GET_ADS({ commit }, payload) {
    let data = await adQuery(payload);
    if (data.success) {
      return data.data;
    }
  },

  GET_OTC_ADS(
    { commit },
    { currencyId, legalCurrency, tradeType, page, limit }
  ) {
    adListOTC({
      currencyId: currencyId,
      legalCurrency: legalCurrency,
      tradeType: tradeType,
      page: page,
      limit: limit
    }).then(res => {
      if (res.success) {
        if (res.data) {
          let ads = res.data;
          if (tradeType === "buy") {
            commit("UPDATE_OTC_BUY_ADS", ads);
          } else {
            commit("UPDATE_OTC_SELL_ADS", ads);
          }
          if (res.data.list) {
            socket.subscribe({
              businessName: "SUBSCRIBLE_LEGAL_AD_CHANGE",
              adIds: res.data.list.map(x => x.id),
              appId: "aaa"
            })
          }
        }
      }
    });
  },
  // Socket更新OTC广告
  UPDATE_OTC_ADS({ commit }, message) {
    if (message.status === "online") {
      // online状态就更新
      commit("UPDATE_OTC_AD", message);
    } else {
      // 'offline', 'delete', 'expire' 从广告中删除
      commit("REMOVE_OTC_AD", message.id);
    }
  }
};
