(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class DashInterviewLightningRoundTweet extends Polymer.Element {
		static get is() {
			return 'dash-interview-lightning-round-tweet';
		}

		static get properties() {
			return {
				tweet: {
					type: Object
				},
				tweetId: {
					type: String,
					reflectToAttribute: true,
					computed: '_computeTweetId(tweet.id_str)'
				}
			};
		}

		reject() {
			if (!this.tweet) {
				return;
			}

			const button = this.$.reject;
			button.disabled = true;
			nodecg.sendMessage('interview:markQuestionAsDone', this.tweet.id_str, error => {
				button.disabled = false;
				if (error) {
					this.dispatchEvent(new CustomEvent('error-toast', {
						detail: {
							text: 'Failed to reject interview question.'
						},
						bubbles: true,
						composed: true
					}));
				}
			});
		}

		_computeTweetId(prizeId) {
			return prizeId;
		}
	}

	customElements.define(DashInterviewLightningRoundTweet.is, DashInterviewLightningRoundTweet);
})();
