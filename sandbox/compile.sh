#!/usr/bin/env bash

cd .. && mvn -DskipTests clean install
cd sandbox || exit
mvn clean compile
