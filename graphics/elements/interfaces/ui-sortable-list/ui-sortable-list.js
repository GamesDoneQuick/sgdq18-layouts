(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 * @appliesMixin window.MapSortMixin
	 */
	class UiSortableList extends window.MapSortMixin(Polymer.MutableData(Polymer.Element)) {
		static get is() {
			return 'ui-sortable-list';
		}

		static get properties() {
			return {
				replicantName: {
					type: String
				},
				replicantBundle: {
					type: String,
					value: window.nodecg.bundleName
				},
				itemIdField: {
					type: String,
					value: ''
				},
				items: {
					type: Array
				},
				sort: {
					type: Function
				},
				_itemsReplicantValue: {
					type: Array
				},
				_actualItems: {
					type: Array,
					computed: '_computeActualItems(items, _itemsReplicantValue)'
				}
			};
		}

		ready() {
			super.ready();
			this._flashAddedNodes(this.shadowRoot, 'ui-sortable-list-item');
		}

		_computeActualItems(items, _itemsReplicantValue) {
			if (Array.isArray(items)) {
				return items;
			}

			return _itemsReplicantValue;
		}

		_ensureTemplatized() {
			if (!this._templatized) {
				this._templatized = true;
				const templateElement = this.querySelector('template[slot="item-body"]');
				if (templateElement) {
					this._itemTemplateClass = Polymer.Templatize.templatize(templateElement, this, {
						forwardHostProp(prop, value) {
							if (prop === 'item' || prop === 'index') {
								return;
							}

							const items = Array.from(this.shadowRoot.querySelectorAll('ui-sortable-list-item'));
							items.forEach(item => {
								if (item._itemTemplateInstance) {
									item._itemTemplateInstance.set(prop, value);
								}
							});
						},
						parentModel: true
					});
				}
			}
		}

		_moveItemUpPressed(event) {
			this._sendItemAction('moveItemUp', event);
		}

		_moveItemDownPressed(event) {
			this._sendItemAction('moveItemDown', event);
		}

		_sendItemAction(actionName, event) {
			nodecg.sendMessage(`sortable-list:${actionName}`, {
				replicantName: this.replicantName,
				replicantBundle: this.replicantBundle,
				itemIndex: event.model.index,
				itemId: this.itemIdField && event.model.item[this.itemIdField],
				itemIdField: this.itemIdField
			});
		}
	}

	customElements.define(UiSortableList.is, UiSortableList);
})();
