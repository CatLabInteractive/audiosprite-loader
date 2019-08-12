"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var plugin_1 = require("./plugin");
module.exports = function (content, map, meta) {
    var callback = this.async();
    var soundId = path.basename(this.resourcePath, path.extname(this.resourcePath));
    plugin_1.Plugin.onReady(function (data) {
        callback(null, "var Howl = require(\"howler\").Howl;\nwindow.$_audiosprite = window.$_audiosprite || new Howl(" + data + ");\n\nvar HowlAudioHelper = function(id) {\n    this.id = id;\n}\n\nconst availableMethods = [ 'pause' ];\navailableMethods.forEach(function(methodName) {\n    HowlAudioHelper.prototype[methodName] = function() {\n        var args = [];\n        args.push(this.id);\n        Array.prototype.push.apply(args, arguments);\n        window.$_audiosprite[methodName].apply(this, args);\n    }\n});\n\nmodule.exports = {\n  play: function () {\n    const id = window.$_audiosprite.play(\"" + soundId + "\");\n    return new HowlAudioHelper(id);\n  }\n}");
    });
};
module.exports.raw = true;
