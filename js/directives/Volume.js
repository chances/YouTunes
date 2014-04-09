// YouTunes Volume Control Element Directive Volume.js JavaScript Document

directives.directive('volume', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div><div id="well"></div><div id="wellTrail"></div><div id="handle"></div></div>',
		link: function (scope, element, attrs) {

            var mute = $('#mute'),
                well = $('#well'),
                wellTrail = $('#wellTrail'),
                handle = $('#handle'),
                adjustMetrics = function (newVolume) {
                    var volume = (newVolume === undefined) ? $rootScope.player.volume : newVolume,
                        width = element.outerHeight(true),
                        posX = width - (width * (volume / 100));
                    wellTrail.css('width', volume + '%');
                    // Adjust position so that the thumb isn't clipped
                    posX = posX < 2.5 ? 2.5 : posX;
                    handle.css('left', posX + 'px');
                };

            $rootScope.$watch('player.volume', function (newValue, oldValue) {
                adjustMetrics();
                if (newValue < 50.0) {
                    if (newValue === 0.0) {
                        mute.removeClass('low').addClass('muted');
                    } else {
                        mute.removeClass('muted').addClass('low');
                    }
                } else {
                    mute.removeClass('low muted');
                }
			});

            var newVolume = null,
                tracking = false,
                hideOnEndTracking = false,
                beginTracking = function () {
                    if ($rootScope.player) {
                        var x = event.clientX - element.offset().left,
                            width = element.outerWidth(true),
                            percent = 1 - ((x + 0.0) / width);
                        tracking = true;
                        console.log(percent);
                        percent = (percent < 0) ? 0 : percent;
                        percent = (percent > 1) ? 1 : percent;
                        newVolume = Math.round(percent * 100);
                        adjustMetrics(percent * 100);
                        bg.player.setVolume(newVolume);
                        $(document).on('mousemove', function (event) {
                            x = event.clientX - element.offset().left;
                            percent = 1 - ((x + 0.0) / width);
                            percent = (percent < 0) ? 0 : percent;
                            percent = (percent > 1) ? 1 : percent;
                            newVolume = Math.round(percent * 100);
                            adjustMetrics(percent * 100);
                            bg.player.setVolume(newVolume);
                        });
                    }
                };
            well.on('mousedown', function () {
				beginTracking();
			});
            wellTrail.on('mousedown', function () {
				beginTracking();
			});
			handle.on('mousedown', function () {
				beginTracking();
			});
			$(document).on('mouseup', function () {
				$(this).off('mousemove');
                tracking = false;
				if (element.hasClass('scrubbing') && seekPosition !== null) {
                    if (bg.player.volume !== newVolume) {
					   bg.player.setVolume(newVolume);
                    }
					newVolume = null;
				}
                if (hideOnEndTracking) {
                    tryToHide();
                    hideOnEndTracking = false;
                }
			});

            // Hide or Show the slider
            var visibleTimeout = null,
                show = function () {
                    cancelHide();
                    element.removeClass('hidden').addClass('hiding');
                    setTimeout(function () {
                        element.removeClass('hiding');
                    }, 5);
                },
                tryToHide = function () {
                    if (!tracking) {
                        if (!muteFocused) {
                            element.on('mousemove', function () {
                                cancelHide();
                            });
                            visibleTimeout = setTimeout(function () {
                                element.addClass('hiding');
                                cancelHide();
                            }, 250);
                        }
                    } else { hideOnEndTracking = true; }
                },
                cancelHide = function() {
                    element.off('mousemove');
                    clearTimeout(visibleTimeout);
                    visibleTimeout = null;
                };
            mute.hover(function () {
                show();
            }, function () {
                tryToHide();
            });
            element.mouseleave( function () {
                tryToHide();
            });
            element.on('webkitTransitionEnd', function (event) {
                if (event.target === element[0] && element.hasClass('hiding')) {
                   element.removeClass('hiding').addClass('hidden');
                }
            });

            // Allow volume change when mute button is focused
            // This makes the component more accessible
            var muteFocused = false,
                VOLUME_INCREMENT = 5;
            mute.focusin(function () {
                muteFocused = true;
                show();
            }).focusout(function () {
                muteFocused = false;
                tryToHide();
            });
            $(document).keydown(function (event) {
                if (muteFocused || ( !element.hasClass('hidden') || !element.hasClass('hiding') )) {
                    var newVolume = bg.player.volume;
                    if (event.which === 37) { // Left arrow
                        newVolume += VOLUME_INCREMENT;
                    } else if (event.which === 39) { // Right arrow
                        newVolume -= VOLUME_INCREMENT;
                    }
                    if (newVolume < 0) { newVolume = 0; }
                    if (newVolume > 100) { newVolume = 100; }
                    angular.element(appElement).scope().$apply(function(scope) {
                        scope.player.volume = newVolume;
                    });
                    bg.player.setVolume(newVolume);
                }
            });
        }
    };
});
