const remote = {
    color: 'black', 
    brand: 'samsung',
    dimensions: { height : 1, width: 1},
    turnOff: function() {

    },
    volumeUp: function(){

    }
}

let p1 = {
    fname: 'Hit4sh',
    lname: 'Ch',
    address: {
        h:1,
        w:1,

    }

}

let p2 = {
    ...p1  // spread operator
}

let p1kaString = JSON.stringify(p1)
console.log(p1kaString)
let p3= JSON.parse(p1kaString)

p2.fname = 'Piyush'
p2.fname = 
console.log(p)