import common from './common';
import CoreProcessor from '../index';

export default class DataService {
  coreProcessor = new CoreProcessor();
  services;

  constructor(coreProcessor, services) {
    this.coreProcessor = coreProcessor;
    this.services = { ...common, ...services };
  }

  async exec(name, args) {
    if (this.services[name]) {
      if (typeof this.services[name] === 'function') {
        if (args && typeof args === 'string') {
          args = { args };
        }
        return await this.services[name]({ context: this.coreProcessor, dataService: this, ...args });
      } else {
        return this.services[name];
      }
    }
  }

  add(name, service) {
    if (name && service) {
      this.services[name] = service;
    }
  }

  remove(name) {
    if (this.services[name]) {
      this.services[name] = '';
      delete this.services[name];
    }
  }

  getServices() {
    return this.services;
  }
}
