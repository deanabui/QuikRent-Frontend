var mongoose = require('mongoose');

// the path might not work for c9 users
var dbURI = 'mongodb://localhost/QuikRent-Frontend';
//checking node_env to set 
if(process.env.NODE_ENV === 'production'){
    dbURI = process.env.MONGOLAB_URI;
     //dbURI='mongodb://admin:quikrent2017@ds145329.mlab.com:45329/quikrent';
}
mongoose.connect(dbURI);

//for you windows users
var readLine = require('readline');
if(process.platform === 'win32'){
    var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("SIGINT", function(){
        process.emit("SIGINT");
    });
}

//monitoring for successful connection thru mongoose
mongoose.connection.on('connected', function(){
    console.log('Mongoose connected to ' + dbURI);
});

//checking for connection error
mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error ' + err);
});

//checking for disconnection
mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});

//to close the db
var gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log('Mongoose disconnected through ' + msg);
    });
};

//need to call the gracefulShutdown when nodemon restarts it
process.once('SIGURSR2', function(){
    gracefulShutdown('nodemon restart', function(){
        process.kill(process.pid, 'SIGUSR2');
    });
});

//or when the app terminates
process.once('SIGINT', function(){
    gracefulShutdown('app termination', function(){
        process.exit(0);
    });
});

//or when Heroku app shutdowns
process.once('SIGTERM', function(){
    gracefulShutdown('heroku app shutdown', function(){
        process.exit(0);
    });
});

//adding db stuff
require('./users');