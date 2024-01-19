// 2021-12-23： TODO 由于没有精力维护脚本，该脚本已不足以满足现有的配置化使用场景了，目前配置文件手动维护，不通过脚本生成了，后续再改造脚本吧

/* eslint-disable */
const path = require('path');
const { getAttr } = require('./get-attr');
const { generateMetadataCode } = require('./generate-metadata-code');
const { generateDataServiceCode } = require('./generate-dataservice-code');
const { getOptions } = require('loader-utils');

// console.log(path);
// console.log(fs);

const metadataCache = {};

module.exports = function(source) {
  const loaderContext = this;
  const { resourceQuery, resourcePath } = loaderContext;

  if (
    resourceQuery.indexOf('type=template') > -1 &&
    source.indexOf('<config-form') > -1 &&
    resourcePath.indexOf('configForm') === -1
  ) {
    console.log('=============start==============================>');
    const options = getOptions(loaderContext);
    const metadataListFilePath = path.resolve(options.metadataListFile);
    const dataServiceListFile = path.resolve(options.dataServiceListFile);
    console.log('metadataListFilePath =>', metadataListFilePath);
    console.log('dataServiceListFile =>', dataServiceListFile);
    let { resourcePath, rootContext } = loaderContext;
    resourcePath = path.resolve(resourcePath);
    rootContext = path.resolve(rootContext);
    // 获取 codePath
    const codePath = resourcePath.replace(rootContext, '');

    // 获取 code
    let str = source.substr(source.indexOf('<config-form'));
    str = str.substring(0, str.indexOf('>') + 1);
    const code = getAttr(str, 'code') || '';

    // 获取 metadataPath
    str = source.substr(source.indexOf('import metadata from'));
    str = str.substring(0, str.indexOf('\n'));
    str = str.match(/['|"](.*)['|"]/);
    str = str && str[1];
    let metadataPath = '';
    if (str) {
      metadataPath = path.resolve(path.dirname(resourcePath), str);
    }

    // 获取 dataServiceData
    str = source.substr(source.indexOf('import dataServiceData from'));
    str = str.substring(0, str.indexOf('\n'));
    str = str.match(/['|"](.*)['|"]/);
    str = str && str[1];
    let dataServicePath = '';
    if (str) {
      dataServicePath = path.resolve(path.dirname(resourcePath), str);
    }

    const info = {
      code,
      codePath,
      metadataPath,
      dataServicePath
    };
    metadataCache[info.code || info.codePath] = info;
    console.log(info);
    // console.log(metadataCache);

    // 自动生成代码
    generateMetadataCode({ metadataCache, metadataListFilePath, rootContext });
    generateDataServiceCode({ metadataCache, dataServiceListFile, rootContext });
  }
  return source;
};
