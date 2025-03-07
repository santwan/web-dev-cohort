const obj1 = {
    fname: 'Santwan',
    lname: 'Pathak',
    getfullname: function() {
        if(this.lname !== undefined)
            return this.fname
    },
}

const obj2 = {
    fname: 'Anirush',
    lname: 'Sharma',

}

obj2.__proto__=obj1
obj1.__proto__=null

console.log(obj2.getfullname())
console.log(obj2.toString())
