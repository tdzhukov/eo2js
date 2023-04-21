/**
 * Class ElegantObject
 */
class ElegantObject {

  /**
   * Phi attribute
   * @type { ElegantObject } 
   */
  attr__phi;
  
  constructor() {
    this.varargs = false;
    this.application_counter = 0;
    this.attributes = [];
  }

  dataize() {
    return this.attr__phi.dataize();
  }
}
// TODO: Add type annotations
// TODO: Add operations


let ApplicationMixin = {
  call(arg) {
    if (this.varargs === false) {
      if (this.application_counter >= this.attributes.length) {
        throw new Error(`Error while application of an argument ${arg}`);
      } else {
        console.log(`Assigned ${arg} to attr_${this.attributes[this.application_counter]}`);
        this["attr_" + this.attributes[this.application_counter]] = arg;
        ++this.application_counter;
      }
    } else {
      if (this.application_counter < this.attributes.length - 1) {
        this["attr_" + this.attributes[this.application_counter]] = arg;
        ++this.application_counter;
      } else {
        if (this.application_counter === this.attributes.length - 1) {
          this["attr_" + this.attributes[this.application_counter]].call(arg);
        }
      }
    }
    return this;
  }
};


class Atom extends ElegantObject {

  value = null;

  constructor(val) {
    super();
    this.value = val
  }

  get data() {
    return this.value;
  }

  eq(other) {
    return new Boolean(this.value === other.value);
  }
  
  dataize() {
    return this;
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
        
        let res = attr;
        for (let arg of this.args) {
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

  data() {
    return this.value;
  }

  add(other) {
    return new Number(this.data + other.data);
  }

  sub(other) {
    return new Number(this.data - other.data);
  }
}


class EOString extends Atom {

  data() {
    return this.value;
  }
}


class ArrayGet extends ElegantObject {
  constructor(arr) {
    super();
    this.arr = arr;
    this.attributes = ["i"];
    this.attr_i = new DataizationError();
  }

  dataize() {
    return this.arr.at(this.attr_i).dataize();
  }

}


class Array extends Atom {
  
  constructor() {
    super();
    this.value = [];
    this.attr_get = new ArrayGet(this);
  }

  call(arg) {
    this.value.push(arg);
    return this;
  }

  get data() {
    return this.value.map(x => x.dataize().value);
  }

  push(object) {
    this.value.push(object)
  }

  at(index) {
    const i = index.dataize().value;
    return this.value[i];
  }
}


class Sprintf extends ElegantObject {
  
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
    const str_data = this.sprintf(fmt, ...this.attr_args.value.map(x => x.dataize().value));
    return new EOString(str_data);
  }
}


class Stdout extends Atom {
  
  constructor() {
    super();
    this.attributes = ["text"];
    this.attr_text = new DataizationError();
  }

  dataize() {
    console.log(this.attr_text.dataize().data());
    return this;
  }
}

Object.assign(ArrayGet.prototype, ApplicationMixin);
Object.assign(Sprintf.prototype, ApplicationMixin);
Object.assign(Stdout.prototype, ApplicationMixin);
