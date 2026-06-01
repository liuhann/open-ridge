(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@douyinfe/semi-ui')) :
  typeof define === 'function' && define.amd ? define(['exports', '@douyinfe/semi-ui'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RidgeSemiUI = {}, global.SemiUI));
})(this, (function (exports, semiUi) { 'use strict';

  Object.defineProperty(exports, 'Input', {
    enumerable: true,
    get: function () { return semiUi.Input; }
  });
  Object.defineProperty(exports, 'Radio', {
    enumerable: true,
    get: function () { return semiUi.Radio; }
  });

}));
