(function () {
	'use strict';

	const allPrizesRep = nodecg.Replicant('allPrizes');
	const prizePlaylistRep = nodecg.Replicant('interview:prizePlaylist');

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class DashInterviewPrizes extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'dash-interview-prizes';
		}

		static get properties() {
			return {
				allPrizes: Array,
				prizePlaylist: Array,
				searchString: {
					type: String,
					value: ''
				}
			};
		}

		ready() {
			super.ready();

			allPrizesRep.on('change', newVal => {
				this.allPrizes = newVal;
			});

			prizePlaylistRep.on('change', newVal => {
				this.prizePlaylist = newVal;
			});
		}

		clearFilter() {
			this.searchString = '';
		}

		addPrizeToPlayList(prizeOrPrizeId) {
			const prizeId = disambiguatePrizeId(prizeOrPrizeId);
			nodecg.sendMessage('interview:addPrizeToPlaylist', prizeId);
		}

		removePrizeFromPlaylist(prizeOrPrizeId) {
			const prizeId = disambiguatePrizeId(prizeOrPrizeId);
			nodecg.sendMessage('interview:removePrizeFromPlaylist', prizeId);
		}

		clearPlaylist() {
			nodecg.sendMessage('interview:clearPrizePlaylist');
		}

		_calcClearIconHidden(searchString) {
			return !searchString || searchString.length <= 0;
		}

		_calcPrizesToList(allPrizes, searchString) {
			if (!allPrizes || allPrizes.length <= 0) {
				return [];
			}

			if (!searchString || searchString.trim().length === 0) {
				return allPrizes;
			}

			return allPrizes.filter(prize => {
				return prize.description.toLowerCase().includes(searchString.toLowerCase());
			});
		}

		_isPrizeInPlaylist(prizeOrPrizeId, prizePlaylist) {
			if (!prizePlaylist) {
				return false;
			}

			const prizeId = disambiguatePrizeId(prizeOrPrizeId);
			return prizePlaylist.findIndex(({id}) => id === prizeId) >= 0;
		}

		_calcClearPlaylistDisabled(prizePlaylist) {
			return !prizePlaylist || prizePlaylist.length <= 0;
		}

		_handlePrizeListingAddTap(e) {
			this.addPrizeToPlayList(e.model.prize);
		}

		_handlePrizeListingRemoveTap(e) {
			this.removePrizeFromPlaylist(e.model.prize);
		}

		_calcPrizesInPlaylist(allPrizes, prizePlaylist) {
			if (!allPrizes || allPrizes.length === 0 ||
				!prizePlaylist || prizePlaylist.length === 0) {
				return [];
			}

			return prizePlaylist.map(playlistEntry => {
				return allPrizes.find(prize => {
					return prize.id === playlistEntry.id;
				});
			});
		}

		_calcPlaylistPrizeChecked(prize, prizePlaylist) {
			if (!prize || !prizePlaylist || prizePlaylist.length <= 0) {
				return false;
			}

			console.log(prize, prizePlaylist);

			const playlistEntry = prizePlaylist.find(pe => pe.id === prize.id);
			if (!playlistEntry) {
				return false;
			}

			return playlistEntry.complete;
		}
	}

	customElements.define(DashInterviewPrizes.is, DashInterviewPrizes);

	/**
	 * Given a prize Object or prize ID Number, will always return a prize ID Number.
	 * @param {Number|Object} prizeOrPrizeId - Either a prize Object or a prize ID Number.
	 * @returns {Number} - A prize ID Number.
	 */
	function disambiguatePrizeId(prizeOrPrizeId) {
		return typeof prizeOrPrizeId === 'object' ?
			prizeOrPrizeId.id :
			prizeOrPrizeId;
	}
})();
