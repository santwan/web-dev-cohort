// require  - 
// import  - If you are using import then you have to go to package.json file and have to make some changes - Add "type": "module"  in the object.

// const express = require('express')
import express from "express"

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

