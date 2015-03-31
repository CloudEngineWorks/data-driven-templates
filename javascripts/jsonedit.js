// Rapid Prototype: of data-driven-templates
// a bit of a mess due to trying out a bunch of techniques...
// based on http://onehungrymind.com/angularjs-dynamic-templates/
// also see (for a good overview of angular)  http://stephanebegaudeau.tumblr.com/post/48776908163/everything-you-need-to-understand-to-start-with
// look into loading templates via https://github.com/requirejs/text or angular.$templateCache
// or https://npmjs.org/package/grunt-angular-templates per (simpulton September 7, 2013 at 12:52 pm)
//

var app = angular.module('ddtApp', ['ngSanitize']);

// sortable directive uses JQueryUI to manage the sorting by drag&drop
app.directive('sortable', function() {
  return {
    // A = attribute, E = Element, C = Class and M = HTML Comment
    restrict:'A',
    link: function(scope, element, attrs) {
			var start;
			var dragStart = function(e, ui) {
				start = ui.item.index();
			};
			var dragEnd = function(e, ui) {
				var end = ui.item.index();
				scope.content.items.splice(end, 0, scope.content.items.splice(start, 1)[0]);
				scope.$apply();
			};
			$(element).sortable({
				start: dragStart,
				update: dragEnd
			});
			$(element).disableSelection();
    }
  };
});

// data driven templates with two way data binding while being se recursivly...
app.directive('drivenTemplate', function ($compile, $templateCache) {
  // gets html given a name and an edit_mode
  var getTemplate = function(viewType, edit_mode) {
	  var suffix = (edit_mode)? "_edit": "";
    return $templateCache.get(viewType + suffix + ".html");
  };

  var linker = function(scope, element, attrs) {
    scope.$watch("edit_mode", function() {
      var isArr = angular.isArray(scope.content);
      var isObj = angular.isObject(scope.content);
      var t = typeof scope.content;
      if (isArr) {
        t = 'array';
        scope.items = scope.content;
      }
      if (isObj) {
        scope.elements = scope.content;
      }

      element.html(getTemplate(t, scope.edit_mode));
      $compile(element.contents())(scope);
    });
    scope.$watch("content", function() {
      $compile(element.contents())(scope);
    });
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


function demoCtrl($scope, $http) { "use strict";
  $http.get('json_feed.json').success(function(data) {
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


