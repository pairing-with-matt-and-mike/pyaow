const fs = require("fs");

const { canvas } = require("../canvas");
const { hit } = require("../intersections");
const { pointLight } = require("../light");
const { material } = require("../material");
const { ray } = require("../rays");
const { sphere } = require("../sphere");
const { color, neg, normalise, point, sub, vector } = require("../tuple");
const { scaling, translation } = require("../transformation");

test("the default material", () => {
  const m = material();
  expect(m.color).toEqual(color(1, 1, 1));
  expect(m.ambient).toEqual(0.1);
  expect(m.diffuse).toEqual(0.9);
  expect(m.specular).toEqual(0.9);
  expect(m.shininess).toEqual(200);
});

test("a sphere has a default material", () => {
  expect(sphere().material).toEqual(material());
});

test("a sphere may be assigned a material", () => {
  const s = sphere();
  const m = material();
  m.ambient = 123;
  s.material = m;
  const me = material();
  me.ambient = 123;
  expect(s.material).toEqual(me);
});

const m = material();
const position = point(0, 0, 0);

test("lighting with the eye between the light and the surface", () => {
  const eyev = vector(0, 0, -1);
  const normalv = vector(0, 0, -1);
  const light = pointLight(point(0, 0, -10), color(1, 1, 1));
  const result = m.lighting(light, position, eyev, normalv);
  expect(result.equals(color(1.9, 1.9, 1.9), 0.000001)).toBe(true);
});

test("lighting with the eye between light and surface, eye offset 45°", () => {
  const eyev = vector(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
  const normalv = vector(0, 0, -1);
  const light = pointLight(point(0, 0, -10), color(1, 1, 1));
  const result = m.lighting(light, position, eyev, normalv);
  expect(result).toEqual(color(1.0, 1.0, 1.0));
});

test("lighting with eye opposite surface, light offset 45°", () => {
  const eyev = vector(0, 0, -1);
  const normalv = vector(0, 0, -1);
  const light = pointLight(point(0, 10, -10), color(1, 1, 1));
  const result = m.lighting(light, position, eyev, normalv);
  expect(result.equals(color(0.7364, 0.7364, 0.7364), 0.0001)).toBe(true);
});

test("lighting with eye in the path of the reflection vector", () => {
  const eyev = vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
  const normalv = vector(0, 0, -1);
  const light = pointLight(point(0, 10, -10), color(1, 1, 1));
  const result = m.lighting(light, position, eyev, normalv);
  expect(result.equals(color(1.6364, 1.6364, 1.6364), 0.0001)).toBe(true);
});

test("Lighting with the light behind the surface", () => {
  const eyev = vector(0, 0, -1);
  const normalv = vector(0, 0, -1);
  const light = pointLight(point(0, 0, 10), color(1, 1, 1));
  const result = m.lighting(light, position, eyev, normalv);
  expect(result).toEqual(color(0.1, 0.1, 0.1));
});

test.skip("drawing a sphere", () => {
  // start the ray at z = -5
  const ray_origin = point(0, 0, -5);
  // put the wall at z = 10
  const wall_z = 10;
  const wall_size = 7.0;
  const canvas_pixels = 250;
  const pixel_size = wall_size / canvas_pixels;
  const half = wall_size / 2;
  const c = canvas(canvas_pixels, canvas_pixels);
  const s1 = sphere();
  const s2 = sphere();
  s1.material.color = color(1, 0.2, 1);
  s1.transform = translation(1, 0, 2).mul(scaling(1, 0.5, 1));
  s2.material.color = color(1, 1, 0.2);
  s2.transform = translation(-0.5, 0, 2); //.mul(scaling(1, 0.5, 1));

  const lightPosition = point(-10, 10, -10);
  const lightColor = color(1, 1, 1);
  const light = pointLight(lightPosition, lightColor);

  // for each row of pixels in the canvas
  for (let y = 0; y < canvas_pixels; y++) {
    // compute the world y coordinate (top = +half, bottom = -half)
    const world_y = half - pixel_size * y; // for each pixel in the row
    for (let x = 0; x < canvas_pixels; x++) {
      // compute the world x coordinate (left = -half, right = half)
      const world_x = -half + pixel_size * x;
      // describe the point on the wall that the ray will target
      const position = point(world_x, world_y, wall_z);
      const r = ray(ray_origin, normalise(sub(position, ray_origin)));
      const xs = [...s1.intersect(r), ...s2.intersect(r)];
      const h = hit(xs);
      if (h) {
        const point = r.position(h.t);
        const eye = neg(r.direction);
        const normal = h.object.normalAt(point);
        const color = h.object.material.lighting(light, point, eye, normal);
        c.setPixel(x, y, color);
      }
    }
  }

  fs.writeFileSync("3dSphere.ppm", c.toPpm(), "utf-8");
});
