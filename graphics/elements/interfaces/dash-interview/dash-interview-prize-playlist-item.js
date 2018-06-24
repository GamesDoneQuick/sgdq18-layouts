(function () {
	'use strict';

	const prizePlaylistRep = nodecg.Replicant('interview:prizePlaylist');

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class DashInterviewPrizePlaylistItem extends Polymer.MutableData(Polymer.Element) {
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
					computed: '_computeComplete(prize, _prizePlaylist)',
					observer: '_completeChanged'
				},
				_prizePlaylist: {
					type: Array
				}
			};
		}

		connectedCallback() {
			super.connectedCallback();

			if (!this._initialized) {
				this._initialized = true;
				prizePlaylistRep.on('change', newVal => {
					this._prizePlaylist = newVal;
				});
			}
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

		_computeComplete(prize, prizePlaylist) {
			if (!prize || !Array.isArray(prizePlaylist)) {
				return;
			}

			const playlistEntry = prizePlaylist.find(entry => entry.id === this.prize.id);
			return Boolean(playlistEntry && playlistEntry.complete);
		}

		_completeChanged(newVal) {
			this.parentNode.host.style.backgroundColor = newVal ? '#C2C2C2' : '';
		}

		_handleCheckboxChanged(e) {
			if (!this._handledFirstCheckboxChange) {
				this._handledFirstCheckboxChange = true;
				if (e.detail.value === false) {
					return;
				}
			}

			if (e.detail.value) {
				this.markAsDone();
			} else {
				this.markAsNotDone();
			}
		}
	}

	customElements.define(DashInterviewPrizePlaylistItem.is, DashInterviewPrizePlaylistItem);
})();
