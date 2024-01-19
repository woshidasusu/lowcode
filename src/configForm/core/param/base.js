import CoreProcessor from "../index";
export default class BaseParam {
  coreProcessor = new CoreProcessor();
  param;

  constructor(coreProcessor, param) {
    this.coreProcessor = coreProcessor;
    this.param = param;
  }

  async exec() {}

  log(...args) {
    if (window.__debug_log__) {
      console.log(`[param/${this.param.type}]`, ...args);
    }
  }

  getQuery(name = null, url = location.href, queryStr = null, unxss = false, undecode = false) {
    const searchArr = url.split("?");
    const str = queryStr || searchArr[1];
    if (!str) return name ? undefined : {};

    let tempArr, temp;
    const obj = {};
    const arr = str.split("&");
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      try {
        tempArr = arr[i].split("=");
        if (tempArr.length === 2) {
          temp = undecode ? tempArr[1] : decodeURIComponent(tempArr[1]);
          obj[tempArr[0]] = unxss ? temp : /*xss(temp)*/ temp;
        }
      } catch (e) {
        console.error("[getQuery]", e);
      }
    }

    return name ? obj[name] : obj;
  }
}
