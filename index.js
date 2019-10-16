const fs = require("fs");

const { camera } = require("./lib/camera");
const { pointLight } = require("./lib/light");
const { material } = require("./lib/material");
const { plane } = require("./lib/planes");
const { ray } = require("./lib/rays");
const { sphere } = require("./lib/sphere");
const {
  π,
  rotationX,
  rotationY,
  scaling,
  translation,
  viewTransform
} = require("./lib/transformation");
const { color, point, vector } = require("./lib/tuple");
const { world } = require("./lib/world");

function main() {
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

  fs.writeFileSync("index.ppm", image.toPpm(), "utf-8");
}

main();
