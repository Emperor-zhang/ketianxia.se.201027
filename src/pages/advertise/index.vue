<template>
  <view class="content">
    <image
      :src="$url + '/6.jpg'"
      mode="widthFix"
      class="bgPic"
      :style="scrollTop"
      @click="saveImage"
    ></image>
    <!-- 快速关注公众号 -->
    <view class="attention">
      <official-account style=""></official-account>
    </view>
  </view>
</template>
<script>
var that;
export default {
  data() {
    return {
      $url: "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img",
      windowheight: 0,
      scrollTop: "",
      display: "",
      imgurl: "",
    };
  },
  onLoad() {
    that = this;
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
    that.imgurl =
      "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img/6.jpg";
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

    // 保存图片
    saveImage() {
      this.wxToPromise("downloadFile", {
        url: that.imgurl,
      })
        .then((res) =>
          this.wxToPromise("saveImageToPhotosAlbum", {
            filePath: res.tempFilePath,
          })
        )
        .then((res) => {
          // do something
          wx.showToast({ title: "保存成功~", icon: "none" });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    wxToPromise(method, opt) {
      return new Promise((resolve, reject) => {
        wx[method]({
          ...opt,
          success(res) {
            opt.success && opt.success();
            resolve(res);
          },
          fail(err) {
            opt.fail && opt.fail();

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
            reject("ee", err);
          },
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
  .bgPic {
    width: 100%;
    position: absolute;
    .attention {
      position: fixed;
      bottom: 10rpx;
      width: 100%;
    }
  }
}
</style>
