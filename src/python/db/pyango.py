#!/usr/bin/env python

'''
Created on 3 Mar 2013

@author: Marcos Lin

MongoDB access Wrapper

Note:
  * The '__future__ import division' forces integer division to be performed as floating point.  To perform
    an integer division, use //
'''

from __future__ import division
import math
import pymongo
from bson import json_util
from bson.objectid import ObjectId
import json

con = pymongo.MongoClient("localhost", 27017)
db = con.pyango
songs = db.songs


# ========================================
# SONGS Related
def find_page(page_num, page_size):
    first_row = True
    skip_count = (page_num-1) * page_size
    
    # Find out how many pages there are
    row_count = songs.count()
    total_pages = math.ceil( row_count / page_size )
    yield '{ "total_pages": %d, "rows": ' % total_pages
    
    
    yield "["
    for song in songs.find().skip(skip_count).limit(page_size):
        if first_row:
            yield json.dumps(song, default=json_util.default)
            first_row = False
        else:
            yield "," + json.dumps(song, default=json_util.default)
    yield "]}"  
    
def find_all():
    first_row = True
    yield "["
    for song in songs.find():
        if first_row:
            yield json.dumps(song, default=json_util.default)
            first_row = False
        else:
            yield "," + json.dumps(song, default=json_util.default)
    yield "]"    
    
def find_one(song_oid):
    mongo_id = ObjectId(song_oid)
    print "find_one called for %s" % id
    result = songs.find_one({ "_id": mongo_id} )
    return json.dumps(result, default=json_util.default)

def update(song_oid, json_body):
    mongo_id = ObjectId(song_oid)
    # Can't update _id field
    if "_id" in json_body:
        del json_body["_id"]
    songs.update({ "_id": mongo_id }, { "$set" : json_body } )

def insert(json_body):
    mongo_id = ObjectId()
    # Can't update _id field
    json_body["_id"] = mongo_id
    songs.insert(json_body)

def delete(song_oid):
    mongo_id = ObjectId(song_oid)
    songs.remove({ "_id": mongo_id })

# ========================================
# REF Related
def reference_data(attribute_name):
    result = []
    for genre in songs.distinct(attribute_name):
        result.append({ "name": genre })
    return json.dumps(result, default=json_util.default)
