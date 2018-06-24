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

let initializedRecordingTask = false;
const checklistComplete = nodecg.Replicant('checklistComplete');
checklist.on('change', (newVal: Checklist.List, oldVal: Checklist.List | null) => {
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

	// Recording Cycling
	if (!initializedRecordingTask) {
		initializedRecordingTask = true;
		return;
	}

	if (!newVal.special) {
		return;
	}

	const newCycleRecordingsTask = newVal.special.find(({name}) => name === 'Cycle Recordings');
	if (!newCycleRecordingsTask) {
		return;
	}

	if (!newCycleRecordingsTask.complete) {
		return;
	}

	if (!oldVal || !oldVal.special) {
		return cycleRecordings();
	}

	const oldCycleRecordingsTask = oldVal.special.find(({name}) => name === 'Cycle Recordings');
	if (!oldCycleRecordingsTask || !oldCycleRecordingsTask.complete) {
		return cycleRecordings();
	}
});

function cycleRecordings() {
	if (obs.compositingOBSConnected()) {
		obs.cycleRecordings().catch((error: Error) => {
			nodecg.log.error('Failed to cycle recordings:', error);
		});
	}
}

export function reset() {
	for (const category in checklist.value) { // tslint:disable-line:no-for-in
		if (!{}.hasOwnProperty.call(checklist.value, category)) {
			continue;
		}

		checklist.value[category].forEach((task: Checklist.Task) => {
			task.complete = false;
		});
	}

	if (obs.compositingOBSConnected()) {
		obs.resetCropping();
	}
}
