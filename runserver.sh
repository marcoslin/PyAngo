#!/bin/bash

# Source pyenv
source pyenv/bin/activate

# Keep the src/python/jserver.py running and watch for changes
scripts/runserver.njs

