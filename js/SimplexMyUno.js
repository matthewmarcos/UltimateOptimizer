const transpose = m => m[0].map((x, i) => m.map(x => x[i]));
const log = x => console.log(x);
const foodNames = _.map(foodData, function (food) {
    return {
        foodName: food.food.replace(/_/g, ' '),
        key: food.food,
        isSelected: false,
        isAdded: false
    };
});

const generateTableauU = (constraints, toMaximize) => {
    // Split the maximize expression by spaces
    let maximizeVar = [...toMaximize.split(/[ ]+/g)];

    const toMaximizeExp = /(\+|-)?\d*\.?\d+/;
    // Check if each term on objective function matches the pattern +\d | -\d | \d | decimal
    const validMaximizeExp = _.every(maximizeVar, variable => toMaximizeExp.test(variable));
    if (!validMaximizeExp) {
        return Materialize.toast('Invalid Maximizing Expression', 2000);

    }
    maximizeVar = maximizeVar.map(x => Number(x));

    // check constraints if they have <= and only one of it.
    const allConstraintsHaveSign = _.every(constraints, x => {
        const hasGreaterThan = x.indexOf('<=') !== -1;
        return hasGreaterThan;
    });

    if(!allConstraintsHaveSign) {
        return Materialize.toast('Please check constraints for proper format', 2000);
    }

    // Check if all the constraints have proper format, length

    // Create empty array
    let constraintsVar =  constraints.map(x => x.split(/[ ]+/g).map(y => Number(y)).filter(z => !isNaN(z)));

    // Get count of variables
    const varCount = maximizeVar.length
    const allConstraintsHaveProperLength = _.every(constraintsVar, x => {
        return x.length - 1 === varCount;
    });

    if(!allConstraintsHaveProperLength) {
        return Materialize.toast('Not all constraints have the proper length', 2000);
    }

    const fillCount = constraints.length + 1;
    const colCount = varCount + fillCount + 1;
    const rowCount = fillCount;

    console.log('Maximizing Array');
    console.log(maximizeVar)
    console.log('Constraints Array');
    console.log(constraintsVar);
    console.log('There are: ' + fillCount + ' extra variables');
    console.log('There are: ' + colCount + ' cols');
    console.log('There are: ' + rowCount + ' rows');

    // Convert into tableau
    let tempTableau = _.clone(constraintsVar);
    tempTableau.push(_.clone(maximizeVar));

    // Insert the slack variables
    tempTableau = _.map(tempTableau, (row, index) => {
        let x = _.clone(row);
        const insertionArrayLength = colCount - x.length;
        let insertionArray = Array.apply(null, {
            length: insertionArrayLength
        }).map(Function.call, x => 0);

        // Put the 1's in a diagonal
        insertionArray = _.map(insertionArray, (something, ind) => {
            if(ind === index) return 1;
            return 0;
        });

        x.splice(x.length-1, 0, insertionArray);

        return _.flatten(x);
    });
    console.log(tempTableau);


};

// Generate Tableau for Food solver.
const generateTableauF = foods => {
    // Determine number of foodstuff
    const foodCount = foods.length;

    // Generate Variables
    let variables = Array.apply(null, {
        length: foodCount
    }).map(Function.call, x => 'food' + (x + 1));

    // Minimize price
    const priceArray = foods.map(x => x.pricePerServing);

    const caloriesArray = foods.map(x => x.calories);
    const cholesterolArray = foods.map(x => x.cholesterol);
    const totalFatArray = foods.map(x => x.totalFat);
    const sodiumArray = foods.map(x => x.sodium);
    const carbohydratesArray = foods.map(x => x.carbohydrates);
    const dietaryFiberArray = foods.map(x => x.dietaryFiber);
    const proteinArray = foods.map(x => x.protein);
    const vitAArray = foods.map(x => x.vitA);
    const vitCArray = foods.map(x => x.vitC);
    const calciumArray = foods.map(x => x.calcium);
    const ironArray = foods.map(x => x.iron);

    const priceMin = 0;
    const caloriesMin = 2000;
    const cholesterolMin = 0;
    const totalFatMin = 0;
    const sodiumMin = 0;
    const carbohydratesMin = 0;
    const dietaryFiberMin = 25;
    const proteinMin = 50;
    const vitAMin = 5000;
    const vitCMin = 50;
    const calciumMin = 800;
    const ironMin = 10;

    const calorieMax = 2250;
    const cholesterolMax = 300;
    const totalFatMax = 65;
    const sodiumMax = 2400;
    const carbohydratesMax = 300;
    const dietaryFiberMax = 100;
    const proteinMax = 100;
    const vitAMax = 50000;
    const vitCMax = 20000;
    const calciumMax = 1600;
    const ironMax = 30;


};

// Solve Simplex
const simplex = tableau => {

};