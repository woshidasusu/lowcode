/* eslint-disable */
function getAttr(str, attr) {
  const reg = new RegExp(`${attr}=[",'](.*?)[",']`);
  const find = str.match(reg);
  if (find) {
    return find[1] || '';
  }
  return '';
}

exports.getAttr = getAttr;
