#!/bin/bash

mongo pyango --eval "db.dropDatabase()"
mongoimport --db pyango --collection songs --file ../data/pyango.songs.json
