// YouTunes Search Controller SearchCtrl.js JavaScript Document

var SearchCtrl = function ($scope, $rootScope) {

	$scope.initial = true;
    $scope.query = null;
	$scope.searching = false;
    $scope.startIndex = 1;
    $scope.results = [];

	$scope.resultCount = function () {
        var ofText = $rootScope.search.totalResultCount === 1000000 ? "of about" : "of";
        return formatNumber($scope.startIndex) + "-" +
            formatNumber($scope.startIndex + $scope.results.length - 1) + " " + ofText + " " +
            formatNumber($rootScope.search.totalResultCount);
	};

	$scope.search = function () {
		$scope.startIndex = 1;
		search();
	};

	$scope.more = function () {
		$scope.startIndex += $scope.results.length;
		search();
	};

    $scope.showMore = function () {
        return $scope.results.length < $rootScope.search.totalResultCount;
    };

    $scope.enqueue = function (event) {
		var id = $(event.target).parent().attr('data-id'),
			track = $rootScope.search.results.getTrackById(id);

		$rootScope.playlists.getPlaylistByName('Queue').enqueue(track);
	};

	$scope.play = function (event) {
		var id = $(event.target).parent().attr('data-id'),
			track = $rootScope.search.results.getTrackById(id);

		$rootScope.player.preparing = true;
        $rootScope.player.currentPlaylist = null;

		if ($rootScope.player) {
			$rootScope.player.play(track);
		}
	};

	var search = function () {
        $scope.initial = false;
		$scope.searching = true;

        $rootScope.search.query = $scope.query;

		//Get the YouTube search results
		$.get('http://gdata.youtube.com/feeds/api/videos?q=' + $scope.query +
			'&orderby=relevance&start-index=' + $scope.startIndex +
			'&max-results=15&format=5&v=2&alt=json', function (json) {
            var results = [];
            var media = null;
            if (json.feed.entry) {
                for (var i = 0; i < json.feed.entry.length; i++) {
                    media = json.feed.entry[i].media$group;

                    results.push(new Track(
                        media.yt$videoid.$t,            // ID
                        media.media$title.$t,           // Title
                        media.yt$duration.seconds,      // Duration (sec)
                        media.media$thumbnail[0].url,   // Thumbnail
                        media.media$thumbnail[2].url)); // Cover photo
                }
            }

            angular.element(searchElement).scope().$apply(function(scope) {
                scope.searching = false;
                scope.results = results;
			});

			angular.element(appElement).scope().$apply(function(scope) {
                scope.search.results.clear();
                if (results.length > 0) {
                    scope.search.results.add(results);
                }
                scope.search.startIndex = (results.length > 0) ? $scope.startIndex : 1;
                scope.search.totalResultCount = (results.length > 0) ? json.feed.openSearch$totalResults.$t : 0;
			});

            //Scroll to the top
            $('#results').scrollTop(0);
		}, 'json');
	};
};
