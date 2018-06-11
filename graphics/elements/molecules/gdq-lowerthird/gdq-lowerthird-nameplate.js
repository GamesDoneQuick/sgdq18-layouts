(function () {
	'use strict';

	const ENTRANCE_ANIM_DURATION = 0.5;
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
			return {
				importPath: String, // https://github.com/Polymer/polymer-linter/issues/71
				header: {
					type: Boolean,
					reflectToAttribute: true,
					value: false
				},
				name: {
					type: String,
					observer: '_nameChanged'
				},
				title: {
					type: String
				},
				hasTitle: {
					type: Boolean,
					reflectToAttribute: true,
					computed: '_computeHasTitle(title)'
				}
			};
		}

		enter() {
			const tl = new TimelineLite();

			tl.to(this.$.occluder, ENTRANCE_ANIM_DURATION, {
				x: '250%',
				ease: ENTRANCE_ANIM_EASE
			}, 0);

			tl.to(this.$.clipped, ENTRANCE_ANIM_DURATION, {
				clipPath: 'inset(0 0% 0 0)',
				ease: ENTRANCE_ANIM_EASE
			}, 0);

			tl.to(this.$.title, 0.4, {
				y: '0%',
				ease: Power2.easeOut,
				callbackScope: this,
				onStart() {
					this.$.title.style.opacity = 1;
					this.$['title-text'].maxWidth = this.$.title.clientWidth - 60;
				}
			}, '-=0.1');

			return tl;
		}

		reset() {
			TweenLite.set(this.$.occluder, {x: '-100%'});
			TweenLite.set(this.$.clipped, {clipPath: 'inset(0 100% 0 0)'});
			TweenLite.set(this.$.title, {y: '-100%', opacity: 0});
		}

		_nameChanged(newVal) {
			return this.$.nameplate.updateName({alias: newVal, twitchAlias: null, rotate: false});
		}

		_computeHasTitle(title) {
			return Boolean(title && title.trim().length > 0);
		}
	}

	customElements.define(GdqLowerthirdNameplate.is, GdqLowerthirdNameplate);
})();
