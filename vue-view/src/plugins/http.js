import Vue from 'vue'
import axios from 'axios'

let Url = 'http://43.138.227.253:3000/api/'

axios.defaults.baseURL = Url

Vue.prototype.$http = axios
