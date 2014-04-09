// YouTunes Player Pane Element Directive PlayerView.js JavaScript Document

directives.directive('playerView', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template: '<div ng-transclude></div>',
		link: function (scope, element, attrs) {

            var transition = element.css('transition'),
                bottomToolbar = element.find('.toolbar.inset-bottom'),
                bottomToolbarTransition = bottomToolbar.css('transition'),
                preloadImage = function (url) {
                    try {
                        var img = new Image();
                        img.src = url;
                    } catch (e) { }
                };
            element.css('transition', 'none');
            bottomToolbar.css('transition', 'none');
			setTimeout(function () {
                element.css('transition', transition);
                bottomToolbar.css('transition', bottomToolbarTransition);
            }, 1000);

			if ($rootScope.player && $rootScope.player.currentTrack !== null) {
				element.css('background-image', 'url(' + $rootScope.player.currentTrack.coverPhoto + ')');
				element.parent().removeClass('startup');
                if ($rootScope.player.currentPlaylist === null) {
                    element.parent().addClass('single-track');
                } else {
                    if ($rootScope.player.currentPlaylist.isQueue) {
                        element.parent().addClass('queue');
                    } else {
                        element.parent().addClass('playlist');
                    }
                    // Preload cover photos
                    for (var i in $rootScope.player.currentPlaylist.tracks) {
                        preloadImage($rootScope.player.currentPlaylist.tracks[i].coverPhoto);
                    }
                }
			}

			$rootScope.$watch('player.state', function (newValue, oldValue) {
				if ($rootScope.player) {
					if ($rootScope.player.isPlaying() || newValue === PlayerState.PAUSED) {
						element.parent().removeClass('startup').addClass('playing');
					} else {
						element.parent().removeClass('playing');
					}
				}
			});

			$rootScope.$watch('player.preparing', function (newValue) {
				if (newValue === true) {
                    element.parent().removeClass('startup');
				}
			});

			$rootScope.$watch('player.currentTrack', function (newValue, oldValue) {
				if (newValue !== oldValue && newValue !== null) {
					element.css('background-image', 'url(' + newValue.coverPhoto + ')');
                    if ($rootScope.player.currentPlaylist === null) {
                        element.parent().removeClass('queue playlist').addClass('single-track');
                    } else {
                        element.parent().removeClass('single-track');
                    }
				}
			});

            $rootScope.$watch('player.currentPlaylist', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue === null) {
                        element.parent().removeClass('queue playlist');
                    } else {
                        if (newValue.isQueue) {
                            element.parent().removeClass('playlist').addClass('queue');
                        } else {
                            element.parent().removeClass('queue').addClass('playlist');
                        }
                        // Preload cover photos
                        for (var i in newValue.tracks) {
                            preloadImage(newValue.tracks[i].coverPhoto);
                        }
                    }
                }
            });
		}
	};
});
