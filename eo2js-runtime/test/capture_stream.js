export function captureStream(stream){
  var oldWrite = stream.write;
  var buf = '';
  stream.write = function(chunk, encoding, callback){
    buf += chunk.toString();
    oldWrite.apply(stream, arguments);
  }

  return {
    unhook: function unhook(){
     stream.write = oldWrite;
    },
    captured: function(){
      return buf;
    }
  };
}

export var hook;
beforeEach(function(){
  hook = captureStream(process.stdout);
});
afterEach(function(){
  hook.unhook(); 
});