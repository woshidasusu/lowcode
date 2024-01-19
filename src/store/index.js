import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex);

const options = {
  modules
};
console.log('[Vuex]', options);

export default new Vuex.Store(options);
