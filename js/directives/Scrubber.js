// YouTunes Scrubber Element Directive Scrubber.js JavaScript Document

directives.directive('scrubber', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div><div id="buffer"></div><div id="elapsed"></div></div>',
		link: function (scope, element, attrs) {

            var $buffer = $('#buffer'),
                $elapsed = $('#elapsed'),
                transition = element.css('transition'),
                childrenTransition = $buffer.css('transition');

            element.css('transition', 'none');
            element.find('div').css('transition', 'none')
            setTimeout(function () {
                element.css('transition', transition);
                element.find('div').css('transition', childrenTransition);
            }, 750);

            if ($rootScope.player.state === PlayerState.ENDED) {
                $buffer.width('0%');
                $elapsed.width('0%');
            }

			scope.$watch('player.elapsed', function (newValue, oldValue) {
				if ($rootScope.player) {
					//Buffer
					if ($rootScope.player.loaded !== 1.0) {
						$buffer.width($rootScope.player.loaded * 100 + '%');
					} else {
						$buffer.width('0%');
					}
					//Elapsed
					if (!element.hasClass('scrubbing')) {
						var elapsed = (($rootScope.player.elapsed + 0.0) / $rootScope.player.duration) * 100;
						$elapsed.width(elapsed + '%');
					}
				}
			});
			scope.$watch('player.state', function (newValue, oldValue) {
				if ($rootScope.player) {
					if (($rootScope.player.state === PlayerState.PLAYING ||
						$rootScope.player.state === PlayerState.PAUSED) &&
						$rootScope.player.state !== PlayerState.ENDED) {
						element.removeClass('hidden buffering');
                    } else if ($rootScope.player.state === PlayerState.BUFFERING) {
                        element.removeClass('hidden').addClass('buffering');
					} else {
						element.addClass('hidden');
					}
				}
			});

            element.on('webkitTransitionEnd', function (event) {
                if (event.target === element[0] &&
                    $rootScope.player.state === PlayerState.ENDED) {
                    $elapsed.width('0%');
                }
            });

			var seekPosition = null;
			element.on('mousedown', function () {
				if ($rootScope.player) {
					var x = event.clientX;
					var width = element.outerWidth(true);
					var percent = (x + 0.0) / width;
					seekPosition = Math.round(percent * $rootScope.player.duration);
					$elapsed.width((percent * 100) + '%');
					element.addClass('scrubbing');
					$('body').on('mousemove', function (event) {
						x = event.clientX;
						width = element.outerWidth(true);
						percent = (x + 0.0) / width;
						seekPosition = Math.round(percent * $rootScope.player.duration);
						$elapsed.width((percent * 100) + '%');
					});
				}
			});
			$('body').on('mouseup', function () {
				$(this).off('mousemove');
				if (element.hasClass('scrubbing') && seekPosition !== null) {
					bg.player.seek(seekPosition);
					element.removeClass('scrubbing');
					seekPosition = null;
				}
			});
		}
	};
});
