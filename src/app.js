//include Vue and home component
var Vue = require('vue');
var Home = require('./components/home.vue');
var VueResource = require('vue-resource');

Vue.use(VueResource);

//instantiate Vue
new Vue({
    el: '#app',
    //render function is used to render the component
    render: function (createElement) {
        return createElement(Home);
    }
});
