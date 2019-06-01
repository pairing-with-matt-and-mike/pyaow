const fs = require("fs");
const {canvas} = require('../canvas');
const {add, color, mul, normalise, point, vector} = require('../tuple');

const black = color(0, 0, 0);

test('creating a canvas', () => {
    const c = canvas(10, 20);
    expect(c.width).toBe(10);
    expect(c.height).toBe(20);
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 20; y++) {
            expect(c.getPixel(x, y)).toEqual(color(0, 0, 0));
        }
    }
});

test('writing pixels to a canvas',  () => {
    const c = canvas(10, 20);
    const red = color(1, 0, 0);
    c.setPixel(2, 3, red);
    expect(c.getPixel(2, 3)).toEqual(red);
    expect(c.getPixel(2, 1)).toEqual(black);
    expect(c.getPixel(1, 3)).toEqual(black);
});

test('constructing the PPM header', () => {
    const c = canvas(5, 3);
    const ppm = c.toPpm().split(/\n/).slice(0, 3);
    expect(ppm).toEqual(
        ['P3',
         '5 3',
         '255']);
});

test('constructing the PPM header', () => {
    const c = canvas(5, 3);
    const c1 = color(1.5, 0, 0);
    const c2 = color(0, 0.5, 0);
    const c3 = color(-0.5, 0, 1);
    c.setPixel(0, 0, c1);
    c.setPixel(2, 1, c2);
    c.setPixel(4, 2, c3);
    const ppm = c.toPpm().split(/\n/).slice(3, 6);
    expect(ppm).toEqual(['255 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
                         '0 0 0 0 0 0 0 128 0 0 0 0 0 0 0',
                         '0 0 0 0 0 0 0 0 0 0 0 0 0 0 255']);
});

test('Splitting long lines in PPM files', () => {
    const c = canvas(10, 2);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 2; j++) {
            c.setPixel(i, j, color(1, 0.8, 0.6));
        }
    }
    const ppm = c.toPpm().split(/\n/).slice(3, 7);
    expect(ppm).toEqual([
        '255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204',
        '153 255 204 153 255 204 153 255 204 153 255 204 153',
        '255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204',
        '153 255 204 153 255 204 153 255 204 153 255 204 153']);
});

test('PPM files are terminated by a newline', () => {
    const c = canvas(5, 3);
    const ppm = c.toPpm();
    expect(ppm).toEqual(expect.stringMatching(/\n$/));
});

test('PPM rock', () => {
    function tick(world, p) {
        const position = add(p.velocity, p.position);
        const velocity = add(add(p.velocity, world.gravity), world.wind);
        return { position, velocity };
    }
    const world = {
        gravity: vector(0, -0.1, 0),
        wind: vector(-0.01, 0, 0),
    };
    let rock = {
        position: point(0, 0, 0),
        velocity: mul(normalise(vector(1, 1.8, 0)), 11.25)
    };

    const c = canvas(900, 550);

    while (rock.position.y >= 0 && rock.position.y <= 548 && rock.position.x < 899) {
        const {x, y} = rock.position;
        c.setPixel(Math.round(x), Math.round(549 - y) - 1, color(1, 0, 0));
        c.setPixel(Math.round(x) + 1, Math.round(549 - y) - 1, color(1, 0, 0));
        c.setPixel(Math.round(x) + 1, Math.round(549 - y), color(1, 0, 0));
        c.setPixel(Math.round(x), Math.round(549 - y), color(1, 0, 0));
        rock = tick(world, rock);
    }
    fs.writeFileSync("rock.ppm", c.toPpm(), "utf-8");
});
