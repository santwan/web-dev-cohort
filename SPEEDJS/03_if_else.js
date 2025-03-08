function prepareChai(type){
    if(typeof(type) === typeof("abs")){
        if(type === "Masala Chai"){
            console.log("Adding spices to the chai")
        } else {
            console.log("Preparing regular Chai")
        }
    }
}

prepareChai("Masala Chai")
prepareChai("Ginger Chai")