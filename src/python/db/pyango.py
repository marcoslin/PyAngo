#!/usr/bin/env python

'''
Created on 3 Mar 2013

@author: Marcos Lin

MongoDB access Wrapper
'''

import pymongo
from bson import json_util
from bson.objectid import ObjectId
import json

con = pymongo.MongoClient("localhost", 27017)
db = con.pyango
songs = db.songs

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



