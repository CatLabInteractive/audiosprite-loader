"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var audiosprite = require("audiosprite");
var fs = require("fs");
var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
    }
    Deferred.prototype.then = function (func) {
        return this.promise.then(func);
    };
    Deferred.prototype.catch = function (func) {
        return this.promise.catch(func);
    };
    return Deferred;
}());
exports.Deferred = Deferred;
var Plugin = /** @class */ (function () {
    function Plugin(options) {
        if (options === void 0) { options = {}; }
        this.files = [];
        if (!options.format) {
            options.format = "howler2";
        }
        if (!options.output) {
            options.output = "audiosprite";
        }
        this.options = options;
    }
    Plugin.onReady = function (callback) {
        this.onReadyCallbacks.push(callback);
    };
    Plugin.prototype.apply = function (compiler) {
        var _this = this;
        // Setup callback for accessing a compilation:
        compiler.plugin("compilation", function (compilation) {
            _this.generateDeferred = new Deferred();
            _this.generateDeferred.then(function (data) {
                Plugin.onReadyCallbacks.map(function (callback) { return callback(data); });
            });
            Plugin.onReadyCallbacks = [];
            compilation.plugin("normal-module-loader", function (context, module) {
                if (module.loaders &&
                    module.loaders.filter(function (l) { return l.loader.indexOf("audiosprite-loader/lib/loader.js") >= 0; }).length > 0) {
                    _this.enqueueFileForGeneration(compilation, module.userRequest, 100);
                }
            });
        });
    };
    Plugin.prototype.enqueueFileForGeneration = function (compilation, filename, accumulateInterval) {
        var _this = this;
        if (this.generateTimeout)
            clearTimeout(this.generateTimeout);
        this.files.push(filename);
        this.generateTimeout = setTimeout(function () {
            audiosprite(_this.files, _this.options, function (err, result) {
                if (err)
                    return console.error(err);
                // read and add audio files as compilation assets
                // generated files will be removed from the filesystem
                Promise.all([
                    _this.addCompilationAsset(compilation, _this.options.output + ".mp3"),
                    _this.addCompilationAsset(compilation, _this.options.output + ".ogg"),
                    _this.addCompilationAsset(compilation, _this.options.output + ".ac3"),
                    _this.addCompilationAsset(compilation, _this.options.output + ".m4a"),
                ]).then(function () {
                    _this.generateDeferred.resolve(JSON.stringify(result));
                });
            });
        }, accumulateInterval);
    };
    Plugin.prototype.addCompilationAsset = function (compilation, filename) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filename, function (err, buffer) {
                if (err)
                    console.error(err);
                compilation.assets[filename] = {
                    source: function () { return buffer; },
                    size: function () { return buffer.length; }
                };
                fs.unlink(filename, function (err) { if (err)
                    console.log(err); });
                resolve();
            });
        });
    };
    Plugin.prototype.isHotUpdateCompilation = function (assets) {
        return assets.js.length && assets.js.every(function (name) {
            return /\.hot-update\.js$/.test(name);
        });
    };
    Plugin.onReadyCallbacks = [];
    return Plugin;
}());
exports.Plugin = Plugin;
