const { material } = require("../material");
const { identity } = require("../matrix");
const { ray } = require("../rays");
const { Shape } = require("../shapes");
const { scaling, translation } = require("../transformation");
const { point, vector } = require("../tuple");

class TestShape extends Shape {
  constructor(...args) {
    super(...args);
    this.intersectCalls = [];
  }

  localIntersect(localRay) {
    this.intersectCalls.push(localRay);
    return "blah";
  }

  localNormalAt(op) {
    return vector(op.x, op.y, op.z);
  }
}

test("the default transformation", () => {
  const s = new TestShape();
  expect(s.transform).toEqual(identity(4));
});

test("Assigning a transformation", () => {
  const s = new TestShape();
  s.transform = translation(2, 3, 4);
  expect(s.transform).toEqual(translation(2, 3, 4));
});

test("a sphere has a default material", () => {
  expect(new TestShape().material).toEqual(material());
});

test("assigning a material", () => {
  const s = new TestShape();
  const m = material();
  m.ambient = 123;
  s.material = m;
  const me = material();
  me.ambient = 123;
  expect(s.material).toEqual(me);
});

test("intersecting a scaled shape with a ray", () => {
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const s = new TestShape();
  s.transform = scaling(2, 2, 2);
  const xs = s.intersect(r);
  expect(s.intersectCalls).toEqual([
    {
      origin: point(0, 0, -2.5),
      direction: vector(0, 0, 0.5)
    }
  ]);
  expect(xs).toEqual("blah");
});

test("intersecting a translated shape with a ray", () => {
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const s = new TestShape();
  s.transform = translation(5, 0, 0);
  const xs = s.intersect(r);
  expect(s.intersectCalls).toEqual([
    {
      origin: point(-5, 0, -5),
      direction: vector(0, 0, 1)
    }
  ]);
  expect(xs).toEqual("blah");
});

test("computing the normal on a translated shape", () => {
  const s = new TestShape();
  s.transform = translation(0, 1, 0);
  const n = s.normalAt(point(0, 1.70711, -0.70711));
  expect(n.equals(vector(0, 0.70711, -0.70711), 0.0001)).toBe(true);
});

test("computing the normal on a scaled shape", () => {
  const s = new TestShape();
  s.transform = scaling(1, 0.5, 1);
  const n = s.normalAt(point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
  expect(n.equals(vector(0, 0.97014, -0.24254), 0.0001)).toBe(true);
});
