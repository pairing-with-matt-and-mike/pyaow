const {flatMap, sortBy} = require('lodash');
const {hit} = require('./intersections');
const {pointLight} = require('./light');
const {sphere} = require('./sphere');
const {scaling} = require('./transformation');
const {BLACK, color, point} = require('./tuple');

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
        return sortBy(flatMap(this.objects, o => o.intersect(ray)), 't');
    }

    shadeHit(h) {
        return h.object.material.lighting(this.light, h.point, h.eyev, h.normalv);
    }
}

module.exports = {
    defaultWorld,
    world
};
