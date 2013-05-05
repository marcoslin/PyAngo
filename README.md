# PyAngo

A sample Music Catalog build on MAP stack (MongoDB, AngularJS and Python)

# Dependencies

### Javascript Frameworks
Following packages are installed under `src/www/components` directory:

1. [angular.js](http://angularjs.org/) >= 1.0.6
1. [angular-resource](http://docs.angularjs.org/api/ngResource.$resource) >= 1.0.6
1. [angular-ui-bootstrap](http://angular-ui.github.io/bootstrap/) >= 0.4.0

Note: `angular-ui-bootstrap` is a custom build with: `Alert`, `Dialog` and `TypeAhead`

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

### Git Branch
All developement effort should take place on a branch.  To create a new branch for your work, for example `mycode`
run:
```
# Create a new local branch
git checkout -b mycode

# Push the branch to repo
git push -u origin mycode

# To checkout a remote branch
checkout -b mycode origin/mycode
```

### Git Merge
To merge your changes to `master`, do the following (assuming you work on a branch called `mycode`):
```
# Start at your branch and make sure it is up-to-date
git checkout mycode
git pull

# Merge changes from master and run unit test to make sure everything still works
git merge master

# Merge your branch to master
git checkout master
git pull
git merge mycode

# Run the unit test again and push if it all works
git push
```
