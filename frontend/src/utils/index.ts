/**
 * @file 通用工具库
 */

export const getScrollTop = (): number => {
  const pageYOffset: number = window.pageYOffset;
  const documentElementScrollTop: number = document.documentElement.scrollTop;
  const documentBodyScrollTop: number = document.body.scrollTop;
  return (pageYOffset || pageYOffset === 0)
    ? pageYOffset
    : (documentElementScrollTop || documentElementScrollTop === 0)
      ? documentElementScrollTop
      : (documentBodyScrollTop || documentBodyScrollTop === 0)
        ? documentBodyScrollTop
        : 0
};
