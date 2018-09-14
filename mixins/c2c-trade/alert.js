export default {
  props: {
    data: Object
  },
  methods: {
    cancel() {
      // console.log(2332)
      this.$emit('update:showFlag', false)
    }
  }
}
