<template>
  <div class="my-upload">
    <h4 class="h4-title">{{title}}</h4>
    <el-upload
      :headers="headers"
      class="avatar-uploader"
      :action="imgHost + '/common/img/upload'"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="uurl" :src="uurl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { legalUrl } from "@/plugins/config";
import { getCookie } from "@/tools/cookie.js";

export default {
  props: {
    title: String,
    _id: Number,
    url: {
      type: String,
      default: ""
    },
    useUrl: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageUrl: "",
      imgHost: "",
      showUrl: "",
      headers: {},
      newUpload: false
    };
  },
  created() {
    // console.log(this.url);
    this.imgHost = legalUrl;
  },
  mounted() {
    if (getCookie("token")) {
      this.headers.token = getCookie("token");
    }
  },
  computed: {
    uurl() {
      if (this.useUrl && !this.newUpload) {
        return this.url;
      } else {
        return this.showUrl;
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      if (res.success) {
        this.$message.success("上传成功");
        this.$emit("fileUpload", this._id, res.data);
        this.showUrl = URL.createObjectURL(file.raw);
        this.newUpload = true;
      } else {
        this.$message.error("上传失败");
      }
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      console.log(file.type);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss">
.my-upload {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 230px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 230px;
    height: 150px;
    display: block;
  }
  .h4-title {
    text-align: center;
    color: $font-color4;
    margin-bottom: 10px;
  }
}
</style>
