#!/bin/bash

#
# Author:  Marcos Lin
# Created: 3 May 2013
# 
# This script is used to initialize the MongoDB's pyango database.
# It accepts a JSON file as input arg, or pass - read from STDIN
#

json_file=$1
default_file="../data/pyango.songs.json"

help_needed() {
	echo "Script used to load initial data to pyango MongoDB database.
Usage:
 $0 [<file>|-]

Note:
 * if <file> not passed, the default '$default_file' will be used.
 * - is used to source the JSON from STDIN
"
}



if [ "$json_file" = "--help" -o "$json_file" = "-h" ]; then
	help_needed
	exit
elif [ -f "$json_file" ]; then
	import_opt="--file $json_file"
elif [ "$json_file" = "-" ]; then
	import_opt=""
else
	import_opt="--file $default_file"
fi

mongo pyango --eval "db.dropDatabase()"
mongoimport --db pyango --collection songs $import_opt
