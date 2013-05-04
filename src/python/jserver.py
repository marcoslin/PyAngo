#!/usr/bin/env python

'''
Created on 3 Mar 2013

@author: Marcos Lin

JSON Server
'''

import os
from bottle import route, post, put, get, delete, run, response, request, static_file, redirect

from db import pyango

# Configure Static File Server for HTML
http_root = os.path.join(os.path.dirname(__file__), "../www")

@route("/app/<filepath:path>")
def server_static(filepath):
    return static_file(filepath, root=http_root)

@route("/")
@route("/app/")    
def server_index():
    return static_file("index.html", root=http_root)


@get("/json/song")
def song_query():
    response.content_type = "application/json"
    return pyango.find_all()

@get("/json/song/<song_id>")
def song_get(song_id):
    response.content_type = "application/json"
    return pyango.find_one(song_id)





# Start the server
run(host='localhost', port=8036, debug=True)
