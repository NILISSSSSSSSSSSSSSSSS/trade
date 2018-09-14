export default {
  el: {
    colorpicker: {
      confirm: "确定",
      clear: "清空"
    },
    datepicker: {
      now: "此刻",
      today: "今天",
      cancel: "取消",
      clear: "清空",
      confirm: "确定",
      selectDate: "选择日期",
      selectTime: "选择时间",
      startDate: "开始日期",
      startTime: "开始时间",
      endDate: "结束日期",
      endTime: "结束时间",
      prevYear: "前一年",
      nextYear: "后一年",
      prevMonth: "上个月",
      nextMonth: "下个月",
      year: "年",
      month1: "1 月",
      month2: "2 月",
      month3: "3 月",
      month4: "4 月",
      month5: "5 月",
      month6: "6 月",
      month7: "7 月",
      month8: "8 月",
      month9: "9 月",
      month10: "10 月",
      month11: "11 月",
      month12: "12 月",
      // week: '周次',
      weeks: {
        sun: "日",
        mon: "一",
        tue: "二",
        wed: "三",
        thu: "四",
        fri: "五",
        sat: "六"
      },
      months: {
        jan: "一月",
        feb: "二月",
        mar: "三月",
        apr: "四月",
        may: "五月",
        jun: "六月",
        jul: "七月",
        aug: "八月",
        sep: "九月",
        oct: "十月",
        nov: "十一月",
        dec: "十二月"
      }
    },
    select: {
      loading: "加载中",
      noMatch: "无匹配数据",
      noData: "无数据",
      placeholder: "请选择"
    },
    cascader: {
      noMatch: "无匹配数据",
      loading: "加载中",
      placeholder: "请选择"
    },
    pagination: {
      goto: "前往",
      pagesize: "条/页",
      total: "共 {total} 条",
      pageClassifier: "页"
    },
    messagebox: {
      title: "提示",
      confirm: "确定",
      cancel: "取消",
      error: "输入的数据不合法!"
    },
    upload: {
      deleteTip: "按 delete 键可删除",
      delete: "删除",
      preview: "查看图片",
      continue: "继续上传"
    },
    table: {
      emptyText: "暂无数据",
      confirmFilter: "筛选",
      resetFilter: "重置",
      clearFilter: "全部",
      sumText: "合计",
      emptyTip: "登录后查看"
    },
    tree: {
      emptyText: "暂无数据"
    },
    transfer: {
      noMatch: "无匹配数据",
      noData: "无数据",
      titles: ["列表 1", "列表 2"],
      filterPlaceholder: "请输入搜索内容",
      noCheckedFormat: "共 {total} 项",
      hasCheckedFormat: "已选 {checked}/{total} 项"
    }
  },
  common: {
    nodata: "暂无数据",
    money: "金额",
    warmPrompt: "温馨提示",
    confirm: "确认",
    cancel: "取消",
    more: "更多",
    legalAmount: "金额",
    user: "用户",
    onlineStatus: "在线状态",
    online: "在线",
    offline: "不在线",
    leftAmount: "余量",
    successTradeCount: "成单数",
    tradeRatio: "完成率",
    seeAll: "查看全部",
    fiatCurrency: "法币",
    price: "价格",
    currency: "币种",
    type: "类型",
    to: "至",
    startTime: "开始时间",
    endTime: "结束时间",
    count: "总计",
    opreation: "操作",
    search: "查询",
    orderCode: "订单号",
    time: "时间",
    opreationType: "操作类型",
    amount: "数量",
    accountAll: "账户总额",
    address: "地址",
    status: "状态",
    serviceCharge: "手续费",
    tradeCode: "交易单号",
    tradeType: "交易类型",
    buy: "买入",
    sell: "卖出",
    currencyType: "资金类型",
    dealPrice: "成交价",
    dealAmount: "成交量",
    tradeStatus: "订单状态",
    othersName: "对方姓名",
    appeal: "申诉",
    deleteMany: "批量删除",
    inputCode: "输入验证码",
    emailCode: "邮箱验证码",
    phoneCode: "手机验证码",
    submit: "提交",
    orderTypes: {
      waitPay: "等待付款",
      success: "交易成功",
      cancel: "交易取消"
    },
    adver: {
      publishTime: "发布时间",
      expireTime: "过期时间",
      tradePrice: "交易价",
      tradeLimit: "交易限额",
      payMethods: "付款方式",
      publish: "发布广告"
    },
    orderComponent: {
      current: "我的当前订单",
      complete: "已完成订单",
      cancel: "已取消订单",
      appeal: "已申诉订单",
      createTime: "创建时间"
    },
    phoneNumber: "手机号",
    email: "邮箱",
    errMsg: {
      phone: "手机号格式错误",
      password: "以字母开头，6-18位字符、数字和下划线组成",
      password2: "两次密码不一致",
      txPw: "资金密码必须是6位数字",
      txPw2: "两次资金密码不一致",
      email: "邮箱格式错误",
      phoneCode: "手机验证码格式错误",
      emailCode: "邮箱验证码格式错误",
      googleCode: "谷歌验证码格式错误"
    },
    twoStep: {
      title: "二次验证",
      inputCode: "请输入已绑定谷歌验证码",
      googleCode: "谷歌验证码"
    },
    code: {
      phone: "短信验证码",
      email: "邮箱验证码",
      google: "谷歌验证码",
      createTime: "创建时间",
      appealTime: "申述时间",
      appealType: "申述类型",
      appealStatus: "申述状态",
      oppoNickname: "对方昵称",
      appealAgainst: "我要申诉",
      paymentInformation: "付款信息",
      paid: "我已付款",
      revoke: "撤单",
      receipt: "我已收款",
      warning:
        "非自动扣款，请本人付款成功后点击”我已付款“，未付款并点击”我已付款“，经核实，将会暂停账号功能。"
    }
  },
  user: {
    login: {
      title: "登录",
      welcome: "欢迎登录",
      byPhone: "手机登录",
      byEmail: "邮箱登录",
      forgetPw: "忘记登录密码？",
      noAcc: "还不是我们的用户？",
      regNow: "立即注册，在全球领先的数字资产交易平台开始交易",
      regFree: "免费注册",
      password: "登录密码"
    },
    reg: {
      title: "注册",
      byPhone: "手机注册",
      byEmail: "邮箱注册",
      loginPw: "设置登录密码",
      loginPw2: "确认登录密码",
      txPw: "设置资金密码",
      txPw2: "确认资金密码",
      txPwNotice: "用于提现，请牢记，不可与登录密码相同",
      readAndAgree: "我已阅读并同意",
      protocol: "《用户使用协议》",
      hasAcc: "已有平台账号？",
      loginNow: "立即登录",
      plzInputEmail: "请输入邮箱",
      plzInputPhone: "请输入手机号",
      receiveCode: "收到的验证码",
      complete: "完成注册"
    },
    reset: {
      title: "重置登录密码",
      byPhone: "手机找回",
      byEmail: "邮箱找回",
      nextStep: "下一步",
      security: "安全验证",
      newPw: "新的登录密码",
      newPw2: "再次输入新的登录密码",
      confirmChange: "确认修改"
    }
  },
  header: {
    index: "首页",
    c2c: "委托交易",
    otc: "OTC交易",
    coin: "币币交易",
    finance: "我的财务",
    security: "安全设置",
    msg: "消息",
    notice: "站内公告",
    helpCenter: "帮助中心",
    theme: "主题：",
    theme_light: "白色",
    theme_dark: "深色",
    login: "登录",
    register: "注册",
    logout: "退出",
    logoutMobile: "退出登录"
  },
  msg: {
    nomsg: "暂时没有消息",
    clear: "清空",
    msg_order_waitCoin: "订单:{orderid}:等待放币",
    msg_order_waitPay_hasExpire: "订单{orderid}:已延迟付款",
    msg_order_waitPay: "订单{orderid}:等待付款",
    msg_order_expire: "订单{orderid}:已过期",
    msg_order_success: "订单{orderid}:已完成",
    msg_order_cancel: "订单{orderid}:已取消",
    msg_appeal_commit: "订单{orderid}:已提交申述",
    msg_appeal_cancel: "订单{orderid}:已取消申述",
    msg_appeal_success: "订单{orderid}:已申述成功",
    msg_appeal_fail: "订单{orderid}:申述失败",
    msg_appeal_process: "订单{orderid}:申述处理中"
  },
  footer: {
    name: "OTCEX",
    desc:
      "OTCEX 是一个提供区块链场外交易的平台，我们致力于让区块链资产更有效的流动，让更多人可以参与到区块链行业中来。我们的技术团队拥有二十多年的金融系统开发和安防经验，打造一个安全、便捷、社区化的交易平台。",
    customerService: "客户服务",
    app: "App",
    helperCenter: "帮助中心",
    appLink: "",
    service: "服务",
    serviceLink: "",
    aboutUs: "关于我们",
    aboutUsLink: "",
    whitePaper: "白皮书",
    whitePaperLink: "",
    group: "官方社群",
    telegramLink: ""
  },
  finance: {
    title: "我的财务",
    property: {
      title: "我的资金",
      fund: {
        title: "账户资金",
        appraisement: "估值",
        convert: "资金折合",
        remark: "注：资金总估是由历史行情估算值，仅为用户提供一个参考，请以单项资金为准",
        myproperty: "我的资产",
        showHas: "显示有资金币种",
        frezze: "冻结金额",
        unlock: "锁仓",
        canuse: "可用金额",
        recharge: "充值",
        stopRecharge: "充暂停",
        withdraw: "提现",
        stopWithdraw: "提暂停",
        trade: "交易",
        stopTrade: "暂停交易"
      },
      detail: {
        title: "账单明细"
      },
      recharge: {
        title: "充值地址",
        qrcode: "二维码",
        copy: "复制钱包地址",
        tip1: "请勿向上述地址充值任何非USDT资产，否则资产将不可找回。",
        tip2:
          "USDT充币仅支持simple send的方法，使用其他方法（send all）的充币暂时无法上账，请您谅解。"
      },
      withdraw: {
        title: "提现地址",
        min: "最小限额",
        password: "资金密码",
        google: "谷歌验证码",
        tip: "如未设置请留空",
        setting: "设置",
        charge: "手续费",
        balance: "可用余额",
        confirm: "提交提币申请"
      }
    },
    recharge: {
      title: "充值提现",
      rechargerecord: {
        title: "最近充值记录",
        header: {
          order: "订单",
          time: "时间",
          amount: "数量",
          address: "地址",
          status: "状态"
        }
      },
      withdrawalrecord: {
        title: "最近提现记录",
        header: {
          order: "订单",
          time: "时间",
          amount: "数量",
          feeAmount: "手续费",
          address: "地址",
          status: "状态"
        }
      }
    },
    trade: {
      title: "交易挂单",
      tradeId: "交易单号",
      time: "时间",
      tradeType: "交易类型",
      currencyType: "资金类型",
      price: "成交价",
      number: "成交量",
      total: "总计",
      orderStatus: "订单状态",
      otherName: "对方姓名",
      oprate: "操作",
      appeal: "申诉",
      pubTime: "发布时间",
      overTime: "过期时间",
      tradePrice: "交易价",
      tradeLimit: "交易限额",
      amount: "数量",
      payType: "付款方式",
      down: "下架",
      downed: "已下架",
      deleteAll: "批量删除",
      delete: "删除",
      up: "上架",
      historyOtc: {
        title: "OTC成交记录"
      },
      historyC2c: {
        title: "委托交易记录"
      },
      historybb: {
        title: "币币交易记录",
        time: "委托时间",
        pair: "交易对",
        direction: "方向",
        price: "价格",
        amount: "数量",
        total: "委托总额"
      },
      myAdver: {
        title: "我的广告",
        publish: "发布广告",
        confirm: "确认删除广告？",
        hint: "温馨提示",
        success1: "删除成功",
        success2: "下架成功"
      },
      merchant: {
        title: "认证商家",
        cancel: "取消认证",
        change: "修改认证",
        isMerchant: "商家已认证",
        step1: "选择特权",
        step2: "专业对接",
        step3: "享受特权服务",
        score: "商家评分",
        cumulative: "累计交易量",
        avaTime: "平均交易时间"
      }
    },
    security: {
      title: "安全设置",
      google: {
        title: "绑定谷歌验证器",
        googleCode: "谷歌验证码",
        cancelGoogle: "取消谷歌验证",
        unbind: {
          title: "绑定谷歌验证器",
          tip:
            "谷歌验证器是一款动态口令工具，工作原理类似短信动态验证。绑定后每30s生成一个动态验证码，验证码可用于登录、提现、修改安全设置等操作的安全验证。",
          first: {
            subTitle: "下载谷歌验证器APP",
            cont1: "iOS用户登录App Store搜索“Authenticator”下载。",
            cont2: "安卓用户登录应用商店或使用手机浏览器搜索“谷歌验证器”下载。"
          },
          second: {
            subTitle: "在谷歌验证器中添加密钥并备份",
            cont1: "打开谷歌验证器，扫描下方二维码或手动输入下述密钥添加验证令牌。",
            cont2: "密钥用于手机更换或遗失时找回谷歌验证器，绑定前请务必将下述密钥备份保存。",
            secret: "密钥",
            copy: "复制"
          },
          third: {
            subTitle: "输入谷歌验证器中6位验证码",
            // cont1: '谷歌验证码',
            btn: "绑定"
          }
        },
        cancel: {
          title: "取消谷歌验证器",
          tip: "您的帐号已经成功开启谷歌验证功能！如果您要取消此功能，请输入您的谷歌验证码"
          // cont1: '谷歌验证码',
          // btn: '取消谷歌验证'
        },
        bind: {
          title: "您已绑定谷歌验证器。",
          warning: {
            name: "注意：",
            cont1:
              "切勿删除谷歌验证器应用程序内的谷歌验证码账户，否则会导致您无法进行账户操作。如果遇到手机丢失，软件卸载等无法输入谷歌验证码的情况，请联系管理员 Email: *******@mail.oi0 。",
            cont2:
              "如果一直提示谷歌验证码不对，请检查和校准手机时间，当前服务器时间2018-07-17 09:45:23 UTC+8",
            cont3:
              "谷歌验证为您的交易密码带来第二重保护。启用这一功能后，在您每次登录，或者提取现金操作前都必须输入手机应用程序上显示的谷歌验证码。本功能目前支持 iOS 和 Android 设备。",
            cont4: "谷歌验证详细信息请阅读：Google Authenticator安装及使用说明"
          }
        },
        tips: {
          copySuccess: "复制成功",
          copyFail: "复制失败",
          googleCode: "请填入正确的google二次验证码",
          unbind: "解绑成功",
          bind: "绑定成功"
        }
      },
      phone: {
        title: "手机绑定"
      },
      email: {
        title: "邮箱绑定",
        unbind: {
          title: "绑定邮箱",
          tip: "用于安全通知，登录、安全设置时输入"
        },
        bind: {
          title: "已绑定邮箱:",
          tip: "用于安全通知，登录、安全设置时输入。"
        },
        yourEmail: "您的邮箱",
        emailCode: "邮箱验证码",
        getCode: "获取验证码",
        bindBtn: "绑定",
        tips: {
          email: "请填写正确的邮箱号",
          emailCode: "请输入正确的邮箱验证码",
          success: "绑定成功",
          codeSuccess: "获取验证码成功"
        }
      },
      pay: {
        title: "收款设置",
        tip: "设置收款方式，必须是本人账号。（支付时必须本人实际操作，非自动扣款）",
        warning: {
          name: "注意：",
          cont1: "请绑定您的本人收款信息",
          cont2: "支付时必须本人实际操作，非自动扣款"
        }
      },
      changeLoginPw: {
        title: "修改登录密码",
        tip: "修改登录密码后24小时内禁止提币",
        title1: "修改登录密码（忘记原登录密码）",
        assetsPw: "资金密码",
        submit: "提交",
        newLoginPw: "新登录密码",
        affirmNewPw: "确认新登录密码",
        oldLoginPw: "原登录密码",
        forgetOldPw: "忘记登录密码?",
        newLoginPwAgain: "再次新登录密码",
        tips: {
          loginPw: "请输入正确格式的密码",
          assetsPw: "请输入正确格式的资金密码",
          differ: "两次密码输入不一致",
          success: "修改成功"
        }
      },
      changeAssetspw: {
        title: "修改资金密码",
        tip: "修改资金密码后24小时内禁止提币",
        oldAssetspw: "原资金密码",
        forgetoldAssetspw: "忘记原资金密码?",
        newAssetspw: "新资金密码",
        affirmNewPw: "确认新资金密码",
        next: "下一步",
        title1: "修改资金密码（忘记原资金密码）",
        loginPw: "请输入登录密码",
        submit: "提交",
        inputNewAssetspw: "请输入您新的资金密码",
        inputNewAssetspwAgain: "请再输入一次新资金密码",
        sure: "确认修改",
        tips: {
          assetsPw: "请输入正确格式的资金密码",
          differ: "两次密码输入不一致",
          loginPw: "请输入正确格式的登录密码",
          success: "修改成功"
        }
      },
      logs: {
        title: "安全日志",
        subTitle: "登录日志",
        table: {
          index: "序号",
          time: "时间",
          see: "查看",
          status: "状态",
          lang: "语言"
        },
        warning: {
          warn: "注意：",
          time: "当前服务器时间: 2018-07-18 10:07:51 UTC+8"
        },
        prompt: {
          assetsPw: "请输入资金密码",
          seeIp: "查看IP",
          pwError: "密码格式不正确",
          loginIp: "登录IP",
          nowIp: "当前IP",
          address: "地址位置"
        }
      }
    },
    person: {
      title: "个人设置",
      information: {
        title: "基本资料",
        editAvatar: "编辑头像",
        placeholderNickname: "请输入昵称",
        nickname: "昵称"
      }
    },
    feedback: {
      title: "交易申诉",
      history: {
        title: "申诉历史",
        header: {
          order: "订单号",
          createTime: "申述时间",
          appealType: "申述原因",
          appealStatus: "申述状态",
          opt: "操作"
        },
        show: "查看",
        void: "撤销",
        cancel_success: "申述撤销成功"
      },
      create: {
        title: "提交申述",
        header: "对订单号{order}的申述",
        reason: "选择申述原因",
        notice1: "请提交您的相关图像证据材料（可选）：",
        notice2:
          "图片要求：文件大小不能超过4M！文件格式须为jpg或者png！请确保照片清晰，无水印，无污渍。",
        notice3: "您的文字资料",
        submit: "提交",
        submit_success: "申述提交成功",
        upload_limit: "图片不能超过4M"
      },
      detail: {
        title: "申述详情",
        header: "对订单号{order}的申述",
        reason: "申述原因：",
        notice1: "您提交的相关图片资料：",
        notice2: "您的文字资料"
      }
    }
  },
  c2c: {
    title: "委托交易",
    to: "对",
    buyAmount: "购买量",
    sellAmount: "卖出量",
    payMethods: "支付方式",
    buyEstimate: "买入估计",
    sellEstimate: "卖出估计",
    systemIsNice: "系统匹配的价格是最优的选择",
    imBuy: "立即买入",
    imSell: "立即卖出",
    merchant: "商户",
    dealAmount: "成交数量",
    becomeMerchant: "成为认证商家",
    priceMap: {
      cur: "实时价：",
      day: "日涨跌：",
      high: "最高价：",
      low: "最低价："
    }
  },
  otc: {
    title: "OTC交易",
    msgOrderSuccess: "订单创建成功！",
    plzConfirm: "请确认",
    price: "价格：",
    buyAmount: "买入量：",
    sellAmount: "卖出量：",
    amount: "金额：",
    quota: "限额：",
    tradeType: "交易方式：",
    confirm: "确定提交",
    cancel: "取 消"
  },
  coin: {
    title: "币币交易"
  },
  helpCenter: {
    title: "帮助中心"
  },
  enum: {
    appealType: {
      no_pay: "没有付款",
      no_coin: "没有支付虚拟币",
      no_response: "没有响应",
      spite: "恶意交易",
      other: "其他"
    },
    appealStatus: {
      normal: "暂无申述",
      processing: "申述中",
      success: "已处理",
      fail: "申诉失败",
      cancel: "取消申述"
    },
    depositsStatus: {
      1: "等待确认",
      2: "充值失败",
      3: "充值成功"
    },
    withdrawStatus: {
      1: "初始化",
      2: "已广播",
      3: "等待确认",
      4: "提币成功",
      5: "等待审核",
      6: "提币失败"
    }
  }
};
