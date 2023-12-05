#!/bin/sh

echo "Running tests"
npm test

OUTPUT=$?

if [ $OUTPUT != 0 ]
then
    echo "Please fix tests before proceeding"
    exit 1
else
    exit 0
fi
