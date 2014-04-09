// YouTunes Popup Module Popup.js JavaScript Document

var bg = chrome.extension.getBackgroundPage();
var bridgeEvents = [];

var appElement = null;
var searchElement = null;

var directives = angular.module('popup.directives', []);

angular.module('popup', ['popup.directives'])
	.run(function ($rootScope) {
		appElement = $('body')[0];
		searchElement = $('#searchPane')[0];

        //Create scope
		$rootScope.player = bg.player;
        $rootScope.playlists = bg.playlists;
        $rootScope.search = bg.search;
        $rootScope.playPlaylist = function (event) {
            var id = $(event.target).parent().attr('data-id'),
                playlist = null;
            playlist = $rootScope.playlists.getPlaylistById(parseInt(id));

            $rootScope.player.playPlaylist(playlist);

            $('#closePlaylists').click();
        }

        var updateScopedPlayer = function () {
            angular.element(appElement).scope().$apply(function(scope) {
                scope.player = bg.player;
			});
        };

		bridgeEvents.push(bg.bridge.on('playerReady', function () {
            updateScopedPlayer();
		}));
        bridgeEvents.push(bg.bridge.on('playerError', function (event) {
			angular.element(appElement).scope().$apply(function(scope) {
                scope.player.error = event.error;
			});
		}));
		bridgeEvents.push(bg.bridge.on('playerProps', function () {
			updateScopedPlayer();
		}));

		bg.bridge.trigger('getProps');

		$(window).on('load', function () {
            if ($rootScope.search.results.length > 0) {
                angular.element(searchElement).scope().$apply(function(scope) {
                    scope.initial = false;
                    scope.query = $rootScope.search.query;
                    scope.results = $rootScope.search.results.tracks;
                });
            }
        }).on('unload', function () {
            $rootScope.search.save();
            $rootScope.playlists.save();

			for (i in bridgeEvents) {
				bg.bridge.off(bridgeEvents[i]);
			}
		});
	});
