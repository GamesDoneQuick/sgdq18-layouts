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
			tl.addLabel('backRects', 0.1667);
			tl.addLabel('backTraps', 0.2334);

			// Front rects.
			tl.to(this.$.bottomFrontRect, 0.2167, {
				x: 26,
				y: 321,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontRects');
			tl.to(this.$.topFrontRect, 0.2167, {
				x: -10,
				y: -349,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontRects');

			// Front traps.
			tl.to(this.$.bottomFrontTrapezoid, 0.2667, {
				x: -503,
				y: 364,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontTraps');
			tl.to(this.$.topFrontTrapezoid, 0.2667, {
				x: 8,
				y: -417,
				ease: 'ModifiedPower2EaseInOut'
			}, 'frontTraps');

			// Back rects.
			tl.to(this.$.bottomBackRect, 0.2334, {
				x: -26,
				y: 323,
				ease: 'ModifiedPower2EaseInOut'
			}, 'backRects');
			tl.to(this.$.topBackRect, 0.2334, {
				x: -10,
				y: -351,
				ease: 'ModifiedPower2EaseInOut'
			}, 'backRects');

			// Back traps.
			tl.to(this.$.bottomBackTrapezoid, 0.2334, {
				x: -490,
				y: 374,
				ease: 'ModifiedPower2EaseInOut'
			}, 'backTraps');
			tl.to(this.$.topBackTrapezoid, 0.2334, {
				x: 0,
				y: -426,
				ease: 'ModifiedPower2EaseInOut'
			}, 'backTraps');

			return tl;
		}
	}

	customElements.define(GdqTransition.is, GdqTransition);
})();
