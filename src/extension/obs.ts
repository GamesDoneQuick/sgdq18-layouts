'use strict';

// Native
import * as fs from 'fs';
import * as path from 'path';
import {exec} from 'child_process';

// Packages
import OBSUtility = require('nodecg-utility-obs');

// Ours
import * as nodecgApiContext from './util/nodecg-api-context';

const nodecg = nodecgApiContext.get();

// We track what _layout_ is active, not necessarily what _scene_ is active.
// A given layout can be on multiple scenes.
const currentLayout = nodecg.Replicant('gdq:currentLayout');
const autoCycleRecordings = nodecg.Replicant('autoCycleRecordings');
const autoUploadRecordings = nodecg.Replicant('autoUploadRecordings');
const streamingOBS = new OBSUtility(nodecg, {namespace: 'streamingOBS'});
const recordingOBS = new OBSUtility(nodecg, {namespace: 'recordingOBS'});
const uploadScriptPath = nodecg.bundleConfig.youtubeUploadScriptPath;
let uploadScriptRunning = false;

if (uploadScriptPath) {
	let stats;
	try {
		stats = fs.lstatSync(uploadScriptPath);
	} catch (e) {
		if (e.code === 'ENOENT') {
			throw new Error(`Configured youtubeUploadScriptPath (${uploadScriptPath}) does not exist.`);
		}

		throw e;
	}

	if (!stats.isFile()) {
		throw new Error(`Configured youtubeUploadScriptPath (${uploadScriptPath}) is not a file.`);
	}

	nodecg.log.info('Automatic VOD uploading enabled.');
} else {
	autoCycleRecordings.value = false;
}

autoCycleRecordings.on('change', (newVal: boolean) => {
	nodecg.log.info('Automatic cycling of recordings %s.', newVal ? 'ENABLED' : 'DISABLED');
	if (!newVal) {
		autoUploadRecordings.value = false;
	}
});

autoUploadRecordings.on('change', (newVal: boolean) => {
	nodecg.log.info('Automatic uploading of recordings %s.', newVal ? 'ENABLED' : 'DISABLED');
});

streamingOBS.replicants.programScene.on('change', (newVal: any) => {
	if (!newVal) {
		return;
	}

	newVal.sources.some((source: any) => {
		if (!source.name) {
			return false;
		}

		const lowercaseSourceName = source.name.toLowerCase();
		if (lowercaseSourceName.indexOf('layout') === 0) {
			currentLayout.value = lowercaseSourceName.replace(/ /g, '_').replace('layout_', '');
			return true;
		}

		return false;
	});
});

function cycleRecording(obs: any) {
	return new Promise((resolve, reject) => {
		let rejected = false;
		const timeout = setTimeout(() => {
			rejected = true;
			reject(new Error(`Timed out waiting for ${obs.namespace} to stop recording.`));
		}, 30000);

		const recordingStoppedListener = () => {
			if (rejected) {
				return;
			}

			obs.log.info('Recording stopped.');
			clearTimeout(timeout);

			setTimeout(() => {
				resolve();
			}, 2500);
		};

		obs.once('RecordingStopped', recordingStoppedListener);
		obs.stopRecording().catch((error: Error) => {
			if ((error as any).error === 'recording not active') {
				obs.removeListener('RecordingStopped', recordingStoppedListener);
				resolve();
			} else {
				obs.log.error(error);
				reject(error);
			}
		});
	}).then(() => {
		return obs.startRecording();
	});
}

export function resetCropping() {
	return streamingOBS.send('ResetCropping').catch((error: Error) => {
		nodecg.log.error('resetCropping error:', error);
	});
}

export function setCurrentScene(sceneName: string) {
	return streamingOBS.setCurrentScene({
		'scene-name': sceneName
	});
}

export async function cycleRecordings() {
	nodecg.log.info('Cycling recordings...');

	const cycleRecordingPromises = [];
	if (recordingOBS._connected) {
		cycleRecordingPromises.push(cycleRecording(recordingOBS));
	} else {
		nodecg.log.error('Recording OBS is disconnected! Not cycling its recording.');
	}

	if (streamingOBS._connected) {
		cycleRecordingPromises.push(cycleRecording(streamingOBS));
	} else {
		nodecg.log.error('Streaming OBS is disconnected! Not cycling its recording.');
	}

	if (cycleRecordingPromises.length <= 0) {
		nodecg.log.warn('Neither instance of OBS is connected, aborting cycleRecordings.');
		return;
	}

	await Promise.all(cycleRecordingPromises);

	nodecg.log.info('Recordings successfully cycled.');

	if (uploadScriptPath && autoUploadRecordings.value && !uploadScriptRunning) {
		uploadScriptRunning = true;
		nodecg.log.info('Executing upload script...');
		exec(`python "${uploadScriptPath}"`, {
			cwd: path.parse(uploadScriptPath).dir
		}, (error, stdout, stderr) => {
			uploadScriptRunning = false;

			if (error) {
				nodecg.log.error('Upload script failed:', error);
				return;
			}

			if (stderr) {
				nodecg.log.error('Upload script failed:', stderr);
				return;
			}

			if (stdout.trim().length > 0) {
				nodecg.log.info('Upload script ran successfully:', stdout.trim());
			} else {
				nodecg.log.info('Upload script ran successfully.');
			}
		});
	}
}

export function streamingOBSConnected() {
	return streamingOBS._connected;
}
