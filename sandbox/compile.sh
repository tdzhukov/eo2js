#!/usr/bin/env bash

cd .. && mvn -DskipTests clean install
npm install
cd sandbox || exit
mvn clean compile

cp ../atoms/atoms.js ./target/generated-sources/
cd ./target/generated-sources/

if [ "$1" = "--debug" ]; then
  echo "Debug mode enabled."
  sed -i "s/this.debug_mode = false;/this.debug_mode = true;/g" ./atoms.js
fi