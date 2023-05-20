cd eo2js-runtime
[ ! -d "./target" ] && echo "Directory target does not exists.\nPlease, run 'npm run build -- eo2js-runtime'" && exit 1
sed -i 's/^class /export class /g' ./target/generated-sources/*.js
mocha ./test/*.test.js
