// YouTunes PlayerCtrl.js Controller JavaScript Document

var PlayerCtrl = function ($scope, $rootScope) {

	$scope.track = function () {
		if ($rootScope.player && $rootScope.player.currentTrack) {
			return $rootScope.player.currentTrack.title;
		} else {
			return '';
		}
	};

	$scope.timing = function () {
		if ($rootScope.player) {
			if (($rootScope.player.state === PlayerState.PLAYING ||
				$rootScope.player.state === PlayerState.PAUSED) &&
				!$rootScope.player.preparing && $rootScope.player.error === null) {
				return formatTime($rootScope.player.elapsed) + ' - ' + formatTime($rootScope.player.duration);
			}
		}
		return "";
	};

	$scope.status = function () {
		if ($rootScope.player && $rootScope.player.isReady) {
			if ($rootScope.player.state === PlayerState.BUFFERING) {
				return "Buffering...";
			}
			if ($rootScope.player.preparing) {
				return "Loading...";
			}
			if ($rootScope.player.error !== null) {
				if ($rootScope.player.error === PlayerError.UNAVAILABLE) {
					return "Unavailable for streaming.";
				}
				if ($rootScope.player.error === PlayerError.UNEMBEDABLE ||
					$rootScope.player.error === PlayerError.UNEMBEDABLE_ALT) {
					return "Embedding disabled for track.";
				}
			}
		}
		return "";
	};
};
