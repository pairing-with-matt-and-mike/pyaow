const {matrix} = require("./matrix");

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

module.exports = {
    π: Math.PI,
    rotationX,
    rotationY,
    rotationZ,
    scaling,
    shearing,
    translation
};
