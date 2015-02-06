var app = angular.module('ddtEditorApp', ['ngSanitize']);

// data driven templates 
app.directive('drivenTemplate', function ($compile, $templateCache) {

  var linker = function(scope, element, attrs) {
    //scope.$watch("content.edit_mode", function() {
      element.html($templateCache.get(scope.content.view_template + ".html"));
      $compile(element.contents())(scope);
    //});
  };

  return {
    restrict: "A",
    replace: true,
    link: linker,
    scope: {
        content:'=content'
    }
  };
});


function basketCtrl($scope, $http) { "use strict";
  $http.get('basket_feed.json').success(function(data) {
		$scope.content = data;
	});

  $scope.stringify_content = function () {
    return JSON.stringify($scope.content, null, ' ');
  };
  
  $scope.add_content = function () {
    $scope.content.items.unshift({"view_template": "section", "title": "A New First Section",
      "narrative": "Lorem ipsum nan nan-nan nan-nan nahh dolor sit amet, consectetur adipiscing elit."
    });
  };
}
