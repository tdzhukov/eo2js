cd sandbox
[ ! -d "./target" ] && echo "Directory target does not exists. Please, run compile.sh" 
sed -i 's/^class /export class /g' ./target/generated-sources/*.js
mocha ./test/*.test.js