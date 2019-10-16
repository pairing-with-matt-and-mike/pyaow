const { range, sum, zip, zipWith, unzip } = require("lodash");
const { tuple } = require("./tuple");

function matrix(rows) {
  return new Matrix(rows);
}

class Matrix {
  constructor(rows) {
    this.rows = rows.map(row => [...row]);
    this._inverse = null;
    this._transpose = null;
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
    if (this._transpose === null) {
      this._transpose = matrix(unzip(this.rows));
    }
    return this._transpose;
  }

  mul(other) {
    if (isMatrix(other)) {
      return this.mulMatrix(other);
    } else {
      // const result = matrix([[other.x, other.y, other.z, other.w]]).mulMatrix(
      //   this.transpose()
      // );
      // return tuple(...result.rows[0]);
      const a = [other.x, other.y, other.z, other.w];
      const b = this.rows;
      return tuple(
        a[0] * b[0][0] + a[1] * b[0][1] + a[2] * b[0][2] + a[3] * b[0][3],
        a[0] * b[1][0] + a[1] * b[1][1] + a[2] * b[1][2] + a[3] * b[1][3],
        a[0] * b[2][0] + a[1] * b[2][1] + a[2] * b[2][2] + a[3] * b[2][3],
        a[0] * b[3][0] + a[1] * b[3][1] + a[2] * b[3][2] + a[3] * b[3][3]
      );
    }
  }

  mulMatrix(other) {
    const a = this.rows;
    const b = other.rows;
    return matrix([
      [
        a[0][0] * b[0][0] +
          a[0][1] * b[1][0] +
          a[0][2] * b[2][0] +
          a[0][3] * b[3][0],
        a[0][0] * b[0][1] +
          a[0][1] * b[1][1] +
          a[0][2] * b[2][1] +
          a[0][3] * b[3][1],
        a[0][0] * b[0][2] +
          a[0][1] * b[1][2] +
          a[0][2] * b[2][2] +
          a[0][3] * b[3][2],
        a[0][0] * b[0][3] +
          a[0][1] * b[1][3] +
          a[0][2] * b[2][3] +
          a[0][3] * b[3][3]
      ],
      [
        a[1][0] * b[0][0] +
          a[1][1] * b[1][0] +
          a[1][2] * b[2][0] +
          a[1][3] * b[3][0],
        a[1][0] * b[0][1] +
          a[1][1] * b[1][1] +
          a[1][2] * b[2][1] +
          a[1][3] * b[3][1],
        a[1][0] * b[0][2] +
          a[1][1] * b[1][2] +
          a[1][2] * b[2][2] +
          a[1][3] * b[3][2],
        a[1][0] * b[0][3] +
          a[1][1] * b[1][3] +
          a[1][2] * b[2][3] +
          a[1][3] * b[3][3]
      ],
      [
        a[2][0] * b[0][0] +
          a[2][1] * b[1][0] +
          a[2][2] * b[2][0] +
          a[2][3] * b[3][0],
        a[2][0] * b[0][1] +
          a[2][1] * b[1][1] +
          a[2][2] * b[2][1] +
          a[2][3] * b[3][1],
        a[2][0] * b[0][2] +
          a[2][1] * b[1][2] +
          a[2][2] * b[2][2] +
          a[2][3] * b[3][2],
        a[2][0] * b[0][3] +
          a[2][1] * b[1][3] +
          a[2][2] * b[2][3] +
          a[2][3] * b[3][3]
      ],
      [
        a[3][0] * b[0][0] +
          a[3][1] * b[1][0] +
          a[3][2] * b[2][0] +
          a[3][3] * b[3][0],
        a[3][0] * b[0][1] +
          a[3][1] * b[1][1] +
          a[3][2] * b[2][1] +
          a[3][3] * b[3][1],
        a[3][0] * b[0][2] +
          a[3][1] * b[1][2] +
          a[3][2] * b[2][2] +
          a[3][3] * b[3][2],
        a[3][0] * b[0][3] +
          a[3][1] * b[1][3] +
          a[3][2] * b[2][3] +
          a[3][3] * b[3][3]
      ]
    ]);
    // const t = other.transpose();
    // return matrix(
    //   this.rows.map(rowA =>
    //     t.rows.map(rowB => sum(zipWith(rowA, rowB, (a, b) => a * b)))
    //   )
    // );
  }

  determinant() {
    return this.rows.length === 1
      ? this.at(0, 0)
      : sum(
          this.rows[0].map(
            (element, columnIndex) => element * this.cofactor(0, columnIndex)
          )
        );
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
    if (this._inverse === null) {
      const det = this.determinant();
      this._inverse = matrix(
        range(this.rows.length).map(i =>
          range(this.rows[i].length).map(j => this.cofactor(j, i) / det)
        )
      );
    }
    return this._inverse;
  }
}

function isMatrix(value) {
  return value instanceof Matrix;
}

function identity(n) {
  return matrix(range(n).map(i => range(n).map(j => (i === j ? 1 : 0))));
}

module.exports = {
  identity,
  matrix
};
