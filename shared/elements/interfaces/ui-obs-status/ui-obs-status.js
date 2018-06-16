(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class UiObsStatus extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'ui-obs-status';
		}

		static get properties() {
			return {
				_namespaces: Array
			};
		}
	}

	customElements.define(UiObsStatus.is, UiObsStatus);
})();
