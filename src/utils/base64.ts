


// url safe character set for base64 encoding
const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

// encode a number as a base64 string
export const encode = (num: number): string => {
  let str = '';
  while (num > 0) {
    str += CHARSET[num % 64];
    num = Math.floor(num / 64);
  }
  return str === '' ? '0' : str;
}

// decode a base64 string to a number
export const decode = (str: string): number => {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    num += CHARSET.indexOf(str[i]) * (64 ** i);
  }
  return num;
}

// change array of booleans to encoded string
export const compress = (arr: boolean[]): string => {
  let str = '';
  for (let i = 0; i < arr.length; i += 6) {
    let num = 0;
    for (let j = 0; j < 6; j++) {
      num += (arr[i + j] ? 1 : 0) * (2 ** j);
    }
    str += encode(num);
  }
  return str;
}

// change encoded string to array of booleans
export const decompress = (str: string): boolean[] => {
  let arr = [];
  for (let i = 0; i < str.length; i++) {
    let num = decode(str[i]);
    for (let j = 0; j < 6; j++) {
      arr.push((num & (2 ** j)) > 0);
    }
  }
  return arr;
}
