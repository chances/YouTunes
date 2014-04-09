// YouTunes Duration Span Element Directive Duration.js JavaScript Document

directives.directive('duration', function factory($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		template: '<span class="duration"></span>',
		link: function (scope, element, attrs) {
			element.text(formatTime(scope.track.duration));
		}
	};
});
