(function () {
	'use strict';

	const questionSortMapRep = nodecg.Replicant('interview:questionSortMap');

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class DashInterviewLightningRoundTweet extends Polymer.MutableData(Polymer.Element) {
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
				},
				first: {
					type: Boolean,
					reflectToAttribute: true,
					computed: '_computeFirst(tweet, _questionSortMap)',
					observer: '_firstChanged'
				},
				_questionSortMap: {
					type: Array
				}
			};
		}

		connectedCallback() {
			super.connectedCallback();

			if (!this._initialized) {
				this._initialized = true;
				questionSortMapRep.on('change', newVal => {
					this._questionSortMap = newVal;
				});
			}
		}

		promote() {
			if (!this.tweet) {
				return;
			}

			const button = this.$.promote;
			button.disabled = true;
			nodecg.sendMessage('interview:promoteQuestionToTop', this.tweet.id_str, error => {
				button.disabled = false;
				if (error) {
					this.dispatchEvent(new CustomEvent('error-toast', {
						detail: {
							text: 'Failed to promote interview question.'
						},
						bubbles: true,
						composed: true
					}));
				}
			});
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

		_computeFirst(tweet, questionSortMap) {
			if (!tweet || !Array.isArray(questionSortMap)) {
				return;
			}

			const sortMapIndex = questionSortMap.findIndex(entry => entry === this.tweet.id_str);
			return sortMapIndex === 0;
		}

		_firstChanged(newVal) {
			this.parentNode.host.style.backgroundColor = newVal ? '#BDE7C4' : '';
		}
	}

	customElements.define(DashInterviewLightningRoundTweet.is, DashInterviewLightningRoundTweet);
})();
