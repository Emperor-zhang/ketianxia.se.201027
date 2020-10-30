import Vue from "vue";
import App from "./App";
// 引入colorUi组件
import cuCustom from "colorui/components/cu-custom.vue";
Vue.component("cu-custom", cuCustom);

Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
