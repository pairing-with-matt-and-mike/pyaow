const { identity } = require("./matrix");
const { add, sub, mul } = require("./tuple");

class Pattern {
  constructor() {
    this.transform = identity(4);
  }

  colorAtObject(object, point) {
    return this.colorAt(
      this.transform
        .inverse()
        .mul(object.transform.inverse())
        .mul(point)
    );
  }
}

class CheckersPattern extends Pattern {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }

  colorAt(point) {
    const sum = Math.floor(point.x) + Math.floor(point.y) + Math.floor(point.z);
    return sum % 2 === 0 ? this.a : this.b;
  }
}

function checkersPattern(a, b) {
  return new CheckersPattern(a, b);
}

class GradientPattern extends Pattern {
  constructor(start, end) {
    super();
    this.start = start;
    this.end = end;
    this.distance = sub(this.end, this.start);
  }

  colorAt(point) {
    const fraction = point.x % 1;
    return add(this.start, mul(this.distance, fraction));
  }
}

function gradientPattern(start, end) {
  return new GradientPattern(start, end);
}

class RingPattern extends Pattern {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }

  colorAt(point) {
    const distanceFromCenter = Math.sqrt(point.x * point.x + point.z * point.z);
    return Math.floor(distanceFromCenter) % 2 === 0 ? this.a : this.b;
  }
}

function ringPattern(a, b) {
  return new RingPattern(a, b);
}

class StripePattern extends Pattern {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }

  colorAt(point) {
    return Math.floor(point.x) % 2 === 0 ? this.a : this.b;
  }
}

function stripePattern(a, b) {
  return new StripePattern(a, b);
}

module.exports = {
  Pattern,
  checkersPattern,
  gradientPattern,
  ringPattern,
  stripePattern
};
