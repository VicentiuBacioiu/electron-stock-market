var Vue = require('vue');
var Home = require('./components/home.vue');

new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(Home);
    }
});
