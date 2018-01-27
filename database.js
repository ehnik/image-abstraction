const express = require('express');
const MongoClient = require('mongodb').MongoClient

var state = {
  db: null
}

exports.connect = function(url,dbName) { //connects to MongoDB database

  return new Promise((resolve, reject) =>{ //returns promise that resolves to
    //either stored database (if already created) or newly created database

    if(state.db){
      return(resolve(state.db))
    }
    else{
      MongoClient.connect(url).then( (client) => {
      database = client.db(dbName)
      state.db = database
      return resolve(database)
      })
    }
  })

}

exports.get = function() { //returns stored database
  return state.db
}
