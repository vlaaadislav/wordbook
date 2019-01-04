import Vue from 'nativescript-vue'
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'
import RadListView from 'nativescript-ui-listview/vue'
import Pager from 'nativescript-pager/vue'

if (TNS_ENV !== 'production') {
    Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.use(RadListView)
Vue.use(Pager)

new Vue({
    render: h => h('frame', [h(App)])
}).$start()
