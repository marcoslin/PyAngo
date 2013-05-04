# PyAngo

A sample Music Catalog build on MAP stack (MongoDB, AngularJS and Python)


# Development

### Setup Python VirtualEnv
This project requires a Python 2.7 virtual environment at `pyenv/` directory.  The required Python package are defined
in `src/pylib_req.txt`.  To setup the virtualenv and install the defined packages, run:
```
make virtualenv
```

### Database Initialization
To initialize MongoDB with initial sample data, run:
```
cd scripts/
mongodb_init.sh
```

### Start a webserver
The actual server code is in `src/python/jserver.py`.  The script below will load the virtualenv, start the server and
watch for file changes in the `src/python/` directory.  When file change are detected, the server will be automatically
started.
```
runserver.sh
```
