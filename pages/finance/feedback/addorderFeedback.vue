<template>
<div class="feedback-addorder">
  <div class="title" v-html="$t('finance.feedback.create.header',{ order:`<span class='order font-color6'>${$route.query.order}</span>` })">
  </div>
  <div class="line_1 bg-line-color"></div>
  <div class="tip_0 font-color3">
    {{$t('finance.feedback.create.reason')}}
  </div>
  <div class="reasons">
    <el-select v-model="appealType" :default-first-option="true">
      <el-option v-for="item in appealTypeList" :key="item" :label="$t(`enum.appealType.${item}`)" :value="item">
      </el-option>
    </el-select>
  </div>
  <div class="tip_1 font-color6">{{$t('finance.feedback.create.notice1')}}
  </div>
  <div class="pics" :class="(filelist.length>=5)?'max':''">
    <el-upload :headers="headers" :before-upload="onBeforeUpload" :limit='5' :on-success="onSuccess" :action="uploadAction" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
  <div class="tip_2 font-color3">{{$t('finance.feedback.create.notice2')}}
  </div>
  <div class="tip_3 font-color3">{{$t('finance.feedback.create.notice3')}}
  </div>
  <div class="info">
    <el-input type="textarea" autosize v-model.trim="content"></el-input>
  </div>
  <div class="opt">
    <el-button type="primary" :disabled="disableSubmit" @click="submit" style="margin:0 auto">{{$t('finance.feedback.create.submit')}}</el-button>
  </div>
</div>
</template>

<script>
import { url } from "@/plugins/config";
import { orderComplaint, getAppealTypes } from "@/apis/finance/feedback";
import { getCookie } from "@/tools/cookie.js";
export default {
  data() {
    return {
      uploadAction: `${url}/common/img/upload`,
      filelist: [],
      content: "",
      dialogImageUrl: "",
      dialogVisible: false,
      appealType: "",
      appealTypeList: ["no_pay", "no_coin", "no_response", "spite", "other"],
      headers: {}
    };
  },
  created() {
    if (process.client) {
      this.headers.token = getCookie("token");
    }
  },
  computed: {
    disableSubmit() {
      return this.appealType === "" || this.content.length === 0;
    }
  },
  methods: {
    onSuccess(res, file, fileList) {
      if (res.success) {
        file.imageUrl = res.data;
      } else {
        fileList.splice(fileList.length - 1, 1);
        if (res.message) {
          this.$message.error(res.message);
        }
      }
      this.filelist = fileList;
    },
    onBeforeUpload(file) {
      if (file.size > (1024 * 4)) {
        this.$message.error(this.$t('finance.feedback.create.upload_limit'));
        return false;
      } else {
        return true;
      }
    },
    handleRemove(file, filelist) {
      this.filelist = filelist;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    submit() {
      let images = this.filelist.map(item => item.imageUrl);
      orderComplaint({
        addonPic: images,
        orderId: this.$route.query.order,
        appealType: this.appealType,
        appealMsg: this.content
      }).then(res => {
        if (res.success) {
          this.$i18n.push("/finance/feedback/history");
          this.$message.success(
            this.$t("finance.feedback.create.submit_success")
          );
        } else {
          this.$message.error(res.message);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.feedback-addorder {
  .title {
    @include fontsize("title2");
    margin-bottom: $space;
    .order {
      color: $font-color6;
    }
  }
  .line_1 {
    margin-top: $space; // background-color: $line-color;
    height: 1px;
  }
  .tip_0 {
    @include fontsize("content3"); // color: $font-color3;
    padding: $space 0px;
  }
  .tip_1 {
    margin-top: $space; // color: $font-color6;
    @include fontsize("content3");
  }
  .pics {
    margin-top: $space;
    width: 100%;
    &.max {
      /deep/ .el-upload--picture-card {
        display: none;
      }
    }
  }
  .tip_2 {
    margin-top: $space; // color: $font-color3;
    @include fontsize("content3");
  }
  .tip_3 {
    margin-top: $space; // color: $font-color3;
    @include fontsize("content2");
    font-weight: bold;
  }
  .info {
    margin-top: $space;
    /deep/ {
      textarea {
        min-height: 150px !important;
      }
    }
  }
  .opt {
    margin-top: $space;
    text-align: center;
    button {
      width: 150px;
    }
  }
}
</style>
