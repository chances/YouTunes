// YouTunes Previous and Next Buttons Element Directive PreviousNext.js JavaScript Document

directives.directive('previousButton', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<button></button>',
		link: function (scope, element, attrs) {

			$rootScope.$watch('player.currentPlaylist', function (newValue, oldValue) {
				var player = $rootScope.player;

                //Disabled state
                if (newValue === null || newValue.isQueue ||
                   newValue.peekPreviousTrack(player.isLoopingPlaylist) === null) {
                    element.attr('disabled','');
                } else {
                    element.removeAttr('disabled');
                }
			});

			element.click(function () {
                var player = $rootScope.player,
                    track = player.currentPlaylist.getPreviousTrack(player.isLoopingPlaylist);
				player.play(track);
			});
		}
	};
});

directives.directive('nextButton', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<button></button>',
		link: function (scope, element, attrs) {

			$rootScope.$watch('player.currentPlaylist', function (newValue, oldValue) {
				var player = $rootScope.player;

                //Disabled state
                if (newValue === null || newValue.peekNextTrack(player.isLoopingPlaylist) === null) {
                    element.attr('disabled','');
                } else {
                    element.removeAttr('disabled');
                }
			});

            $rootScope.$watch('player.currentTrack', function () {
				var player = $rootScope.player;

                //Disabled state
                if (player.currentPlaylist === null ||
                    player.currentPlaylist.peekNextTrack(player.isLoopingPlaylist) === null) {
                    element.attr('disabled','');
                } else {
                    element.removeAttr('disabled');
                }
			});

			element.click(function () {
                var player = $rootScope.player,
                    track = player.currentPlaylist.getNextTrack(player.isLoopingPlaylist);
				player.play(track);
			});
		}
	};
});
