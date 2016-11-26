// Transposes the matrix
const transpose = m => m[0].map((x, i) => m.map(x => x[i]));
const log = x => console.log(x);

new Vue({
    el: '#app',
    data: {
        'appType': 'index'
    },
    methods: {
        setAppType(appType) {
            console.log('WhAT');
            this['appType'] = appType;
            document.title = appType;
        },
        isAppType(source) {
            return source === this['appType'];
        }
    }
});