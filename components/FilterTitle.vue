<template>
  <div class="filter-title">
    <h3 class="title h3-title">
      <i class="iconfont icons" :class="icon"></i>
      <span>{{title}}</span>
    </h3>
    <div class="filter">
      <div
        v-if="filterA.name" 
        class="select">
        <el-select v-model="type" :placeholder="filterA.name" clearable>
          <el-option
            v-for="(item, i) in filterA.values"
            :key="i"
            :label="item | enumFilterTitle"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div 
        v-if="filterB.name"
        class="select select2">
        <el-select v-model="status" :placeholder="filterB.name" clearable>
          <el-option
            v-for="(item, i) in filterB.values"
            :key="i"
            :label="item | enumFilterTitle"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="data-range">
        <el-date-picker
          class="date-pc"
          v-model="daterange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-date-picker
          class="date-phone"
          v-model="daterange"
          type="month"
          :editable="false"
          placeholder="选择月">
        </el-date-picker>
      </div>
      <div class="button">
        <my-button :text="'查询'" @click="handleClick"></my-button>
      </div>
    </div>
  </div>
</template>

<script>
import MyButton from "./Button";

export default {
  props: {
    title: String,
    icon: String,
    filterA: {
      type: Object,
      default: () => ({})
    },
    filterB: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      type: "",
      status: "",
      typeOptions: ["买入", "卖出"],
      statusOptions: ["完成", "待付款"],
      daterange: ""
    };
  },
  methods: {
    handleClick() {
      let obj = {};
      if (this.type) {
        obj.type = this.type;
      }
      if (this.status) {
        obj.status = this.status;
      }
      if (this.daterange) {
        console.log(this.daterange);
        if (this.daterange instanceof Array) {
          obj.startTime = this.daterange[0];
          obj.endTime = this.daterange[1];
        } else {
          const s = new Date(this.daterange);
          obj.startTime = s.getTime();
          s.setMonth(s.getMonth() + 1);
          obj.endTime = s.getTime();
        }
      }
      console.log(obj);
      this.$emit("query", obj);
    }
  },
  components: {
    MyButton
  }
};
</script>

<style lang="scss" scoped>
.filter-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .date-phone {
    display: none;
  }
  .icons{
    @include fontsize("title2");
    margin-right: 5px;
    @include phone {
      display: none;
    }
  }
  .title {
    width: 20%;
  }
  .filter {
    width: 60%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 700px;
    .select,
    .button {
      width: 16%;
    }
    .data-range {
      width: 46%;
    }
    .select2 {
      width: 20%;
    }
  }
  /deep/ .el-date-editor {
    width: 100%;
  }
  /deep/ .el-input__inner {
    font-size: 12px;
  }

  @media screen and (max-width: 860px) {
    .filter {
      width: 70%;
    }
    .title {
      width: 30%;
    }
  }

  @media screen and (max-width: 750px) {
    .filter {
      width: 80%;
    }
    .title {
      width: 20%;
    }
    .date-pc {
      display: none;
    }
    .date-phone {
      display: block;
    }
  }

  @media screen and (max-width: 650px) {
    flex-direction: column;
    .filter {
      width: 100%;
    }
    .title {
      margin-bottom: 12px;
      width: 100%;
    }
  }

  @media screen and (max-width: 520px) {
    .filter {
      flex-wrap: wrap;
      justify-content: flex-start;
      .select {
        width: 39%;
      }
      .select2 {
        padding-left: 10px;
      }
      .data-range {
        width: 80%;
        margin: 12px 0;
      }
      .button {
        width: 40%;
      }
    }
  }
}
</style>
