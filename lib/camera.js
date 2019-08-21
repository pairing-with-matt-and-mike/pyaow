const { canvas } = require("./canvas");
const { identity } = require("./matrix");
const { ray } = require("./rays");
const { normalise, point, sub } = require("./tuple");

class Camera {
  constructor(hsize, vsize, fov) {
    this.hsize = hsize;
    this.vsize = vsize;
    this.fov = fov;
    this.transform = identity(4);

    const halfView = Math.tan(fov / 2);
    const aspect = hsize / vsize;
    let halfWidth;
    let halfHeight;
    if (hsize >= vsize) {
      halfWidth = halfView;
      halfHeight = halfView / aspect;
    } else {
      halfHeight = halfView;
      halfWidth = halfView * aspect;
    }

    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
    this.pixelSize = (halfWidth * 2) / hsize;
  }

  rayForPixel(x, y) {
    const pixelOffsetX = (x + 0.5) * this.pixelSize;
    const pixelOffsetY = (y + 0.5) * this.pixelSize;
    const worldX = this.halfWidth - pixelOffsetX;
    const worldY = this.halfHeight - pixelOffsetY;
    const worldP = point(worldX, worldY, -1);
    const ti = this.transform.inverse();
    const transformedP = ti.mul(worldP);
    const origin = ti.mul(point(0, 0, 0));
    const direction = normalise(sub(transformedP, origin));
    return ray(origin, direction);
  }

  render(world) {
    const c = canvas(this.hsize, this.vsize);
    for (let x = 0; x < this.hsize; x++) {
      for (let y = 0; y < this.vsize; y++) {
        const r = this.rayForPixel(x, y);
        c.setPixel(x, y, world.colorAt(r));
      }
    }

    return c;
  }
}

function camera(hsize, vsize, fov) {
  return new Camera(hsize, vsize, fov);
}

module.exports = {
  camera
};
