(function () {
	'use strict';

	const lowerthirdTimeRemaining = nodecg.Replicant('interview:lowerthirdTimeRemaining');
	const questionShowing = nodecg.Replicant('interview:questionShowing');
	const questionSortMap = nodecg.Replicant('interview:questionSortMap');
	const questionTimeRemaining = nodecg.Replicant('interview:questionTimeRemaining');

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
				}
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

			this.addEventListener('error-toast', event => {
				this.$.errorToast.show(event.detail.text);
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
					this.$.errorToast.text = 'Failed to load next interview question.';
					this.$.errorToast.show();
					nodecg.log.error(error);
				}
			});
		}

		hideQuestion() {
			questionShowing.value = false;
			this._markingTopQuestionAsDone = false;
		}

		_any(...args) {
			return args.find(arg => Boolean(arg));
		}
	}

	customElements.define(DashInterview.is, DashInterview);
})();
