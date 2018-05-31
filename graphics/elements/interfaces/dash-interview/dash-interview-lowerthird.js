(function () {
	'use strict';

	const currentIntermissionRep = nodecg.Replicant('currentIntermission');
	const currentRunRep = nodecg.Replicant('currentRun');
	const interviewNamesRep = nodecg.Replicant('interview:names');
	const lowerthirdShowingRep = nodecg.Replicant('interview:lowerthirdShowing');
	const runnersRep = nodecg.Replicant('runners');
	const scheduleRep = nodecg.Replicant('schedule');

	/**
	 * @customElement
	 * @polymer
	 */
	class DashInterviewLowerthird extends Polymer.Element {
		static get is() {
			return 'dash-interview-lowerthird';
		}

		static get properties() {
			return {
				lowerthirdShowing: {
					type: Boolean,
					value: false,
					notify: true
				},
				questionShowing: {
					type: Boolean
				},
				_typeaheadCandidates: {
					type: Array,
					value() {
						return [];
					}
				}
			};
		}

		ready() {
			super.ready();

			// Hack to get around https://github.com/bevacqua/crossvent/issues/8
			// I dunno why but this prevents the "auto passive listener" thing.
			Polymer.Gestures.addListener(this.$.nameInputs, 'track', () => {});

			this.$.nameInputs.moves = function (element, source, handle) {
				return handle.id === 'handle';
			};

			this.$.nameInputs.createMirror = originalElement => {
				const rect = originalElement.getBoundingClientRect();
				const mirror = originalElement.cloneNode(true);
				mirror.style.width = rect.width + 'px';
				mirror.style.height = rect.height + 'px';
				mirror.allowCustomValue = true;
				mirror.value = originalElement.value;
				Polymer.RenderStatus.beforeNextRender(mirror, () => {
					mirror.$.input.$.input.value = originalElement.value;
				});
				return mirror;
			};

			runnersRep.on('change', newVal => {
				if (newVal && newVal.length > 0) {
					this._typeaheadCandidates = newVal.filter(Boolean).map(runner => runner.name).sort();
				} else {
					this._typeaheadCandidates = [];
				}
			});

			interviewNamesRep.on('change', newVal => {
				this.setNames(newVal);
			});

			lowerthirdShowingRep.on('change', newVal => {
				this.lowerthirdShowing = newVal;
			});
		}

		openPreview() {
			this.$.lowerthirdPreview.updatePreview(this.getNames());
			this.$.lowerthirdPreviewDialog.open();
		}

		calcStartDisabled(lowerthirdShowing, questionShowing) {
			return lowerthirdShowing || questionShowing;
		}

		showLowerthird() {
			this.takeNames();
			lowerthirdShowingRep.value = true;
		}

		hideLowerthird() {
			lowerthirdShowingRep.value = false;
		}

		autoLowerthird() {
			this.takeNames();
			nodecg.sendMessage('pulseInterviewLowerthird', 10);
		}

		/**
		 * Takes the names currently entered into the inputs.
		 * @returns {undefined}
		 */
		takeNames() {
			interviewNamesRep.value = this.getNames();
		}

		/**
		 * Returns an array of the names currently entered into the inputs.
		 * @returns {string[]} - The names.
		 */
		getNames() {
			return this.getInputs().map(input => input.value);
		}

		setNames(names) {
			const typeaheads = this.getInputs();

			if (!names || names.length <= 0) {
				typeaheads.forEach(input => {
					input.value = '';
				});
				return;
			}

			typeaheads.forEach((input, index) => {
				input.value = names[index] || '';
			});
		}

		/**
		 * Retrieves the name inputs as an array of DOM elements.
		 * @returns {any[]} - The input elements.
		 */
		getInputs() {
			return Array.from(this.$.nameInputs.shadowRoot.querySelectorAll('ui-sortable-list-item'))
				.map(uiSortableListItem => uiSortableListItem.shadowRoot.querySelector('dash-lowerthird-name-input'));
		}

		any(...args) {
			return args.find(arg => arg);
		}

		openRefillDialog() {
			const currentInterview = currentIntermissionRep.value.content.find(item => item.type === 'interview');
			const nextInterview = scheduleRep.value.find(scheduleItem => {
				// Ignore items which are not interviews.
				if (scheduleItem.type !== 'interview') {
					return false;
				}

				// If we have a currentInterview, return the first interview after it.
				if (currentInterview) {
					return scheduleItem.order > currentInterview.order;
				}

				// If we don't have a currentInterview, return the first interview after the currentRun.
				// Ignore items before the currentRun.
				return scheduleItem.order >= currentRunRep.value.order;
			});

			let currentInterviewNames = [];
			let nextInterviewNames = [];

			if (currentInterview) {
				currentInterviewNames = currentInterview.interviewers.concat(currentInterview.interviewees);
			}

			if (nextInterview) {
				nextInterviewNames = nextInterview.interviewers.concat(nextInterview.interviewees);
			}

			while (currentInterviewNames.length < 5) {
				currentInterviewNames.push('(none)');
			}

			while (nextInterviewNames.length < 5) {
				nextInterviewNames.push('(none)');
			}

			this.$.currentLowerthirdRefillOption.names = currentInterviewNames;
			this.$.nextLowerthirdRefillOption.names = nextInterviewNames;
			this.$.lowerthirdRefillDialog.open();

			nodecg.log.info('currentInterview:', currentInterview);
			nodecg.log.info('currentInterviewNames:', currentInterviewNames);
			nodecg.log.info('nextInterview:', nextInterview);
			nodecg.log.info('nextInterviewNames:', nextInterviewNames);
		}

		closeRefillDialog() {
			this.$.lowerthirdRefillDialog.close();
		}

		_handleRefillOptionAccepted(e) {
			this.setNames(e.detail.names);
			this.closeRefillDialog();
		}

		_handleNameInputChange(event) {
			interviewNamesRep.value[event.model.index] = event.target.value;
		}
	}

	customElements.define(DashInterviewLowerthird.is, DashInterviewLowerthird);
})();
