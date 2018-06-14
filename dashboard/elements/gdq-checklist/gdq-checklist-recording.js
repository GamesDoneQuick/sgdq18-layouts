(function () {
	'use strict';

	const checklistRep = nodecg.Replicant('checklist');
	const stopwatchRep = nodecg.Replicant('stopwatch');
	const cyclingRecordingsRep = nodecg.Replicant('obs:cyclingRecordings');

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqChecklistRecording extends Polymer.Element {
		static get is() {
			return 'gdq-checklist-recording';
		}

		static get properties() {
			return {
				name: String,
				category: String,
				checked: {
					type: Boolean,
					notify: true,
					reflectToAttribute: true
				},
				warning: {
					type: Boolean,
					reflectToAttribute: true
				},
				disabled: {
					type: Boolean,
					reflectToAttribute: true
				},

				// Private state.
				_stopwatchState: Boolean,
				_cyclingRecordings: Boolean
			};
		}

		static get observers() {
			return [
				'_calcDisabled(_stopwatchState, _cyclingRecordings)'
			];
		}

		ready() {
			super.ready();

			checklistRep.on('change', newVal => {
				if (!newVal) {
					return;
				}

				const incompleteTasks = [];
				for (const key in newVal) {
					if (!{}.hasOwnProperty.call(newVal, key)) {
						continue;
					}

					const category = newVal[key];
					category.forEach(task => {
						if (!task.complete) {
							incompleteTasks.push(task);
						}
					});
				}
				this.warning = incompleteTasks.length > 1 && incompleteTasks[0].name !== 'Cycle Recordings';
			});

			stopwatchRep.on('change', newVal => {
				if (!newVal) {
					return;
				}

				this._stopwatchState = newVal.state === 'running';
			});

			cyclingRecordingsRep.on('change', newVal => {
				this._cyclingRecordings = newVal;
			});

			nodecg.listenFor('obs:recordingsCycled', error => {
				if (error) {
					let errorString = error;
					if (error.message) {
						errorString = error.message;
					} else if (error.error) {
						errorString = error.error;
					}
					this.$.toast.showErrorToast('Failed to cycle recordings: ' + errorString);
				} else {
					this.$.toast.showSuccessToast('Recordings cycled.');
				}
			});

			this.addEventListener('click', () => {
				this.$.checkbox.click();
			});
		}

		_calcDisabled(stopwatchState, cyclingRecordings) {
			this.disabled = Boolean(stopwatchState === 'running' || cyclingRecordings);
		}

		_calcContextPage(warning, disabled, cyclingRecordings) {
			if (cyclingRecordings) {
				return 'cycling';
			}

			if (disabled) {
				return 'disabled';
			}

			if (warning) {
				return 'warning';
			}

			return 'all-clear';
		}
	}

	customElements.define(GdqChecklistRecording.is, GdqChecklistRecording);
})();
