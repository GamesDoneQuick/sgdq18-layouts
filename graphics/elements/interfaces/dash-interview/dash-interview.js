(function () {
	'use strict';

	const lowerthirdTimeRemaining = nodecg.Replicant('interview:lowerthirdTimeRemaining');
	const questionShowing = nodecg.Replicant('interview:questionShowing');
	const questionSortMap = nodecg.Replicant('interview:questionSortMap');
	const questionTimeRemaining = nodecg.Replicant('interview:questionTimeRemaining');
	const streamingOBSTransitioning = nodecg.Replicant('streamingOBS:transitioning');

	class DashInterview extends Polymer.MutableData(Polymer.GestureEventListeners(Polymer.Element)) {
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
				_transitioning: Boolean
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

			streamingOBSTransitioning.on('change', newVal => {
				this._transitioning = newVal;
			});

			this.addEventListener('error-toast', event => {
				this.showErrorToast(event.detail.text);
			});
		}

		showSuccessToast(text) {
			this._successToastText = text;
			this.$.successToast.show();
		}

		showErrorToast(text) {
			this._errorToastText = text;
			this.$.errorToast.show();
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

		transitionToInterview() {
			return this.transitionToScene('Interview');
		}

		transitionToBreak() {
			return this.transitionToScene('Break');
		}

		async transitionToScene(sceneName, transitionName = 'Blank Stinger') {
			this._sendingTransitionCommand = true;

			try {
				await nodecg.sendMessage('streamingOBS:transition', {
					name: transitionName,
					sceneName
				});
				this.showSuccessToast(`Successfully started transition to "${sceneName}".`);
			} catch (error) {
				let errorString = error;
				if (error.message) {
					errorString = error.message;
				} else if (error.error) {
					errorString = error.error;
				}
				this.showErrorToast('Failed to transition: ' + errorString);
			}

			this._sendingTransitionCommand = false;
		}

		_any(...args) {
			return args.find(arg => Boolean(arg));
		}
	}

	customElements.define(DashInterview.is, DashInterview);
})();
