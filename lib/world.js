const { flatMap, sortBy } = require("lodash");
const { hit } = require("./intersections");
const { pointLight } = require("./light");
const { ray } = require("./rays");
const { sphere } = require("./sphere");
const { scaling } = require("./transformation");
const { BLACK, color, normalise, point, sub } = require("./tuple");

function defaultWorld() {
  const w = world();

  w.light = pointLight(point(-10, 10, -10), color(1, 1, 1));

  const s1 = sphere();
  s1.material.color = color(0.8, 1.0, 0.6);
  s1.material.diffuse = 0.7;
  s1.material.specular = 0.2;
  const s2 = sphere();
  s2.transform = scaling(0.5, 0.5, 0.5);
  w.objects = [s1, s2];

  return w;
}

function world() {
  return new World();
}

class World {
  constructor() {
    this.objects = [];
  }

  colorAt(ray) {
    let h = hit(this.intersect(ray));
    if (!h) {
      return BLACK;
    }

    h = h.prepare(ray);
    return this.shadeHit(h);
  }

  intersect(ray) {
    return sortBy(flatMap(this.objects, o => o.intersect(ray)), "t");
  }

  shadeHit(h) {
    const inShadow = this.isShadowed(h.point);
    return h.object.material.lighting(
      this.light,
      h.object,
      h.point,
      h.eyev,
      h.normalv,
      {
        inShadow
      }
    );
  }

  isShadowed(p) {
    const r = ray(p, sub(this.light.position, p));
    const h = hit(this.intersect(r));
    return !!(h && h.t < 1);
  }
}

module.exports = {
  defaultWorld,
  world
};
