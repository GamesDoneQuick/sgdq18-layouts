/// <reference types="node" />
import { EventEmitter } from 'events';
import * as CasparCG from 'casparcg-connection';
export declare function play(filename: string): Promise<void>;
export declare function info(): Promise<CasparCG.Command.IAMCPCommand>;
export declare function loadbgAuto(filename: string): Promise<CasparCG.Command.IAMCPCommand>;
export declare function clear(doResetState?: boolean): Promise<void>;
export declare function stop(): Promise<void>;
export declare function resetState(): void;
export declare const replicants: {
    files: any;
};
export declare const oscEvents: EventEmitter;
