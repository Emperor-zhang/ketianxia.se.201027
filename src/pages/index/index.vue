<template>
  <view class="content">
    <view class="container" v-if="isUserinfo">
      <view class="pageBox" style="padding: 10% 10%;">
        <view
          style="height: 1px; width: 100%; margin: 20px auto; background:#E8E8E8;"
        ></view>
        <view style="margin: 40px 0;">
          <text style="color: #000000;font-weight: bold;"
            >申请获取以下权限</text
          >
          <text style="color: #C1B6B4;">获得你的公开信息（昵称，头像等）</text>
        </view>
        <button
          class="btn"
          open-type="getUserInfo"
          type="primary"
          @getuserinfo="bindGetUserInfo"
        >
          授权登录
        </button>
      </view>
    </view>

    <!-- <view class="attention">
      <official-account style=""></official-account>
    </view> -->
    <!-- swipwer -->
    <swiper class="swiperTop" :swiperList="swiper"></swiper>
    <!-- 长图 -->
    <image :src="$url + '/1.jpg'" mode="widthFix" class="bgPic"></image>
    <!-- 四个奖品图片 -->
    <view class="picList">
      <image
        class="picButton"
        :src="item.url"
        v-for="(item, index) in picList"
        :key="index"
        :data-index="index"
        mode="widthFix"
        @click="handlePicClick(item.id)"
      ></image>
    </view>
    <!-- 倒计时 -->
    <view class="countDown">
      <countdown :startTime="startTime" :endTime="enTime" />
    </view>
    <!-- 登陆 -->
    <view class="apply" v-if="isLogin">
      <view class="pageApply" :style="scrollTop">
        <image :src="$url + '/7.jpg'" mode="widthFix" class="applyPic"></image>
        <view class="infoBox">
          <input
            type="text"
            :value="name"
            placeholder-style="color:#ccc"
            placeholder="姓名"
            @input="inputName"
          />
          <input
            type="text"
            :value="phone"
            placeholder-style="color:#ccc"
            placeholder="电话"
            @input="inputPhone"
          />
        </view>
        <view class="btnBottom">
          <button class="cu-btn round bg-orange" type="warn" @click="cancel">
            Cancel
          </button>
          <button class="cu-btn round bg-orange" type="primary" @click="save">
            Ensure
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
var that;
import swiper from "@/components/swiper/index";
import { getResquest } from "@/utils/api.js";
import countdown from "@/components/cz-countdown/cz-countdown.vue";
import time from "@/utils/time.js";
export default {
  data() {
    return {
      startTime: "2020-10-30 20:00:00",
      enTime: "2020-10-30 20:00:00",
      $url: "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img",
      swiper: [
        {
          id: "1",
          type: "image",
          url: "https://wb.jaas.ac.cn/ketianxia.se.201027/img/1-5.jpg",
        },
      ],
      picList: [
        {
          id: "1",
          type: "image",
          url: "https://wb.jaas.ac.cn/ketianxia.se.201027/img/1-1.png",
        },
      ],
      isUserinfo: false,
      nickName: "x",
      nickUrl:
        "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img/kong.png",
      openid: "x",
      name: "x",
      phone: 0,
      state: 0,
      flag: 0,
      scrollTop: "top:0rpx",
      windowheight: 0,
      goodsid: 0,
      isLogin: false,
    };
  },
  onShow() {
    this.startTime = time.formatTime(new Date());
  },
  onLoad() {
    uni.hideTabBar();
    let that = this;
    that.getPIc();
    // 检验、登录
    wx.checkSession({
      success: function(r) {
        uni.getUserInfo({
          success: function(result) {
            console.log("result", result);
            that.nickName = result.userInfo.nickName;
            that.nickUrl = result.userInfo.avatarUrl;
            uni.setStorageSync("nickname", result.userInfo.nickName);
            uni.setStorageSync("nickurl", result.userInfo.avatarUrl);
            that.getLogin();
          },
        });
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function() {
        //session_key 已经失效，需要重新执行登录流程
        // 是否已授权
        uni.getSetting({
          success: function(res) {
            if (res.authSetting["scope.userInfo"]) {
              that.isUserinfo = false;
              uni.getUserInfo({
                success: function(result) {
                  // console.log(res.userInfo);
                  that.nickName = result.userInfo.nickName;
                  that.nickUrl = result.userInfo.avatarUrl;
                  uni.setStorageSync("nickname", result.userInfo.nickName);
                  uni.setStorageSync("nickurl", result.userInfo.avatarUrl);
                  //用户已经授权过
                  that.getLogin();
                },
              });
            } else {
              that.isUserinfo = true;
            }
          },
        });
      },
    });
    uni.getSystemInfo({
      success(res) {
        let bgPic = {
          width: 750,
          height: 1131,
        };
        that.windowheight = parseInt(
          (res.windowWidth / bgPic.width) * bgPic.height
        );
        that.scrollTop =
          "top:" + (res.windowHeight - that.windowheight) + "rpx";
      },
    });
  },

  methods: {
    onShareAppMessage: function(res) {
      console.log(res);
      if (res.from == "button") {
      }
      return {
        title: "分享",
        path: "/pages/index/index",
        imageUrl:
          "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img/share.png", //用户分享出去的自定义图片大小为5:4,
      };
    },
    // 取消登陆
    cancel() {
      this.isLogin = false;
      console.log(this.isLogin);
    },
    // 登陆
    save() {
      if (this.name == "") {
        uni.showToast({
          title: "请输入姓名",
          mask: true,
          image: "/static/err.png",
          duration: 1500,
        });
        return;
      }
      if (this.phone == "") {
        uni.showToast({
          title: "请输入手机号码",
          mask: true,
          image: "/static/err.png",
          duration: 1500,
        });
        return;
      }
      if (
        !/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.phone) ||
        this.phone.length != 11
      ) {
        uni.showToast({
          title: "电话格式不正确",
          mask: true,
          image: "/static/err.png",
          duration: 1500,
        });
        return false;
      }
      getResquest("/CommonHelper.ashx?Method=Save", {
        OpenID: this.openid,
        Name: this.name, //姓名
        Phone: this.phone, //手机
        GoodsID: getApp().globalData.id, //所选要兑换的奖品编号
      }).then((res) => {
        uni.setStorageSync("state", res.data[0].State);
        uni.setStorageSync("flag", res.data[0].Flag);
        uni.setStorageSync("goodsid", res.data[0].GoodsID);
        if (res.data[0].Opt == 1) {
          uni.showToast({
            title: "提交成功",
            mask: true,
            duration: 20000,
          });

          setTimeout(function() {
            uni.hideToast();
            uni.switchTab({
              url: "/pages/bargain/index",
            });
            this.isLogin = false;
          }, 2000);
        } else if (res.data[0].Opt == 2) {
          uni.showToast({
            title: "您已报过名",
            mask: true,
            image: "/static/err.png",
            duration: 2000,
          });
        } else if (res.data[0].Opt == 3) {
          uni.showToast({
            title: "活动结束",
            mask: true,
            image: "/static/err.png",
            duration: 2000,
          });
        } else if (res.data[0].Opt == 4) {
          uni.showToast({
            title: "手机号码已存在",
            mask: true,
            image: "/static/err.png",
            duration: 2000,
          });
        }
      });
    },
    // 授权
    bindGetUserInfo(e) {
      let that = this;
      console.log(e);
      if (e.detail.userInfo) {
        that.nickName = e.detail.userInfo.nickName;
        that.nickUrl = e.detail.userInfo.avatarUrl;
        uni.setStorageSync("nickname", e.detail.userInfo.nickName);
        uni.setStorageSync("nickurl", e.detail.userInfo.avatarUrl);
        uni.showLoading({
          title: "正在登陆",
          mask: true,
          duration: 2000,
        });
        setTimeout(function() {
          that.isUserinfo = false;
          that.getLogin();
        }, 2000);
      } else {
        that.isUserinfo = true;
      }
    },
    // 点击奖品
    handlePicClick(id) {
      getApp().globalData.id = id;
      if (this.state == 1 && this.goodsid != 0) {
        uni.showModal({
          title: "提示",
          content: "您已经选择过奖品，是否进入砍价",
          success: function(res) {
            if (res.confirm) {
              console.log("用户点击确定");
              uni.switchTab({
                url: "/pages/bargain/index",
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          },
        });
      } else {
        this.isLogin = true;
      }
    },
    inputName(e) {
      this.name = e.detail.value;
    },
    inputPhone(e) {
      this.phone = e.detail.value;
    },
    getPIc() {
      getResquest("/CommonHelper.ashx?Method=GetInfo", {}).then((res) => {
        this.swiper = res.data[0].TitleImg || [
          {
            id: "1",
            type: "image",
            url: "https://wb.jaas.ac.cn/ketianxia.se.201027/img/1-5.jpg",
          },
        ];
        this.picList = res.data[0].GoodsImg || [
          {
            id: "1",
            type: "image",
            url: "https://wb.jaas.ac.cn/ketianxia.se.201027/img/1-5.jpg",
          },
        ];
      });
    },
    getLogin() {
      let that = this;
      uni.login({
        provider: "weixin",
        success(res) {
          if (res.code) {
            //发起网络请求
            //使用 code 换取 openid 和 session_key 等信息
            getResquest("/CommonHelper.ashx?Method=Check", {
              Code: res.code, //小程序获取的code
              NickName: unescape(that.nickName), //微信昵称
              NickUrl: that.nickUrl, //微信头像
            }).then((res) => {
              uni.setStorageSync("OpenID", res.data[0].OpenID);
              uni.setStorageSync("SessionKey", res.data[0].SessionKey);
              uni.setStorageSync("state", res.data[0].State);
              uni.setStorageSync("flag", res.data[0].Flag);
              uni.setStorageSync("goodsid", res.data[0].GoodsID);
              uni.setStorageSync("userid", res.data[0].UserID);

              that.openid = res.data[0].OpenID;
              that.state = res.data[0].State;
              that.flag = res.data[0].Flag;
              that.goodsid = res.data[0].GoodsID;
              that.userid = res.data[0].UserID;
              that.openid = res.data[0].OpenID;
              that.nickName = res.data[0].NickName;
              that.nickUrl = res.data[0].NickUrl;
              that.DownloadUrl();
            });
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        },
      });
    },
    DownloadUrl() {
      getResquest("/CommonHelper.ashx?Method=DownloadUrl", {
        OpenID: this.openid, //微信标识符
        NickUrl: this.nickUrl, //头像
      }).then((res) => {
        console.log(res);
        uni.setStorageSync(
          "nickurl",
          "https://wb.jaas.ac.cn/ketianxia.se.201027/UpLoad/headimg/" +
            this.openid +
            ".jpg"
        );
        uni.showTabBar({
          animation: true,
        });
      });
    },
  },
  components: {
    swiper,
    countdown,
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 750rpx;
  height: 100vh;
  position: relative;
  .bgPic {
    width: 100%;
  }
  .swiperTop {
    width: 750rpx;
    height: 460rpx;
  }
  .countDown {
    position: absolute;
    width: 300rpx;
    top: 494rpx;
    left: 80%;
    margin-left: -150rpx;
    text-align: center;
    font-size: 36rpx;
    color: #6b6b6b;
    text-shadow: 1px 1px 1px #f3b66a;
  }
  .picList {
    position: absolute;
    top: 580rpx;
    width: 90%;
    left: 5%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .picButton {
      width: 43vw;
      margin: 10rpx 0;
    }
  }
  .container {
    width: 100%;
    height: 100%;
    background: #94747e;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    .pageBox {
      padding: 10%;
    }
    .btn {
      width: 100%;
      line-height: 40px;
      color: #ffffff;
      background: #1aad19;
      text-align: center;
      border-radius: 20px;
      margin: auto;
    }
  }
  .apply {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1;
    .pageApply {
      position: absolute;
      width: 100%;
      .applyPic {
        width: 100%;
      }
      .infoBox {
        width: 500rpx;
        height: 200rpx;
        border: 3px solid #848484;
        box-shadow: 5rpx 5rpx 15rpx 0rpx #998080;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        position: absolute;
        top: 400rpx;
        left: 50%;
        margin-left: -250rpx;
        input {
          width: 400rpx;
          height: 80rpx;
          font-size: 32rpx;
          text-align: center;
          text-shadow: 2rpx 2rpx 2rpx rgb(158, 148, 148);
          color: rgb(63, 63, 63);
          border-bottom: 1px solid #ccc;
        }
      }
      .btnBottom {
        width: 460rpx;
        height: 200rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        top: 600rpx;
        left: 50%;
        margin-left: -230rpx;
      }
    }
  }
  .payment {
    color: #ffebd6;
    font-size: 36rpx;
    padding: 20rpx;
    text-align: center;
  }
  .attention {
    position: fixed;
    bottom: 10rpx;
    width: 100%;
  }
}
</style>
