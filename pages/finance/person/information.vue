<template>
<div class="information">
  <FinanceTitle :title="$t('finance.person.title')" icon="icon-gerenziliao"/>
  <no-ssr>
    <el-upload
      :headers="headers"
      class="avatar-uploader"
      :action="url + '/common/img/upload'"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div class="shade">{{ $t('finance.person.information.editAvatar') }}</div>
    </el-upload>
  </no-ssr>
  <section>
    <label for="nickname" class="nicklabel font-color4">{{ $t('finance.person.information.nickname') }}</label>
    <el-input :placeholder="$t('finance.person.information.placeholderNickname')" maxlength="7" name="nickname font-color4" suffix-icon="el-icon-edit" class="nickname" v-model="newNickname"></el-input>
  </section>
  <MyButton :text="$t('common.confirm')" class="confirm" @click="updateUserInfo"></MyButton>
</div>
</template>
<script>
import FinanceTitle from '@/components/FinanceTitle'
import MyButton from '@/components/Button'
import { url, imgHost } from "@/plugins/config"
import { userUpdate } from "@/apis/user"
import { mapState, mapActions } from "vuex";
import { getCookie } from "@/tools/cookie.js";

export default {
  data() {
    return {
      imageUrl: '',
      url: '',
      newNickname: '',
      newAvatar: '',
      headers: {}
    };
  },
  computed: {
    ...mapState({
      avatar: state => state.user.user_info.avatar,
      nickname: state => state.user.user_info.nickname
    })
  },
  mounted() {
    if (getCookie("token")) {
      this.headers.token = getCookie("token");
    }
    this.USER_INFO()
    this.url = url;
  },
  watch: {
    avatar: {
      handler(val) {
        if (val) {
          console.log('TCL: handler -> val', val);
          this.imageUrl = `${imgHost}${val}`
        }
      },
      immediate: true
    },
    nickname: {
      handler(val) {
        this.newNickname = val
      },
      immediate: true
    }
  },
  components: {
    FinanceTitle,
    MyButton
  },
  methods: {
    ...mapActions('user', ['USER_INFO']),
    async _userUpdate(params) {
      const res = await userUpdate(params);
      return res
    },
    handleAvatarSuccess(res, file) {
      this.newAvatar = res.data
      this.imageUrl = `${imgHost}${res.data}`
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    updateUserInfo() {
      this._userUpdate({nickname: this.newNickname, avatar: this.newAvatar}).then(res => {
        if (res.success) {
          this.$message('修改资料成功');
          this.USER_INFO()
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.information{
  .avatar-uploader{
    border-radius: 50%;
    width: 140px;
    height: 140px;
    position: relative;
    // border: 4px solid $border-color1;
    cursor: pointer;
    margin-top: 54px;
    overflow: hidden;
    @include notpc{
      margin: 20px auto;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    // color: $border-color1;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .avatar {
    width: 140px;
    height: 140px;
    display: block;
    border-radius: 50%;
  }
  .shade{
    position: absolute;
    @include fontsize("small");
    bottom: 0;
    background: rgba(0,0,0,0.70);
    height: 32px;
    width: 100%;
    margin: 0px;
    line-height: 32px;
    // color: $font-color1;
  }
  .nicklabel{
    display: block;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 14px;
    margin: 29px 0 10px 0;
    @include notpc{
      text-align: center
    }
  }
  .nickname{
    width: 234px;
    height: 44px;
    font-size: 14px;
    /deep/ .el-input__inner{
      font-size: 14px;
      // background-color: $line-color;
    }
    // /deep/ .el-icon-edit{
      // color: $font-color4;
    // }
    @include notpc{
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .confirm{
    width: 133px;
    margin-top: 60px;
    @include notpc{
      margin: 60px auto;
    }
  }
}
</style>
