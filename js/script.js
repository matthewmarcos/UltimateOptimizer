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

const rootVue = new Vue({
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
        },

        addFood() {
            const alreadyPicked = _.some(this.dietarySolver.picks, x => {
                return x.food === this.dietarySolver.focusedFood.food;
            });

            if(!alreadyPicked) {
                const food = this.dietarySolver.focusedFood.food;
                // Toggle isAdded flag
                this.dietarySolver.choices = this.dietarySolver.choices.map(x => {
                    if(x.key === food) {
                        x.isAdded = true;
                    }
                    return x;
                });

                // Add the food to the picks array
                this.dietarySolver.picks.push(this.dietarySolver.focusedFood);

                // Toast that the food has successfully been added
                const msgString = 'Added ' +
                    this.dietarySolver.focusedFood.food.replace(/_/g, ' ') +
                    '.';
                Materialize.toast(msgString, 2000);
            }
            else {
                // Toast that this food item has already been added!
                const msgString = 'Napili mo na ang ' +
                    this.dietarySolver.focusedFood.food.replace(/_/g, ' ') +
                    '.';

                Materialize.toast(msgString, 2000);
            }
        },

        removePick(food) {
            this.dietarySolver.picks = this.dietarySolver.picks.filter(x => {
                return x.food !== food;
            });

            // Toggle isAdded flag
            this.dietarySolver.choices = this.dietarySolver.choices.map(x => {
                if(x.key === food) {
                    x.isAdded = false;
                }
                return x;
            });

            const msgString = 'Removed ' +
                    this.dietarySolver.focusedFood.food.replace(/_/g, ' ') +
                    '!';
            Materialize.toast(msgString, 1000);
        },

        optimizeFood() {
            let myPicks = $.extend(true, {}, this.dietarySolver.picks);

            console.log(myPicks);
        }

    }
});