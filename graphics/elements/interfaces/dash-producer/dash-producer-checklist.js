(function () {
	'use strict';

	const checklist = nodecg.Replicant('checklist');

	/**
	 * @customElement
	 * @polymer
	 */
	class DashProducerChecklist extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'dash-producer-checklist';
		}

		static get properties() {
			return {
				stageTechDuties: Array,
				extraContent: Array,
				audioReady: Boolean,
				techStationDuties: Array,
				audioEngineerDuties: Array,
				specialDuties: Array
			};
		}

		ready() {
			super.ready();
			checklist.on('change', newVal => {
				this.extraContent = newVal.extraContent;
				this.techStationDuties = newVal.techStationDuties;
				this.stageTechDuties = newVal.stageTechDuties;
				this.audioEngineerDuties = newVal.audioEngineerDuties;
				this.specialDuties = newVal.special;
			});
		}

		_calcItemName(item) {
			return item ? (item.shortName || item.name) : '';
		}
	}

	customElements.define(DashProducerChecklist.is, DashProducerChecklist);
})();
