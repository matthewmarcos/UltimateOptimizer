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
            this.ultimateOptimizer.constraints.push({ string: '' });
        },

        createTableauU() {
            // Check if there is an empty string
            let allValidFunctionStrings = !!this.ultimateOptimizer.constraints.filter(x =>  {
                return x.string === '';
            }).length;

            if(allValidFunctionStrings) {
                Materialize.toast('Make sure all fields follow the proper format!', 2000);
                return;
            }

            let functions = this.ultimateOptimizer.constraints.map(x => x.string);

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


$(_ => {
    // Scroll to the bottom of the page when contraint-adder is clicked
    $('#constraint-adder').click(_ => {
        $('html, body').animate({
            scrollTop: ($("#scroll-here").offset().top + $("#scroll-here").height() - $(window).height())
        }, 250);
    });
})
