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

const generateTableauU = (functions, toMaximize) => {
    console.log('To Maximize:');
    console.log(toMaximize);

    console.log('functions');
    console.log(functions);

};

// Generate Tableau for Food solver.
const generateTableauF = foods => {
    // Determine number of foodstuff
    const foodCount = foods.length;

    // Generate Variables
    let variables = Array.apply(null, {length: foodCount}).map(Function.call, x => 'food' + (x + 1));

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