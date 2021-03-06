'use strict';

const md = require('node-md-config');
const PrimePart = require('./Prime.js');
const Relic = require('./Relic.js');

/**
 * Describe a handler for creating component objects.
 * Presently, these consist of PrimeParts and Relics.
 */
class ComponentHandler {
  /**
   * @param {Object} data to construct objects with
   */
  constructor(data) {
     /**
      * Array of component objects
      * @type {Array<Item>}
      */
    this.components = [];
    const self = this;
    if (typeof data !== 'undefined' && data != null) {
      data.forEach((reliquary) => {
        const primeReg = /prime\s?parts?/i;
        const relicReg = /relics?/i;
        if (primeReg.test(reliquary.type)) {
          self.components.push(new PrimePart(reliquary));
        } else if (relicReg.test(reliquary.type)) {
          self.components.push(new Relic(reliquary));
        }
      });
    }
  }

  /**
   * String representation of the ComponentHandler
   * @returns {string} a stringified list of components created by the component handler.
   */
  toString() {
    let componentString = md.codeMulti;
    const maxLen = 4;
    const listToJoin = [];
    this.components.forEach((component) => {
      listToJoin.push(component);
    });

    componentString += listToJoin.slice(0, maxLen).join(md.doubleReturn);
    if (componentString === md.codeMulti) {
      componentString += 'Operator, no relics available for that query.';
    }
    componentString += md.blockEnd;
    return componentString;
  }

  /**
   * Array of component strings generated by this ComponentHandler
   * @returns {Array<string>}  a list of string representations of results from the query
   */
  toStringList() {
    const componentStringList = [];
    const maxLen = 4;
    this.components.forEach((component) => {
      if (!(component.type === 'Relic' && componentStringList.length >= 3)) {
        const compStr = component.toString();
        componentStringList.push(compStr);
      }
    });

    if (componentStringList.length < 1) {
      componentStringList.push('Operator, no relics available for that query.');
    }

    if (this.components.length > maxLen) {
      componentStringList.push('Your query returned more results than I can display, operator. Refine your search for more accurate results.');
    }
    return componentStringList;
  }

  /**
   * Array of components generated by this ComponentHandler
   * @returns {Array<Item>} an array of components generated by this ComponentHandler
   */
  getAll() {
    return this.components;
  }
}

module.exports = ComponentHandler;
