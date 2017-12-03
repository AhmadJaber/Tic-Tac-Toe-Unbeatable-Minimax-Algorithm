// forEach --- example
[1,2,3].forEach(function(item, index) {
	console.log(index, item);
});

//reduce --- example
const sum = [1, 2, 3].reduce(function(result, item) {
    return result + item;
}, 0);
console.log(sum);

// typeof()

//looping using of
for (let (index, win) of winCombos.entries()) {

}

//arrow function and use of filter()

var fruits = ['apple', 'banana', 'grapes', 'mango', 'orange'];

function filterItems(query) {
    return fruits.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
}
console.log(filterItems('ap')); // ['apple', 'grapes']
console.log(filterItems('an')); // ['banana', 'mango', 'orange']

// now in es6
const filterItems = (query) => {
    return fruits.filter((el) => {
        return el.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
};