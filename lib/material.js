const {
  add,
  BLACK,
  color,
  dot,
  hadamardProduct,
  mul,
  neg,
  normalise,
  reflect,
  sub
} = require("./tuple");

function material() {
  return new Material();
}

class Material {
  constructor() {
    this.ambient = 0.1;
    this.color = color(1, 1, 1);
    this.diffuse = 0.9;
    this.shininess = 200;
    this.specular = 0.9;
  }

  lighting(light, point, eyev, normalv, options = {}) {
    const { inShadow = false } = options;
    const effectiveColor = hadamardProduct(this.color, light.intensity);
    const ambient = mul(effectiveColor, this.ambient);

    if (inShadow) {
      return ambient;
    }

    const lightv = normalise(sub(light.position, point));
    const lightDotNormal = dot(lightv, normalv);

    let diffuse;
    let specular;
    if (lightDotNormal < 0) {
      diffuse = BLACK;
      specular = BLACK;
    } else {
      diffuse = mul(effectiveColor, this.diffuse * lightDotNormal);

      const reflectv = reflect(neg(lightv), normalv);
      const reflectDotEye = Math.pow(dot(reflectv, eyev), this.shininess);

      specular =
        reflectDotEye <= 0
          ? BLACK
          : mul(light.intensity, this.specular * reflectDotEye);
    }

    return add(ambient, add(diffuse, specular));
  }
}

module.exports = {
  material
};
