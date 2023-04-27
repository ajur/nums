import { Array2D, Array2DMapper } from "~/utils/Array2D";
import * as b64 from '~/utils/base64';


export class BoardMap {
  private board: Array2D<boolean>;
  
  private constructor(board: Array2D<boolean>) {
    if (board.width !== board.height) {
      throw new Error('BoardMap must be square');
    }
    this.board = board;
  }

  public static empty(size: number): BoardMap {
    return new BoardMap(Array2D.from(size, size, false));
  }

  public static full(size: number): BoardMap {
    return new BoardMap(Array2D.from(size, size, true));
  }
  
  public empty(): BoardMap {
    return BoardMap.empty(this.board.width);
  }

  public full(): BoardMap {
    return new BoardMap(this.board.map(() => true));
  }

  public get size(): number {
    return this.board.width;
  }

  public get(x: number, y: number): boolean {
    return this.board.get(x, y);
  }

  public set(x: number, y: number, value: boolean): BoardMap {
    return new BoardMap(this.board.with(x, y, value));
  }

  public setRect(startPos: [number, number], endPos: [number, number], value: boolean): BoardMap {
      const [x1, y1] = startPos;
      const [x2, y2] = endPos;
      const xMin = Math.max(Math.min(x1, x2), 0);
      const xMax = Math.min(Math.max(x1, x2), this.size - 1);
      const yMin = Math.max(Math.min(y1, y2), 0);
      const yMax = Math.min(Math.max(y1, y2), this.size - 1);
      const newBoard = this.board.map((v, x, y) => {
        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          return value;
        }
        return v;
      });
      return new BoardMap(newBoard);
  }

  public resize(size: number): BoardMap {
    return new BoardMap(this.board.resize(size, size, false));
  }

  public mapToArray<T>(mapper: Array2DMapper<boolean, T>): T[] {
    return this.board.map(mapper).data;
  }

  public encode(): string {
    return b64.encode(this.size) + b64.compress(this.board.data);
  }

  public static decode(str: string): BoardMap {
    const size = b64.decode(str[0]);
    const data = b64.decompress(str.slice(1)).slice(0, size * size);
    return new BoardMap(new Array2D(data, size, size));
  }
}
