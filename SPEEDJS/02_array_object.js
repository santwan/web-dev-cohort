let chaiTypes = ["Masala chai", "Ginger Chai", "Green Tea"]
/*
console.log(chaiTypes[2])

console.log(`Total chai types: ${chaiTypes.length}`)

chaiTypes.push("Herbal Tea")
const data = chaiTypes.pop()
console.log(data)

let index = chaiTypes.indexOf("Green Tea")
console.log(index)

if ( index !== -1 ){
    chaiTypes.splice(index)
}
*/

// console.group(chaiTypes)
chaiTypes.push("Black Tea")
chaiTypes.push("Milk Tea")

// chaiTypes.forEach((chai, index) =>  {
//     console.log(`${index + 1}: ${chai}`)
// })

let moreChaiTypes = ["Oolong Tea", "White Tea"]

let allChaiTypes = chaiTypes.concat(moreChaiTypes)
// console.log(allChaiTypes)

let newChaiTypes = [...chaiTypes, "Chamolina Tea"]
// console.log(newChaiTypes)


let chaiRecipe = {
    name: "Ginger Tea",
    ingredients: {
        teaLeaves: "Assam Tea",
        milk: "Full Cream Milk",
        sugar: "Brown Sugar",
        spices: ["DaalChini", "Ginger"],
    },
    instruction: "Boil water, add tea leaves , milk , sugar and spices"

}
// console.log(chaiRecipe.ingredients.spices[1])

let updatedChaiRecipe = {
    ...chaiRecipe,
    instruction: "Boil water, add tea leaves, milk, sugar, spices with some love" //This will override the previous object instruction , keep the name same
}

// console.log(updatedChaiRecipe)

let {name, ingredients} = chaiRecipe //object destructuring
let [firstChai, secondChai, x] = chaiTypes // Array Destructuring

// console.log(ingredients)
// console.log(chaiTypes)
// console.log(secondChai)
// console.log(x)