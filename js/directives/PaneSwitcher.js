// YouTunes Search Button Element & Back Button Directives PaneSwitcher.js JavaScript Document

directives.directive('searchButton', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<button title="Search"></button>',
		link: function (scope, element, attrs) {

			var popup = $('#popup'),
                isRevealed = false,
                playerPane = $('#playerPane'),
                searchPane = $('#searchPane'),
                searchPaneDisplay = searchPane.css('display'),
				query = $('#query'),
				results = $('#results');

            searchPane.css('display', 'none');

            //Prevent non-visible panes from being focused via tabbing
            popup.on('webkitTransitionEnd', function (event) {
                if (event.target === popup[0]) {
                    if (isRevealed) {
                        searchPane.css('display', 'none');
                    } else {
                        playerPane.css('display', 'none');
                        query.focus().select();
                        popup.addClass('lock');
                        results.removeClass('short');
                    }
                    isRevealed = !isRevealed;
                }
            });

			element.click(function () {
				popup.addClass('reveal');
                searchPane.css('display', searchPaneDisplay);
			});
		}
	};
});

directives.directive('backButton', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<button title="Back"></button>',
		link: function (scope, element, attrs) {

			var popup = $('#popup'),
                playerPane = $('#playerPane'),
                playerPaneDisplay = playerPane.css('display'),
				results = $('#results'),
				hasResults = $rootScope.search.totalResultCount > 0;

			scope.$watch('search.totalResultCount', function () {
				hasResults = $rootScope.search.totalResultCount > 0;
			});

            results.on('webkitTransitionEnd', function (event) {
                if (event.target === results[0]) {
                    //TODO: Make this work
                }
            });

			element.click(function () {
				if (hasResults) {
					results.addClass('short');
					setTimeout(function () {
                        playerPane.css('display', playerPaneDisplay);
						popup.removeClass('reveal lock');
					}, 300);
				} else {
                    playerPane.css('display', playerPaneDisplay);
					popup.removeClass('reveal lock');
				}
			});
		}
	};
});

directives.directive('playlistsButton', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<button title="Show Playlists"></button>',
		link: function (scope, element, attrs) {

			var $playerPane = $('#playerPane'),
                $playlistsPane = $('#playlistsPane'),
                $mask = $('#mask'),
                $closePlaylists = $('#closePlaylists');

			element.click(function () {
				$playlistsPane.removeClass('hidden').addClass('transitory');
                $mask.removeClass('hidden').addClass('transitory');
                $playerPane.find('button').not(':disabled').attr('disabled','disabled').addClass('masked');
                setTimeout(function () {
                    $playlistsPane.removeClass('transitory');
                    $mask.removeClass('transitory');
                }, 5);
			});
		}
	};
});

directives.directive('closePlaylistsButton', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<button title="Hide Playlists"></button>',
		link: function (scope, element, attrs) {

			var $playerPane = $('#playerPane'),
                $playlistsPane = $('#playlistsPane'),
                $mask = $('#mask'),
                closing = false,
                close = function () {
                    $playlistsPane.addClass('transitory');
                    $mask.addClass('transitory');
                    closing = true;
                };

			element.click(function () {
				close();
			});
            $mask.click(function () {
				close();
			});

            $mask.on('webkitTransitionEnd', function (event) {
                if (event.target === $mask[0] && closing) {
                    $playlistsPane.removeClass('transitory').addClass('hidden');
                    $mask.removeClass('transitory').addClass('hidden');
                    $playerPane.find('button.masked').removeAttr('disabled').removeClass('masked');
                    closing = false;
                }
            });
		}
	};
});
