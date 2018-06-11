(function () {
	'use strict';

	const boardRep = nodecg.Replicant('ootBingo:board');

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class DashOotbingo extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'dash-ootbingo';
		}

		static get properties() {
			return {
				socket: {
					type: String
				},
				status: {
					type: String,
					reflectToAttribute: true,
					computed: '_computeStatus(socket)'
				},

				// Private state
				_submitting: {
					type: Boolean,
					value: false
				}
			};
		}

		ready() {
			super.ready();
			this._$lineSelectors = Array.from(this.shadowRoot.querySelectorAll('.lineSelector'));
			this._$lineSelectors.forEach(button => {
				button.addEventListener('click', event => {
					nodecg.sendMessage('ootBingo:selectLine', event.target.innerText.toLowerCase());
				});
			});

			boardRep.on('change', newVal => {
				if (!newVal) {
					return;
				}

				this._$lineSelectors.forEach(button => {
					if (button.innerText.toLowerCase() === newVal.selectedLine) {
						button.setAttribute('selected', 'true');
					} else {
						button.removeAttribute('selected');
					}
				});
			});
		}

		toggleLineFocus() {
			nodecg.sendMessage('ootBingo:toggleLineFocus');
		}

		toggleCard() {
			nodecg.sendMessage('ootBingo:toggleCard');
		}

		toggleEmbiggen() {
			nodecg.sendMessage('ootBingo:toggleEmbiggen');
		}

		async submit() {
			this._submitting = true;
			await nodecg.sendMessage('ootBingo:joinRoom', {
				siteUrl: this.$.siteUrl.value,
				socketUrl: this.$.socketUrl.value,
				playerName: this.$.playerName.value,
				roomCode: this.$.roomCode.value,
				passphrase: this.$.passphrase.value
			});
			this._submitting = false;
		}

		defaults() {
			this.$.siteUrl.value = 'https://bingosync.com';
			this.$.socketUrl.value = 'wss://sockets.bingosync.com';
			this.$.playerName.value = 'NodeCG';
		}

		_computeStatus(socket) {
			if (!socket) {
				return 'disconnected';
			}

			return socket.status;
		}

		_calcToggleClass(cardHidden) {
			return cardHidden ? 'green' : 'red';
		}

		_calcFocusToggleText(lineFocused) {
			return lineFocused ?
				'See whole board' :
				'Focus on selected group';
		}

		_calcToggleCardText(cardHidden) {
			return cardHidden ? 'Show Card' : 'Hide Card';
		}

		_calcToggleEmbiggenText(embiggen) {
			return embiggen ? 'Debiggen Card' : 'Embiggen Card';
		}
	}

	customElements.define(DashOotbingo.is, DashOotbingo);
})();
