'use strict';

// Packages
import equal = require('deep-equal');
import * as numeral from 'numeral';
import * as request from 'request-promise';

// Ours
import * as nodecgApiContext from './util/nodecg-api-context';
import * as GDQTypes from '../types';

const nodecg = nodecgApiContext.get();
const POLL_INTERVAL = 60 * 1000;

const currentPrizesRep = nodecg.Replicant('currentPrizes', {defaultValue: []});
const allPrizesRep = nodecg.Replicant('allPrizes', {defaultValue: []});

// Get initial data
update();

// Get latest prize data every POLL_INTERVAL milliseconds
setInterval(() => {
	update();
}, POLL_INTERVAL);

/**
 * Grabs the latest prizes from the tracker.
 */
function update() {
	nodecg.sendMessage('prizes:updating');

	const currentPromise = request({
		uri: nodecg.bundleConfig.useMockData ?
			'https://www.dropbox.com/s/rpiisscgszwhguc/currentPrizes.json?dl=1' :
			'https://private.gamesdonequick.com/tracker/search/',
		qs: {
			type: 'prize',
			feed: 'current',
			event: 22,
			dl: 1 // For Dropbox only
		},
		json: true
	}).then(prizes => {
		const formattedPrizes = prizes.map(formatPrize);
		if (!equal(formattedPrizes, currentPrizesRep.value)) {
			currentPrizesRep.value = formattedPrizes;
		}
	});

	const allPromise = request({
		uri: nodecg.bundleConfig.useMockData ?
			'https://www.dropbox.com/s/rpiisscgszwhguc/allPrizes.json?dl=1' :
			'https://private.gamesdonequick.com/tracker/search/',
		qs: {
			type: 'prize',
			event: 22,
			dl: 1 // For Dropbox only
		},
		json: true
	}).then(prizes => {
		const formattedPrizes = prizes.map(formatPrize);
		if (!equal(formattedPrizes, allPrizesRep.value)) {
			allPrizesRep.value = formattedPrizes;
		}
	});

	return Promise.all([
		currentPromise,
		allPromise
	]).then(() => {
		nodecg.sendMessage('prizes:updated');
	}).catch(() => {
		nodecg.sendMessage('prizes:updated');
	});
}

/**
 * Formats a raw prize object from the GDQ Tracker API into a slimmed-down version for our use.
 * @param rawPrize - A raw prize object from the GDQ Tracker API.
 * @returns The formatted prize object.
 */
function formatPrize(rawPrize: GDQTypes.TrackerObject) {
	return {
		id: rawPrize.pk,
		name: rawPrize.fields.name,
		provided: rawPrize.fields.provider || rawPrize.fields.provided || 'Anonymous', // new field is "provider", but it used to be called "provided"
		description: rawPrize.fields.shortdescription || rawPrize.fields.name,
		image: rawPrize.fields.altimage,
		minimumbid: numeral(rawPrize.fields.minimumbid).format('$0,0[.]00'),
		grand: rawPrize.fields.category__name === 'Grand',
		sumdonations: rawPrize.fields.sumdonations,
		startrun: {
			id: rawPrize.fields.startrun,
			name: rawPrize.fields.startrun__display_name || 'Unknown',
			longName: rawPrize.fields.startrun__name || 'Unknown',
			order: rawPrize.fields.startrun__order
		},
		endrun: {
			id: rawPrize.fields.endrun,
			name: rawPrize.fields.endrun__display_name || 'Unknown',
			longName: rawPrize.fields.endrun__name || 'Unknown',
			order: rawPrize.fields.endrun__order
		},
		type: 'prize'
	};
}
