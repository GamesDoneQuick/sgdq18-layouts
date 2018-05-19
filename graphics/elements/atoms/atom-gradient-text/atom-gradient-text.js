/**
 * @customElement
 * @polymer
 */
class AtromGradientText extends Polymer.Element {
	static get is() {
		return 'atom-gradient-text';
	}

	static get properties() {
		return {
			text: String,
			align: {
				type: String,
				reflectToAttribute: true
			},
			maxWidth: Number
		};
	}

	ready() {
		super.ready();

		// Workaround for: https://bugs.chromium.org/p/chromium/issues/detail?id=844880
		this.shadowRoot.querySelectorAll('sc-fitted-text').forEach(node => {
			node.$.fittedContent.style.webkitBackgroundClip = 'text';
		});
	}
}

customElements.define(AtromGradientText.is, AtromGradientText);
