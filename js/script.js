Vue.config.silent = false;
Vue.config.devtools = true;

// Juice colored.
// Transposes the matrix
const transpose = m => m[0].map((x, i) => m.map(x => x[i]));
const log = x => console.log(x);
const foodNames = _.map(foodData, function(food) {
    return {
        foodName: food.food.replace(/_/g, ' '),
        key: food.food,
        isSelected: false,
        isAdded: false
    };
});


let rootVue = new Vue({
    el: '#app',

    data: {
        appType: 'dietary-problem-solver',

        dietarySolver: {
            focusedFood: '', //Food on the display
            solution: [],
            choices: [ ...foodNames ], //Food that the user can pick
            picks: []
        }
    },

    methods: {

        setAppType(appType) {
            this['appType'] = appType;
            this['clicks'] += 1;
        },

        isAppType(src) {
            return src === this['appType'];
        },

        setSelected(food) {
            // For dietary solver problem
            this.dietarySolver.focusedFood = _.find(foodData, s => s.food === food);

            this.dietarySolver.choices = this.dietarySolver.choices.map(x => {
                x.isSelected = false;
                if(x.key === food) {
                    x.isSelected = true;
                }
                return x;
            });
        }

    }
});