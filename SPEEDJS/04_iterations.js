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
// console.log(mostActiveUser)


//--------------------------------------------------------------------------------

let expenses = [
    {description: "Groceries", amount: 50, category: "Food"},
    {description: "Electricity Bill", amount: 100, category: "Utilities"},
    {description: "Dinner", amount: 30, category: "Food"},
    {description: "Internet Bill", amount: 50, category: "Utilities"},
]

let expenseReport = expenses.reduce((report, expense) => {
    report[expense.category] += expense.amount

    return report
}, { Food: 0, Utilities: 0})

// console.log("Expense Report", expenseReport)

//-------------------------------------------------------------------------------

let tasks = [
    {description: "Write report", completed: false, priority: 2},
    {description: "Send email", completed: true, priority: 3},
    {description: "Prepare ppt", completed: false, priority: 1},
    {description: "Eat Junk Food", completed: false, priority: 4},
]


//Find the all the task which are not completed yet and sort them according to priority


// Using forEach Loop 
// let notCompleted = []
// tasks.forEach((element) => {
//     if( element.completed == false){
//         notCompleted.push(element)
//     }
// })


//Using for loop
// let notCompleted = []
// for( let i = 0 ; i <tasks.length; i++ ){
//     if(tasks[i].completed == false ){
//         notCompleted.push(tasks[i])
//     }
// }


//using filter function

let notCompleted = tasks
                .filter((task) => task.completed==false)
                .sort((a,b) => a.priority - b.priority)

// console.log(notCompleted)

//------------------------------------------------------------------------------

let movieRatings = [
    { title: "Movie A", ratings: [4,5,3]},
    { title: "Movie B", ratings: [5,5,4]},
    { title: "Movie C", ratings: [3,4,2]},
]

//sort the movies according to average rating

let avgRatingMovie = []

movieRatings.forEach((movie) => {
    let avg = movie.ratings.reduce((sum, current) => (sum + current), 0) / movie.ratings.length
    avgRatingMovie.push({title: movie.title, ratings: avg.toFixed(2)})
})

let avgRatingMovieSorted = avgRatingMovie.sort((a,b) => a.ratings - b.ratings)
console.log(avgRatingMovieSorted)


let averageRatings = movieRatings.map()

