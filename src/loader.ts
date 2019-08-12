import * as path from "path";
import { Plugin } from "./plugin"

module.exports = function (content: Buffer, map: any, meta: any) {
    const callback = this.async();
    const soundId = path.basename(this.resourcePath, path.extname(this.resourcePath))

    Plugin.onReady((data) => {
        callback(null, `var Howl = require("howler").Howl;
window.$_audiosprite = window.$_audiosprite || new Howl(${ data });

var HowlAudioHelper = function(id) {
    this.id = id;
}

const availableMethods = [ 'pause' ];
availableMethods.forEach(function(methodName) {
    HowlAudioHelper.prototype[methodName] = function() {
        var args = [];
        args.push(this.id);
        Array.prototype.push.apply(args, arguments);
        window.$_audiosprite[methodName].apply(this, args);
    }
});

module.exports = {
  play: function () {
    const id = window.$_audiosprite.play("${ soundId }");
    return new HowlAudioHelper(id);
  }
}`);
    });

};

module.exports.raw = true;
