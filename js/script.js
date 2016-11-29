Vue.config.silent = false;
Vue.config.devtools = true;

// Juice colored.
const rootVue = new Vue({
    el: '#app',

    data: {
        appType: 'ultimate-optimizer',

        dietarySolver: {
            focusedFood: '', //Food on the display
            solution: [],
            choices: [ ...foodNames ], //Food that the user can pick
            picks: []
        },

        ultimateOptimizer: {
            maxFunctions: '',
            constraints: [{
                string: ''
            }]
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

        addConstraint() {
            // Check if there is an empty string
            let hasEmptyFunction = !!this.ultimateOptimizer.constraints.filter(x =>  x.string === '').length;
            if(hasEmptyFunction) {
                Materialize.toast('Make sure all empty fields are filled out first', 2000);
                return;
            }
            else {
                this.ultimateOptimizer.constraints.push({ string: '' });
            }
        },


        // Dietary Solver
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

            // Create unreferenced copy of the user's selection
            let myPicks = $.extend(true, {}, this.dietarySolver.picks);
            generateTableau(this.dietarySolver.picks);
        }

    }
});
