(function () {
	'use strict';

	const currentLayout = nodecg.Replicant('gdq:currentLayout');
	const fanartTweetsRep = nodecg.Replicant('fanartTweets');

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class GdqFanart extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'gdq-fanart';
		}

		static get properties() {
			return {
				tweets: Array
			};
		}

		ready() {
			super.ready();

			currentLayout.on('change', newVal => {
				switch (newVal) {
					case 'break':
						this.$.cover.style.display = 'none';
						break;
					default:
						this.$.cover.style.display = 'flex';
				}
			});

			fanartTweetsRep.on('change', newVal => {
				this.$.empty.style.display = newVal.length > 0 ? 'none' : 'flex';
				this.tweets = newVal;
			});
		}

		_sortTweets(a, b) {
			return new Date(b.created_at) - new Date(a.created_at);
		}

		_handlePreviewEvent(event) {
			this.$.previewDialog.open(event.model.tweet);
		}
	}

	customElements.define(GdqFanart.is, GdqFanart);
})();
