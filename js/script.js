// Juice colored.
// Transposes the matrix
const transpose = m => m[0].map((x, i) => m.map(x => x[i]));
const log = x => console.log(x);

Vue.config.silent = false;
Vue.config.devtools = true;

let rootVue = new Vue({
    el: '#app',
    data: {
        appType: 'index',
        clicks : 0
    },
    methods: {
        setAppType(appType) {
            this['appType'] = appType;
            this['clicks']+= 1;
        },
        isAppType(src) {
            return src === this['appType'];
        }
    }
});