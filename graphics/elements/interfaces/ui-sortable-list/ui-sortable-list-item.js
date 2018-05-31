(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class UiSortableListItem extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'ui-sortable-list-item';
		}

		static get properties() {
			return {
				/**
				 * The index of the item
				 */
				index: Number,

				/**
				 * The item to render
				 * @type {(String|Object)}
				 */
				item: Object,

				/**
				 * The array of all item
				 */
				items: Array,

				/**
				 * The template instance corresponding to the item
				 */
				_itemTemplateInstance: Object
			};
		}

		static get observers() {
			return [
				'_updateTemplateInstanceVariable("index", index, _itemTemplateInstance)',
				'_updateTemplateInstanceVariable("item", item, _itemTemplateInstance)'
			];
		}

		connectedCallback() {
			super.connectedCallback();
			if (!this._itemTemplateInstance) {
				const sortableList = this.parentNode.host;
				sortableList._ensureTemplatized();
				if (sortableList._itemTemplateClass) {
					this._itemTemplateInstance = new sortableList._itemTemplateClass();
					this.shadowRoot.appendChild(this._itemTemplateInstance.root);
				}
			}
		}

		_updateTemplateInstanceVariable(variable, value, _itemTemplateInstance) {
			if (variable === undefined || value === undefined || _itemTemplateInstance === undefined) {
				return;
			}
			_itemTemplateInstance[variable] = value;
		}

		_calcUpDisabled(index) {
			return index === 0;
		}

		_calcDownDisabled(index, items) {
			if (!items) {
				return true;
			}

			return index === (items.length - 1);
		}

		_moveItemUpPressed() {
			this.dispatchEvent(new CustomEvent('move-item-up'));
		}

		_moveItemDownPressed() {
			this.dispatchEvent(new CustomEvent('move-item-down'));
		}
	}

	customElements.define(UiSortableListItem.is, UiSortableListItem);
})();
