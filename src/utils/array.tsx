

export const inGroupOf = <T,>(source: T[], n: number): T[][] => {
  let arr = [];
  for (let i = 0; i < source.length; i += n) {
    arr.push(source.slice(i, i + n));
  }
  return arr;
};
