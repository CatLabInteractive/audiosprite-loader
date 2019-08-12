"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_1 = require("./plugin");
exports.Plugin = plugin_1.Plugin;
function loader(options) {
    return require.resolve("./loader") + (options ? "?" + JSON.stringify(options) : "");
}
exports.loader = loader;
