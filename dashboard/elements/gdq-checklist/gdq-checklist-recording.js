(function () {
	'use strict';

	const checklistRep = nodecg.Replicant('checklist');
	const stopwatchRep = nodecg.Replicant('stopwatch');

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
					reflectToAttribute: true
				},
				warning: {
					type: Boolean,
					reflectToAttribute: true
				},
				disabled: {
					type: Boolean,
					reflectToAttribute: true
				}
			};
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

				this.disabled = newVal.state === 'running';
			});
		}

		_calcContext(warning, disabled) {
			if (disabled) {
				return 'RUN IN PROGRESS';
			}

			if (warning) {
				return 'COMPLETE OTHER<br/>CHECKLIST ITEMS FIRST';
			}

			return 'PERFORM SHORTLY<br/>BEFORE INTRODUCING RUN';
		}
	}

	customElements.define(GdqChecklistRecording.is, GdqChecklistRecording);
})();
