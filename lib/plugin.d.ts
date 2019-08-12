export declare class Deferred {
    promise: Promise<any>;
    reject: Function;
    resolve: Function;
    constructor();
    then(func: (value: any) => any): Promise<any>;
    catch(func: (value: any) => any): Promise<any>;
}
export declare class Plugin {
    options: any;
    files: string[];
    generateTimeout: any;
    generateDeferred: Deferred;
    static onReadyCallbacks: any[];
    static onReady(callback: any): void;
    constructor(options?: any);
    apply(compiler: any): void;
    enqueueFileForGeneration(compilation: any, filename: any, accumulateInterval: any): void;
    addCompilationAsset(compilation: any, filename: string): Promise<{}>;
    isHotUpdateCompilation(assets: any): any;
}
