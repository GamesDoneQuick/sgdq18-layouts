/* eslint-disable camelcase */
'use strict';

// Packages
const request = require('request-promise').defaults();
const equal = require('deep-equal');

// Ours
const nodecg = require('./util/nodecg-api-context').get();

const log = new nodecg.Logger(`${nodecg.bundleName}:victorOps`);
const incidentsReplicant = nodecg.Replicant('victorOps:incidents');
const routingKeysReplicant = nodecg.Replicant('victorOps:routingKeys');

log.info('VictorOps integration enabled.');

nodecg.listenFor('victorOps:createIncident', (body, cb) => {
	cb = cb || function () {};

	log.info('Creating incident:', body);

	createIncident({
		restEndpoint: nodecg.bundleConfig.victorOps.restEndpoint,
		routingKey: body.routingKey,
		body: {
			message_type: 'CRITICAL',
			entity_display_name: body.subject,
			state_message: body.details
		}
	}).then(() => {
		log.info('Incident successfully created.');
		cb();
	}).catch(error => {
		log.error('Failed to create incident:', error);
		cb(error);
	});
});

// Initialize.
updateIncidentsReplicant();
updateRoutingKeysReplicant();

// Update incidents once a minute.
setInterval(() => {
	updateIncidentsReplicant();
}, 60 * 1000);

// Update routing keys once every 5 minutes.
setInterval(() => {
	updateRoutingKeysReplicant();
}, 5 * 60 * 1000);

async function updateIncidentsReplicant() {
	let incidents;
	try {
		incidents = await fetchIncidents(nodecg.bundleConfig.victorOps);
	} catch (e) {
		log.error('Failed to fetch incidents:', e);
	}

	try {
		if (!equal(incidentsReplicant.value, incidents)) {
			incidentsReplicant.value = incidents;
		}
	} catch (e) {
		log.error('Failed to update incidents replicant:', e);
	}
}

async function updateRoutingKeysReplicant() {
	let teams;
	try {
		teams = await fetchRoutingKeys(nodecg.bundleConfig.victorOps);
	} catch (e) {
		log.error('Failed to fetch teams:', e);
	}

	try {
		if (!equal(routingKeysReplicant.value, teams)) {
			routingKeysReplicant.value = teams;
		}
	} catch (e) {
		log.error('Failed to update teams replicant:', e);
	}
}

async function fetchIncidents({apiId, apiKey}) {
	const result = await request({
		uri: 'https://api.victorops.com/api-public/v1/incidents',
		headers: {
			Accept: 'application/json',
			'X-VO-Api-Id': apiId,
			'X-VO-Api-Key': apiKey
		},
		json: true
	});

	return result ? result.incidents : [];
}

async function fetchRoutingKeys({apiId, apiKey}) {
	const result = await request({
		uri: 'https://api.victorops.com/api-public/v1/org/routing-keys',
		headers: {
			Accept: 'application/json',
			'X-VO-Api-Id': apiId,
			'X-VO-Api-Key': apiKey
		},
		json: true
	});

	return (result ? result.routingKeys : []).filter(routingKey => {
		if (!routingKey) {
			return false;
		}

		// Filter out the default routing key.
		return routingKey.routingKey !== '.+';
	});
}

function createIncident({restEndpoint, routingKey, body}) {
	return request({
		method: 'POST',
		uri: restEndpoint.replace(/\$routing_key$/, routingKey),
		headers: {
			Accept: 'application/json'
		},
		body,
		json: true
	});
}
