(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class UiSortableList extends Polymer.MutableData(Polymer.Element) {
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
					value: 'id'
				}
			};
		}

		_ensureTemplatized() {
			if (!this._templatized) {
				this._templatized = true;
				const templateElement = this.querySelector('template[slot="item-body"]');
				if (templateElement) {
					this._itemTemplateClass = Polymer.Templatize.templatize(templateElement, this, {parentModel: true});
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
			console.log(event);
			nodecg.sendMessage(`sortable-list:${actionName}`, {
				replicantName: this.replicantName,
				replicantBundle: this.replicantBundle,
				itemIndex: event.model.index,
				itemId: event.model.item[this.itemIdField]
			});
		}
	}

	customElements.define(UiSortableList.is, UiSortableList);
})();
