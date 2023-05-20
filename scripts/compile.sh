#!/usr/bin/env bash

mvn clean install
npm install

cd $1
mvn clean compile
atoms_path=$([ "$1" == sandbox ] && echo "../eo2js-runtime/atoms/atoms.js" || echo "atoms/atoms.js")
cp $atoms_path target/generated-sources/
