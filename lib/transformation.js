const {matrix} = require("./matrix");
const {cross, normalise, sub} = require("./tuple");

function translation(x, y, z) {
    return matrix([
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1],
    ]);
}

function scaling(x, y, z) {
    return matrix([
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1],
    ]);
}


function rotationX(r) {
    return matrix([
        [1, 0, 0, 0],
        [0, Math.cos(r), -Math.sin(r), 0],
        [0, Math.sin(r), Math.cos(r), 0],
        [0, 0, 0, 1],
    ]);
}

function rotationY(r) {
    return matrix([
        [Math.cos(r), 0, Math.sin(r), 0],
        [0, 1, 0, 0],
        [-Math.sin(r), 0, Math.cos(r), 0],
        [0, 0, 0, 1],
    ]);
}

function rotationZ(r) {
    return matrix([
        [Math.cos(r), -Math.sin(r), 0, 0],
        [Math.sin(r), Math.cos(r), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]);
}

function shearing(x_y, x_z, y_x, y_z, z_x, z_y) {
    return matrix([
        [1, x_y, x_z, 0],
        [y_x, 1, y_z, 0],
        [z_x, z_y, 1, 0],
        [0, 0, 0, 1],
    ]);
}

function viewTransform(from, to, up) {
    const forward = normalise(sub(to, from));
    const upn = normalise(up);
    const left = cross(forward, upn);
    const trueUp = cross(left, forward);
    const orientation = matrix([
        [left.x, left.y, left.z, 0],
        [trueUp.x, trueUp.y, trueUp.z, 0],
        [-forward.x, -forward.y, -forward.z, 0],
        [0, 0, 0, 1],
    ]);
    return orientation.mul(translation(-from.x, -from.y, -from.z));
}

module.exports = {
    π: Math.PI,
    rotationX,
    rotationY,
    rotationZ,
    scaling,
    shearing,
    translation,
    viewTransform,
};
