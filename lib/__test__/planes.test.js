const fs = require("fs");

const { camera } = require("../camera");
const { pointLight } = require("../light");
const { material } = require("../material");
const { plane } = require("../planes");
const { ray } = require("../rays");
const { sphere } = require("../sphere");
const {
  π,
  rotationX,
  rotationY,
  scaling,
  translation,
  viewTransform
} = require("../transformation");
const { color, point, vector } = require("../tuple");
const { world } = require("../world");

test("The normal of a plane is constant everywhere", () => {
  const p = plane();
  const n1 = p.localNormalAt(point(0, 0, 0));
  const n2 = p.localNormalAt(point(10, 0, -10));
  const n3 = p.localNormalAt(point(-5, 0, 150));
  expect(n1).toEqual(vector(0, 1, 0));
  expect(n2).toEqual(vector(0, 1, 0));
  expect(n3).toEqual(vector(0, 1, 0));
});

test("intersect with a ray parallel to the plane", () => {
  const p = plane();
  const r = ray(point(0, 10, 0), vector(0, 0, 1));
  const xs = p.localIntersect(r);
  expect(xs).toEqual([]);
});

test("intersect with a coplanar ray", () => {
  const p = plane();
  const r = ray(point(0, 0, 0), vector(0, 0, 1));
  const xs = p.localIntersect(r);
  expect(xs).toEqual([]);
});

test("a ray intersecting a plane from above", () => {
  const p = plane();
  const r = ray(point(0, 1, 0), vector(0, -1, 0));
  const xs = p.localIntersect(r);
  expect(xs).toEqual([
    {
      t: 1,
      object: p
    }
  ]);
});

test("a ray intersecting a plane from below", () => {
  const p = plane();
  const r = ray(point(0, -1, 0), vector(0, 1, 0));
  const xs = p.localIntersect(r);
  expect(xs).toEqual([
    {
      t: 1,
      object: p
    }
  ]);
});

test.skip("drawing balls and walls", () => {
  const floor = plane();
  floor.material = material();
  floor.material.color = color(1, 0.9, 0.9);
  floor.material.specular = 0;

  const middle = sphere();
  middle.transform = translation(-0.5, 1, 0.5);
  middle.material = material();
  middle.material.color = color(0.1, 1, 0.5);
  middle.material.diffuse = 0.7;
  middle.material.specular = 0.3;

  const right = sphere();
  right.transform = translation(1.5, 0.5, -0.5).mul(scaling(0.5, 0.5, 0.5));
  right.material = material();
  right.material.color = color(0.5, 1, 0.1);
  right.material.diffuse = 0.7;
  right.material.specular = 0.3;

  const left = sphere();
  left.transform = translation(-1.5, 0.33, -0.75).mul(
    scaling(0.33, 0.33, 0.33)
  );
  left.material = material();
  left.material.color = color(1, 0.8, 0.1);
  left.material.diffuse = 0.7;
  left.material.specular = 0.3;

  const w = world();
  w.objects = [floor, middle, right, left];
  w.light = pointLight(point(-10, 10, -10), color(1, 1, 1));

  const c = camera(800, 400, π / 3);
  c.transform = viewTransform(
    point(0, 1.5, -5),
    point(0, 1, 0),
    vector(0, 1, 0)
  );

  const image = c.render(w);

  fs.writeFileSync("balls-n-walls.ppm", image.toPpm(), "utf-8");
});
