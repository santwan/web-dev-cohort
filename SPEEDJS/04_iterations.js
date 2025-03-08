let salesData = [
    {product: "Laptop",price: 1200},
    {product: "Smartphone",price: 3500},
    {product: "Headphones",price: 120},
    {product: "Keyboard",price: 200},
]

let initialValue = 0
let totalSales = salesData.reduce((acc, sale) => (acc+sale.price), initialValue)
// console.log(totalSales)

//-----------------------------------------------------------------------------------
let inventory = [
    {name: "Widget A", stock: 30},
    {name: "Widget B", stock: 120},
    {name: "Widget C", stock: 45},
    {name: "Widget D", stock: 70},
]

// let lowStockItems = inventory.filter((item) => item.stock<50)
let lowStockItems = inventory.filter((item) => { 
    return item.stock<50
})
// console.log(lowStockItems)


//---------------------------------------------------------------------------------

let userActivity = [
    {user: "Alice", activityCount: 45},
    {user: "Bob", activityCount: 72},
    {user: "Charlie", activityCount: 33},
    {user: "Chomu", activityCount: 33},
]

//Find the most active user

let mostActiveUser = userActivity.reduce((maxUser, user) => {
    // user.activityCount > maxUser.activityCount ? user : maxUser
    if( user.activityCount > maxUser.activityCount){
        return user
    } else {
        return maxUser
    }
})
console.log(mostActiveUser)