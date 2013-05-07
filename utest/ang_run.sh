#!/bin/bash

# Run the AngularJS unit test.  Pass "--single-run" arg to this script to immediately exit after test.
echo "============================================="
echo "* START UNIT TEST"

karma start conf/karma.ang.conf.js $*
karma_ret=$?

exit $karma_ret
