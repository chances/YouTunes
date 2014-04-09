// YouTunes Track Info Element Directive TrackInfo.js JavaScript Document

directives.directive('trackInfo', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template: '<div id="trackInfo" ng-transclude></div>',
		link: function (scope, element, attrs) {

            var $popup = $('#popup'),
                isRevealed = false,
                $playerPane = $('#playerPane'),
                playerPaneDisplay = $playerPane.css('display'),
                $track = $('#track'),
                HOLD_TIME = 3000,
                scrollWidth = element[0].scrollWidth,
                width = $track.outerWidth(true),
                offset = scrollWidth - width,
                animationName = null,
                transform = $.keyframe.getVendorPrefix() + 'transform',
                overflow = function () {
                    offset = scrollWidth - width;
                    animationName = 'scroll-text-' + $rootScope.player.currentTrack.id;
                    $.keyframe.define({
                        name: animationName,
                        from: {
                            transform: 'translateX(0px)'
                        },
                        to: {
                            transform: 'translateX(' + (0 - offset) + 'px)'
                        }
                    });
                    doAnimation(Math.round(offset * 25));
                },
                doAnimation = function (duration, direction) {
                    direction = (direction === undefined) ? 'normal' : direction;
                    $track.resetKeyframe(function () {
                        $track.playKeyframe({
                            name: animationName,
                            duration: duration,
                            timingFunction: 'ease-in-out',
                            delay: HOLD_TIME,
                            direction: direction,
                            complete: function () {
                                direction = (direction === 'normal') ? 'reverse' : 'normal';
                                doAnimation(duration, direction);
                            }
                        });
                        if (direction === 'reverse') {
                            $track.css(transform, 'translateX(' + (0 - offset) + 'px)');
                        } else {
                            $track.css(transform, 'none');
                        }
                    });
                },
                checkOverflow = function () {
                    var revertPlayerPaneDisplay = false;
                    if ($playerPane.css('display') === 'none') {
                        revertPlayerPaneDisplay = true;
                        $playerPane.css('display', playerPaneDisplay);
                    }
                    setTimeout(function () {
                        //Check for overflow
                        scrollWidth = element[0].scrollWidth;
                        width = $track.outerWidth(true);
                        if (revertPlayerPaneDisplay) {
                            $playerPane.css('display', playerPaneDisplay);
                        }
                        offset = scrollWidth - width;
                        if (offset > 0) {
                            overflow();
                            // Don't animate if search is revealed
                            if (isRevealed) {
                                $track.pauseKeyframe();
                            }
                        } else {
                            $track.css(transform, 'none');
                        }
                    }, 50);
                };

            if ($rootScope.player && $rootScope.player.isReady && $rootScope.player.currentTrack !== null) {
                checkOverflow();
            }

            $popup.on('webkitTransitionEnd', function (event) {
                if (event.target === $popup[0]) {
                    isRevealed = !isRevealed;
                    if (isRevealed) {
                        $track.pauseKeyframe();
                    } else {
                        $track.resumeKeyframe();
                    }
                }
            });
            $track.hover(function () {
                $track.pauseKeyframe();
            }, function () {
                $track.resumeKeyframe();
            })

			$rootScope.$watch('player.currentTrack', function (newValue, oldValue) {
				if (newValue !== oldValue) {
                    //Stop and/or delete old animation
                    $track.resetKeyframe();
                    $('head .keyframe-style').remove();
                    if ( newValue !== null) { checkOverflow(); }
				}
			});
		}
	};
});
