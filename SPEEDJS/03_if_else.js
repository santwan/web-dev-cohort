function prepareChai(type){
    if(typeof(type) === typeof("abs")){
        if(type === "Masala Chai"){
            console.log("Adding spices to the chai")
        } else {
            console.log("Preparing regular Chai")
        }
    }
}

// prepareChai("Masala Chai")
// prepareChai("Ginger Chai")


/*
in an online store, if customer's bill amount is more than 1000 then 10% discount is applied other wise no discount.
*/

function calculateTotal(amount){
    /*amount = Number(amount)
    if(amount > 1000){
        return amount * 0.9
    }
    
    return amount  */
    
    return amount > 1000 ? amount*0.9 : amount
    // let isLoading = true
    // return isLoading ? () : ()
    
}

let finalBill = calculateTotal("1200")
// console.log(finalBill)
// console.log(calculateTotal(1300))


/*
in a traffic light system, if  light is red then print stop . if yellow then slow down and if green then print go
*/

function trafficLight(color){
    color = color.toString()
    switch(color){
        case "red":
            console.log("Stop")
            break
        case "yellow":
            console.log("Slow down")
            break
        case "green":
            console.log("Go")
            break
        default:
            console.log("Stop")
    }
}

// trafficLight("red")

//---------------------------------------------------------------------------
function checktruthyValue(value){
    if ( value){
        console.log("Truthy")
    } else {
        console.log("False")
    }
}

// checktruthyValue(1)
// checktruthyValue(0)
// checktruthyValue("Hitesh")
// checktruthyValue("")
// checktruthyValue([])
// checktruthyValue([[1,2,3,4]])


function login(username, password){
    if(username === 'admin' && (password === "1234" || loginIP == "12390.00")){
        console.log("Login successful")
    } else {
        console.log("Invalid credentials")
    }
}