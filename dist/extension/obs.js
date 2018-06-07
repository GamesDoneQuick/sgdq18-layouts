'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
// Packages
const OBSUtility = require("nodecg-utility-obs");
// Ours
const nodecgApiContext = require("./util/nodecg-api-context");
const nodecg = nodecgApiContext.get();
// We track what _layout_ is active, not necessarily what _scene_ is active.
// A given layout can be on multiple scenes.
const currentLayout = nodecg.Replicant('gdq:currentLayout');
const autoCycleRecordings = nodecg.Replicant('autoCycleRecordings');
const autoUploadRecordings = nodecg.Replicant('autoUploadRecordings');
const streamingOBS = new OBSUtility(nodecg, { namespace: 'streamingOBS' });
const recordingOBS = new OBSUtility(nodecg, { namespace: 'recordingOBS' });
const uploadScriptPath = nodecg.bundleConfig.youtubeUploadScriptPath;
let uploadScriptRunning = false;
if (uploadScriptPath) {
    let stats;
    try {
        stats = fs.lstatSync(uploadScriptPath);
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            throw new Error(`Configured youtubeUploadScriptPath (${uploadScriptPath}) does not exist.`);
        }
        throw e;
    }
    if (!stats.isFile()) {
        throw new Error(`Configured youtubeUploadScriptPath (${uploadScriptPath}) is not a file.`);
    }
    nodecg.log.info('Automatic VOD uploading enabled.');
}
else {
    autoCycleRecordings.value = false;
}
autoCycleRecordings.on('change', (newVal) => {
    nodecg.log.info('Automatic cycling of recordings %s.', newVal ? 'ENABLED' : 'DISABLED');
    if (!newVal) {
        autoUploadRecordings.value = false;
    }
});
autoUploadRecordings.on('change', (newVal) => {
    nodecg.log.info('Automatic uploading of recordings %s.', newVal ? 'ENABLED' : 'DISABLED');
});
streamingOBS.replicants.programScene.on('change', (newVal) => {
    if (!newVal) {
        return;
    }
    newVal.sources.some((source) => {
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
streamingOBS.replicants.previewScene.on('change', (newVal) => {
    if (!newVal || !newVal.name) {
        return;
    }
    // Show the Transition Graphic if the scene is NOT the Break scene.
    if (newVal.name !== 'Break') {
        // Abort if the PVW scene is also the PGM scene.
        if (newVal.name === streamingOBS.replicants.programScene.value.name) {
            return;
        }
        streamingOBS.setSceneItemRender({
            'scene-name': newVal.name,
            source: 'Transition Graphic',
            render: false
        }).catch((error) => {
            nodecg.log.error(`Failed to hide Transition Graphic on scene "${newVal.name}":`, error);
        });
    }
});
streamingOBS.on('TransitionBegin', (data) => {
    if (data.name !== 'Blank Stinger') {
        return;
    }
    const pvwSceneName = streamingOBS.replicants.previewScene.value && streamingOBS.replicants.previewScene.value.name;
    if (!pvwSceneName) {
        return;
    }
    // Show the Transition Graphic on the scene which is being transitioned to.
    streamingOBS.setSceneItemRender({
        'scene-name': pvwSceneName,
        source: 'Transition Graphic',
        render: true
    }).catch((error) => {
        nodecg.log.error(`Failed to show Transition Graphic on scene "${pvwSceneName}":`, error);
    });
});
streamingOBS.on('SwitchScenes', (data) => {
    const actualPgmSceneName = data['scene-name'];
    const pvwSceneName = streamingOBS.replicants.previewScene.value && streamingOBS.replicants.previewScene.value.name;
    const pgmSceneName = streamingOBS.replicants.programScene.value && streamingOBS.replicants.programScene.value.name;
    const actualPvwSceneName = actualPgmSceneName === pvwSceneName ? pgmSceneName : pvwSceneName;
    if (actualPvwSceneName === 'Break') {
        return;
    }
    // Abort if the PVW scene is also the PGM scene.
    if (actualPvwSceneName === actualPgmSceneName) {
        return;
    }
    streamingOBS.setSceneItemRender({
        'scene-name': actualPvwSceneName,
        source: 'Transition Graphic',
        render: false
    }).catch((error) => {
        nodecg.log.error(`Failed to hide Transition Graphic on scene "${actualPvwSceneName}":`, error);
    });
});
function cycleRecording(obs) {
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
        obs.stopRecording().catch((error) => {
            if (error.error === 'recording not active') {
                obs.removeListener('RecordingStopped', recordingStoppedListener);
                resolve();
            }
            else {
                obs.log.error(error);
                reject(error);
            }
        });
    }).then(() => {
        return obs.startRecording();
    });
}
function resetCropping() {
    return streamingOBS.send('ResetCropping').catch((error) => {
        nodecg.log.error('resetCropping error:', error);
    });
}
exports.resetCropping = resetCropping;
function setCurrentScene(sceneName) {
    return streamingOBS.setCurrentScene({
        'scene-name': sceneName
    });
}
exports.setCurrentScene = setCurrentScene;
async function cycleRecordings() {
    nodecg.log.info('Cycling recordings...');
    const cycleRecordingPromises = [];
    if (recordingOBS._connected) {
        cycleRecordingPromises.push(cycleRecording(recordingOBS));
    }
    else {
        nodecg.log.error('Recording OBS is disconnected! Not cycling its recording.');
    }
    if (streamingOBS._connected) {
        cycleRecordingPromises.push(cycleRecording(streamingOBS));
    }
    else {
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
        child_process_1.exec(`python "${uploadScriptPath}"`, {
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
            }
            else {
                nodecg.log.info('Upload script ran successfully.');
            }
        });
    }
}
exports.cycleRecordings = cycleRecordings;
function streamingOBSConnected() {
    return streamingOBS._connected;
}
exports.streamingOBSConnected = streamingOBSConnected;
//# sourceMappingURL=obs.js.map