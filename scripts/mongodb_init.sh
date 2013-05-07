#!/bin/bash

#
# Author:  Marcos Lin
# Created: 3 May 2013
# 
# This script is used to initialize the MongoDB's pyango database.
# It accepts a JSON file as input arg, or pass - read from STDIN
#

input_arg=$1
script_dir=`dirname $0`
data_dir="$script_dir/../data"
small_file="$data_dir/small.pyango.songs.json.bz2"
large_file="$data_dir/large.pyango.songs.json.bz2"

help_needed() {
	echo "Script used to load initial data to pyango MongoDB database.
Usage:
	$0 [small|large|<file>]

Note:
	* If no parameter passed, source from STDIN
	* small: uses $small_file
	* large: uses $large_file
	* <file>: source using <file> passed
" 1>&2
	exit 1
}

import_opt=""
bz_file=""
if [ -n "$input_arg" ]; then
	case "$input_arg" in
		-h|--help)
			help_needed;
			;;
	    small)
	    	bz_file=$small_file;
	    	;;
	    large)
	    	bz_file=$large_file;
	    	;;
	    *)
	    	if [ ! -f "$input_arg" ]; then
	    		echo "### File $input_arg not foud" 1>&2
	    		exit 1
	    	fi
	    	import_opt="--file $input_arg"
	    	;;
	esac
fi

mongo pyango --eval "db.dropDatabase()"
if [ $? -ne 0 ]; then
	exit 1
fi

mongo_cmd="mongoimport --db pyango --collection songs"
if [ -z "$bz_file" ]; then
	if [ -z "$import_opt" ]; then
		echo
		echo "*** Reading JSON from STDIN..."
	fi
	$mongo_cmd $import_opt
	if [ $? -ne 0]; then
		exit 1
	fi
else
	bunzip2 -c $bz_file | $mongo_cmd
	if [ $? -ne 0 ]; then
		exit 1
	fi
fi

mongo pyango --eval "db.songs.ensureIndex( { track_name: 1 } )"
if [ $? -ne 0 ]; then
	exit 1
fi

mongo pyango --eval "db.songs.ensureIndex( { artist: 1 } )"
if [ $? -ne 0 ]; then
	exit 1
fi

mongo pyango --eval "db.songs.ensureIndex( { album: 1 } )"
if [ $? -ne 0 ]; then
	exit 1
fi

mongo pyango --eval "db.songs.ensureIndex( { genre: 1 } )"
if [ $? -ne 0 ]; then
	exit 1
fi

