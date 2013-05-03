#!/usr/bin/env python

'''
Created on 3 Mar 2013

@author: Marcos Lin

JSON Server
'''

import os
from bottle import route, post, put, get, delete, run, response, request, static_file, redirect

# Configure Static File Server for HTML
http_root = os.path.join(os.path.dirname(__file__), "../www")

@route("/<filepath:path>")
def server_static(filepath):
    return static_file(filepath, root=http_root)

@route("/")
@route("/index.html")    
def server_index():
    return static_file("index.html", root=http_root)


# Start the server
run(host='localhost', port=8036, debug=True)
