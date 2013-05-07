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
import time
import math
import re
import pymongo
from bson import json_util
from bson.objectid import ObjectId
import json

# DEFINE CONSTANTS
DEFAULT_PAGE_SIZE=15

# DEFINE MongoDB collections
con = pymongo.MongoClient("localhost", 27017)
db = con.pyango
songs = db.songs


# ========================================
# SONGS Related
def find_page(page_num, query_string, logger):
    # Set the page_size from query string
    if ( "page_size" in query_string ):
        try:
            page_size = int(query_string["page_size"])
        except:
            page_size = DEFAULT_PAGE_SIZE
    else:
        page_size = DEFAULT_PAGE_SIZE
    
    # Set the db query
    db_fields = { "track_name": 1, "track_num": 1, "artist": 1, "album": 1, "genre": 1 }
    db_query = {}
    
    # Look for the first key to search by and use only the first one found.
    # The generic 'search' will search on track, artist and album
    for search_by in ("search", "track_name", "artist", "album", "genre"):
        if ( search_by in query_string ):
            search_str = query_string[search_by]
            search_re = re.compile(search_str, re.IGNORECASE)

            if ( search_by == "search" ):
                db_query["$or"] = [
                    { "track_name": { "$regex": search_re } },
                    { "artist": { "$regex": search_re } },
                    { "album": { "$regex": search_re } }
                ]
            else:
                db_query[search_by] = { "$regex": search_re }

            break
    
    # Setting the order
    db_sort = []
    if ( "sort_by" in query_string ):
        sort_by = str( query_string["sort_by"] )
        if ( "sort_asc" in query_string and query_string["sort_asc"] == "1" ):
            db_sort= [(sort_by, pymongo.ASCENDING)];
        else:
            db_sort= [(sort_by, pymongo.DESCENDING)];
    
    # logger.debug("db_query: %s" % db_query)

    # Run query
    first_row = True
    skip_count = (page_num-1) * page_size
    
    # Find out how many pages there are
    row_count = songs.find(db_query,db_fields).count()
    total_pages = math.ceil( row_count / page_size )
    
    
    yield '{ "total_pages": %d, "rows": ' % total_pages
        
    yield "["
    for song in songs.find(db_query,db_fields,sort=db_sort).skip(skip_count).limit(page_size):
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
