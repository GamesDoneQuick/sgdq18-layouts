(function () {
	'use strict';

	const boardRep = nodecg.Replicant('ootBingo:board');
	const urlParams = new URLSearchParams(window.location.search);
	let EMBIGGEN = urlParams.get('embiggen');
	if (EMBIGGEN === 'true') {
		EMBIGGEN = true;
		window.title += ' - EMBIGGENED';
	} else if (EMBIGGEN === 'false') {
		EMBIGGEN = false;
		window.title += ' - debiggened';
	} else {
		EMBIGGEN = null;
	}

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqOotbingoBoard extends Polymer.Element {
		static get is() {
			return 'gdq-ootbingo-board';
		}

		static get properties() {
			return {
				embiggened: {
					type: Boolean,
					reflectToAttribute: true,
					value: EMBIGGEN
				},
				_embiggenState: {
					type: Boolean,
					value: false,
					observer: '_embiggenStateChanged'
				}
			};
		}

		ready() {
			super.ready();
			boardRep.on('change', newVal => {
				if (!newVal) {
					return;
				}

				this._embiggenState = newVal.embiggen;
			});
		}

		_embiggenStateChanged(newVal) {
			if (EMBIGGEN === null) {
				return;
			}

			if ((newVal && EMBIGGEN) || (!newVal && !EMBIGGEN)) {
				TweenLite.to(this, 0.3, {
					opacity: 1,
					ease: Sine.easeInOut
				});
			} else {
				TweenLite.to(this, 0.3, {
					opacity: 0,
					ease: Sine.easeInOut
				});
			}
		}
	}

	customElements.define(GdqOotbingoBoard.is, GdqOotbingoBoard);
})();
