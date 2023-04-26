#!/usr/bin/env bash

cd .. && mvn -DskipTests clean install
cd sandbox || exit
mvn clean compile

cp ../atoms/atoms.js ./target/generated-sources/
cp ../atoms/package.json ./target/generated-sources/
cd ./target/generated-sources/
npm install sprintf-js

if [ "$1" = "--debug" ]; then
  echo "Debug mode enabled."
  sed -i "s/this.debug_mode = false;/this.debug_mode = true;/g" ./atoms.js
fi