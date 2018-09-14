<template>
  <div class="merchant-wrap">
    <auth
      v-if="type === 'success'"
      :url="url"
      :name="name"
      :type="'success'"
      :vipInfo="stat || {}"
      :userInfo="userInfo || {}"></auth>
    <auth 
      v-else
      :url="url"
      :name="name"
      type="pre"
      @agreeChange="agreeChange"
      @handleAuth="handleAuth"></auth>
    <auth-hint class="hint"></auth-hint>
  </div>
</template>

<script>
import Auth from "@/components/trade/Authentication";
import AuthHint from "@/components/trade/AuthHint";
import { mapGetters } from "vuex";
import { imgHost } from "@/plugins/config";
import { merchantInfo, merchantApplay } from "@/apis/merchant";
import { verified, unverified, verifiding } from "@/store/merchant";

export default {
  props: {
    type: String
  },
  data() {
    return {
      agree: false,
      url: "",
      name: ""
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapGetters("merchant", ["stat"])
  },
  watch: {
    userInfo: {
      handler(val) {
        if (val) {
          this.analysis();
        }
      },
      immediate: true
    },
    stat: {
      handler(val) {
        if (this.type === "pre") {
          this.skip();
        }
      },
      immediate: true
    }
  },
  methods: {
    agreeChange(val) {
      this.agree = val;
    },
    handleAuth() {
      if (!this.agree) {
        return this.$message.error("请先同意条款");
      }
      this.$router.push(this.$i18n.path("/finance/trade/merchant"));
    },
    skip() {
      // init, processing, success, fail
      const status = this.stat.certifyStatus;

      if (status === verifiding) {
        this.$router.push(this.$i18n.path("/finance/trade/merchant"));
      } else if (status === verified) {
        this.$router.push(this.$i18n.path("/finance/trade/merchant-success"));
      }
    },
    analysis() {
      if (this.userInfo.avatar) {
        this.url = this.utils.joinUrl(imgHost, this.userInfo.avatar);
      }
      if (this.userInfo.nickname) {
        this.name = this.userInfo.nickname;
      }
    }
  },
  components: {
    Auth,
    AuthHint
  }
};
</script>

<style lang="scss" scoped>
.hint {
  margin-top: 40px;
}
</style>
