"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var plugin_1 = require("./plugin");
module.exports = function (content, map, meta) {
    var callback = this.async();
    var soundId = path.basename(this.resourcePath, path.extname(this.resourcePath));
    plugin_1.Plugin.onReady(function (data) {
        callback(null, "const Howl = require(\"howler\").Howl;\nwindow.$_audiosprite = window.$_audiosprite || new Howl(" + data + ");\n\nclass HowlAudioHelper {\n\n    constructor(\n        public id: number\n    ) {}\n\n    pause() {\n        window.$_audiosprite.pause(this.id);\n    }\n}\n\nmodule.exports = {\n  play: function () {\n    const id = window.$_audiosprite.play(\"" + soundId + "\");\n    return new HowlAudioHelper(id);\n  }\n}");
    });
};
module.exports.raw = true;
