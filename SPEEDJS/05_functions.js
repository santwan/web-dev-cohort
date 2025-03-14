function greet ( name ){
    console.log(`Hello ${name}`)
}

let globalVar = "I am global"


function modifyGlobal(){
    globalVar = "I am modified"
    let blockScopedVar = "I am blocked-scope"
    console.log(blockScopedVar)
}

// modifyGlobal()

let config = function(){}() //IIFE Immediately Invoked function expression

// (() => {})()   //Another way of writting . It is like use and through function

// let config = function(){
//     let settings = {
//         theme:  "dark"
//     }
//     return settings
// }


let person1 = {
    name: "ravi",
    greet: function(){
        console.log(`Hello ${this.name}`)
    }
}


let person2 = {
    name: "hitesh"
}

// person1.greet.call(person2)
// let bindGreet = person1.greet.bind(person2) 
// console.log(bindGreet)
// bindGreet()  
// console.log(bindGreet())

// person1.greet.call(person2)  

//----------------------------------------------------------------------------------------------
const obj = {
    personName: "Santwan", 
    greet: function(){
        console.log(`Hello, ${this.personName}`)
    },
}


console.log("Hello Bye bye")

setTimeout(obj.greet, 1000 * 3)

setTimeout(function(){
    console.log("Hello")
}, 1000*5 /*Second argument in ms */)


a = 10 , b = 12
console.log('sum', a + b )

//Blog on call stack concept in Javascript

// call stack waits for  nothing 

//In reality , hwo this is performs in browser

// setTimeout() isnot a feature of JS

