const {pointLight} = require("../light");
const {color, point} = require("../tuple");

test("a point light has a position and intensity", () => {
    const intensity = color(1, 1, 1);
    const position = point(0, 0, 0);
    const light = pointLight(position, intensity);
    expect(light.position).toEqual(position);
    expect(light.intensity).toEqual(intensity);
});
