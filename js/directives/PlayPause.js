// YouTunes Play Pause Button Element Directive PlayPause.js JavaScript Document

directives.directive('playPauseButton', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<button></button>',
		link: function (scope, element, attrs) {

			$rootScope.$watch('player.state', function (newValue, oldValue) {
				var player = $rootScope.player;
				if (player) {
					if (player.isPlaying()) {
						element.removeClass('play').addClass('pause').attr('title', 'Pause');
					} else {
						element.removeClass('pause').addClass('play').attr('title', 'Play');
					}

					//Disabled state
					if ((player === null || !player.isReady) ||
						(player.state === PlayerState.UNSTARTED || player.state === PlayerState.CUED) ||
						player.error !== null || player.currentTrack === null ||
                        (player.state === PlayerState.ENDED &&
                         player.currentPlaylist !== null && player.currentPlaylist.peekNextTrack(player.isLoopingPlaylist) === null)) {
						element.attr('disabled','');
					} else {
						element.removeAttr('disabled');
					}
				}
			});

			element.click(function () {
				if ($rootScope.player.isPlaying()) {
					$rootScope.player.pause();
					element.removeClass('pause').addClass('play').attr('title', 'Play');
				} else {
					$rootScope.player.play();
					element.removeClass('play').addClass('pause').attr('title', 'Pause');
				}
			});
		}
	};
});
