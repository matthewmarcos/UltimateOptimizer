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

// Solve Simplex
const simplex = (tableauWrapper) => {
    const tableauData = _.clone(tableauWrapper);
    let solutions = [];

    let tableau = _.clone(tableauData.tableau);
    const rowCount = tableau.length;
    const colCount = tableau[0].length;
    const variableCount = tableauData.varCount;
    const slackVariableCount = tableauData.slackVariableCount;

    let constraintNames = tableauData.rowHeaders;
    const variableNames = tableauData.variableNames;

    let rowHeaders = [ //Initially rowHeaders are named after the constraints.
        ...constraintNames
    ];

    //So we know the name of the variable to replace in the object
    let tableHeaders = _.clone(tableauData.tableHeaders);

    console.log(rowHeaders);
    console.log(tableHeaders);


    const hasNegative = () => {
        let smallest = _.clone(tableau[tableau.length - 1]).sort((x, y) => x - y)[0];
        return smallest < 0;
    }

    let values = _.fromPairs(_.zip(rowHeaders, transpose(tableau)[colCount - 1]))
    variableNames.forEach(name => {
        values[name] = 0;
    });
    // START THE SIMPLEX
    solutions.push( {
        tableau: _.clone(tableau),
        variables: values
    });

    while(hasNegative()) {
         // Get the pivot column
        let rowToSearch = tableau[rowCount - 1].slice(0, tableau[rowCount - 1].length - 1);
        let minData = _.reduce(rowToSearch, (acc, value, index) => {
            if(value < acc.minValue) {
                return {
                    minIndex: index,
                    minValue: value
                };
            }
            return acc;
        }, {
            minIndex: 0,
            minValue: rowToSearch[0]
        });

        const minValue = minData.minValue; // Smallest value in bottom row
        const pivotElementCol = minData.minIndex; // Index of the pivot column

        // Get pivot column
        const pivotColumn = transpose(_.clone(tableau))[pivotElementCol];
        const numeratorColumn = transpose(_.clone(tableau))[colCount - 1];

        const trArray = _.map(numeratorColumn, (x, key) => {
            return x/pivotColumn[key];
        });

        let smallestNonzero = _.clone(trArray).sort((x, y) => x - y).filter(x => x > 0)[0]
        if(!smallestNonzero) {
            // Infeasible
            Materialize.toast('There is no solution to your problem', 2000);
            return [];
        }
        let pivotElementRow = trArray.indexOf(smallestNonzero);

        // Normalize the pivot row
        let pivotElement = tableau[pivotElementRow][pivotElementCol];
        tableau[pivotElementRow] = tableau[pivotElementRow].map(x => (x / pivotElement).toFixed(4));

        // Normalize the entire column:
        tableau = _.map(tableau, (row, rowNo) => {
            if(rowNo === pivotElementRow) {
                return row;
            }
            const multiplier = row[pivotElementCol]; //divide to pivot row
            const pivotRowCopy = _.clone(tableau[pivotElementRow])
                .map(x => x * multiplier);
            const newRow = _.map(pivotRowCopy, (x, index) => {
                return (row[index] - x).toFixed(4);
            });

            return newRow;
        });


        solutions.push({
            tableau: _.clone(tableau),
            variables: _.clone(values)
        });
    }

    return solutions;
};

const generateTableauU = (constraints, toMaximize, isMaximize) => {
    // Split the maximize expression by spaces
    let maximizeVar = [...toMaximize.split(/[ ]+/g)];

    const toMaximizeExp = /(\+|-)?\d*\.?\d+/;
    // Check if each term on objective function matches the pattern +\d | -\d | \d | decimal
    const validMaximizeExp = _.every(maximizeVar, variable => toMaximizeExp.test(variable));
    if (!validMaximizeExp) {
        return Materialize.toast('Invalid Maximizing Expression', 2000);

    }
    maximizeVar = maximizeVar.map(x => Number(x));

    // If minimize, negate the function.
    if(!isMaximize) {
        maximizeVar = _.map(maximizeVar, (x, key) => {
            return x * -1
        });
    }
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

    const fillCount = constraints.length + 1; //How many values to insert for slack variables
    const colCount = varCount + fillCount + 1; //Total number of columns
    const rowCount = fillCount;

    // Convert into tableau
    let tempTableau = _.clone(constraintsVar);
    let tempMaxVar = _.clone(maximizeVar)
    tempMaxVar = tempMaxVar.map(x => -1 * x);
    tempMaxVar.push(0);
    tempTableau.push(tempMaxVar);

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

    const tableHeaders = [
        ..._.map(maximizeVar, (x, key) => 'X' + (key + 1)),
        ..._.map(constraints, (x, key) => 'S' + (key + 1)),
        'Z'
    ];

    const rowHeaders = [
        ..._.map(constraints, (x, key) => 'S' + (key + 1)),
        'Z'
    ]

    return {
        tableau: tempTableau,
        tableHeaders: tableHeaders,
        rowHeaders: rowHeaders,
        varCount: maximizeVar.length,
        slackVariableCount: constraints.length,
        variableNames: [ ..._.map(maximizeVar, (x, key) => 'X' + (key + 1)) ],
        rowCount, colCount
    };
};

