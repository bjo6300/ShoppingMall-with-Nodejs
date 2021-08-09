// function hello() {
// 	console.log("Hello function");
// }

// // 첫번째 arrow function
// const arrowFunction = () => {
// 	console.log("Hello arrow function");
// }

// // 두번째 arrow function
// const arrowFunctionWithoutReturn = () => console.log("Hello arrow function without return");

// hello(); // Hello function
// arrowFunction(); // Hello arrow function
// arrowFunctionWithoutReturn(); // Hello arrow function without return


//Arrow Function 퀴즈
let personArray = [
    {"name": "John Doe", "age": 20},
    {"name": "Jane Doe", "age": 19},
    {"name": "Fred Doe", "age": 32},
    {"name": "Chris Doe", "age": 45},
    {"name": "Layla Doe", "age": 37},
];

// personArray의 나이 평균을 구해주는 Arrow Function을 작성해봅시다.
const getAgeAverage = (personArray) => {
    let sum = 0;
    for(let person of personArray){
        sum += person['age']
    }
    var average = sum / personArray.length
    
    return average
}

console.log(getAgeAverage(personArray));