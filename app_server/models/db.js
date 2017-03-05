var mongoose = require('mongoose');

// the path might not work for c9 users
var dbURI = 'mongodb://localhost/QuikRent-Frontend';
mongoose.connect(dbURI);

//for you windows users 
var readLine = require('readline');
if(process.platform === 'win32'){
    var rl = readLine.createInterfact({
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
proces.once('SIGURSR2', function(){
    gracefulShutdown('nodemon restart', function(){
        process.kill(process.pid, 'SIGUSR2');
    });
});

//or when the app terminates
proces.once('SIGINT', function(){
    gracefulShutdown('app termination', function(){
        process.exit(0);
    });
});

//or when Heroku app shutdowns
proces.once('SIGTERM', function(){
    gracefulShutdown('heroku app shutdown', function(){
        process.exit(0);
    });
});
