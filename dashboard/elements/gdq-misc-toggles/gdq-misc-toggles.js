(function () {
	'use strict';

	const autoCycleRecordings = nodecg.Replicant('autoCycleRecordings');
	const autoUploadRecordings = nodecg.Replicant('autoUploadRecordings');
	const recordTrackerEnabled = nodecg.Replicant('recordTrackerEnabled');

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqMiscToggles extends Polymer.Element {
		static get is() {
			return 'gdq-misc-toggles';
		}

		static get properties() {
			return {};
		}

		ready() {
			super.ready();
			Polymer.RenderStatus.beforeNextRender(this, () => {
				recordTrackerEnabled.on('change', newVal => {
					this.$.milestoneToggle.checked = newVal;
				});

				autoCycleRecordings.on('change', newVal => {
					this.$.cycleToggle.checked = newVal;
					this._checkUploadToggleDisable();
				});

				autoUploadRecordings.on('change', newVal => {
					this.$.uploadToggle.checked = newVal;
				});

				this._checkUploadToggleDisable();
			});
		}

		_checkUploadToggleDisable() {
			if (!autoCycleRecordings.value || !nodecg.bundleConfig.youtubeUploadScriptPath) {
				this.$.uploadToggle.setAttribute('disabled', 'true');
			} else {
				this.$.uploadToggle.removeAttribute('disabled');
			}
		}

		_handleMiletoneTrackerToggleChange(e) {
			recordTrackerEnabled.value = e.target.checked;
		}

		_handleCycleToggleChange(e) {
			autoCycleRecordings.value = e.target.checked;
		}

		_handleUploadToggleChange(e) {
			autoUploadRecordings.value = e.target.checked;
		}
	}

	customElements.define(GdqMiscToggles.is, GdqMiscToggles);
})();
