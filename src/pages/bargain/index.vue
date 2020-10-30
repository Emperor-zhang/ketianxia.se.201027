<template>
  <view class="content">
    <image :src="$url + '/2.jpg'" mode="widthFix" class="bgPic"></image>
    <!-- 头像 -->
    <image :src="nickUrlWeb" mode="widthFix" class="uesrNickUrl"></image>
    <!-- 奖品名称 -->
    <view class="awardsText">{{ goods[goodsNumber - 1] }}</view>
    <!-- 倒计时 -->
    <view class="countDown">
      <countdown :startTime="startTime" :endTime="enTime" />
    </view>
    <!-- 邀请好友 -->
    <image
      :src="$url + '/2-1.png'"
      mode="widthFix"
      class="inviteFriend"
    ></image>
    <button class="share" open-type="share">转发</button>
    <!-- 生成海报 -->
    <image
      :src="$url + '/2-2.png'"
      mode="widthFix"
      class="becomePoster"
      @click="becomePoster"
    ></image>
    <!-- 已助力人数 -->
    <view class="helpCount">{{ helpcount }}</view>
    <!-- 助力好友滚动显示 -->
    <scroll-view scroll-y class="friendHelpList">
      <view class="scroll">
        <view class="helpBox" v-for="(item, index) in boxList" :key="index">
          <image
            class="friendNickUrl"
            :src="item.NickUrl"
            mode="widthFix"
          ></image>
          <text class="friendNickName">{{ item.NickName }}</text>
        </view>
      </view>
    </scroll-view>
    <!-- 生成海报组件 -->
    <view class="getPoster" v-show="isShow">
      <canvas
        canvas-id="myCanvas"
        id="canvasId"
        :style="'height:' + windowheight + 'px;position: absolute;' + scrollTop"
      ></canvas>
      <image :src="base64" v-show="base64" class="pc-container"></image>
      <button class="ensure" type="primary" @click="saveImage">保存</button>
      <button class="cancelimg" type="warn" @click="cancelimg">取消</button>
    </view>
  </view>
