let arr = [1,2,3,4,45,6,7,8,9,0]

console.log(arr[-1])

const user = {
    name: ' Hitesh',
    age: 55,
    password: "ABc@123"
}

// const proxyUser = user
// proxyUser.password
//the goal is to hide the user password 
const proxyUser = new Proxy(user, handler)
