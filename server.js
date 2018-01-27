const express = require('express')
const request = require('request')
const app = express()
const bodyParser = require('body-parser')
const db = require('./database.js')

app.use(bodyParser.json())

//let database;

db.connect("mongodb://localhost:27017/records", "records").then( (database)=>{
  database.dropCollection('queries') //drops old collection
  database.createCollection('queries') //creates new collection for this server instance
}).then( (data)=>app.listen(3000) )


let key = "AIzaSyBBTRQJMubq0bYQrUrIouwPD7uQ44FIB3A"
let cx = "017503487236250911187%3Akno7rbyg34e"


app.get('/:query',(req,res)=>{

  //db ? _db : await connect()

  //saves each discrete search term in database (does not save duplicates)
  let params = req.params['query']
  let queries = database.collection('queries')
  console.log("next look")
  queries.update({ 'query': params },{ 'query': params }, {upsert:true} ).then( (res) =>
  queries.find({}).forEach( (query)=> console.log(query) ) )

  //search for images based on search params
  let imageRequest = 'https://www.googleapis.com/customsearch/v1?searchType=image&q='
  + params + "&cx=" + cx + "&key=" + key

  //initiates google image search
  request.get(imageRequest, (error,response,body)=> {

    if(!error){
      let results = JSON.parse(body)['items']
      let offset = req.query.offset||results.length

      //sends search results to client
      res.send(results.filter( (item,index) => index < offset ).map( (image)=>{
        return JSON.stringify({url: image['link'], snippet: image['snippet'],
        thumbnail: image['image']['thumbnailLink'],
        context: image['image']['contextLink']})
        })
      )}
    else{
      res.send("Please submit your search again.")
    }
  })
})
