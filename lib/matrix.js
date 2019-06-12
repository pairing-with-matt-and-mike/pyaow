const {range, sum, zip, zipWith, unzip} = require('lodash');
const {tuple} = require('./tuple');

function matrix(rows) {
    return new Matrix(rows);
}

class Matrix {
    constructor(rows) {
        this.rows = rows.map(row => [...row]);
    }

    at(rowIndex, columnIndex) {
        return this.rows[rowIndex][columnIndex];
    }

    equals(other, delta = 0) {
        for (let i = 0; i < this.rows.length; i++) {
            for (let j = 0; j < this.rows[i].length; j++) {
                if (Math.abs(this.at(i, j) - other.at(i, j)) > delta) return false;
            }
        }
        return true;
    }

    transpose() {
        return matrix(unzip(this.rows));
    }

    mul(other) {
        if (isMatrix(other)) {
            return this.mulMatrix(other);
        } else {
            const result = matrix([[
                other.x,
                other.y,
                other.z,
                other.w,
            ]]).mulMatrix(this.transpose());
            return tuple(...result.rows[0]);
        }
    }

    mulMatrix(other) {
        const t = other.transpose();

        return matrix(this.rows.map(
            rowA => t.rows.map(rowB => sum(zipWith(rowA, rowB, (a, b) => a * b))),
        ));

    }

    determinant() {
        return this.rows.length === 1 ?
            this.at(0, 0) :
            sum(this.rows[0].map(
                (element, columnIndex) => element * this.cofactor(0, columnIndex),
            ));
    }

    submatrix(rowIndex, columnIndex) {
        const rows = this.rows
              .filter((_, i) => rowIndex !== i)
              .map(row => row.filter((_, j) => columnIndex !== j));
        return matrix(rows);
    }

    minor(rowIndex, columnIndex) {
        return this.submatrix(rowIndex, columnIndex).determinant();
    }

    cofactor(rowIndex, columnIndex) {
        const multiplier = (rowIndex + columnIndex) % 2 == 0 ? 1 : -1;
        return this.minor(rowIndex, columnIndex) * multiplier;
    }

    isInvertible() {
        return this.determinant() !== 0;
    }

    inverse() {
        const det = this.determinant();
        return matrix(range(this.rows.length).map(i => range(this.rows[i].length).map(j =>
            this.cofactor(j, i) / det
        )));
    }
}

function isMatrix(value) {
    return value instanceof Matrix;
}

function identity(n) {
    return matrix(range(n).map(i => range(n).map(j => i === j ? 1 : 0)));
}

module.exports = {
    identity,
    matrix,
};
