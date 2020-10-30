<script>
export default {
  globalData: {
    id: 1,
  },
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function(options) {
    console.log(options.scene);
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
};
</script>

<style>
/*每个页面公共css */

@import "colorui/main.css";
@import "colorui/icon.css";
@import "colorui/animate.css";
@import "./styles/bass.wxss";
</style>
