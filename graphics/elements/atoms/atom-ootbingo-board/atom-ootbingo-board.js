(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class AtomOotbingoBoard extends Polymer.Element {
		static get is() {
			return 'atom-ootbingo-board';
		}

		static get properties() {
			return {};
		}

		_calcComplete(cell) {
			if (!cell) {
				return false;
			}

			return cell.colors.length > 0 && cell.colors !== 'none' && cell.colors !== 'blank';
		}
	}

	customElements.define(AtomOotbingoBoard.is, AtomOotbingoBoard);
})();
