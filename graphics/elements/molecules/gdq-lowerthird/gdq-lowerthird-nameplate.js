(function () {
	'use strict';

	const ENTRANCE_ANIM_DURATION = 1;
	const ENTRANCE_ANIM_EASE = Power2.easeInOut;

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqLowerthirdNameplate extends Polymer.Element {
		static get is() {
			return 'gdq-lowerthird-nameplate';
		}

		static get properties() {
			return {};
		}

		updateName(...args) {
			return this.$.nameplate.updateName(...args);
		}

		enter() {
			const tl = new TimelineLite();

			tl.to(this.$.occluder, ENTRANCE_ANIM_DURATION, {
				x: '250%',
				ease: ENTRANCE_ANIM_EASE
			}, 0);

			tl.to(this.$.nameplate, ENTRANCE_ANIM_DURATION, {
				clipPath: 'inset(0 0% 0 0)',
				ease: ENTRANCE_ANIM_EASE
			}, 0);

			return tl;
		}

		reset() {
			TweenLite.set(this.$.occluder, {x: '-100%'});
			TweenLite.set(this.$.nameplate, {clipPath: 'inset(0 100% 0 0)'});
		}
	}

	customElements.define(GdqLowerthirdNameplate.is, GdqLowerthirdNameplate);
})();
