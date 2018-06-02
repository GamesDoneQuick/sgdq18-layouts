/* global Random */
(function () {
	'use strict';

	const NAME_ELEMENT_ENTRANCE_STAGGER = 0.1;
	const interviewNames = nodecg.Replicant('interview:names');
	const lowerthirdShowing = nodecg.Replicant('interview:lowerthirdShowing');

	/**
	 * @customElement
	 * @polymer
	 * @appliesMixin Polymer.MutableData
	 */
	class GdqLowerthird extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'gdq-lowerthird';
		}

		static get properties() {
			return {
				tl: {
					type: TimelineLite,
					value() {
						return new TimelineLite({autoRemoveChildren: true});
					},
					readOnly: true
				},
				preview: {
					type: Boolean,
					reflectToAttribute: true,
					value: false
				},
				numNames: {
					type: Number,
					reflectToAttribute: true
				}
			};
		}

		ready() {
			super.ready();

			this._$nameElements = Array.from(this.shadowRoot.querySelectorAll('#mainNames gdq-lowerthird-nameplate, #hostName gdq-lowerthird-nameplate'));

			this.reset();

			if (!this.preview && !window.__SCREENSHOT_TESTING__) {
				lowerthirdShowing.on('change', newVal => {
					if (newVal) {
						this.tl.add(this.show());
					} else {
						this.tl.add(this.hide());
					}
				});
			}
		}

		updatePreview(names) {
			this.show(names).progress(1);
		}

		show(prefilledNames) {
			const tl = new TimelineLite();
			const names = prefilledNames ?
				prefilledNames :
				interviewNames.value.filter(name => Boolean(name) && name.trim().length > 0);
			if (names.length <= 0) {
				return tl;
			}

			const nameElementsToShow = this._$nameElements.slice(0, names.length);
			const randomizedNameElements = Random.shuffle(Random.engines.browserCrypto, nameElementsToShow.slice(0));

			this.reset();

			tl.call(() => {
				this.numNames = names.length;
			});

			// Set names
			tl.call(() => {
				this._$nameElements.forEach((nameElement, index) => {
					nameElement.updateName({alias: names[index], twitchAlias: null, rotate: false});
					nameElement.hidden = !names[index];
				});
			}, null, null, '+=0.3'); // Give time for interviewNames replicant to update.

			tl.to(this.$.background, 0.75, {
				y: '0%',
				ease: Power4.easeOut
			});

			tl.addLabel('nameElementsEnter');

			tl.call(() => {
				// tl.timeScale(0.2);
			}, null, null, 'nameElementsEnter');

			randomizedNameElements.forEach((nameElem, index) => {
				tl.add(nameElem.enter(), `nameElementsEnter+=${NAME_ELEMENT_ENTRANCE_STAGGER * index}`);
				if (nameElem.id === 'hostName-actual') {
					tl.to(this.$['hostName-label'], 0.4, {
						y: '0%',
						ease: Power2.easeOut,
						callbackScope: this,
						onStart() {
							this.$['hostName-label'].style.opacity = 1;
						}
					}, '-=0.1');
				}
			});

			return tl;
		}

		hide() {
			const tl = new TimelineLite();
			tl.to(this, 0.5, {
				y: '100%',
				ease: Power1.easeIn
			});
			return tl;
		}

		reset() {
			this._$nameElements.forEach(nameElem => nameElem.reset());
			TweenLite.set(this.$.background, {y: '100%'});
			TweenLite.set(this.$['hostName-label'], {y: '-100%', opacity: 0});
			TweenLite.set(this, {y: '0%', opacity: 1});
		}
	}

	customElements.define(GdqLowerthird.is, GdqLowerthird);
})();