// Generate Tableau for Food solver.
const generateTableauF = input => {
    const foods = _.clone(input);
    // Determine number of foodstuff
    const foodCount = foods.length;
    const constraintCount = 23 + foodCount * 2;
    const foodNameArray = foods.map(x => x.food);

    console.log(`foodNameArray: ${foodNameArray}`);

    // Generate Variables
    let insertionArray = Array.apply(null, {
        length: constraintCount + 1 // + 1 for the Z
    }).map(Function.call, x => 0);

    // Objective function
    let priceArray = foods.map(x => x.pricePerServing);

    // constraints
    let caloriesArray = foods.map(x => x.calories);
    let cholesterolArray = foods.map(x => x.cholesterol);
    let totalFatArray = foods.map(x => x.totalFat);
    let sodiumArray = foods.map(x => x.sodium);
    let carbohydratesArray = foods.map(x => x.carbohydrates);
    let dietaryFiberArray = foods.map(x => x.dietaryFiber);
    let proteinArray = foods.map(x => x.protein);
    let vitAArray = foods.map(x => x.vitA);
    let vitCArray = foods.map(x => x.vitC);
    let calciumArray = foods.map(x => x.calcium);
    let ironArray = foods.map(x => x.iron);

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

    const newRowCount = constraintCount + 1;
    const colCount = foods.length + insertionArray.length + 1;
    console.log(`colLength: ${colCount}`);

     const minServingConstraints = _.map(priceArray, (variable, index) => {
        return [
            ...Array.apply(null, {
                length: index
            }).map(Function.call, x => 0),
            -1, // We negate because we want greater than 0 servings
            ...Array.apply(null, {
                // -1 for the var, -1 for the min servings
                length: colCount - index - 2
            }).map(Function.call, x => 0),
            -1 // min servings
        ];
    });

    const maxServingConstraints = _.map(priceArray, (variable, index) => {
        return [
            ...Array.apply(null, {
                length: index
            }).map(Function.call, x => 0),
            1, // We negate because we want greater than 0 servings
            ...Array.apply(null, {
                // -1 for the var, -1 for the max servings
                length: colCount - index - 2
            }).map(Function.call, x => 0),
            10 // max servings
        ];
    });

    const minimizingFunctionRow = [
        ...priceArray.map(x => -x),
        ...Array.apply(null, {
            // -1 for the var, -1 for the max servings
            length: colCount - priceArray.length - 1
        }).map(Function.call, x => 0),
        0 // Initial solution
    ];

    let tempTableau =_.map(_.clone([ // Remove reference to insertionArray before mutation
        // Constraints for lessthanequalto
        [ ...caloriesArray, ...insertionArray, calorieMax ],
        [ ...cholesterolArray, ...insertionArray, cholesterolMax ],
        [ ...totalFatArray, ...insertionArray, totalFatMax ],
        [ ...sodiumArray, ...insertionArray, sodiumMax ],
        [ ...carbohydratesArray, ...insertionArray, carbohydratesMax ],
        [ ...dietaryFiberArray, ...insertionArray, dietaryFiberMax ],
        [ ...proteinArray, ...insertionArray, proteinMax ],
        [ ...vitAArray, ...insertionArray, vitAMax ],
        [ ...vitCArray, ...insertionArray, vitCMax ],
        [ ...calciumArray, ...insertionArray, calciumMax ],
        [ ...ironArray, ...insertionArray, ironMax ],

        // Negated version for the minimums
        [ ...caloriesArray.map(x => -1 * x), ...insertionArray, -caloriesMin ],
        [ ...cholesterolArray.map(x => -1 * x), ...insertionArray, -cholesterolMin ],
        [ ...totalFatArray.map(x => -1 * x), ...insertionArray, -totalFatMin ],
        [ ...sodiumArray.map(x => -1 * x), ...insertionArray, -sodiumMin ],
        [ ...carbohydratesArray.map(x => -1 * x), ...insertionArray, -carbohydratesMin ],
        [ ...dietaryFiberArray.map(x => -1 * x), ...insertionArray, -dietaryFiberMin ],
        [ ...proteinArray.map(x => -1 * x), ...insertionArray, -proteinMin ],
        [ ...vitAArray.map(x => -1 * x), ...insertionArray, -vitAMin ],
        [ ...vitCArray.map(x => -1 * x), ...insertionArray, -vitCMin ],
        [ ...calciumArray.map(x => -1 * x), ...insertionArray, -calciumMin ],
        [ ...ironArray.map(x => -1 * x), ...insertionArray, -ironMin ],

        ...minServingConstraints, //min Servings
        ...maxServingConstraints, //maxServings
        minimizingFunctionRow //Function to minimize

    ]), (row, index) => {
        let x = _.clone(row);
        x[index + foodCount] = 1;
        return x;
    });


    console.log(tempTableau);

};
