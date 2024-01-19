const path = require('path');
const fs = require('fs');
/* eslint-disable */
function generateDataServiceCode({ metadataCache, dataServiceListFile, rootContext }) {
  let codes = '/* eslint-disable */\n/**\n * 【注意】禁止手动编辑该文件，该文件由脚本自动生成\n */';
  codes += '\n\n';
  const tab = '  ';
  Object.keys(metadataCache).forEach((v, i) => {
    const value = metadataCache[v];
    if (value.dataServicePath) {
      const _path = path.relative(path.dirname(dataServiceListFile), value.dataServicePath);
      codes += `import dataServiceData${i} from "${_path.replace(/\\/g, '/')}";\n`;
    }
  });
  codes += '\n';
  codes += 'export default {\n';
  Object.keys(metadataCache).forEach((v, i, arr) => {
    const value = metadataCache[v];
    if (value.dataServicePath) {
      const key = (`"${value.dataServicePath}"` || '').replace(rootContext, '').replace(/\\/g, '/');
      codes += tab + key + ': dataServiceData' + i + ',\n';
    }
  });
  codes += '};\n';
  // console.log(codes);
  fs.writeFile(dataServiceListFile, codes, err => {
    if (err) {
      console.error(err);
    }
  });
}

exports.generateDataServiceCode = generateDataServiceCode;
