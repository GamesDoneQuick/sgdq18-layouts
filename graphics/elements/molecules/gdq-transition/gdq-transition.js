(function () {
	'use strict';

	CustomEase.create('ModifiedPower2EaseInOut', 'M0,0 C0.66,0 0.339,1 1,1');

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqTransition extends Polymer.Element {
		static get is() {
			return 'gdq-transition';
		}

		static get properties() {
			return {};
		}

		ready() {
			super.ready();

			if (!window.__SCREENSHOT_TESTING__) {
				// TODO: remove this when done developing this particular animation.
				setTimeout(() => {
					this.fromClosedToBreak();
				}, 1000);
			}
		}

		fromClosedToBreak() {
			const tl = new TimelineLite();

			// Start frame = 211

			tl.addLabel('frontRects', 0);
			tl.addLabel('frontTraps', 0.1);

			// Front rects.
			tl.to(this.$.bottomFrontRect, 0.2167, {
				x: 21,
				y: 256.6,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontRects');
			tl.to(this.$.topFrontRect, 0.2167, {
				x: -8,
				y: -279,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontRects');

			// Front traps.
			tl.to(this.$.bottomFrontTrapezoid, 0.2667, {
				x: -402,
				y: 291.2,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontTraps');
			tl.to(this.$.topFrontTrapezoid, 0.2667, {
				x: 6,
				y: -283.4,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontTraps');

			return tl;
		}
	}

	customElements.define(GdqTransition.is, GdqTransition);
})();
