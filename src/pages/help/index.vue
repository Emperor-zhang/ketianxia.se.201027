<template>
  <view class="content">
    <view class="pageout" v-if="isUserinfo">
      <text>为了更好地体验小程序，请先登录</text>
      <button
        open-type="getUserInfo"
        size="mini"
        type="primary"
        @getuserinfo="bindGetUserInfo"
      >
        登录
      </button>
    </view>
    <!-- 背景图 -->
    <image class="bgPic" :src="$url + '/4.jpg'" mode="widthFix"></image>
    <!-- 头像 -->
    <image class="nickUrl" :src="nickUrl" mode="widthFix"></image>
    <!-- 奖品 -->
    <view class="awardsText">{{ awardText }}</view>
    <!-- 倒计时 -->
    <view class="countDown">
      <countdown :startTime="startTime" :endTime="enTime" />
    </view>
    <!-- 帮他助力 -->
    <image
      :src="$url + '/4-1.png'"
      class="help"
      mode="widthFix"
      @click="help"
    ></image>
    <!-- 我要参与 -->
    <image
      :src="$url + '/4-2.png'"
      class="jion"
      mode="widthFix"
      @click="jion"
    ></image>
  </view>
</template>
<script>
var that;
import countdown from "@/components/cz-countdown/cz-countdown.vue";
import time from "@/utils/time.js";
import { getResquest } from "@/utils/api.js";
export default {
  data() {
    return {
      $url: "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img",
      startTime: "",
      enTime: "",
      awardText: "",
      openid: "",
      userid: 0,
      nickName: "",
      nickUrl: "",
      isUserinfo: false,
      isLogin: false,
    };
  },
  onLoad(e) {
    that = this;
    console.log(e);
    that.enTime = e.countDown;
    that.awardText = e.award;
    that.openid = e.openId;
    that.userid = e.UserID;
    // 检验、登录
    wx.checkSession({
      success: function(r) {
        //session_key 未过期，并且在本生命周期一直有效
        that.nickName = uni.getStorageSync("nickname");
        that.nickUrl = uni.getStorageSync("nickurl");
      },
      fail: function() {
        //session_key 已经失效，需要重新执行登录流程
        // 是否已授权
        uni.getSetting({
          success: function(res) {
            if (res.authSetting["scope.userInfo"]) {
              that.isUserinfo = false;
              wx.getUserInfo({
                success: function(result) {
                  // console.log(res.userInfo);
                  that.nickName = result.userInfo.nickName;
                  that.nickUrl = result.userInfo.avatarUrl;
                  uni.setStorageSync("nickname", result.userInfo.nickName);
                  uni.setStorageSync("nickurl", result.userInfo.avatarUrl);
                  //用户已经授权过
                },
              });
            } else {
              that.isUserinfo = true;
            }
          },
        });
      },
    });
  },
  onShow() {
    that.startTime = time.formatTime(new Date());
    that.nickUrl = uni.getStorageSync("nickurl");
  },
  components: { countdown },
  methods: {
    help() {
      getResquest("/CommonHelper.ashx?Method=Help", {
        OpenID: that.openid,
        UserID: that.userid,
        NickName: unescape(that.nickName), //微信昵称
        NickUrl: that.nickUrl, //微信头像
      }).then((res) => {
        // console.log(res);
        if (res.data[0].Opt == 1) {
          // res.data[0].HelpCount //助力值3
          uni.showToast({
            title: "助力成功",
            mask: true,
            duration: 1500,
          });
        } else if (res.data[0].Opt == 2) {
          uni.showToast({
            title: "您已助力，每人仅有1票",
            mask: true,
            icon: "none",
            duration: 2000,
          });
        } else if (res.data[0].Opt == 2) {
          uni.showToast({
            title: "活动结束",
            mask: true,
            image: "/static/err.png",
            duration: 2000,
          });
        }
      });
    },
    jion() {
      uni.switchTab({
        url: "/pages/index/index",
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
          uni.hideLoading();
          that.isUserinfo = false;
        }, 2000);
      } else {
        that.isUserinfo = true;
      }
    },
    onShareAppMessage: function(res) {
      //   console.log(res);
      // if (res.from == "button") {
      // }
      return {
        title: "分享",
        path: "/pages/bargain/index?UserID=" + that.userid,
        imageUrl:
          "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img/share.png", //用户分享出去的自定义图片大小为5:4,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  position: relative;
  .pageout {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #fff;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 1;
    text {
      font-size: 30rpx;
      margin-bottom: 100rpx;
    }
  }
  .bgPic {
    width: 100vw;
  }
  .nickUrl {
    width: 152rpx;
    position: absolute;
    top: 17%;
    left: 50%;
    margin-left: -76rpx;
    border-radius: 200rpx;
  }
  .awardsText {
    position: absolute;
    width: 300rpx;
    top: 35%;
    left: 50%;
    margin-left: -150rpx;
    text-align: center;
    font-size: 36rpx;
    color: #6b6b6b;
    text-shadow: 1px 1px 1px #f3b66a;
  }
  .countDown {
    position: absolute;
    width: 300rpx;
    top: 41.2%;
    left: 79%;
    margin-left: -150rpx;
    text-align: center;
    font-size: 36rpx;
    color: #6b6b6b;
    text-shadow: 1px 1px 1px #f3b66a;
  }
  .help {
    position: absolute;
    width: 200rpx;
    top: 76%;
    left: 50%;
    margin-left: -100rpx;
    animation: icon 1.5s linear infinite;
  }
  .jion {
    position: absolute;
    width: 200rpx;
    top: 84%;
    left: 50%;
    margin-left: -100rpx;
    animation: icon 1.5s linear infinite;
  }
}
</style>
