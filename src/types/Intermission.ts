'use strict';

export interface Ad {
	id: number;
	type: 'ad';
	name: string;
	adType: 'VIDEO' | 'IMAGE';
	filename: string;
	duration: string;
	order: number;
	suborder: number;
	sponsorName: string;
	state: {
		canStart: boolean;
		started: boolean;
		canComplete: boolean;
		completed: boolean;
		durationFrames: number;
		framesLeft: number;
		frameNumber: number;
		fps: number;
	};
}

export interface AdBreak {
	id: number;
	type: 'adBreak';
	ads: Ad[];
	order: number;
	state: {
		canStart: boolean;
		cantStartReason: string;
		started: boolean;
		canComplete: boolean;
		completed: boolean;
	};
}

export interface Interview {
	id: number;
	interviewees: string[];
	interviewers: string[];
	duration: string;
	order: number;
	subject: string;
	suborder: number;
	type: 'interview';
}

export type IntermissionContentItem = Interview | AdBreak;
