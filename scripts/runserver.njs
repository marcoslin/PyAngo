#!/usr/bin/env node

var chokidar = require("chokidar");

var server_file = __dirname + "/../src/python/jserver.py",
	server_port = 8036,
	spawn = require("child_process").spawn;

/*
 * Create a restartable webserver that runs until killed.
 */
var webServer = function () {
	var self = this,
		server,
		server_start_check_re = new RegExp("Running on http.*" + server_port),
		server_started = false,
		retry_interval = 1,
		max_retry_interval = 16;
	
	// Private method to handle server exit and restart it
	var server_exit = function(signal) {
		console.log("=========================================");
		if ( signal === null ) {
			// If server exited without any signal, it failed to start
			console.log("### Server failed to start.  Retrying again in " + retry_interval + " seconds.");
			setTimeout(function () {
				self.start();
				// Double the retry_internal unti max retry interval reached
				retry_interval = 2 * retry_interval;
				if ( retry_interval > max_retry_interval ) {
					retry_interval = max_retry_interval;
				}
			}, retry_interval * 1000);
		} else {
			// If server was killed, restart it
			console.log("# Server exited with '" + signal + "'.  Restarting...");
			// Intentionally giving restart a 2 secs buffer in case of large number of file changed
			// During this delay, server_started is false so file change events are ignored.
			setTimeout(function () {
				self.start();
				retry_interval = 1;
			}, 2000);
		}
	};
	
	// Return if server has started
	this.started = function () {
		return server_started;
	};

	// Start the webserver and set the needed events
	this.start = function () {
		server = spawn(server_file);
		server.on('close', function (code, signal) {
			server_started = false;
			server_exit(signal);
		});
		server.stdout.setEncoding("ascii");
		server.stdout.on('data', function (data) {
			console.log(data.slice(0,-1));
		});
		server.stderr.setEncoding("ascii");
		server.stderr.on('data', function (data) {
			console.log(data.slice(0,-1));
			// Check the stdout and only set server_started if it indeed has started.
			if ( server_start_check_re.test(data) ) {
				server_started = true;
				console.log("# Server started.");
			}
		});
		// Returning self allowing for chained call.
		return self;
	};
	
	// Retart the server.  The actual restart logic is in server_exit()
	this.restart = function() {
		server.kill("SIGHUP");
	};
};

// Define the webserver
var srv = new webServer();

// Start the file watcher
var watcher = chokidar.watch(__dirname + "/../src/python/", {ignored: /^\./})
	.on('error', function (error) { console.log("### FS Watcher Error: " + error); })
	.on('all', function (event, path) {
		console.log("# " + path + " [" + event + "]" );
		if ( srv.started() ) {
			srv.restart();
		}
	})

// Start the webserver
srv.start();
