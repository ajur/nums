import { inGroupOf } from "./array";

export type Array2DInitialMapper<T> = (x: number, y: number) => T;
export type Array2DMapper<T, U> = (val: T, x: number, y: number) => U;


/**
 * A 2D array implemented as a 1D array.
 */
export class Array2D<T> {
  constructor(
    public readonly data: T[],
    public readonly width: number,
    public readonly height: number
  ) {}

  public static from<T>(
    width: number,
    height: number,
    defaultValueOrMapper: T | Array2DInitialMapper<T>
  ) {
    const mapper = isArray2DMapper(defaultValueOrMapper)
      ? defaultValueOrMapper
      : () => defaultValueOrMapper;
    const data = Array.from({ length: width * height }, (_, idx) =>
      mapper(...i2xy(idx, width))
    );
    return new Array2D(data, width, height);
  }

  public get(x: number, y: number): T {
    return this.data[xy2i(x, y, this.width)];
  }

  public with(x: number, y: number, val: T): Array2D<T> {
    const d2 = [...this.data];
    d2[xy2i(x, y, this.width)] = val;
    return new Array2D(d2, this.width, d2.length / this.width);
  }

  public map<U>(mapper: Array2DMapper<T, U>): Array2D<U> {
    return new Array2D(
      this.data.map((v, i) => mapper(v, ...i2xy(i, this.width))),
      this.width,
      this.height
    );
  }

  public addRows(y: number, n: number, val: T): Array2D<T> {
    const d2 = [...this.data];
    if (n > 0) {
      y = y >= this.height ? this.height : y;
      d2.splice(
        y * this.width,
        0,
        ...Array.from({ length: n * this.width }, () => val)
      );
    }
    return new Array2D(d2, this.width, d2.length / this.width);
  }

  public removeRows(y: number, n = Infinity): Array2D<T> {
    const d2 = [...this.data];
    if (n > 0) {
      y %= this.height;
      n = Math.min(n, this.height - y);
      d2.splice(y * this.width, n * this.width);
    }
    return new Array2D(d2, this.width, d2.length / this.width);
  }

  public addCols(x: number, n: number, val: T): Array2D<T> {
    const d2 = [...this.data];
    if (n > 0) {
      x =
        x >= this.width
          ? this.width
          : x < -this.width
          ? 0
          : (this.width + x) % this.width;
      const d = Array.from({ length: n }, () => val);
      for (let y = this.height - 1; y >= 0; y--) {
        d2.splice(xy2i(x, y, this.width), 0, ...d);
      }
    }
    return new Array2D(d2, d2.length / this.height, this.height);
  }

  public removeCols(x: number, n = Infinity): Array2D<T> {
    if (n <= 0 || x >= this.width || x < -this.width) {
      return new Array2D([...this.data], this.height, this.height);
    }

    const d2: T[] = [];
    x = (this.width + x) % this.width;
    n = Math.min(n, this.width - x);

    for (let y = 0; y < this.height; y++) {
      const y0 = xy2i(0, y, this.width);
      const yx = xy2i(x, y, this.width);
      const yd = xy2i(x + n, y, this.width);
      const ye = xy2i(0, y + 1, this.width);
      d2.push(...this.data.slice(y0, yx), ...this.data.slice(yd, ye));
    }

    return new Array2D(d2, d2.length / this.height, this.height);
  }

  // resize array using addRows and addCols
  public resize(width: number, height: number, val: T): Array2D<T> {
    let a: Array2D<T> = this;
    if (width < this.width) {
      a = a.removeCols(width, this.width - width);
    } else if (width > this.width) {
      a = a.addCols(this.width, width - this.width, val);
    }
    if (height < this.height) {
      a = a.removeRows(height, this.height - height);
    } else if (height > this.height) {
      a = a.addRows(this.height, height - this.height, val);
    }
    return a;
  }

