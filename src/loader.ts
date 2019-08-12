import * as path from "path";
import { Plugin } from "./plugin"

module.exports = function (content: Buffer, map: any, meta: any) {
    const callback = this.async();
    const soundId = path.basename(this.resourcePath, path.extname(this.resourcePath))

    Plugin.onReady((data) => {
        callback(null, `const Howl = require("howler").Howl;
window.$_audiosprite = window.$_audiosprite || new Howl(${ data });

class HowlAudioHelper {

    constructor(
        public id: number
    ) {}

    pause() {
        window.$_audiosprite.pause(this.id);
    }
}

module.exports = {
  play: function () {
    const id = window.$_audiosprite.play("${ soundId }");
    return new HowlAudioHelper(id);
  }
}`);
    });

}

module.exports.raw = true;
