var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const abortMaps = new Map();
const setController = (cancelKey) => {
  let controller;
  if (!abortMaps.has(cancelKey)) {
    controller = new AbortController();
    abortMaps.set(cancelKey, controller);
  } else {
    controller = abortMaps.get(cancelKey);
    const { abort } = controller;
    abort.call(controller);
    controller = new AbortController();
    abortMaps.set(cancelKey, controller);
  }
  return controller;
};
const formatUrl = (url, base) => {
  try {
    return new URL(url, base || (window && window.location ? window.location.origin : "/"));
  } catch (error) {
    throw new TypeError("request url is invalid, or you can add prop like: { urlBase: 'http://localhost:8080' }");
  }
};
const praseUrlUnique = (options) => {
  const { urlUnique = "", url, urlBase } = options;
  const { host, pathname = "", search = "", href } = formatUrl(url, urlBase);
  if (urlUnique instanceof RegExp) {
    return urlUnique.test(href) ? urlUnique.toString() : void 0;
  }
  switch (urlUnique) {
    case "":
      return href;
    case "host":
      return host;
    case "path":
      return host + pathname;
    case "search":
      return host + pathname + search;
    default:
      throw new RangeError(`urlUnique is invalid: ${urlUnique}`);
  }
};
const urlUniqueListCancelKey = (options) => {
  const { urlUniqueList = [], url, urlUnique, urlBase } = options;
  const requestCancelKeyFor = praseUrlUnique(options);
  for (const _url of urlUniqueList) {
    const itemCancelKeyFor = praseUrlUnique(__spreadProps(__spreadValues({}, options), { url: _url }));
    if (requestCancelKeyFor === itemCancelKeyFor) {
      return symbolCancelKey(_url);
    }
  }
};
const urlUniqueCancelKey = (options) => {
  const cancelKeyFor = praseUrlUnique(options);
  if (cancelKeyFor) {
    return symbolCancelKey(cancelKeyFor);
  }
};
const symbolCancelKey = (cancelKey) => {
  return Symbol.for(cancelKey);
};
const errorMerge = (options, handle) => {
  const _errorHandler = options.errorHandler;
  options.errorHandler = (error) => {
    handle(error);
    if (_errorHandler) {
      _errorHandler(error);
    } else {
      throw error;
    }
  };
};
const cancelKeyCheck = (options, url) => {
  const { cancelKey, urlUnique, urlUniqueList } = options;
  if (cancelKey) {
    return symbolCancelKey(cancelKey);
  }
  if (urlUniqueList) {
    return urlUniqueListCancelKey(options);
  }
  if (urlUnique) {
    return urlUniqueCancelKey(options);
  }
};
const signalMerge = (options, cancelKey) => {
  const { signal } = setController(cancelKey);
  options.signal = signal;
  delete options.cancelKey;
  return cancelKey;
};
const umiRequestCancel = (_0, _1) => __async(this, [_0, _1], function* ({ req: { options }, req }, next) {
  const cancelKeySymbol = cancelKeyCheck(options, req.url);
  if (!cancelKeySymbol) {
    return yield next();
  }
  signalMerge(options, cancelKeySymbol);
  errorMerge(options, (error) => {
    if (error.type !== "AbortError") {
      abortMaps.delete(cancelKeySymbol);
    }
  });
  yield next();
  abortMaps.delete(cancelKeySymbol);
});
export { umiRequestCancel as default };
