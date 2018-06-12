'use strict';

const path = require('path');

const BUNDLE_NAME = require('../../package.json').name;
const MAX_LOWERTHIRD_NAMES = 5;
const STANDARD_DELAY = 375;
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

const transitionBefore = function (page) {
	return page.evaluate(async () => {
		await document.querySelector('gdq-transition').waitForInit(); // eslint-disable-line no-undef
	});
};

module.exports = {
	BUNDLE_CONFIG: {},
	WIDTH: 1600,
	HEIGHT: 900,
	TEST_CASES: [{
		route: `bundles/${BUNDLE_NAME}/graphics/break.html`,
		additionalDelay: 1000,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/break.html`,
		nameAppendix: 'fanart',
		additionalDelay: 2000,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS,
		before: async page => {
			const tweet = require(path.resolve(__dirname, '../fixtures/arguments/tweet.json'));
			await page.evaluate(t => {
				return new Promise(resolve => {
					const tl = document.querySelector('gdq-break').$.fanart.playItem(t); // eslint-disable-line no-undef
					tl.call(() => {
						resolve();
					}, null, null, '+=0.03');
				});
			}, tweet);
		}
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/transition.html`,
		nameAppendix: 'initial',
		selector: 'gdq-transition',
		entranceMethodName: null,
		additionalDelay: STANDARD_DELAY,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS,
		before: transitionBefore
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/transition.html`,
		nameAppendix: 'fromOpenToClosed',
		selector: 'gdq-transition',
		entranceMethodName: 'fromOpenToClosed',
		additionalDelay: STANDARD_DELAY,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS,
		before: transitionBefore
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/transition.html`,
		nameAppendix: 'fromClosedToOpen',
		selector: 'gdq-transition',
		entranceMethodName: 'fromClosedToOpen',
		entranceMethodArgs: [{fadeOutVideos: true}],
		additionalDelay: STANDARD_DELAY,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS,
		before: transitionBefore
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/transition.html`,
		nameAppendix: 'fromPartialToClosed',
		selector: 'gdq-transition',
		entranceMethodName: 'fromPartialToClosed',
		additionalDelay: STANDARD_DELAY,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS,
		before: transitionBefore
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/transition.html`,
		nameAppendix: 'fromClosedToPartial',
		selector: 'gdq-transition',
		entranceMethodName: 'fromClosedToPartial',
		entranceMethodArgs: [{fadeOutVideos: true}],
		additionalDelay: STANDARD_DELAY,
		replicantPrefills: {
			...STANDARD_REPLICANT_PREFILLS,
			currentHost: undefined,
			nowPlaying: undefined
		},
		before: transitionBefore
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/interview.html`,
		nameAppendix: 'blank',
		additionalDelay: STANDARD_DELAY,
		replicantPrefills: STANDARD_REPLICANT_PREFILLS
	}, {
		route: `bundles/${BUNDLE_NAME}/graphics/lttp_tracker.html`,
		additionalDelay: 1500,
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

// Interview lowerthird tests.
for (let i = 1; i <= MAX_LOWERTHIRD_NAMES; i++) {
	module.exports.TEST_CASES.push({
		route: `bundles/${BUNDLE_NAME}/graphics/interview.html`,
		nameAppendix: `lowerthird-${i}`,
		selector: 'gdq-lowerthird',
		entranceMethodName: 'show',
		entranceMethodArgs: [[
			{name: 'one wwwwwWWWWWwwwwwWWWWWwwwwwWWWWW', title: 'one title WWWWWwwwwwWWWWWwwwww'},
			{name: 'two', title: 'two title'},
			{name: 'three wwwwwWWWWWwwwwwWWWWWwwwwwWWWWW', title: 'three title WWWWWwwwwwWWWWWwwwww'},
			{name: 'four', title: ''},
			{name: 'five wwwwwWWWWWwwwwwWWWWWwwwwwWWWWW', title: 'five title WWWWWwwwwwWWWWWwwwww'}
		].slice(0, i)],
		additionalDelay: STANDARD_DELAY
	});
}
