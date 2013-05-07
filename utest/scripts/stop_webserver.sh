# Stop the server if needed
if [ ! -z "`ps -p $webserver_pid | grep jserver.py`" ]; then
	echo "### Stopping web-server pid $webserver_pid"
	kill $webserver_pid
fi