"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var plugin_1 = require("./plugin");
module.exports = function (content, map, meta) {
    var callback = this.async();
    var soundId = path.basename(this.resourcePath, path.extname(this.resourcePath));
    plugin_1.Plugin.onReady(function (data) {
        callback(null, "var Howl = require(\"howler\").Howl;\nwindow.$_audiosprite = window.$_audiosprite || new Howl(" + data + ");\n\nvar HowlAudioHelper = function(id) {\n    this.id = id;\n}\n\nconst availableMethods = [ \n    'play:0', 'pause:0', 'stop:0', 'mute:1', \n    'volume:0', 'fade:3', 'rate:1', 'seek:1',\n    'loop:1', 'state:0', 'playing:0', 'duration:0',\n    'on:2', 'once:2', 'off:2', 'load:0', 'unload:0' \n];\n    \navailableMethods.forEach(function(method) {\n    var parts = method.split(':');\n    var methodName = parts[0];\n    var minParameterCount = parts[1];\n\n    HowlAudioHelper.prototype[methodName] = function() {\n        var args = [];\n        Array.prototype.push.apply(args, arguments);\n        \n        while (args.length < minParameterCount) {\n            args.push(undefined);\n        }\n        \n        args[parameterCount].push(this.id);\n        window.$_audiosprite[methodName].apply(window.$_audiosprite, args);\n    }\n});\n\nmodule.exports = {\n  play: function () {\n    const id = window.$_audiosprite.play(\"" + soundId + "\");\n    return new HowlAudioHelper(id);\n  }\n}");
    });
};
module.exports.raw = true;
