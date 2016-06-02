'use strict';
/*jshint -W117, -W097*/

angular.module('modules.dash')

	.controller('DashCtrl', function ($scope, $rootScope, localStorageService, $state, $translate, http, blockUI, initParamsPOST) {
		var vm = this;
		vm.user = localStorageService.get('userData');

		vm.tabData = [{heading: $translate.instant('TASKS'), route: 'main.private.dashboard.abstract.tasks', disable: false},
			{heading: $translate.instant('REFERENCES'), route: 'main.private.dashboard.abstract.ref', disable: false },
			{heading: $translate.instant('NOTIFICATIONS'),badge: 0, route: 'main.private.dashboard.abstract.notifications', disable: false },
			{heading: $translate.instant('PATIENT_FORMS'), route: 'main.private.dashboard.abstract.forms', disable: false},
			{heading: $translate.instant('PATIENTS'), route: 'main.private.dashboard.abstract.patients', disable: (vm.user.type === 'patient')},
			{heading: $translate.instant('MYFORMS'), route:'main.private.dashboard.abstract.myforms', disable: false}
		];
		$scope.$state = $state;

		vm.logout = function () {
			$rootScope.userData = null;
			$rootScope.token = null;
			localStorageService.set('token', null);
			localStorageService.set('userData', null);
			$state.go('main.public.login');
		};

		$scope.$on('calc.notif', function () {
				http.post('private/dashboard/notifications', initParamsPOST.params)
					.then(function (res) {
						blockUI.stop();
						if (res.result) {
							vm.tabData[2].badge = res.result.length;
							console.log('size = '+vm.tabData[2].badge);
						}
					});
			}
		);

		$rootScope.$broadcast('calc.notif');

	})	.run(["$templateCache", function($templateCache) {
		$templateCache.put("uib/template/tabs/tab.html",
			"<li ng-class=\"[{active: active, disabled: disabled}, classes]\" class=\"uib-tab nav-item\">\n" +
			"<a href ng-click=\"select($event)\" class=\"nav-link\" uib-tab-heading-transclude>{{heading}}<div ng-show='$parent.tab.badge > 0'>{{$parent.tab.badge}}</div></a>\n" +
			"<div class='notif_counter' ng-show='$parent.tab.badge > 0'>{{$parent.tab.badge}}</div></li>\n" +
			"");
	}]);
