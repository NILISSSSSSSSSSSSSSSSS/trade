<template>
  <div class="my-upload">
      <!-- :headers="headers" -->
    <el-upload
      :action="url + '/common/img/upload'"
      list-type="picture-card"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      accept="image/jpeg,image/png"
    >
      <!-- :on-progress="uploadProgress" -->
      <img v-if="imgUrl" :src="imgHost + imgUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
import { url, imgHost } from "@/plugins/config";
import { getCookie } from "@/tools/cookie.js";

export default {
  props: {
    index: {
      type: Number
    },
    // url: {
    //   type: String
    // },
    imgUrl: {
      type: String
    }
  },
  data() {
    return {
      headers: {},
      url: url,
      imgHost: imgHost
    }
  },
  mounted() {
    // if (getCookie("token")) {
    //   this.headers.token = getCookie("token");
    // }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // console.log(res, file)
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.$emit('success', res, this.index)
    },
    beforeAvatarUpload(file) {
      console.log(file.type);
      const isIMg = file.type === "image/jpeg" || file.type === "image/png"; // image/png image/gif
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isIMg) {
        this.$message.error("二维码只能是png或jpeg格式!");
      }
      if (!isLt2M) {
        this.$message.error("二维码大小不能超过 2MB!");
      }
      return isIMg && isLt2M;
    }
    // uploadProgress(e, file) {
      // console.log(e, file)
    // }
  }
}
</script>
<style lang="scss" scoped>
.my-upload {
  width: 100%;
  height: 100%;
  .avatar{
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>


