#!/usr/bin/env node

var chokidar = require("chokidar");

var server_file = __dirname + "/../src/python/jserver.py",
	spawn = require("child_process").spawn;
/*
 * Create a restartable webserver that runs until killed.
 */
var webServer = function () {
	var self = this, server_started = false, server_restart = false;
	var retry_interval = 1, max_retry_interval = 16;
	
	var server_killed = function(signal) {
		if ( signal === null ) {
			// Server failed to start
			server_started = false;
			console.log("* server failed to start.  Retrying again in " + retry_interval);
			setTimeout(function () {
				self.start();
				retry_interval = 2 * retry_interval;
				if ( retry_interval > max_retry_interval ) {
					retry_interval = max_retry_interval;
				}
			}, retry_interval * 1000);
			
		} else if ( server_restart ) {
			console.log("* restarting server...");
			self.start();
			server_restart = false;
			retry_interval = 1;
		}
	};
	
	this.started = function () {
		return server_started;
	};
	
	var server;
	this.start = function ( callback ) {
		server = spawn(server_file);
		server.stdout.setEncoding("ascii");
		server.stderr.setEncoding("ascii");
		server.stdout.on('data', function (data) {
			console.log(data);
		});
		server.stderr.on('data', function (data) {
			console.log(data);
		});
		server.on('close', function (code, signal) {
			console.log("* server closed with signal " + signal);
			server_started = false;
			server_killed(signal);
		});
		// Give one sec for the server to start
		setTimeout(function() {
			server_started = true;
			if ( callback ) {
				callback();
			}
		}, 1000);
	};
	
	this.restart = function() {
		server_restart = true;
		server.kill("SIGHUP");
	};
};

//var server = spawn(pyenv_start, [pyenv_activate, server_file
var srv = new webServer();
srv.start();

var watcher = chokidar.watch(__dirname + "/../src/python/", {ignored: /^\./})
	.on('error', function (error) { console.log("### FS Watcher Error: " + error); })
	.on('all', function (event, path) {
		console.log("* " + path + " [" + event + "]" );
		if ( srv.started() ) {
			srv.restart();
		}
	})


