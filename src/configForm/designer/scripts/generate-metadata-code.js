const path = require('path');
const fs = require('fs');
/* eslint-disable */
function generateMetadataCode({ metadataCache, metadataListFilePath, rootContext }) {
  let codes = '/* eslint-disable */\n/**\n * 【注意】禁止手动编辑该文件，该文件由脚本自动生成\n */';
  codes += '\n\n';
  const tab = '  ';
  Object.keys(metadataCache).forEach((v, i) => {
    const value = metadataCache[v];
    if (value.metadataPath) {
      const _path = path.relative(path.dirname(metadataListFilePath), value.metadataPath);
      codes += `import metadata${i} from "${_path.replace(/\\/g, '/')}";\n`;
    }
  });
  codes += '\n';
  codes += 'export default [\n';
  Object.keys(metadataCache).forEach((v, i, arr) => {
    const value = metadataCache[v];
    codes += tab + '{\n';
    Object.keys(value).forEach(d => {
      const _v = (`"${value[d]}"` || '').replace(rootContext, '').replace(/\\/g, '/');
      codes += tab + tab + d + ': ' + _v + ',\n';
    });
    codes += tab + tab + 'metadata' + ': ';
    codes += value.metadataPath ? 'metadata' + i : '""';
    codes += '\n';
    codes += tab + '}';
    if (i !== arr.length - 1) {
      codes += ',\n';
    }
  });
  codes += '\n];\n';
  // console.log(codes);
  fs.writeFile(metadataListFilePath, codes, err => {
    if (err) {
      console.error(err);
    }
  });
}

exports.generateMetadataCode = generateMetadataCode;
