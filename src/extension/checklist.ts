'use strict';

// Packages
import equals = require('deep-equal');
import * as clone from 'clone';

// Ours
import * as nodecgApiContext from './util/nodecg-api-context';
import * as obs from './obs';
import * as Checklist from '../types/Checklist';

const nodecg = nodecgApiContext.get();

// To edit the list of checklist items, edit the "default" value of schemas/checklist.json.
// Any changes you make will be fully picked up and integrated next time NodeCG starts.
const checklist = nodecg.Replicant('checklist');
const checklistDefault = checklist.schema.default as Checklist.List;
const autoCycleRecordings = nodecg.Replicant('autoCycleRecordings');

// Reconcile differences between persisted value and what we expect the checklistDefault to be.
const persistedValue = checklist.value;
if (!equals(persistedValue, checklistDefault)) {
	const mergedChecklist = clone(checklistDefault);

	for (const category in checklistDefault) { // tslint:disable-line:no-for-in
		if (!{}.hasOwnProperty.call(checklistDefault, category)) {
			continue;
		}

		mergedChecklist[category] = checklistDefault[category].map(task => {
			if (persistedValue[category]) {
				const persistedTask = persistedValue[category].find(({name}: {name: string}) => {
					return name === task.name;
				});

				if (persistedTask) {
					return persistedTask;
				}
			}

			return task;
		});
	}

	checklist.value = mergedChecklist;
}

const checklistComplete = nodecg.Replicant('checklistComplete');
checklist.on('change', (newVal: Checklist.List) => {
	let foundIncompleteTask = false;

	for (const category in newVal) { // tslint:disable-line:no-for-in
		if (!{}.hasOwnProperty.call(newVal, category)) {
			continue;
		}

		foundIncompleteTask = newVal[category].some(task => !task.complete);

		if (foundIncompleteTask) {
			break;
		}
	}

	checklistComplete.value = !foundIncompleteTask;
});

export function reset() {
	if (obs.streamingOBSConnected()) {
		obs.resetCropping();
		if (autoCycleRecordings.value) {
			obs.cycleRecordings().catch((error: Error) => {
				nodecg.log.error('Failed to cycle recordings:', error);
			});
		}
	}

	for (const category in checklist.value) { // tslint:disable-line:no-for-in
		if (!{}.hasOwnProperty.call(checklist.value, category)) {
			continue;
		}

		checklist.value[category].forEach((task: Checklist.Task) => {
			task.complete = false;
		});
	}
}
