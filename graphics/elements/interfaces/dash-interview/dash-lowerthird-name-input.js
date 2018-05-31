class DashLowerthirdNameInput extends Polymer.Element {
	static get is() {
		return 'dash-lowerthird-name-input';
	}

	static get properties() {
		return {
			selectedItem: {
				type: String,
				notify: true
			},
			value: {
				type: String,
				notify: true
			},
			disabled: Boolean,
			items: Array
		};
	}

	ready() {
		super.ready();
		this.$.input.$.input.style.fontSize = '24px';
		this.$.input.$.input.style.height = '45px';
		this.$.input.$.toggleIcon.style.height = '100%';
		this.$.input.$.toggleIcon.style.padding = '0';
		this.$.input.$.clearIcon.style.height = '100%';
		this.$.input.$.clearIcon.style.padding = '0';
	}

	clear() {
		this.$.input.value = '';
	}
}

customElements.define(DashLowerthirdNameInput.is, DashLowerthirdNameInput);
