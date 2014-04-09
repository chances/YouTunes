// YouTunes Mute Button Element Directive Mute.js JavaScript Document

directives.directive('mute', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<button></button>',
		link: function (scope, element, attrs) {

			$rootScope.$watch('player.muted', function (newValue, oldValue) {
				if ($rootScope.player) {
					if ($rootScope.player.muted) {
						element.addClass('muted').attr('title', 'Unmute');
					} else {
                        if ($rootScope.player.volume > 0) { element.removeClass('muted'); }
						element.attr('title', 'Mute');
					}
				}
			});
			$rootScope.$watch('player.isReady', function (newValue, oldValue) {
				updateVisibility();
			});
			$rootScope.$watch('player.state', function (newValue, oldValue) {
				updateVisibility();
			});

			var updateVisibility = function () {
				if ((($rootScope.player.state === PlayerState.PLAYING ||
					$rootScope.player.state === PlayerState.PAUSED &&
					$rootScope.player.state !== PlayerState.ENDED)) ||
					$rootScope.player.isReady) {
					element.removeAttr('disabled');
				} else {
					element.attr('disabled','');
				}
			};

			element.click(function () {
				if (bg.player.muted) {
					bg.player.unmute();
                    if (bg.player.volume > 0) { element.removeClass('muted'); }
					element.attr('title', 'Mute');
				} else {
					bg.player.mute();
					element.addClass('muted').attr('title', 'Unmute');
				}
			});
		}
	};
});
