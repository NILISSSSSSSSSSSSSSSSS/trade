<template>
<div class="echart-box">
  <div class="headers border-bottom">
    深度图
  </div>
  <div class="e-charts" ref="echarts"></div>
</div>
</template>
<script>
import echarts from 'echarts';
import { mapGetters } from 'vuex';
import computeFiatPrice from '@/mixins/coin_trade/computeFiatPrice.js'

export default {
  mixins: [computeFiatPrice],
  data() {
    return {
      echartsData: [],
      xData: [],
      buy: [],
      sell: [],
      yData: [],
      minY: 0,
      myEcharts: null
    }
  },
  props: {
    // depthData: Array
  },
  mounted() {

  },
  computed: {
    depthData() {
      return this.pairDepth || []
    },
    ...mapGetters('coin_trade', ['pairDepth', 'windowWidth'])
  },
  watch: {
    depthData: {
      handler: function(newVal, old) {
        this.initData(newVal)
      },
      deep: true
    },
    windowWidth(newVal, old) {
      // console.log(newVal)
      this.myEcharts.resize()
    }
  },
  methods: {
    initData() {
      if (this.depthData.length) {
        this.echartsData = this.depthData[0]
        let xData = []
        let buy = []
        let sell = []
        // let min = 0
        // let emptyArr = new Array(10).fill("")
        if (this.echartsData.sell.length) {
          // let min = this.echartsData.sell[0].price
          this.echartsData.sell.forEach((item, index) => {
            xData.push(item.price)
            let sellCount = 0
            let priceIndex = this.echartsData.sell.length - 1 - index
            for (let i = 0; i < this.echartsData.sell.length; i++) {
              if (priceIndex >= i) {
                sellCount += Number(this.echartsData.sell[i].count)
              }
            }
            sell.push(sellCount)
          })
        }
        if (this.echartsData.buy.length) {
          this.echartsData.buy.forEach((item, index) => {
            xData.push(item.price)
            let buyCount = 0
            let priceIndex = index
            for (let i = 0; i < this.echartsData.buy.length; i++) {
              if (priceIndex >= i) {
                buyCount += Number(this.echartsData.buy[i].count)
              }
            }
            buy.push(buyCount)
          })
        }
        this.buy = (new Array(this.echartsData.sell.length).fill("")).concat(buy)
        this.sell = sell.concat(new Array(this.echartsData.buy.length).fill(""))
        this.xData = xData
        // console.log(this.xData, this.buy, this.sell)
      }
      setTimeout(() => {
        this.drawLine()
      }, 20);
    },
    drawLine() {
      // let xData = [5.5584, 5.2473, 4.9560, 5.2473, 4.9560, 5.2473, 5.2473, 5.2473, 5.2473, 4.9560, 5.2473, 4.9560, 4.6570]
      // const buy = [280, 240, 232, 171, 150, 100, 0, '', '', '', '', '', '']
      // const sell = ['', '', '', '', '', '', 0, 100, 150, 170, 200, 222, 280]
      let that = this
      let xData = this.xData
      let buy = this.buy
      let sell = this.sell
      const option = {
        tooltip: {
            trigger: 'axis',
            // triggerOn: 'mousemove',
            axisPointer: {
                // type: 'cross',
                snap: true,
                label: {
                    backgroundColor: '#6a7985'
                },
                lineStyle: {
                  width: 0
                }
            },
            lineStyle: {
              // width: 0,
              // opacity: 0
            },
            formatter: function(params) {
              // console.log(params)
              if (params[0].data) {
                return '委托价&nbsp;&nbsp;' + params[0].axisValue + '<br />' + '累计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + that.filterCurrency(params[0].data * params[1].axisValue, that.pairNameAfter)
              } else if (params[1].data) {
                return '委托价&nbsp;&nbsp;' + params[1].axisValue + '<br />' + '累计&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + that.filterCurrency(params[1].data * params[1].axisValue, that.pairNameAfter)
              }
            }
        },
        grid: {
            left: '0%',
            right: '2%',
            bottom: '2%',
            top: '2%',
            containLabel: true
        },
        xAxis: {
          type: 'category',
          // min: '4.6693',
          // max: '5.5584',
          data: xData,
          inverse: false,
          splitLine: {
            show: false
          },
          boundaryGap: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#E4E9ED'
            }
          },
          axisLabel: {
            show: true,
            interval: 3,
            color: '#282C32'
          },
          splitArea: {
            interval: 3
          }
        },
        yAxis: {
          type: 'value',
          position: 'right',
          // min: '0',
          // max: '350',
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#E4E9ED'
            }
          },
          axisLabel: {
            show: true,
            interval: 3,
            color: '#282C32'
          }
        },
        series: [
          {
            // smooth: true,
            // name: '邮件营销',
            // stack: '总量',
            showSymbol: false,
            symbol: 'circle',
            type: 'line',
            areaStyle: {
              // normal: {},
              color: '#FB5555',
              opacity: 0.1
            },
            lineStyle: {
              width: 0
            },
            itemStyle: {
              color: '#999999',
              bordeWidth: 2,
              shadowColor: 'rgba(0, 0, 0, 0.7)',
              shadowBlur: 15
            },
            markPoint: {
              symbol: 'circle'
            },
            data: buy
          },
          {
            // smooth: true,
            // name: '联盟广告',
            // stack: '总量',
            showSymbol: false,
            symbol: 'circle',
            type: 'line',
            areaStyle: {
              // normal: {}
              color: '#4A90E2',
              opacity: 0.1
            },
            lineStyle: {
              width: 0
            },
            itemStyle: {
              color: '#999999',
              bordeWidth: 2,
              shadowColor: 'rgba(0, 0, 0, 0.7)',
              shadowBlur: 15
            },
            markPoint: {
              symbol: 'circle'
            },
            // data: ['', '', '', '', '', 100, 150, 170, 200, 222]
            data: sell
          }
        ]
      }
      this.myEcharts = echarts.init(this.$refs.echarts)
      this.myEcharts.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.echart-box{
  padding: 0 10px;
  background-color: $bg-content;
  height: 100% !important;
  width: 100% !important;
  box-sizing: border-box;
  .headers{
    height: 36px;
    line-height: 36px;
    color: $font-color3;
    @include fontsize('content2');
    margin-bottom: 10px;
  }
  .e-charts{
    width: 100%;
    height: calc(100% - 46px);
    background-color: #fff;
  }
}
</style>


