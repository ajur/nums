const _a = document.createElement("a");

export const getAbsoluteUrl = (url: string): string => {
  _a.href = url;
  return _a.href;
};
