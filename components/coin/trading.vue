<template>
  <div 
    class="coin-trading"
    onfocus="this.blur()">
    <div 
      id="tv_chart_container" 
      class="f-fill" 
      style="height:800px;"
      ref="tv_chart_container"></div>
  </div>
</template>

<script>
import $http from "axios";
import { DataFeeds } from "@/plugins/tradingView";

export default {
  props: {
    tradePair: ""
  },
  data() {
    return {
      lang: "zh"
    };
  },
  created() {
    this.lang = this.$route.query.lang;
  },
  mounted() {
    const w = this.utils.getWindowW() - 40;
    const h = 480;
    this.render(w, h);
    document.addEventListener("DOMMouseScroll", () => false, false);
    // this.getChartData();
  },
  methods: {
    render(width, height) {
      window.tvWidget = new TradingView.widget({
        // 是否满屏
        fullscreen: false,
        // 默认显示的商品名
        symbol: this.tradePair,
        // 间隔时间
        interval: 1,
        // 图表容器
        container_id: "tv_chart_container",
        // JavaScript对象的实现接口 JS API 以反馈图表及数据。
        datafeed: new DataFeeds(this.tradePair),
        // static文件夹的路径
        library_path: "/js/charting_library/",
        // 语言
        locale: this.transLang(),
        //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
        drawings_access: {
          type: "black",
          tools: [{ name: "Regression Trend" }]
        },
        // 禁用的功能
        disabled_features: [
          "compare_symbol",
          "display_market_status",
          "go_to_date",
          "header_chart_type",
          "header_compare",
          "header_interval_dialog_button",
          "header_resolutions",
          "header_screenshot",
          "header_symbol_search",
          "header_undo_redo",
          "header_saveload",
          "legend_context_menu",
          "show_hide_button_in_legend",
          "show_interval_dialog_on_key_press",
          "snapshot_trading_drawings",
          "symbol_info",
          "use_localstorage_for_settings",
          "volume_force_overlay",
          "left_toolbar",
          "timeframes_toolbar"
        ],
        // 开启的功能
        enabled_features: [
          "dont_show_boolean_study_arguments",
          "hide_last_na_study_output",
          "move_logo_to_main_pane",
          "same_data_requery",
          "side_toolbar_in_fullscreen_mode",
          "disable_resolution_rebuild"
        ],
        charts_storage_url: "http://saveload.tradingview.com",
        charts_storage_api_version: "1.1",
        client_id: "tradingview.com",
        user_id: "public_user_id",
        // 时区
        timezone: "Asia/Shanghai",
        // 将此属性设置为true时，可使图表将详细的API日志写入控制台。
        debug: false,
        // widget的尺寸，width, height
        width: width,
        height: height,
        // 工具栏背景颜色
        toolbar_bg: "transparent",
        // 对Widget对象的默认属性进行覆盖。
        /*
        overrides: {
          "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)",
          "paneProperties.background": "#181b2a",
          "paneProperties.vertGridProperties.color": "#fff",
          "paneProperties.crossHairProperties.color": "#fff",
          "paneProperties.horzGridProperties.color": "#fff",
          "scalesProperties.textColor": "#d8f0fa",
          "scalesProperties.lineColor" : "#d8f0fa",
          "mainSeriesProperties.lineStyle.color": "#000",
          'mainSeriesProperties.areaStyle.linecolor': "#d8f0fa"
        },
        */
        // 在图表底部的时间范围选择器中可以看见这个时间范围列表。
        time_frames: [],
        // 将您的自定义CSS添加到图表中。url应该是到'static`文件夹的绝对或相对路径。
        custom_css_url: "index.css",
        overrides: false,
        "paneProperties.legendProperties.showLegend": false
      });

      window.tvWidget.onChartReady(() => {
        // 现在可以调用其他widget的方法了
        this.addBtn();
        this.subscribe();
      });
    },
    // add btn
    addBtn() {
      const widget = window.tvWidget;
      const timeList = [
        "分时",
        "1min",
        "5min",
        "15min",
        "30min",
        "1hour",
        "8hour",
        "1day"
      ];

      for (const v of timeList) {
        const button = widget.createButton();
        button.attr("title", v);
        button.append($(`<span>${v}</span>`));
        if (v === "1min") {
          button.addClass("textColor");
        }
        button.on("click", e => {
          $(e.target)
            .parent()
            .siblings()
            .find(".textColor")
            .removeClass("textColor");
          // 如果 分辨率 没有发生变化
          if (widget.chart().resolution() === "1" && this.fixTime(v) === "1") {
            this.switchResolution(widget, e, v);
          }
          widget.chart().setResolution(this.fixTime(v), () => {
            this.switchResolution(widget, e, v);
          });
        });
      }
    },
    fixTime(v) {
      switch (v) {
        case "分时":
          return "1";
        case "1min":
          return "1";
        case "5min":
          return "5";
        case "15min":
          return "15";
        case "30min":
          return "30";
        case "1hour":
          return "60";
        case "8hour":
          return "480";
        case "1day":
          return "1D";
      }
    },
    // 订阅
    subscribe() {
      // 分辨率变更后触发
      const widget = window.tvWidget;
      widget
        .chart()
        .onIntervalChanged()
        .subscribe(null, (interval, obj) => {
          // console.log(interval + "-----------------");
          // obj.timeframe = "12M";
          if (widget.chart().chartType() !== 1) {
            widget.chart().removeEntity(this.entity1);
          }
        });
      this.entity1 = widget
        .chart()
        .createStudy("Moving Average", true, false, [5], null, {
          "Plot.linewidth": 1
        });
    },
    transLang() {
      if (/zh/.test(this.lang)) {
        return "zh";
      } else if (/en/.test(this.lang)) {
        return "en";
      }
      return this.lang;
    },
    // 切换分辨率
    switchResolution(widget, e, v) {
      if (v === "分时") {
        widget.chart().setChartType(3);
      } else {
        widget.chart().setChartType(1);
      }
      $(e.target).addClass("textColor");
    }
  }
};
</script>

<style lang="scss">
</style>

