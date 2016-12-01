Vue.config.silent = false;
Vue.config.devtools = true;

// Juice colored.
const rootVue = new Vue({
    el: '#app',

    data: {
        appType: 'ultimate-optimizer',
        // appType: 'dietary-problem-solver',

        dietarySolver: {
            focusedFood: '', //Food on the display
            solution: [], // Print these one by one for the graph
            choices: [...foodNames], //Food that the user can pick
            picks: [] // The food the user wants
        },

        ultimateOptimizer: {
            // maxFunction: '150 175',
            maxFunction: '35 120 50 75',
            isMaximize: true,
            solutions: [],
            tableHeaders: [],
            rowHeaders: [],
            // constraints: [{
            //     string: '7 11 <= 77'
            // },
            // {
            //     string: '10 8 <= 80'
            // },
            // {
            //     string: '1 0 <= 9'
            // },
            // {
            //     string: '0 1 <= 6'
            // }]
            constraints: [{
                string: '1.5 0 1 0.5 <= 1'
            },
            {
                string: '1 2 1 0 <= .5'
            },
            {
                string: '0 6 1 2.5 <= 2.5'
            },
            {
                string: '2 4 1 1.5 <= 3'
            }]
        }
    },

    methods: {

        setAppType(appType) {
            // General - Set the app type depending on what the user clicks on the navbar
            this['appType'] = appType;
            this['clicks'] += 1;
        },

        isAppType(src) {
            // General - Check which app should be rendered on the screen
            return src === this['appType'];
        },

        addConstraint() {
            // ultimateOptimizer - Add an empty string to list of constraints
            this.ultimateOptimizer.constraints.push({
                string: ''
            });
        },

        createTableauU() {
            // ultimateOptimizer - Start computation
            // Check if there is an empty string
            let allValidFunctionStrings = !!this.ultimateOptimizer.constraints.filter(x => {
                return x.string === '';
            }).length;

            if (allValidFunctionStrings) {
                Materialize.toast('Make sure all fields follow the proper format!', 2000);
                return;
            }

            // Need maximizing function
            if (!this.ultimateOptimizer.maxFunction) {
                Materialize.toast('Sure ka walang maximizing function?', 2000);
                return;
            }

            // At least one constraint needed
            if (this.ultimateOptimizer.constraints.length === 0) {
                Materialize.toast('Sure ka walang constraints?', 2000);
                return;
            }

            // Form checking muna sa mga input ni user bago mag parse
            let functions = this.ultimateOptimizer.constraints.map(x => x.string);
            let startingTableau = generateTableauU(functions,
                this.ultimateOptimizer.maxFunction, this.ultimateOptimizer.isMaximize);

            // Can now clear the solutions array to make room for the new one
            this.ultimateOptimizer.solutions = [];

            this.ultimateOptimizer.tableHeaders = _.clone(startingTableau.tableHeaders);
            this.ultimateOptimizer.rowHeaders = _.clone(startingTableau.rowHeaders);
            // this.ultimateOptimizer.solutions.push(startingTableau.tableau);
            // this.ultimateOptimizer.solutions.push(_.clone(startingTableau.tableau));
            const solution = simplex(startingTableau);
            this.ultimateOptimizer.solutions = _.clone(solution);
        },

        deleteConstraint(index) {
            // ultimateOptimizer = remove a constraint
            if (index > -1) {
                let array = this.ultimateOptimizer.constraints;
                array.splice(index, 1);
                this.ultimateOptimizer.constraints = array;
            }
        },

        // Dietary Solver
        setSelected(food) {
            // For dietary solver problem
            this.dietarySolver.focusedFood = _.find(foodData, s => s.food === food);

            this.dietarySolver.choices = this.dietarySolver.choices.map(x => {
                x.isSelected = false;
                if (x.key === food) {
                    x.isSelected = true;
                }
                return x;
            });
        },

        addFood() {
            // dietarySolver - Adds a food into the pick array
            const alreadyPicked = _.some(this.dietarySolver.picks, x => {
                return x.food === this.dietarySolver.focusedFood.food;
            });

            if (!alreadyPicked) {
                const food = this.dietarySolver.focusedFood.food;
                // Toggle isAdded flag
                this.dietarySolver.choices = this.dietarySolver.choices.map(x => {
                    if (x.key === food) {
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
            } else {
                // Toast that this food item has already been added!
                const msgString = 'Napili mo na ang ' +
                    this.dietarySolver.focusedFood.food.replace(/_/g, ' ') +
                    '.';

                Materialize.toast(msgString, 2000);
            }
        },

        removePick(food) {
            // dietarySolver - Removes an element from the list of picks
            // Input: string that comes on food.food
            this.dietarySolver.picks = this.dietarySolver.picks.filter(x => {
                return x.food !== food;
            });

            // Toggle isAdded flag
            this.dietarySolver.choices = this.dietarySolver.choices.map(x => {
                if (x.key === food) {
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
            // dietarySolver - Solve the function
            // Create unreferenced copy of the user's selection
            let myPicks = $.extend(true, {}, this.dietarySolver.picks);

            generateTableauF(this.dietarySolver.picks);
        }

    }
});


$(_ => {
    $('#constraint-adder').click(_ => {
        // Ultimate optimizer - Scroll to the bottom of the page when contraint-adder is clicked
        $('html, body').animate({
            scrollTop: ($("#scroll-here").offset().top + $("#scroll-here").height() - $(window).height())
        }, 250);
    });
})