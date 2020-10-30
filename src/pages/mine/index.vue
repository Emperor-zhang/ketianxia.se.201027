<template>
  <view class="content">
    <view class="pageout" :style="scrollTop">
      <!-- 背景图 -->
      <image class="bgPic" :src="$url + '/5.jpg'" mode="widthFix"></image>
      <!-- 头像 -->
      <image class="nickUrl" :src="nickUrl" mode="widthFix"></image>
      <!-- 昵称 -->
      <view class="nickName">{{ nickName }}</view>
      <!-- 奖品 -->
      <image
        class="recommend0"
        :src="$url + '/s-' + selected + '.png'"
        mode="widthFix"
      ></image>
      <view class="award">{{ goods[goodsId - 1] }}</view>
      <image
        class="convert"
        :src="$url + '/5-1.png'"
        mode="widthFix"
        @click="recommend"
      ></image>
      <!-- 推荐 -->
      <image
        class="recommend1"
        :src="$url + '/s-' + x0 + '.png'"
        mode="widthFix"
      ></image>
      <image
        class="recommend2"
        :src="$url + '/s-' + x1 + '.png'"
        mode="widthFix"
      ></image>
      <image
        class="recommend3"
        :src="$url + '/s-' + x2 + '.png'"
        mode="widthFix"
      ></image>
      <!-- 戳我获取更多 -->
      <image
        :src="$url + '/5-2.png'"
        mode="widthFix"
        class="getMoreInfo"
        @click="getMoreInfo"
      ></image>
    </view>
  </view>
</template>
<script>
var that;
import { getResquest } from "@/utils/api.js";
export default {
  data() {
    return {
      goods: ["iPhone 12", "代步平衡车", "美的破壁机", "九阳烤箱"],
      goodsNumber: [0, 1, 2, 3],
      $url: "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img",
      scrollTop: "top:0rpx",
      windowheight: 0,
      nickName: "1",
      nickUrl:
        "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img/kong.png",
      nickUrlWeb: "1",
      goodsId: 1,
      openid: "1",
      flag: true,
      x0: 1,
      x1: 1,
      x2: 1,
      selected: 1,
    };
  },
  onLoad() {
    that = this;
    that.goodsId = uni.getStorageSync("goodsid");
    if (that.goodsId == 0) {
      uni.showModal({
        title: "提示",
        content: "请先选择奖品，再来进行兑换！！！",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            uni.switchTab({
              url: "/pages/index/index",
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
            uni.switchTab({
              url: "/pages/index/index",
            });
          }
        },
      });
    } else {
      that.goodsId = uni.getStorageSync("goodsid");
      that.nickName = uni.getStorageSync("nickname");
      that.nickUrl = uni.getStorageSync("nickurl");
      that.openid = uni.getStorageSync("OpenID");
      // 删选推荐
      if (that.flag == true) {
        that.goodsNumber.splice(
          that.goodsNumber.findIndex((item) => item === that.goodsId - 1),
          1
        );
        that.x0 = parseInt(that.goodsNumber[0]) + 1;
        that.x1 = parseInt(that.goodsNumber[1]) + 1;
        that.x2 = parseInt(that.goodsNumber[2]) + 1;
        that.selected = parseInt(that.goodsId);
        // console.log(that.selected);
        // console.log(that.x0, that.x1, that.x2);
        that.flag = false;
      }
    }
  },
  onShow() {
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
  components: {},
  methods: {
    onShareAppMessage: function(res) {
      // console.log(res);
      // if (res.from == "button") {
      // }
      return {
        title: "分享",
        path: "/pages/index/index",
        imageUrl:
          "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img/share.png", //用户分享出去的自定义图片大小为5:4,
      };
    },
    getMoreInfo() {
      uni.navigateTo({
        url: "/pages/advertise/index",
      });
    },
    recommend() {
      that.getRecommend();
    },
    getRecommend() {
      getResquest("/CommonHelper.ashx?Method=Flag", {
        OpenID: that.openid,
      }).then((res) => {
        console.log(res);
        if (res.data[0].Opt == 1) {
          uni.showToast({
            title: "兑换成功！",
            mask: true,
            duration: 1500,
          });
        } else if (res.data[0].Opt == 2) {
          uni.showToast({
            title: "奖品已经兑换完",
            mask: true,
            image: "/static/err.png",
            duration: 1500,
          });
        } else if (res.data[0].Opt == 3) {
          uni.showToast({
            title: "活动结束",
            mask: true,
            image: "/static/err.png",
            duration: 1500,
          });
        } else if (res.data[0].Opt == 4) {
          uni.showToast({
            title: "您已兑换过奖品",
            mask: true,
            image: "/static/err.png",
            duration: 1500,
          });
        } else if (res.data[0].Opt == 5) {
          uni.showToast({
            title: "请先选择奖品",
            mask: true,
            image: "/static/err.png",
            duration: 1500,
          });
        } else if (res.data[0].Opt == 6) {
          uni.showToast({
            title: "你的助力人数不满足兑换条件",
            mask: true,
            icon: "none",
            duration: 1500,
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  position: relative;
  .pageout {
    width: 100%;
    position: absolute;
    .bgPic {
      width: 100%;
    }
    .nickUrl {
      width: 120rpx;
      position: absolute;
      top: 120rpx;
      left: 100rpx;
      border-radius: 200rpx;
      box-shadow: 6rpx 6rpx 18rpx 0rpx rgb(168, 156, 156);
    }
    .nickName {
      position: absolute;
      top: 200rpx;
      left: 237rpx;
      font-size: 30rpx;
      color: #4e4e4e;
    }
    .award {
      position: absolute;
      font-size: 36rpx;
      color: #ff7100;
      top: 392rpx;
      left: 280rpx;
    }
    .convert {
      position: absolute;
      width: 150rpx;
      top: 372rpx;
      left: 500rpx;
    }
    .recommend0 {
      position: absolute;
      width: 120rpx;
      top: 360rpx;
      left: 100rpx;
    }
    .recommend1 {
      position: absolute;
      width: 150rpx;
      top: 736rpx;
      left: 100rpx;
    }
    .recommend2 {
      position: absolute;
      width: 150rpx;
      top: 736rpx;
      left: 302rpx;
    }
    .recommend3 {
      position: absolute;
      width: 150rpx;
      top: 736rpx;
      left: 502rpx;
    }
    .getMoreInfo {
      position: absolute;
      top: 940rpx;
      left: 57rpx;
      width: 250rpx;
      animation: biger 2s linear infinite forwards;
    }
  }
}
</style>
