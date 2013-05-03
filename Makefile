#!/bin/bash

# ===========================================================
# Author:   Marcos Lin
# Created:	3 May 2013
#
# Makefile used to setup PyAngo application
#
# ===========================================================

SRC           = src
PYENV         = pyenv
PIP           = $(PYENV)/bin/pip


# ------------------
# USAGE: First target called if no target specified
man :
	@cat $(SRC)/readme.make
	@cat $(SRC)/pylib_req.txt

# ------------------
# Define file needed
$(PIP) :
ifeq ($(shell which virtualenv),)
	$(error virtualenv command needed to be installed.)
endif
	@mkdir -p $(PYENV)
	@virtualenv $(PYENV)
   
$(PYENV)/pylib_req.txt : $(SRC)/pylib_req.txt
ifeq ($(shell which mongo),)
	$(error mongo command not found.  Make sure mongodb is loaded.)
endif
	@$(PIP) install -r $(SRC)/pylib_req.txt
	@cp -a $(SRC)/pylib_req.txt $@


# ------------------
# MAIN TARGETS	
virtualenv : $(PIP) $(PYENV)/pylib_req.txt


# ------------------
# DEFINE PHONY TARGET: Basically all targets
.PHONY : \
	man virtualenv
