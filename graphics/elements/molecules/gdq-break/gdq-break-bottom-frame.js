(function () {
	'use strict';

	const FADE_DURATION = 0.334;
	const FADE_OUT_EASE = Power1.easeIn;
	const FADE_IN_EASE = Power1.easeOut;

	const currentHost = nodecg.Replicant('currentHost');
	const nowPlaying = nodecg.Replicant('nowPlaying');

	const LOGO_FADE_INTERVAL = 20;
	const LOGO_FADE_DURATION = 1;
	const LOGO_FADE_OUT_EASE = Power1.easeIn;
	const LOGO_FADE_IN_EASE = Power1.easeOut;

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqBreakBottomFrame extends Polymer.Element {
		static get is() {
			return 'gdq-break-bottom-frame';
		}

		static get properties() {
			return {
				importPath: String // https://github.com/Polymer/polymer-linter/issues/71
			};
		}

		ready() {
			super.ready();

			currentHost.on('change', newVal => {
				this._changeText(this.$['host-text'], newVal);
			});

			nowPlaying.on('change', newVal => {
				this._changeText(this.$['music-text'], `${newVal.game || '?'} - ${newVal.title || '?'}`);
			});

			nodecg.listenFor('subscription', this._handleSubscription.bind(this));

			// Logo anim
			const logoTL = new TimelineMax({repeat: -1});

			logoTL.to(this.$.gdqLogo, LOGO_FADE_DURATION, {
				opacity: 1,
				ease: LOGO_FADE_IN_EASE
			});

			logoTL.to(this.$.gdqLogo, LOGO_FADE_DURATION, {
				opacity: 0,
				ease: LOGO_FADE_OUT_EASE
			}, `+=${LOGO_FADE_INTERVAL}`);

			logoTL.to(this.$.charityLogo, LOGO_FADE_DURATION, {
				opacity: 1,
				ease: LOGO_FADE_IN_EASE
			});

			logoTL.to(this.$.charityLogo, LOGO_FADE_DURATION, {
				opacity: 0,
				ease: LOGO_FADE_OUT_EASE
			}, `+=${LOGO_FADE_INTERVAL}`);
		}

		_changeText(element, newText) {
			TweenLite.to(element, FADE_DURATION, {
				opacity: 0,
				ease: FADE_OUT_EASE,
				callbackScope: this,
				onComplete() {
					element.text = newText;
					TweenLite.to(element, FADE_DURATION, {
						opacity: 1,
						ease: FADE_IN_EASE,
						delay: 0.05
					});
				}
			});
		}

		_handleSubscription(subscription) {
			let backgroundColor = 'white';
			let holdDuration = 0.067;
			let text = 'New';

			if (subscription.sub_plan && subscription.sub_plan.toLowerCase() === 'prime') {
				backgroundColor = '#6441a4';
				text = 'Prime';
			} else if (subscription.context && subscription.context.toLowerCase() === 'subgift') {
				backgroundColor = '#00ffff';
				text = 'Gift';
			} else if (subscription.sub_plan === '2000') {
				backgroundColor = '#ffba00';
				holdDuration *= 3;
				text = '$9.99';
			} else if (subscription.sub_plan === '3000') {
				backgroundColor = '#ff0099';
				holdDuration *= 6;
				text = '$24.99';
			}

			if (subscription.months <= 1) {
				text += ' Sub';
			} else {
				text += ` Resub x${subscription.months}`;
			}

			this.$.subscriptionAlerts.addAlert({
				text,
				backgroundColor,
				holdDuration
			});
		}
	}

	customElements.define(GdqBreakBottomFrame.is, GdqBreakBottomFrame);
})();
