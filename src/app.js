var Vue = require('vue');
var Home = require('./components/home.vue');
var VueResource = require('vue-resource');

Vue.use(VueResource);

new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(Home);
    }
});
