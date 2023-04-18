/**
 * Class Object
 */
class Object {

  /**
   * Phi attribute
   * @type { Object } 
   */
  attr__phi;

  dataize() {
    return this.attr__phi.dataize();
  }
}
// TODO: Add type annotations
// TODO: Add Class ApplicationMixin
// TODO: Add Class Attribute
// TODO: Add operations


class Atom extends Object {

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


class DataizationError extends Object {

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

class Sprintf extends Object { // TODO: Add ApplicationMixin
  
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
