'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./const.js');

const request = require('request');
const spawn = require('child_process').spawn;
var restaurants = "not_updated";

//const spawn = require('child_process').spawn;

//let getYelpToken;

// var spawn = require('child_process').spawn,
//     py    = spawn('python', ['auth.py']),
//     data = [],
//     getYelpToken = '';

// py.stdout.on('data', function(data){
//   getYelpToken = data.toString();
// });

// py.stdin.write(JSON.stringify(data));
// py.stdin.end();


// var spawn = require('child_process').spawn,
// py  = spawn('python', ['search.py']),
// data = ['pizza', 'london'],
// restaurants = 'not_updated';

// py.stdout.on('data', function(data){
//   restaurants = data.toString();
// });
// py.stdin.write(JSON.stringify(data));
// py.stdin.end();
// console.log(restaurants);


function getRestaurants(location, type_food, context, cb){
  var py;
  var data;
  py  = spawn('python', ['search.py']),
  data = [type_food, location];

  py.stdout.on('data', function(data){
    restaurants = data.toString();
  });
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
  console.log(restaurants);
  context.restaurants = restaurants;
  //return global.restaurants;  
  cb(context);

}

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Bot actions
const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);

    // Bot testing mode, run cb() and return
    if (require.main === module) {
      cb();
      return;
    }

    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to from context
    // TODO: need to get Facebook user name
    const recipientId = context._fbid_;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      FB.fbMessage(recipientId, message, (err, data) => {
        if (err) {
          console.log(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err
          );
        }

        // Let's give the wheel back to our bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
      // Giving the wheel back to our bot
      cb();
    }
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    const loc = firstEntityValue(entities, 'location');
    if (loc) {
      context.loc = loc; // store it in context
    }
    const action = firstEntityValue(entities, 'action');
    if (action) {
      context.action = action; // store it in context
    }
    const food = firstEntityValue(entities, 'food');
    if (food) {
      context.food = food; // store it in context
    }
    cb(context);
    console.log(context);
  },

  error(sessionId, context, error) {
    console.log(error.message);
  },

  // fetch-weather bot executes
  ['findFood'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    getRestaurants(context.loc, context.food, context, cb);
    // context.restaurants = restaurants;//getRestaurants(context.loc, context.food);
    // cb(context);

    // getRestaurants(context.loc, context.food, context, cb, function(){
    //   cb(context);

    // });

  },
  ['cleanContext'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
   context.loc = null;
   context.food = null;
   context.action = null
   cb(context);

  }
};


const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}