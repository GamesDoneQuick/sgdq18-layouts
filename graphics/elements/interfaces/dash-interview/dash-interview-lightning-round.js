(function () {
	'use strict';

	const questions = nodecg.Replicant('interview:questionTweets');
	const questionShowing = nodecg.Replicant('interview:questionShowing');

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class DashInterviewLightningRound extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'dash-interview-lightning-round';
		}

		static get properties() {
			return {
				questionShowing: {
					type: Boolean,
					value: false,
					notify: true
				},
				replies: {
					type: Object
				},
				_markingTopQuestionAsDone: Boolean
			};
		}

		ready() {
			super.ready();

			questions.on('change', newVal => {
				this.set('replies', newVal);
			});

			questionShowing.on('change', newVal => {
				this.questionShowing = newVal;
			});
		}

		openEndInterviewDialog() {
			this.$.endInterviewDialog.open();
		}

		endInterview() {
			nodecg.sendMessage('interview:end');
		}
	}

	customElements.define(DashInterviewLightningRound.is, DashInterviewLightningRound);
})();
