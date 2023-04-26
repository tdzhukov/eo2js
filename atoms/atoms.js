// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

/**
 * Class ElegantObject
 */
export class ElegantObject {
  
  constructor() {
    this.debug_mode = false;
    this.varargs = false;
    this.application_counter = 0;
    this.attributes = [];
  }

  toString() {
    return "ElegantObject()";
  }

  dataize() {
    if (this.debug_mode) {
      console.log(`Dataizing ${this}'s phi-attrbute...`);
    }
    return this.attr__phi.dataize();
  }
}
// TODO: Add type annotations


export let ApplicationMixin = {
  call(arg) {
    if (this.varargs === false) {
      if (this.application_counter >= this.attributes.length) {
        throw new Error(`Error while application of an argument ${arg}`);
      } else {
        if (this.debug_mode) {
          console.log(`Assigned ${arg} to attr_${this.attributes[this.application_counter]}`);
        }
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


export class Atom extends ElegantObject {

  value = null;

  constructor(val) {
    super();
    this.value = val
  }

  get data() {
    return this.value;
  }

  toString() {
    return `Atom(${this.value})`;
  }

  eq(other) {
    return new Boolean(this.value === other.value);
  }
  
  dataize() {
    return this;
  }
}


function getPropertiesAndMethods(obj) {
  return [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertyNames(obj.__proto__)];
}


function isCallable(obj) {
  return getPropertiesAndMethods(obj).includes("call");
}


export class Attribute extends ElegantObject {
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

    if (getPropertiesAndMethods(this.obj).includes(this.inner_name())) {
      if (this.debug_mode) {
        console.log(`Found .${this.inner_name()} in ${this.obj.toString()}.`);
      }
      attr = this.obj[this.inner_name()];
    } else {
      if (getPropertiesAndMethods(this.obj).includes("attr__phi")) {
        if (this.debug_mode) {
          console.log(`Did not find .${this.inner_name()} in ${this.obj.toString()},
                      searching for .${this.inner_name()} in ${this.obj.toString()}'s
                      phi attribute: ${this.obj.attr__phi.toString()}.`);
        }
        attr = new Attribute(this.obj.attr__phi, this.name);
      } else {
        if (this.debug_mode) {
          console.log(`Attribute .${this.inner_name()} was not found.`);
        }
        attr = null;
      }
    }

    if (attr !== null) {
      if (isCallable(attr)) {
        let args_str = [];
        for (let arg of this.args) {
          args_str.push(arg.toString());
        }
        if (this.debug_mode) {
          console.log(`Dataizing ${attr.toString()} applied to ${args_str}.`);
        }
        
        let res = attr;
        for (let arg of this.args) {
          res = res.call(arg);
        }
        return res.dataize();
      } else {
        if (this.debug_mode) {
          console.log(`Dataizing ${attr.toString()}, no args needed.`);
        }
        return attr.dataize();
      }
    }

    if (this.debug_mode) {
      console.log(`Dataizing ${this.obj.toString()}...`);
    }
    attr = this.obj.dataize()[this.inner_name()];
    for (let arg of this.args) {
      attr = attr.call(arg);
    }
    return attr.dataize();
  }

}


export class DataizationError extends ElegantObject {

  dataize() {
    throw new Error("Method 'dataize' must be implemented.");
  }
}


export class Boolean extends Atom {
  constructor(val) {
    super(val);
  }

  get attr_if() {
    return new IfOperation(this);
  }

  data() {
    return this.value;
  }

  toString() {
    return `Boolean(${this.value})`;
  }
}


export class Number extends Atom {

  constructor(val) {
    super(val);
  }

  get attr_add() {
    return new NumberOperation(this, "add");
  }

  get attr_sub() {
    return new NumberOperation(this, "sub");
  }

  get attr_pow() {
    return new NumberOperation(this, "pow");
  }

  get attr_mul() {
    return new NumberOperation(this, "mul");
  }

  get attr_less() {
    return new NumberOperation(this, "lt");
  }

  get attr_leq() {
    return new NumberOperation(this, "le");
  }

  get attr_eq() {
    return new NumberOperation(this, "eq");
  }

  toString() {
    return `Number(${this.value})`;
  }

  data() {
    return this.value;
  }
}


class NumberOperation extends ElegantObject {

  constructor(num, operation) {
    super();
    this.operation = operation;
    this.num = num;
    this.attributes = ["other"];
    this.attr_other = new DataizationError();
  }

  toString() {
    return `NumberOperation(${this.num}, ${this.operation})`;
  }

  dataize() {
    let left = this.num.dataize().data();
    let right = this.attr_other.dataize().data();
    switch (this.operation) {
      case "add":
        return new Number(left + right);
      case "sub":
        return new Number(left - right);
      case "pow":
        return new Number(left ** right);
      case "mul":
        return new Number(left * right);
      case "lt":
        return new Boolean(left < right);
      case "le":
        return new Boolean(left <= right);
      case "eq":
        return new Boolean(left === right);
      default:
        return new DataizationError();
    }
  }
}


class IfOperation extends ElegantObject {
  constructor(bool_instance) {
    super();
    this.bool_instance = bool_instance;
    this.attributes = ["if_true", "if_false"];
    this.attr_if_true = new DataizationError();
    this.attr_if_false = new DataizationError();
  }

  toString() {
    return `IfOperation(${this.bool_instance})`;
  }

  dataize() {
    return this.bool_instance.dataize().data() ? this.attr_if_true.dataize() : this.attr_if_false.dataize();
  }

}


export class EOString extends Atom {

  data() {
    return this.value;
  }

  toString() {
    return `EOString(${this.value})`;
  }
}


class ArrayGet extends ElegantObject {
  constructor(arr) {
    super();
    this.arr = arr;
    this.attributes = ["i"];
    this.attr_i = new DataizationError();
  }

  toString() {
    return `ArrayGet(${this.arr})`;
  }

  dataize() {
    return this.arr.at(this.attr_i).dataize();
  }
}


export class Array extends Atom {
  
  constructor() {
    super();
    this.value = [];
  }

  get attr_get() {
    return new ArrayGet(this);
  }

  toString() {
    let content = "[";
    for (let i = 0; i < this.value.length; ++i) {
      content += this.value[i].toString();
      if (i < this.value.length - 1) {
        content += ", ";
      } else {
        content += "]";
      }
    }
    return `Array(${content})`;
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


export class Sprintf extends ElegantObject {

  constructor() {
    super();
    this.sprintf = require('sprintf-js').sprintf;
    this.attributes = ["fmt", "args"];
    this.attr_fmt = new DataizationError();
    this.attr_args = new Array();
    this.varargs = true;
  }

  toString() {
    return "Sprintf()";
  }

  dataize() {
    const fmt = this.attr_fmt.dataize().data();
    const str_data = this.sprintf(fmt, ...this.attr_args.value.map(x => x.dataize().value));
    return new EOString(str_data);
  }
}


export class Stdout extends Atom {
  
  constructor() {
    super();
    this.attributes = ["text"];
    this.attr_text = new DataizationError();
  }

  toString() {
    return "Stdout()";
  }

  dataize() {
    console.log(this.attr_text.dataize().data());
    return this;
  }
}

Object.assign(NumberOperation.prototype, ApplicationMixin);
Object.assign(IfOperation.prototype, ApplicationMixin);
Object.assign(ArrayGet.prototype, ApplicationMixin);
Object.assign(Sprintf.prototype, ApplicationMixin);
Object.assign(Stdout.prototype, ApplicationMixin);
