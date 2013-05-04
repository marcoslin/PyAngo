#!/usr/bin/env python

'''
Created on 3 Mar 2013

@author: Marcos Lin

JSON Server
'''

import os
from flask import Flask, redirect, request, Response, send_from_directory
from db import pyango

# Configure Static File Server for HTML
http_root = os.path.join(os.path.dirname(__file__), "../www")
app = Flask(__name__, static_folder=http_root, static_url_path="/app")

@app.route("/")
def index():
    return redirect("/app/")

@app.route("/app/")
def app_index():
    return send_from_directory(http_root, "index.html")

# Configure Restfull
@app.route("/json/song")
def song_query():
    return Response(pyango.find_all(), mimetype="application/json") 

@app.route("/json/song/<song_oid>", methods=['GET'])
def song_get(song_oid):
    return Response(pyango.find_one(song_oid), mimetype="application/json")

@app.route("/json/song/<song_oid>", methods=['PUT'])
def song_update(song_oid):
    pyango.update(song_oid, request.json)
    return ""

@app.route("/json/song", methods=['POST'])
def song_insert():
    pyango.insert(request.json)
    return ""

# Start the server
if __name__ == "__main__":
    http_port=8036
    app.run( port=http_port, debug=True, use_reloader=False )
