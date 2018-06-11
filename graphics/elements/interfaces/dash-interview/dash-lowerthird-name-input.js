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
			name: {
				type: String,
				notify: true
			},
			title: {
				type: String,
				notify: true
			},
			disabled: Boolean,
			items: Array
		};
	}

	ready() {
		super.ready();
		this.$.name.$.input.style.fontSize = '24px';
		this.$.name.$.input.style.height = '45px';
		this.$.name.$.toggleIcon.style.height = '100%';
		this.$.name.$.toggleIcon.style.padding = '0';
		this.$.name.$.clearIcon.style.height = '100%';
		this.$.name.$.clearIcon.style.padding = '0';
	}

	clear() {
		this.$.name.value = '';
		this.$.name.value = '';
	}
}

customElements.define(DashLowerthirdNameInput.is, DashLowerthirdNameInput);
