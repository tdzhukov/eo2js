#!/usr/bin/env bash

<<<<<<< HEAD
mvn -DskipTests clean install
npm install
cd sandbox
mvn clean compile
=======
cd .. && mvn -DskipTests clean install
cd sandbox || exit
mvn clean compile -e
>>>>>>> 7995c23 (WIP)

cp ../atoms/atoms.js ./target/generated-sources/
cd ./target/generated-sources/

if [ "$1" = "--debug" ]; then
  echo "Debug mode enabled."
  sed -i "s/this.debug_mode = false;/this.debug_mode = true;/g" ./atoms.js
fi