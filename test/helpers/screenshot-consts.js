'use strict';

const BUNDLE_NAME = require('../../package.json').name;

const STANDARD_DELAY = 350;
const FINISHED_DELAY = 2000;
const STANDARD_REPLICANT_PREFILLS = {
	allBids: undefined,
	allPrizes: undefined,
	currentBids: undefined,
	currentIntermission: undefined,
	currentPrizes: undefined,
	currentRun: undefined,
	'interview:names': undefined,
	recordTrackerEnabled: undefined,
	stopwatch: undefined,
	total: undefined,
	tweets: undefined
};

module.exports = {
	BUNDLE_CONFIG: {},
	WIDTH: 1600,
	HEIGHT: 900,
	TEST_CASES: [{
		route: `bundles/${BUNDLE_NAME}/graphics/break.html`,
		additionalDelay: STANDARD_DELAY,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/interview.html`,
		additionalDelay: STANDARD_DELAY,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/lttp_tracker.html`,
		additionalDelay: STANDARD_DELAY,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/omnibar.html`,
		additionalDelay: STANDARD_DELAY,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS
	}]
};

const gameplayLayoutTestCases = [{
	route: `bundles/${BUNDLE_NAME}/graphics/3ds.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/ds.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/ds_vertical.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/gameboy_1.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/gameboy_2.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/gameboy_3.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/gameboy_4.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/gba_1.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/gba_2.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/standard_1.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/standard_2.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/standard_3.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/standard_4.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/widescreen_1.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/widescreen_2.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/widescreen_4.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}, {
	route: `bundles/${BUNDLE_NAME}/graphics/widescreen_4_2.html`,
	additionalDelay: STANDARD_DELAY,
	replicantPrefills: STANDARD_REPLICANT_PREFILLS
}];

gameplayLayoutTestCases.forEach(testCase => {
	module.exports.TEST_CASES.push({
		...testCase,
		nameAppendix: 'not_started'
	}, {
		...testCase,
		nameAppendix: 'running',
		replicantPrefills: {
			...STANDARD_REPLICANT_PREFILLS,
			stopwatch: {
				state: 'running',
				time: {
					days: 0,
					hours: 1,
					minutes: 2,
					seconds: 3,
					milliseconds: 400,
					formatted: '1:02:03.4',
					raw: 3723400,
					timestamp: 1526531543450
				},
				results: [
					null,
					null,
					null,
					null
				]
			}
		}
	}, {
		...testCase,
		nameAppendix: 'finished',
		additionalDelay: FINISHED_DELAY,
		replicantPrefills: {
			...STANDARD_REPLICANT_PREFILLS,
			stopwatch: {
				state: 'finished',
				time: {
					days: 0,
					hours: 1,
					minutes: 2,
					seconds: 3,
					milliseconds: 400,
					formatted: '1:02:03.4',
					raw: 3723400,
					timestamp: 1526531543450
				},
				results: [{
					time: {
						days: 0,
						hours: 1,
						minutes: 2,
						seconds: 3,
						milliseconds: 400,
						formatted: '1:02:03.4',
						raw: 3723400,
						timestamp: 1526589137479
					},
					place: 1,
					forfeit: false
				}, {
					time: {
						days: 0,
						hours: 1,
						minutes: 2,
						seconds: 3,
						milliseconds: 400,
						formatted: '1:02:03.4',
						raw: 3723400,
						timestamp: 1526589137479
					},
					place: 2,
					forfeit: true
				}, {
					time: {
						days: 0,
						hours: 1,
						minutes: 2,
						seconds: 3,
						milliseconds: 400,
						formatted: '1:02:03.4',
						raw: 3723400,
						timestamp: 1526589137479
					},
					place: 3,
					forfeit: false
				}, {
					time: {
						days: 0,
						hours: 1,
						minutes: 2,
						seconds: 3,
						milliseconds: 400,
						formatted: '1:02:03.4',
						raw: 3723400,
						timestamp: 1526589137479
					},
					place: 4,
					forfeit: false
				}]
			}
		}
	});
});
