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

const availableMethods = [ 
    'play:0', 'pause:0', 'stop:0', 'mute:1', 
    'volume:0', 'fade:3', 'rate:1', 'seek:1',
    'loop:1', 'state:0', 'playing:0', 'duration:0',
    'on:2', 'once:2', 'off:2', 'load:0', 'unload:0' 
];
    
availableMethods.forEach(function(method) {
    var parts = method.split(':');
    var methodName = parts[0];
    var minParameterCount = parts[1];

    HowlAudioHelper.prototype[methodName] = function() {
        var args = [];
        Array.prototype.push.apply(args, arguments);
        
        while (args.length < minParameterCount) {
            args.push(undefined);
        }
        
        args.push(this.id);
        
        console.log('howler callback', methodName, args);
        return window.$_audiosprite[methodName].apply(window.$_audiosprite, args);
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