</template>
<script>
// import QR from "@/components/poster/wxqrcode.js"; // 二维码生成器
// import hchPoster from "@/components/hch-poster/hch-poster.vue";
import { getResquest } from "@/utils/api.js";
import countdown from "@/components/cz-countdown/cz-countdown.vue";
import time from "@/utils/time.js";
export default {
  data() {
    return {
      base64: "",
      ewm: "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img/3.jpg", //背景
      goods: ["iPhone 12", "代步平衡车", "美的破壁机", "九阳烤箱"],
      goodsNumber: "",
      $url: "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img",
      startTime: "",
      nickUrlWeb: "",
      enTime: "",
      isShow: false,
      imgurl: "",
      canvasShow: true,
      windowwidth: 0,
      windowheight: 0,
      scrollTop: "",
      boxList: [
        {
          NickUrl:
            "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img/kong.png",
        },
      ],
      Code: "",
      userid: 0,
      openid: "",
      nickName: "",
      nickUrl: "",
      thisNickUrl: "",
      goodsid: 0,
      helpcount: 0,
      fNickName: "",
      fNickUrl: "",
      rowid: 0,
      flag: 0,
      getUserId: 0,
      v0: "",
      v1: "",
    };
  },
  onHide() {
    uni.removeStorageSync("person-card");
  },
  onShow() {
    let that = this;
    uni.getSystemInfo({
      success(res) {
        console.log(res);
        let poster = {
          width: 750,
          height: 1131,
        };
        that.windowwidth = res.windowWidth;
        that.windowheight = parseInt(
          (that.windowwidth / poster.width) * poster.height
        );
        that.scrollTop =
          "top:" + (res.windowHeight - that.windowheight) + "rpx";
      },
    });
    that.nickUrl = uni.getStorageSync("nickurl");
    let nickUrl = uni.getStorageSync("nickurl");
    //这里等promise执行，避免拿不到图片临时路径
    uni.downloadFile({
      url: that.ewm,
      success: (res1) => {
        that.v1 = res1.tempFilePath;
      },
    });
    uni.downloadFile({
      url: nickUrl,
      success: (res) => {
        that.v0 = res.tempFilePath;
      },
    });

    // ---------------------------------------------------
    that.startTime = time.formatTime(new Date());
    that.goodsNumber = uni.getStorageSync("goodsid");
    uni.login({
      provider: "weixin",
      success(res) {
        console.log(res);
        that.Code = res.code;
        that.GetUserInfo();
      },
    });
  },
  onLoad(e) {
    let that = this;
    if (e.UserID) {
      // 分享链接打开
      that.getUserId = e.UserID;
      console.log("e.UserID", e.UserID);
    } else {
      // 正常打开小程序
      that.getUserId = uni.getStorageSync("userid");
    }
  },
  components: { countdown },
  methods: {
    // canvas圆角
    circleImgOne(ctx, img, x, y, r) {
      let d = r * 2;
      let cx = x + r;
      let cy = y + r;
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = "#FFFFFF"; // 设置绘制圆形边框的颜色
      ctx.stroke(); // 绘制出圆形，默认为黑色，可通过 ctx.strokeStyle = '#FFFFFF'， 设置想要的颜色
      ctx.clip();
      ctx.drawImage(img, x, y, d, d);
      /* ctx.restore(); */
    },
    makecanvas(img01, img02) {
      const query = uni.createSelectorQuery().in(this);
      var ctx = uni.createCanvasContext("myCanvas"); //绑定画布

      // ctx.draw(); //输出到画布中
      ctx.drawImage(this.v1, 0, 0, this.windowwidth, this.windowheight);
      this.circleImgOne(
        ctx,
        this.v0,
        (this.windowwidth - 80) / 2,
        uni.upx2px(120),
        uni.upx2px(100)
      );
      // ctx.drawImage(this.v0, (this.windowwidth - 80) / 2, 80, 80, 80);
      ctx.draw(); //输出到画布中
      uni.showLoading({
        //增加loading等待效果
        title: "正在生成",
        mask: true,
      });
      setTimeout(() => {
        //不加延迟的话，base64有时候会赋予undefined
        uni.canvasToTempFilePath({
          canvasId: "myCanvas",
          success: (res) => {
            this.base64 = res.tempFilePath;
          },
        });
        uni.hideLoading();
      }, 1200);
    },
    // 保存图片
    saveImage() {
      let that = this;
      uni.showLoading({
        title: "保存中...",
      });
      //图片保存到本地
      uni.saveImageToPhotosAlbum({
        filePath: that.base64,
        success: function(data) {
          uni.hideLoading();
          uni.showToast({
            title: "保存成功",
            mask: true,
          });
          that.isShow = false;
        },
        fail: function(err) {
          if (
            err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" ||
            err.errMsg === "saveImageToPhotosAlbum:fail auth deny"
          ) {
            // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
            uni.showModal({
              title: "提示",
              content: "需要您授权保存相册",
              showCancel: false,
              success: (modalSuccess) => {
                uni.openSetting({
                  success(settingdata) {
                    console.log("settingdata", settingdata);
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      uni.showModal({
                        title: "提示",
                        content: "获取权限成功,再次点击图片即可保存",
                        showCancel: false,
                      });
                    } else {
                      uni.showModal({
                        title: "提示",
                        content: "获取权限失败，将无法保存到相册哦~",
                        showCancel: false,
                      });
                    }
                  },
                  fail(failData) {
                    console.log("failData", failData);
                  },
                  complete(finishData) {
                    console.log("finishData", finishData);
                  },
                });
              },
            });
          }
        },
        complete(res) {
          uni.hideLoading();
        },
      });
    },

    cancelimg() {
      this.isShow = false;
    },
    onShareAppMessage: function(res) {
      console.log(res);
      // if (res.from == "button") {
      // }
      return {
        title: "分享",
        path: "/pages/bargain/index?UserID=" + this.userid,
        imageUrl:
          "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img/share.png", //用户分享出去的自定义图片大小为5:4,
      };
    },
    GetUserInfo() {
      let flag = uni.getStorageSync("flag");
      getResquest("/CommonHelper.ashx?Method=GetUserInfo", {
        Code: this.Code, //小程序获取的code
        UserID: this.getUserId, //用户UserID
      }).then((res) => {
        this.openid = res.data.Table[0].OpenID;
        this.userid = res.data.Table[0].UserID;
        this.nickName = res.data.Table[0].NicKName;
        this.nickUrl = res.data.Table[0].NickUrl;
        this.goodsid = res.data.Table[0].GoodsID;
        this.helpcount = res.data.Table[0].HelpCount;
        this.enTime = res.data.Table[0].CountDown;
        // console.log(this.helpcount);
        this.nickUrlWeb =
          "https://wb.jaas.ac.cn/ketianxia.se.201027/UpLoad/headimg/" +
          this.openid +
          ".jpg";
        if (res.data.Table1.length > 0) {
          this.boxList = res.data.Table1 || [
            {
              NickUrl:
                "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img/kong.png",
            },
          ];
          // this.rowid = res.data.Table1[0].RowID;
          // this.fNickName = res.data.Table1[0].NickName;
          // this.fNickUrl = res.data.Table1[0].NickUrl;
        }
        // this.getUrl();
        if (res.data.Table[0].Opt == 1) {
          if (flag == 0) {
            uni.showModal({
              title: "提示",
              content: "您还未选择奖品，请先选择奖品再进行砍价",
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
          }
        } else {
          uni.reLaunch({
            url:
              "/pages/help/index?award=" +
              this.goods[this.goodsNumber - 1] +
              "&openId=" +
              this.openid +
              "&UserID=" +
              this.getUserId +
              "&countDown=" +
              this.enTime,
          });
        }
      });
    },
    savePic() {
      this.saveImage();
    },
    becomePoster(e) {
      this.isShow = true;
      this.makecanvas(this.v0, this.v1);
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  position: relative;
  .bgPic {
    width: 100vw;
  }
  .uesrNickUrl {
    position: absolute;
    top: 230rpx;
    width: 150rpx;
    left: 50vw;
    margin-left: -75rpx;
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
  .inviteFriend {
    width: 150rpx;
    position: absolute;
    top: 150rpx;
    right: 10rpx;
    animation: seal 1s ease 0.5s both, biger 3s linear infinite 1.5s forwards;
  }
  .share {
    width: 150rpx;
    position: absolute;
    top: 150rpx;
    right: 10rpx;
    height: 150rpx;
    opacity: 0;
    border-radius: 200rpx;
  }
  .becomePoster {
    position: absolute;
    width: 150rpx;
    right: 10rpx;
    top: 314rpx;
    animation: seal 1s ease 0.5s both, biger 3s linear infinite 1.5s forwards;
  }
  .helpCount {
    position: absolute;
    top: 77.7%;
    width: 100rpx;
    text-align: center;
    left: 284rpx;
    color: #d86363;
  }
  .friendHelpList {
    position: absolute;
    width: 70%;
    height: 180rpx;
    border: 1px solid #000;
    top: 81%;
    left: 15%;

    overflow: hidden;
    .scroll {
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      .helpBox {
        display: flex;
        align-items: center;
        justify-content: center;
        .friendNickUrl {
          width: 60rpx;
          border-radius: 200rpx;
        }
        .friendNickName {
          font-size: 24rpx;
          margin-left: 20rpx;
          max-width: 350rpx;
          color: rgb(134, 134, 134);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  .getPoster {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    .pc-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    #canvasId {
      width: 100%;
    }
    image {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
    .ensure {
      position: absolute;
      bottom: 80rpx;
      width: 180rpx;
      left: 150rpx;
    }
    .cancelimg {
      position: absolute;
      bottom: 80rpx;
      width: 180rpx;
      right: 150rpx;
    }
  }
}
</style>
