const {identity, matrix} = require('../matrix');
const {point} = require('../tuple');

test('contructing and inspecting a 4x4 matrix', () => {
    const m = matrix([
        [1, 2, 3, 4],
        [5.5, 6.5, 7.5, 8.5],
        [9, 10, 11, 12],
        [13.5, 14.5, 15.5, 16.5]
    ]);

    expect(m.at(0, 0)).toBe(1);
    expect(m.at(0, 3)).toBe(4);
    expect(m.at(1, 0)).toBe(5.5);
    expect(m.at(1, 2)).toBe(7.5);
    expect(m.at(2, 2)).toBe(11);
    expect(m.at(3, 0)).toBe(13.5);
    expect(m.at(3, 2)).toBe(15.5);
});

test('matrix equality with identical matrices', () => {
    const rows = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6],
        [4, 5, 6, 7],
    ];

    const a = matrix(rows);
    const b = matrix(rows);
    rows[0][0] = 9;
    const c = matrix(rows);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
});

test('multiplying two matrices', () => {

    const a = matrix([
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6],
        [4, 5, 6, 7],
    ]);
    const b = matrix([
        [0, 1, 2, 4],
        [1, 2, 4, 8],
        [2, 4, 8, 16],
        [8, 8, 16, 32],
    ]);
    const c = matrix([
        [40, 49, 98, 196],
        [51, 64, 128, 256],
        [62, 79, 158, 316],
        [73, 94, 188, 376],
    ]);

    expect(a.mul(b)).toEqual(c);
});

test('a matrix multiplied by a tuple', () => {
    const A = matrix([
        [1, 2, 3, 4],
        [2, 4, 4, 2],
        [8, 6, 4, 1],
        [0, 0, 0, 1]
    ]);

    const b = point(1, 2, 3);
    expect(A.mul(b)).toEqual(point(18, 24, 33));
});

test('multiplying a matrix by the identity', () => {
    const A = matrix([
        [1, 2, 3, 4],
        [2, 4, 4, 2],
        [8, 6, 4, 1],
        [0, 0, 0, 1]
    ]);

    expect(A.mul(identity(4))).toEqual(A);
});

test('transposing a matrix', () => {
    const A = matrix([
        [0, 9, 3, 0],
        [9, 8, 0, 8],
        [1, 8, 5, 3],
        [0, 0, 5, 8]
    ]);

    const At = matrix([
        [0, 9, 1, 0],
        [9, 8, 8, 0],
        [3, 0, 5, 5],
        [0, 8, 3, 8]
    ]);

    expect(A.transpose()).toEqual(At);
});

test('calculating the determinant of a 2x2 matrix', () => {
    const A = matrix([
        [1, 5],
        [-3 , 2]
    ]);

    expect(A.determinant()).toBe(17);
});

test('a submatrix of a 3x3 matrix is a 2x2 matrix', () => {
    const A = matrix([
        [1, 5, 0],
        [-3, 2, 7],
        [0, 6, -3],
    ]);
    const E = matrix([
        [-3, 2],
        [0, 6]
    ]);
    expect(A.submatrix(0, 2)).toEqual(E);
});

test('a submatrix of a 4x4 matrix is a 3x3 matrix', () => {
    const A = matrix([
        [-6, 1, 1, 6],
        [-8, 5, 8, 6],
        [-1, 0, 8, 2],
        [-7, 1,-1, 1],
    ]);
    const E = matrix([
        [-6, 1, 6],
        [-8, 8, 6],
        [-7, -1, 1]
    ]);
    expect(A.submatrix(2, 1)).toEqual(E);
});

test('calculating a minor of a 3x3 matrix', () => {
    const A = matrix([
        [3, 5, 0],
        [2, -1, -7],
        [6, -1, 5],
    ]);

    expect(A.minor(1, 0)).toBe(25);
});

test('calculating a cofactor of a 3x3 matrix', () => {
    const A = matrix([
        [3, 5, 0],
        [2, -1, -7],
        [6, -1, 5]
    ]);

    expect(A.minor(0, 0)).toBe(-12);
    expect(A.cofactor(0, 0)).toBe(-12);
    expect(A.minor(1, 0)).toBe(25);
    expect(A.cofactor(1, 0)).toBe(-25);
});

test('calculating the determinant of a 3x3 matrix', () => {
    const A = matrix([
        [ 1, 2,  6],
        [-5, 8, -4],
        [ 2, 6,  4],
    ]);
    expect(A.cofactor(0, 0)).toBe(56);
    expect(A.cofactor(0, 1)).toBe(12);
    expect(A.cofactor(0, 2)).toBe(-46);
    expect(A.determinant()).toBe(-196);
});

test('calculating the determinant of a 4x4 matrix', () => {
    const A = matrix([
        [-2, -8,  3,  5],
        [-3,  1,  7,  3],
        [ 1,  2, -9,  6],
        [-6,  7,  7, -9],
    ]);
    expect(A.cofactor(0, 0)).toBe(690);
    expect(A.cofactor(0, 1)).toBe(447);
    expect(A.cofactor(0, 2)).toBe(210);
    expect(A.cofactor(0, 3)).toBe(51);
    expect(A.determinant()).toBe(-4071);
});

test('testing an invertible matrix for invertibility', () => {
    const A = matrix([
        [6, 4, 4, 4],
        [5, 5, 7, 6],
        [4, -9, 3, -7],
        [9, 1, 7, -6],
    ]);
    expect(A.determinant()).toBe(-2120);
    expect(A.isInvertible()).toBe(true);
});

test('testing a non invertible matrix for invertibility', () => {
    const A = matrix([
        [-4, 2, -2, 3],
        [9, 6, 2, 6],
        [0, -5, 1, -5],
        [0, 0, 0, 0],
    ]);
    expect(A.determinant() === 0).toBe(true);
    expect(A.isInvertible()).toBe(false);
});


test('calculating the inverse of a matrix', () => {
    const A = matrix([
        [-5, 2, 6, -8],
        [1, -5, 1, 8],
        [7, 7, -6, -7],
        [1, -3, 7, 4],
    ]);

// And B ← inverse(A) Then determinant(A) = 532
// And cofactor(A, 2, 3) = -160 And B[3,2] = -160/532
    // And cofactor(A, 3, 2) = 105 And B[2,3] = 105/532
    const B = matrix([
        [ 0.21805,  0.45113,  0.24060, -0.04511],
        [-0.80827, -1.45677, -0.44361,  0.52068],
        [-0.07895, -0.22368, -0.05263,  0.19737],
        [-0.52256, -0.81391, -0.30075,  0.30639]
    ]);
    expect(A.inverse().equals(B, 0.00001)).toBe(true);
});

test('multiplying a matrix by its inverse', () => {
    const A = matrix([
        [3, -9, 7, 3],
        [3, -8, 2, -9],
        [-4, 4, 4, 1],
        [-6, 5, -1, 1],
    ]);
    const B = matrix([
        [8, 2, 2, 2],
        [3, -1, 7, 0],
        [7, 0, 5, 4],
        [6, -2, 0, 5],
    ]);
    expect(A.mul(B).mul(B.inverse()).equals(A, 0.00001)).toBe(true);
    expect(A.mul(A.inverse()).equals(identity(4), 0.00001)).toBe(true);
    expect(identity(4).inverse().equals(identity(4))).toBe(true);
    expect(A.transpose().inverse().equals(A.inverse().transpose(), 0.00001)).toBe(true);
});
