let arr = [1,2,3,4,45,6,7,8,9,0]



// const user = {
//     name: ' Hitesh',
//     age: 55,
//     password: "ABc@123",
// }

// const proxyUser = user
// proxyUser.password
//the goal is to hide the user password 
// const proxyUser = new Proxy(user, {
//     get(target, prop){ //prop = property , target is the target object
//         if(prop === 'password'){
//             throw new Error("Access Denied")
//         }

//         return target[prop]
//     },
//     set(target, prop, user){

//     }
// })

// console.log(proxyUser.password)

function nagetiveIndex(arr) {
    return new Proxy(arr, {
        get(target, prop){
            const index = Number(prop)
            if( index < 0 ){
                return target[target.length + index]
            }
            return target[index]
        },
        set(target, prop, value){
            const index = Number(prop)
            if(index<0){
                target[index.length + index] = value
            } else {
                target[index] = value
            }
            return true
        }
    })
}

let newArr = nagetiveIndex(arr)

console.log(newArr[-1])

newArr[-1] = 22
console.log(newArr)
console.log(arr) // Shallow copy and deep copy concept
