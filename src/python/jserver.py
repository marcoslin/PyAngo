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

# ========================================
# SONGS Related
@app.route("/json/test/", defaults={ "page_num": 1 }, methods=['GET'])
@app.route("/json/test/<int:page_num>", methods=['GET'])
def test(*args, **kwargs):
    return "args: %s; kwargs: %s; request.args: %s" % (str(args), str(kwargs), str(request.args))

@app.route("/json/songs/<int:page_num>", methods=['GET'])
def songs_page_query(page_num):
    return Response(pyango.find_page(page_num, request.args, app.logger), mimetype="application/json") 

@app.route("/json/song/<song_oid>", methods=['GET'])
def song_get(song_oid):
    return Response(pyango.find_one(song_oid), mimetype="application/json")

@app.route("/json/song/<song_oid>", methods=['PUT'])
def song_update(song_oid):
    pyango.update(song_oid, request.json)
    return ""

@app.route("/json/song/<song_oid>", methods=['DELETE'])
def song_delete(song_oid):
    pyango.delete(song_oid)
    return ""

@app.route("/json/song", methods=['POST'])
def song_insert():
    pyango.insert(request.json)
    return ""

# ========================================
# Referencial Data
@app.route("/json/ref/<attr_name>", methods=['GET'])
def ref_genre_list(attr_name):
    # Only return for pre-configured list
    if attr_name in ("album", "artist", "genre"):
        return Response(pyango.reference_data(attr_name), mimetype="application/json")
    else:
        return "Reference data does not exists for '%s'" % attr_name, 404


# Start the server
if __name__ == "__main__":
    http_port=8036
    app.run( port=http_port, debug=True, use_reloader=False )
