(function () {
	'use strict';

	const compositingOBSStatus = nodecg.Replicant('compositingOBS:websocket');
	const compositingOBSTransitioning = nodecg.Replicant('compositingOBS:transitioning');
	const interviewStopwatch = nodecg.Replicant('interview:stopwatch');
	const lowerthirdTimeRemaining = nodecg.Replicant('interview:lowerthirdTimeRemaining');
	const programScene = nodecg.Replicant('compositingOBS:programScene');
	const questionShowing = nodecg.Replicant('interview:questionShowing');
	const questionSortMap = nodecg.Replicant('interview:questionSortMap');
	const questionTimeRemaining = nodecg.Replicant('interview:questionTimeRemaining');
	const showPrizesOnMonitorRep = nodecg.Replicant('interview:showPrizesOnMonitor');

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 * @appliesMixin Polymer.SCDataBindingHelpers
	 */
	class DashInterview extends Polymer.SCDataBindingHelpers(Polymer.MutableData(Polymer.Element)) {
		static get is() {
			return 'dash-interview';
		}

		static get properties() {
			return {
				lowerthirdShowing: {
					type: Boolean,
					reflectToAttribute: true
				},
				lowerthirdTimeRemaining: {
					type: Number
				},
				questionShowing: {
					type: Boolean,
					reflectToAttribute: true
				},
				questionTimeRemaining: {
					type: Boolean
				},
				_programSceneName: {
					type: String,
					value: ''
				},
				_markingTopQuestionAsDone: {
					type: Boolean,
					value: false
				},
				_sendingTransitionCommand: {
					type: Boolean,
					value: false
				},
				_errorToastText: String,
				_successToastText: String,
				_transitioning: Boolean,
				_disconnectedFromOBS: Boolean,
				_transitionToBreakDisabled: {
					type: Boolean,
					computed: '_computeTransitionToBreakDisabled(_sendingTransitionCommand, _transitioning, _disconnectedFromOBS, _programSceneName)'
				},
				_timeElapsed: String,
				_modeToggleChecked: Boolean
			};
		}

		ready() {
			super.ready();

			lowerthirdTimeRemaining.on('change', newVal => {
				this.lowerthirdTimeRemaining = newVal;
			});

			questionTimeRemaining.on('change', newVal => {
				this.questionTimeRemaining = newVal;
			});

			compositingOBSTransitioning.on('change', newVal => {
				this._transitioning = newVal;
			});

			programScene.on('change', newVal => {
				this._programSceneName = newVal ? newVal.name : '';
			});

			compositingOBSStatus.on('change', newVal => {
				this._disconnectedFromOBS = Boolean(!newVal || newVal.status !== 'connected');
			});

			interviewStopwatch.on('change', newVal => {
				this._timeElapsed = newVal.time.formatted.split('.')[0];
			});

			showPrizesOnMonitorRep.on('change', newVal => {
				this._modeToggleChecked = !newVal;
			});

			this.addEventListener('error-toast', event => {
				this.$.toast.showErrorToast(event.detail.text);
			});
		}

		showLowerthird() {
			this.$.lowerthirdControls.autoLowerthird();
		}

		hideLowerthird() {
			this.$.lowerthirdControls.hideLowerthird();
		}

		showQuestion() {
			this._markingTopQuestionAsDone = true;
			nodecg.sendMessage('pulseInterviewQuestion', questionSortMap.value[0], error => {
				this._markingTopQuestionAsDone = false;
				if (error) {
					this.showErrorToast('Failed to load next interview question.');
					nodecg.log.error(error);
				}
			});
		}

		hideQuestion() {
			questionShowing.value = false;
			this._markingTopQuestionAsDone = false;
		}

		openInterviewTransitionConfirmation() {
			this.$.interviewTransitionConfirmation.open();
		}

		transitionToInterview() {
			return this.transitionToScene('Interview');
		}

		transitionToBreak() {
			return this.transitionToScene('Break');
		}

		async transitionToScene(sceneName, transitionName = 'Blank Stinger') {
			this._sendingTransitionCommand = true;

			try {
				await nodecg.sendMessage('compositingOBS:transition', {
					name: transitionName,
					sceneName
				});
				this.$.toast.showSuccessToast(`Successfully started transition to "${sceneName}".`);
			} catch (error) {
				let errorString = error;
				if (error.message) {
					errorString = error.message;
				} else if (error.error) {
					errorString = error.error;
				}
				this.$.toast.showErrorToast('Failed to transition: ' + errorString);
			}

			this._sendingTransitionCommand = false;
		}

		_computeTransitionToBreakDisabled(_sendingTransitionCommand, _transitioning, _disconnectedFromOBS, _programSceneName) {
			return _sendingTransitionCommand ||
				_transitioning ||
				_disconnectedFromOBS ||
				_programSceneName === 'Break';
		}

		_any(...args) {
			return args.find(arg => Boolean(arg));
		}

		_handleModeToggleChange(e) {
			showPrizesOnMonitorRep.value = !e.target.checked;
		}
	}

	customElements.define(DashInterview.is, DashInterview);
})();
