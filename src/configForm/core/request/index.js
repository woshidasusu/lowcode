// import http from "@src/http";

const http = {
  $POST: async (...args) => {
    console.error(...args);
    return {};
  },
  $GET: async (...args) => {
    console.error(...args);
    return {};
  }
};

/**
 * 发起请求
 * @param {methos = 'get', url, params, dataKey = 'data'}
 * @returns
 */
export default async function request({ method = "get", url, params, dataKey = "data" }) {
  let res = {};
  try {
    if (method === "post") {
      res = await http.$POST(url, params);
    } else {
      res = await http.$GET(url, params);
    }
  } catch (error) {
    console.error(error);
  }
  if (res.errcode === 0 && dataKey !== "") {
    const dataKeys = dataKey.split(".");
    let result = res;
    while (dataKeys.length > 0) {
      if (result == null) {
        console.error("[request]", dataKey + " 读取异常，请检查数据结构");
        break;
      }
      const key = dataKeys.shift();
      result = result[key];
    }
    return result;
  }
  if (res.errcode != null) {
    return res;
  }
  return "";
}

// 获取配置化表单的元数据
// code 必填 string 模板code
// version 选填 string 版本（不填时默认拉取最新）
export function fetchFormMetadata(params) {
  return http.$GET("common-api/template/get-template", params);
}

// post 提交
export function submit(url, params) {
  const headers = { "Content-Type": "application/json;charset=UTF-8" };
  return http.$POST(url, params, { headers });
}

// 更新表单元数据
export function saveTemplateData(data) {
  const headers = { "Content-Type": "application/json;charset=UTF-8" };
  return http.$POST("common-api/template/save", data, { headers });
}

export function getMetadataList(params) {
  return http.$GET("common-api/template/list", params);
}

// 启用
export function enableTemplate(data) {
  return http.$GET("common-api/template/enable", data);
}
