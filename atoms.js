/**
 * Class ElegantObject
 */
class ElegantObject {

  /**
   * Phi attribute
   * @type { ElegantObject } 
   */
  attr__phi;

  dataize() {
    return this.attr__phi.dataize();
  }
}
// TODO: Add type annotations
// TODO: Add Class ApplicationMixin
// TODO: Add operations


class Atom extends ElegantObject {

  data = null;

  constructor(data) {
    super();
    this.data = data
  }

  get data() {
    return this.data;
  }

  eq(other) {
    return new Boolean(this.data === other.data);
  }
  
  dataize() {
    throw new Error("Method 'dataize' must be implemented.");
  }
}

function isCallable(obj) {
  return Object.getOwnPropertyNames(obj.__proto__).includes("call");
}

class Attribute extends ElegantObject {
  constructor(obj, name) {
    super();
    this.obj = obj;
    this.name = name;
    this.args = [];
  }

  call(...args) {
    this.args.push(...args);
    return this;
  }

  inner_name() {
    return "attr_" + this.name;
  }

  toString() {
    return `${this.obj}.${this.inner_name()}`;
  }

  dataize() {
    let attr = null, res;

    if (Object.getOwnPropertyNames(this.obj).includes(this.inner_name())) {
      console.log(`Found .${this.inner_name()} in ${this.obj.toString()}.`);
      attr = this.obj[this.inner_name()];
    } else {
      if (Object.getOwnPropertyNames(this.obj).includes("attr__phi")) {
        console.log(`Did not find .${this.inner_name()} in ${this.obj.toString()},
                     searching for .${this.inner_name()} in ${this.obj.toString()}'s
                     phi attribute: ${this.obj.attr__phi.toString()}.`);
        attr = new Attribute(this.obj.attr__phi, this.name);
      } else {
        console.log(`Attribute .${this.inner_name()} was not found.`);
        attr = null;
      }
    }

    if (attr !== null) {
      if (isCallable(attr)) {
        let args_str = [];
        for (let arg of this.args) {
          args_str.push(arg.toString());
        }
        console.log(`Dataizing ${attr.toString()} applied to ${args_str}.`);
        
        let res = attr.call();
        for (let arg in this.args) {
          res = res.call(arg);
        }
        return res.dataize();
      } else {
        console.log(`Dataizing ${attr.toString()}, no args needed.`);
        return attr.dataize();
      }
    }

    console.log(`Dataizing ${this.obj.toString()}...`);
    attr = this.obj.dataize()[this.inner_name()].call();
    for (let arg in this.args) {
      attr = attr.call(arg);
    }
    return attr.dataize();
  }

}


class DataizationError extends ElegantObject {

  dataize() {
    throw new Error("Method 'dataize' must be implemented.");
  }
}


class Boolean extends Atom {
}


class Number extends Atom {

  add(other) {
    return new Number(this.data + other.data);
  }

  sub(other) {
    return new Number(this.data - other.data);
  }
}


class String extends Atom {
}


class Array extends Atom {
  
  constructor() {
    super();
    this.data = [];
  }

  get data() {
    return this.data.map(x => x.dataize().data);
  }

  push(object) {
    this.data.push(object)
  }

  at(index) {
    const i = index.dataize().data;
    return this.data[i];
  }
}

class Sprintf extends ElegantObject { // TODO: Add ApplicationMixin
  
  constructor() {
    super();
    this.sprintf = require('sprintf-js').sprintf;
    this.attributes = ["fmt", "args"];
    this.attr_fmt = new DataizationError();
    this.attr_args = new Array();
    this.varargs = true;
  }

  dataize() {
    const fmt = this.attr_fmt.dataize().data();
    const str_data = this.sprintf(fmt, ...this.attr_args.map(arg => arg.dataize().data));
    return new String(str_data);
  }
}


class Stdout extends Atom { // TODO: Add ApplicationMixin
  
  constructor() {
    super();
    this.attributes = ["text"];
    this.attr_text = new DataizationError();
  }

  dataize() {
    console.log(this.attr_text.dataize());
    return this;
  }
}
