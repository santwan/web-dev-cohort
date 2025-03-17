Express js

// require  - 
// import  - If you are using import then you have to go to package.json file and have to make some changes - Add "type": "module"  in the object.

"express": "^4.21.2" 
Semantic versioning

  "scripts": {
    "start": "nodemon index.js"
  },
  npm run start


  port 


Read and understand cors
app.use(cors({
    origin: 'http://localhost:3000'
}))