(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class DashInterviewPrizePlaylistItem extends Polymer.Element {
		static get is() {
			return 'dash-interview-prize-playlist-item';
		}

		static get properties() {
			return {
				prize: {
					type: Object
				},
				prizeId: {
					type: String,
					reflectToAttribute: true,
					computed: '_computePrizeId(prize.id)'
				},
				complete: {
					type: Boolean,
					reflectToAttribute: true,
					value: false
				}
			};
		}

		markAsDone() {
			if (!this.prize) {
				return;
			}
			nodecg.sendMessage('interview:markPrizeAsDone', this.prize.id);
		}

		markAsNotDone() {
			if (!this.prize) {
				return;
			}
			nodecg.sendMessage('interview:markPrizeAsNotDone', this.prize.id);
		}

		removeFromPlaylist() {
			if (!this.prize) {
				return;
			}
			nodecg.sendMessage('interview:removePrizeFromPlaylist', this.prize.id);
		}

		_computePrizeId(prizeId) {
			return prizeId;
		}

		_handleCheckboxChanged(e) {
			if (e.detail.value) {
				this.markAsDone();
			} else {
				this.markAsNotDone();
			}
		}
	}

	customElements.define(DashInterviewPrizePlaylistItem.is, DashInterviewPrizePlaylistItem);
})();
