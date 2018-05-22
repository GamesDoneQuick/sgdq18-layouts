'use strict';

export class Run {
	category: string = 'Any%';
	commentators: string = 'Unknown';
	console: string = 'Unknown';
	coop: boolean = false;
	estimate: string;
	id: number;
	longName: string = 'Unknown';
	name: string = 'Unknown';
	notes: string = '';
	order: number;
	pk: number;
	releaseYear: string | number | null = '';
	runners: Runner[] = [];
	setupTime: string;
	type: 'run';
	originalValues?: Partial<Run>;
}

export class Runner {
	name: string | undefined;
	stream: string | undefined;
}
