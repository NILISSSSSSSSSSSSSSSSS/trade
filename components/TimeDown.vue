<template>
      <span class="timeDown">{{time}}</span>
</template>

<script>
   export default{
     data () {
       return {
         time: '',
         flag: false
       }
     },
     mounted () {
       this.timeDown()
       let time = setInterval(() => {
         if (this.flag === true) {
           clearInterval(time)
         }
         this.timeDown()
       }, 500)
     },
     props: {
       endTime: {
         type: String
       }
     },
     methods: {
       timeDown () {
         const endTime = new Date(this.endTime)
         const nowTime = new Date();
         if (nowTime > endTime) {
           this.time = '0分0秒'
           return true
         }
        //  let leftTime = this.endTime
         let leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000)
         //  let d = parseInt(leftTime / (24 * 60 * 60))
         let h = this.formate(parseInt(leftTime / (60 * 60) % 24))
         let m = this.formate(parseInt(leftTime / 60 % 60))
         let s = this.formate(parseInt(leftTime % 60))
         if (leftTime <= 0) {
           this.flag = true
           this.$emit('time-end')
         }
         this.time = `${h}小时${m}分${s}秒`
         //  this.time = `${d}天${h}小时${m}分${s}秒`
       },
       formate (time) {
         if (time >= 10) {
           return time
         } else {
           return `0${time}`
         }
       }
     }
   }
</script>

<style lang="scss" scoped>
.timeDown{
  color: $btn-green;
}
</style>
