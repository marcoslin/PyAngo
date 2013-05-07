# Sourced by *_run.sh script to start the web server if necessary
if [ -z "`netstat -anp tcp | grep 8036`" ]; then
	echo "### Sourcing Python VirtualEnv"
	source ../pyenv/bin/activate
	echo "### Starting web server in the unit test mode."
	../src/python/jserver.py --utest &
	webserver_pid=$!
	echo "### Web server started with pid $webserver_pid"
fi

