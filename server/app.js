// declare what libraries you are using
// In .Net these are your 'Using statements'
const express = require('express');
const logger = require('morgan');
const axios = require('axios');

const app = express();

// create 'short cuts' for URL construction so that you do not have to re-type URL parts; will use to concat new URLs
const omdbApi = 'http://www.omdbapi.com/';
const apiKey = '&apikey=8730e0e';

// create place holders (variables) that will house the retreived data from the OMBD API
// *THIS IS YOUR CACHE*
var movieIds = new Map();
var movieNames = new Map();

// enable the use of your logger
// in .Net Morgan is the equivalent of Serilog
app.use(logger('dev'));

// create the logic that will handle a GET to the '/' route
app.get('/', function(req, res){

    var movieId = req.query.i;
    // using encodeURIComponent to account for spaces that are passed in (from the Movie titles)
    var movieName = encodeURIComponent(req.query.t);

    // if the URL was based upon a movieId check if the movieId (and its data) is in the cache
    if(movieId){
        // if the movieId is in the cache, return the movie Data (based upon the ID) to the user
        if(movieIds.has(movieId)){
            res.send(movieIds.get(movieId));
        }
        // if the movieId is NOT in the cache, make a request (by way of Axios) and place the retrieved data in the cache
        else{
            axios
            .get(omdbApi + '?i=' + movieId + apiKey)
            .then(axios_res => {
                res.send(axios_res.data);
                movieIds.set(movieId, axios_res.data);
            })
            .catch(error => {
                console.log('error: An error occured handling Movie ID search.');
                console.log('error: ', error);
            });
        }
    }
    // if the URL was based upon a movieName check if the movieName (and its data) is in the cache
    else if(movieName){
        // if the movieName is in the cache, return the movie Data (based upon the Name) to the user
        if(movieNames.has(movieName)){
            res.send(movieNames.get(movieName));
        }
        // if the movieName is NOT in the cache, make a request (by way of Axios) and place the retrieved data in the cache
        else{
            axios
            .get(omdbApi + '?t=' + movieName + apiKey)
            .then(axios_res => {
                res.send(axios_res.data);
                movieNames.set(movieName, axios_res.data);
            })
            .catch(error => {
                console.log('error: An error occured handling Movie Name search.');
                console.log('error: ', error);
            })
        }
    }
})

module.exports = app;