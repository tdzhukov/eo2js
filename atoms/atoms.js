// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export class DataizationResultStorage {

  constructor() {
    this.loc_to_result = {};
  }

  get_value(key) {
    if (!(key in this.loc_to_result)) {
      return null;
    }
    return this.loc_to_result[key];
  }

  put(key, value) {
    this.loc_to_result[key] = value;
  }
}

/**
 * Class ElegantObject
 */
export class ElegantObject {
  
  constructor(kwargs={}) {
    this.debug_mode = false;
    this.varargs = false;
    this.application_counter = 0;
    this.attributes = [];
    if ("dataization_result_storage" in kwargs) {
      // only if object is constant (dataize once)
      this.dataization_result_storage = kwargs["dataization_result_storage"];
      this.loc = kwargs["loc"];
    } else {
      this.dataization_result_storage = null;
      this.loc = null;
    }
  }

  toString() {
    return "ElegantObject()";
  }

  dataize() {
    if (this.debug_mode) {
      console.log(`Dataizing ${this}'s phi-attrbute...`);
    }
    if (this.dataization_result_storage !== null) {
      if (this.dataization_result_storage.get_value(this.loc) === null) {
        this.dataization_result_storage.put(this.loc, this.attr__phi.dataize());
      }
      return this.dataization_result_storage.get_value(this.loc);
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

  constructor(val, kwargs={}) {
    super(kwargs);
    this.value = val
  }

  get data() {
    return this.value;
  }

  toString() {
    return `Atom(${this.value})`;
  }

  eq(other) {
    return new ElegantBoolean(this.value === other.value);
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
  constructor(obj, name, kwargs={}) {
    super(kwargs);
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
    if (this.dataization_result_storage !== null) {
      let result = this.dataization_result_storage.get_value(this.loc);
      if (result !== null) {
        return result;
      }
    }

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
        if (this.dataization_result_storage !== null) {
          this.dataization_result_storage.put(this.loc, res.dataize());
          return this.dataization_result_storage.get_value(this.loc);
        }
        return res.dataize();
      } else {
        if (this.debug_mode) {
          console.log(`Dataizing ${attr.toString()}, no args needed.`);
        }
        if (this.dataization_result_storage !== null) {
          this.dataization_result_storage.put(this.loc, attr.dataize());
          return this.dataization_result_storage.get_value(this.loc);
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
    if (this.dataization_result_storage !== null) {
      this.dataization_result_storage.put(this.loc, attr.dataize());
      return this.dataization_result_storage.get_value(this.loc);
    }
    return attr.dataize();
  }

}


export class DataizationError extends ElegantObject {

  dataize() {
    throw new Error("Method 'dataize' must be implemented.");
  }
}


export class ElegantBoolean extends Atom {
  constructor(val, kwargs={}) {
    if (typeof val === "string") {
      if (val === "01" || val === "true") {
        val = true;
      } else {
        val = false;
      }
    }
    super(val, kwargs);
  }

  get attr_if() {
    return new IfOperation(this);
  }

  data() {
    return this.value;
  }

  toString() {
    return `ElegantBoolean(${this.value})`;
  }
}


export class ElegantNumber extends Atom {

  constructor(val, kwargs={}) {
    if (typeof val === "string") {
      const bytes = val.split(" ").map(byte => parseInt(byte, 16));
      if (kwargs["number_type"] === "int") {
        val = Number(new BigInt64Array(new Uint8Array(bytes.reverse()).buffer)[0]);
      }
      if (kwargs["number_type"] === "float") {
        val = Number(new Float64Array(new Uint8Array(bytes.reverse()).buffer)[0]);
      }
    }
    super(val, kwargs);
  }

  get attr_add() {
    return new ElegantNumberOperation(this, "add");
  }

  get attr_sub() {
    return new ElegantNumberOperation(this, "sub");
  }

  get attr_pow() {
    return new ElegantNumberOperation(this, "pow");
  }

  get attr_mul() {
    return new ElegantNumberOperation(this, "mul");
  }

  get attr_less() {
    return new ElegantNumberOperation(this, "lt");
  }

  get attr_leq() {
    return new ElegantNumberOperation(this, "le");
  }

  get attr_eq() {
    return new ElegantNumberOperation(this, "eq");
  }

  toString() {
    return `ElegantNumber(${this.value})`;
  }

  data() {
    return this.value;
  }
}


class ElegantNumberOperation extends ElegantObject {

  constructor(num, operation) {
    super();
    this.operation = operation;
    this.num = num;
    this.attributes = ["other"];
    this.attr_other = new DataizationError();
  }

  toString() {
    return `ElegantNumberOperation(${this.num}, ${this.operation})`;
  }

  dataize() {
    let left = this.num.dataize().data();
    let right = this.attr_other.dataize().data();
    switch (this.operation) {
      case "add":
        return new ElegantNumber(left + right);
      case "sub":
        return new ElegantNumber(left - right);
      case "pow":
        return new ElegantNumber(left ** right);
      case "mul":
        return new ElegantNumber(left * right);
      case "lt":
        return new ElegantBoolean(left < right);
      case "le":
        return new ElegantBoolean(left <= right);
      case "eq":
        return new ElegantBoolean(left === right);
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


export class ElegantString extends Atom {

  constructor(val, kwargs={}) {
    if ("is_bytes" in kwargs && kwargs["is_bytes"]) {
      let bytes = val.split(" ").map(byte => parseInt(byte, 16));
      val = String.fromCharCode(...bytes);
    }
    super(val, kwargs);
  }

  data() {
    return this.value;
  }

  toString() {
    return `ElegantString(${this.value})`;
  }
}


class ElegantArrayGet extends ElegantObject {
  constructor(arr) {
    super();
    this.arr = arr;
    this.attributes = ["i"];
    this.attr_i = new DataizationError();
  }

  toString() {
    return `ElegantArrayGet(${this.arr})`;
  }

  dataize() {
    return this.arr.at(this.attr_i).dataize();
  }
}


export class ElegantArray extends Atom {
  
  constructor(kwargs={}) {
    super([], kwargs);
    this.value = [];
  }

  get attr_get() {
    return new ElegantArrayGet(this);
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
    return `ElegantArray(${content})`;
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

  constructor(kwargs={}) {
    super(kwargs);
    this.sprintf = require('sprintf-js').sprintf;
    this.attributes = ["fmt", "args"];
    this.attr_fmt = new DataizationError();
    this.attr_args = new ElegantArray();
    this.varargs = true;
  }

  toString() {
    return "Sprintf()";
  }

  dataize() {
    const fmt = this.attr_fmt.dataize().data();
    const str_data = this.sprintf(fmt, ...this.attr_args.value.map(x => x.dataize().value));
    return new ElegantString(str_data);
  }
}


export class Stdout extends Atom {
  
  constructor(kwargs={}) {
    super(null, kwargs);
    this.attributes = ["text"];
    this.attr_text = new DataizationError();
  }

  toString() {
    return "Stdout()";
  }

  dataize() {
    process.stdout.write(this.attr_text.dataize().data());
    return this;
  }
}


export class Seq extends Atom {
  
  constructor(kwargs={}) {
    super(null, kwargs);
    this.attributes = [];
    this.args = [];
  }

  toString() {
    return "Seq()";
  }

  call(arg) {
    this.args.push(arg);
    return this;
  }

  dataize() {
    for (let arg of this.args) {
      arg.dataize();
    }
    return this;
  }
}

export class EOIo {

  get attr_stdout() {
    return new Stdout();
  }

  toString() {
    return "EOIo()";
  }

  dataize() {
    return this;
  }
}

export class EOTxt {

  get attr_sprintf() {
    return new Sprintf();
  }

  toString() {
    return "EOTxt()";
  }

  dataize() {
    return this;
  }
}

export class EOEolang {

  get attr_io() {
    return new EOIo();
  }

  get attr_txt() {
    return new EOTxt();
  }

  toString() {
    return "EOEolang()";
  }

  dataize() {
    return this;
  }
}

export class EOOrg {

  get attr_eolang() {
    return new EOEolang();
  }

  toString() {
    return "EOOrg()";
  }

  dataize() {
    return this;
  }
}

export class EOQ {

  get attr_org() {
    return new EOOrg();
  }

  toString() {
    return "EOQ()";
  }

  dataize() {
    return this;
  }
}

Object.assign(ElegantNumberOperation.prototype, ApplicationMixin);
Object.assign(IfOperation.prototype, ApplicationMixin);
Object.assign(ElegantArrayGet.prototype, ApplicationMixin);
Object.assign(Sprintf.prototype, ApplicationMixin);
Object.assign(Stdout.prototype, ApplicationMixin);
