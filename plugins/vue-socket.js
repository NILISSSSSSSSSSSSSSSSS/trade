import VueSocketio from 'vue-socket.io';
import { socketUrl } from './config';
import Vue from 'vue'
Vue.use(VueSocketio, socketUrl);
