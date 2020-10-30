<template>
  <view class="content">
    <image :src="$url + '/8.jpg'" mode="widthFix" class="bgPic"></image>
  </view>
</template>
<script>
export default {
  data() {
    return {
      $url: "https://wb.jaas.ac.cn/SmallExePic/ketianxia.se.201027/img",
    };
  },
  components: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  .bgPic {
    width: 100%;
  }
}
</style>