  public toString(): string {
    const strings = this.data.map((v) => "" + v);
    const maxStr = Math.max(...strings.map((v) => v.length));
    const paddedStrings = strings.map((v) => v.padStart(maxStr));
    const rows = inGroupOf(paddedStrings, this.width);

    return rows.map((row) => row.join(" ")).join("\n");
  }
}

const i2xy = (idx: number, width: number): [number, number] => [
  idx % width,
  Math.floor(idx / width),
];
const xy2i = (x: number, y: number, width: number): number => x + y * width;

function isArray2DMapper<T>(
  mapper: T | Array2DInitialMapper<T>
): mapper is Array2DInitialMapper<T> {
  return typeof mapper === "function";
}

//
// =================================================================
// TESTS
// =================================================================
//

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Array2D", () => {
    it("should be created with constructor", () => {
      const a = new Array2D([0, 0, 0, 0], 2, 2);
      expect(a).toEqual({ data: [0, 0, 0, 0], width: 2, height: 2 });
    });

    it("should be created from default value", () => {
      const a = Array2D.from(3, 3, 1);
      expect(a).toEqual({
        data: [1, 1, 1, 1, 1, 1, 1, 1, 1],
        width: 3,
        height: 3,
      });
    });

    it("should be created from maper", () => {
      const a = Array2D.from(3, 2, (x, y) => x + y);
      expect(a).toEqual({ data: [0, 1, 2, 1, 2, 3], width: 3, height: 2 });
    });

    it("should perform map transformation", () => {
      const a = Array2D.from(3, 3, 2);
      expect(a.map((v, x, y) => v * (x + y))).toEqual({
        width: 3,
        height: 3,
        // prettier-ignore
        data: [
          0, 2, 4, 
          2, 4, 6, 
          4, 6, 8,
        ],
      })
    })

    describe("column and row manipulations", () => {
      const arr = Array2D.from(5, 5, (x, y) => (x === y ? 1 : 0));

      it("adding or removeing should not change original array", () => {
        arr.removeRows(0, 1).addRows(3, 2, 0).addCols(1, 2, 0).removeCols(0, 1);
        expect(arr).toEqual({
          width: 5,
          height: 5,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1,
          ],
        });
      });

      it("should be able to add rows with value", () => {
        expect(arr.addRows(0, 1, 4)).toEqual({
          width: 5,
          height: 6,
          // prettier-ignore
          data: [ 
            4, 4, 4, 4, 4,
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1,
          ],
        });
        expect(arr.addRows(Infinity, 2, 4)).toEqual({
          width: 5,
          height: 7,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1,
            4, 4, 4, 4, 4,
            4, 4, 4, 4, 4,
          ],
        });
        expect(arr.addRows(2, 1, 4)).toEqual({
          width: 5,
          height: 6,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            4, 4, 4, 4, 4,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1,
          ],
        });
        expect(arr.addRows(-3, 1, 4)).toEqual({
          width: 5,
          height: 6,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            4, 4, 4, 4, 4,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1,
          ],
        });
      });

      it("should be able to remove rows", () => {
        expect(arr.removeRows(0, 1)).toEqual({
          width: 5,
          height: 4,
          // prettier-ignore
          data: [ 
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1,
          ],
        });
        expect(arr.removeRows(-2, 2)).toEqual({
          width: 5,
          height: 3,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
          ],
        });
        expect(arr.removeRows(2, 1)).toEqual({
          width: 5,
          height: 4,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1,
          ],
        });
        expect(arr.removeRows(1, 10)).toEqual({
          width: 5,
          height: 1,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0, 0,
          ],
        });
        expect(arr.removeRows(1)).toEqual({
          width: 5,
          height: 1,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0, 0,
          ],
        });
      });

      it("should be able to add columns", () => {
        expect(arr.addCols(0, 1, 4)).toEqual({
          width: 6,
          height: 5,
          // prettier-ignore
          data: [ 
            4, 1, 0, 0, 0, 0,
            4, 0, 1, 0, 0, 0,
            4, 0, 0, 1, 0, 0,
            4, 0, 0, 0, 1, 0,
            4, 0, 0, 0, 0, 1,
          ],
        });
        expect(arr.addCols(Infinity, 2, 4)).toEqual({
          width: 7,
          height: 5,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0, 0, 4, 4,
            0, 1, 0, 0, 0, 4, 4,
            0, 0, 1, 0, 0, 4, 4,
            0, 0, 0, 1, 0, 4, 4,
            0, 0, 0, 0, 1, 4, 4,
          ],
        });
        expect(arr.addCols(2, 1, 4)).toEqual({
          width: 6,
          height: 5,
          // prettier-ignore
          data: [ 
            1, 0, 4, 0, 0, 0,
            0, 1, 4, 0, 0, 0,
            0, 0, 4, 1, 0, 0,
            0, 0, 4, 0, 1, 0,
            0, 0, 4, 0, 0, 1,
          ],
        });
        expect(arr.addCols(-3, 1, 4)).toEqual({
          width: 6,
          height: 5,
          // prettier-ignore
          data: [ 
            1, 0, 4, 0, 0, 0,
            0, 1, 4, 0, 0, 0,
            0, 0, 4, 1, 0, 0,
            0, 0, 4, 0, 1, 0,
            0, 0, 4, 0, 0, 1,
          ],
        });
      });

      it("should be able to remove columns", () => {
        expect(arr.removeCols(0, 1)).toEqual({
          width: 4,
          height: 5,
          // prettier-ignore
          data: [ 
            0, 0, 0, 0,
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
          ],
        });
        expect(arr.removeCols(-2, 2)).toEqual({
          width: 3,
          height: 5,
          // prettier-ignore
          data: [ 
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
            0, 0, 0,
            0, 0, 0,
          ],
        });
        expect(arr.removeCols(2, 1)).toEqual({
          width: 4,
          height: 5,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
          ],
        });
        expect(arr.removeCols(1, 10)).toEqual({
          width: 1,
          height: 5,
          // prettier-ignore
          data: [ 
            1,
            0,
            0,
            0,
            0,
          ],
        });
        expect(arr.removeCols(1)).toEqual({
          width: 1,
          height: 5,
          // prettier-ignore
          data: [ 
            1,
            0,
            0,
            0,
            0,
          ],
        });
      });

      it("should be able to resize from smaller to larger", () => {
        expect(arr.resize(6, 6, 4)).toEqual({
          width: 6,
          height: 6,
          // prettier-ignore
          data: [ 
            1, 0, 0, 0, 0, 4,
            0, 1, 0, 0, 0, 4,
            0, 0, 1, 0, 0, 4,
            0, 0, 0, 1, 0, 4,
            0, 0, 0, 0, 1, 4,
            4, 4, 4, 4, 4, 4,
          ],
        });
      });
      it("should be able to resize from larger to smaller", () => {
        expect(arr.resize(3, 3, 4)).toEqual({
          width: 3,
          height: 3,
          // prettier-ignore
          data: [ 
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
          ],
        });
      });
    });
  });

  it("i2xy should return correct positions", () => {
    expect(i2xy(0, 3)).toEqual([0, 0]);
    expect(i2xy(2, 3)).toEqual([2, 0]);
    expect(i2xy(3, 3)).toEqual([0, 1]);
    expect(i2xy(3, 4)).toEqual([3, 0]);
    expect(i2xy(8, 4)).toEqual([0, 2]);
  });

  it("xy2i should return correct index", () => {
    expect(xy2i(0, 0, 3)).toBe(0);
    expect(xy2i(2, 0, 3)).toBe(2);
    expect(xy2i(0, 1, 3)).toBe(3);
    expect(xy2i(3, 0, 4)).toBe(3);
    expect(xy2i(0, 2, 4)).toBe(8);
  });
}
