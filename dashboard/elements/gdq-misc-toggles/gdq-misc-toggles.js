(function () {
	'use strict';

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

				autoUploadRecordings.on('change', newVal => {
					this.$.uploadToggle.checked = newVal;
				});

				this._checkUploadToggleDisable();
			});
		}

		_checkUploadToggleDisable() {
			if (nodecg.bundleConfig.youtubeUploadScriptPath) {
				this.$.uploadToggle.removeAttribute('disabled');
			} else {
				this.$.uploadToggle.setAttribute('disabled', 'true');
			}
		}

		_handleMiletoneTrackerToggleChange(e) {
			recordTrackerEnabled.value = e.target.checked;
		}

		_handleUploadToggleChange(e) {
			autoUploadRecordings.value = e.target.checked;
		}
	}

	customElements.define(GdqMiscToggles.is, GdqMiscToggles);
})();
