import CoreProcessor from "../index";

export default class BaseDataSource {
  coreProcessor = new CoreProcessor();
  dataSource;
  eventData;

  constructor(coreProcessor, dataSource, extraArgs) {
    this.coreProcessor = coreProcessor;
    this.dataSource = dataSource;
    this.eventData = extraArgs.eventData;
  }

  async exec() {}

  log(...args) {
    if (window.__debug_log__) {
      console.log(`[dataSource/${this.dataSource.type}]`, ...args);
    }
  }

  // 拿到数据后调用指定 service 来解析数据源，没配置直接返回数据
  async parseDataAfterFetched(data) {
    const { parseServiceName } = this.dataSource;
    if (parseServiceName) {
      const dataService = this.coreProcessor.getDataService();
      const result = await dataService.exec(parseServiceName, { $event: data });
      return result;
    }
    return data;
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
