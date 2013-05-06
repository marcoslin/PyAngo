#!/usr/bin/env python

'''
Created on 5 Mar 2013

@author: Marcos Lin

Generate a list of JSON music track entry based on a itunelib.db sqlite3 file.

'''

import os, sys
import json
from collections import OrderedDict
import sqlite3

# Read row to generate from command line, defaulting to 10
set_row_count = 10
if len(sys.argv) > 1:
    try:
        set_row_count = int(sys.argv[1])
    except:
        pass
sys.stderr.write("### Generating JSON file with track detail for %d rows\n" % set_row_count)

# Config Data
db_file = os.path.join( os.environ["HOME"], "tmp/db/itunelib.db")
field_layout = [ "track_name", "track_num", "track_count", "track_year", "artist", "album", "genre" ]

# Connect to db
if not os.path.isfile(db_file):
    print "### Error: iTune database not found at '%'" % db_file
    sys.exit(1)

con = sqlite3.connect(db_file)
con.row_factory = sqlite3.Row
cur = con.cursor()

sql_select = '''
select * from itune_track
where album != '' and artist != '' and track_kind like '%audio file'
order by artist, album, track_name limit '''

# Create result
# cur.execute("select * from itune_track where album in (%s)" % "'Back In Black', '21', 'Forever Young', 'Elis & Tom', 'Brit Awards 2003'")
cur.execute(sql_select + str(set_row_count))
for row in cur:
    dic = OrderedDict()
    for field in field_layout:
        dic[field] = row[field]
    print json.dumps( dic )
    # print [ "'%s': %s" % (s, row[s]) for s in field_layout ]
    

