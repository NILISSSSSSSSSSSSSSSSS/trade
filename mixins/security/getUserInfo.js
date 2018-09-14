import {getPhoneAndEmail} from '@/apis/user'
import { mapGetters } from 'vuex'
// import { getServiceCookie, getCookie } from "@/tools/cookie";

export default {
  data () {
    return {
      // vertifyData: {},
      resultInfo: '',
      serviceName: 'bind'
    }
  },
  // async asyncData ({req, store, isServer}) {
  //   console.log('--------req----------')
  //   console.log(isServer)
  //   var headers = {}
  //   var token
  //   if (isServer) {
  //     token = getServiceCookie('token', req)
  //     if (token) {
  //       headers = {headers: {token: token}}
  //     }
  //     // console.log(headers)
  //     let res = await getPhoneAndEmail({}, headers)
  //     // console.log(res)
  //     if (res.success) {
  //       return {
  //         vertifyData: {
  //           phone: res.data.phone,
  //           email: res.data.email,
  //           google: res.data.isBindGlAtu
  //         }
  //       }
  //     }
  //   } else {
  //     token = getCookie('token')
  //     if (token) {
  //       headers = {headers: {token: token}}
  //     }
  //     // console.log(headers)
  //     let res = await getPhoneAndEmail({}, headers)
  //     // console.log(res)
  //     if (res.success) {
  //       return {
  //         vertifyData: {
  //           phone: res.data.phone,
  //           email: res.data.email,
  //           google: res.data.isBindGlAtu
  //         }
  //       }
  //     }
  //   }
  // },
  computed: {
    ...mapGetters('security', ['vertifyData']),
    phoneByStar() {
      let phone = (this.vertifyData.phone).toString()
      if (phone) {
        let lens = phone.length
        return phone.slice(0, lens - 8) + '****' + phone.slice(lens - 4)
      }
      return ''
    },
    emailByStar() {
      let email = (this.vertifyData.email).toString()
      if (email) {
        let splitAfter = email.split("@")[1]
        return email.slice(0, 3) + '****@' + splitAfter
      }
      return ''
    }
  },
  created() {
    // console.log(this.vertifyData)
  },
  // async beforeMount() {
  //   let res = await getPhoneAndEmail()
  //   if (res.success) {
  //     this.vertifyData = {
  //       phone: res.data.phone,
  //       email: res.data.email,
  //       google: res.data.isBindGlAtu
  //     }
  //   }
  // },
  mounted() {
  },
  methods: {
    // _getPhoneAndEmail() {
    //   getPhoneAndEmail().then((res) => {
    //     if (res.success) {
    //       let data = res.data
    //       this.vertifyData = {
    //         phone: data.phone,
    //         email: data.email,
    //         google: data.isBindGlAtu
    //       }
    //     }
    //   })
    // }
  }
}
