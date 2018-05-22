'use strict';

import {TimeStruct} from '../extension/lib/time';

export interface Stopwatch {
	state: StopwatchStateEnum;
	time: {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
		milliseconds: number;
		formatted: string;
		raw: number;
		timestamp: number;
	};
	results: (StopwatchResult | null)[];
}

export interface StopwatchResult {
	time: TimeStruct;
	place: number;
	forfeit: boolean;
}

export enum StopwatchStateEnum {
	NOT_STARTED = 'not_started',
	RUNNING = 'running',
	PAUSED = 'paused',
	FINISHED = 'finished'
}
