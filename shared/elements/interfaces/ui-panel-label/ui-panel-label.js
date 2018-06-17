(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class UiPanelLabel extends Polymer.Element {
		static get is() {
			return 'ui-panel-label';
		}

		static get properties() {
			return {};
		}
	}

	customElements.define(UiPanelLabel.is, UiPanelLabel);
})();
