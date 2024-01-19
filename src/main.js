import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "normalize.css";
import "./assets/styles/common.scss";

Vue.use(ElementUI);
Vue.prototype.$t = msg => msg;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
