'use strict';
/*jshint -W117, -W097*/

angular.module('modules.dash')

	.controller('CatalogCtrl', function (http, blockUI, alertService, $state, $uibModal) {
		var vm = this;
		vm.myForms = [];

		vm.onRefresh = function () {
			http.get('private/dashboard/user/template')
				.then(function (res) {
					blockUI.stop();
					if (res.state) {
						vm.myForms = res.result;
					}
				});
		};
		vm.onRefresh();

		vm.onRemove = function(id) {
			http.get('private/dashboard/template/delete/'+id)
				.then(function (res) {
					blockUI.stop();
					alertService.add(0, res.state.message);
					vm.onRefresh();
				});
		};

		vm.onGoTemplates = function() {
			vm.arr = [];
			vm.myForms.forEach(function(e) {
				var item = {};
				item.id = e.templateDto.id;
				item.type = e.type;
				vm.arr.push(item);
			});
			$state.go('main.private.dashboard.abstract.catalog.catalogtemplate', { arr: vm.arr, onCheck: true });
		};

		vm.onAddTask = function(model) {
			blockUI.start();
			//var paramsPOST = {template: {id: id_, templateDto: {id: null, body: {sections:[], name: ''}}}};
			//http.post('private/dashboard/tasks/create', paramsPOST)
			//	.then(function (res) {
			//		blockUI.stop();
			//		if  (res.result) {
			//			alertService.add(0, res.state.message);
			//		}
			//	});
			var result = $uibModal.open({
				templateUrl: 'modules/dashboard/views/modal.addNotif.html',
				controller: 'modalAddNotifCtrl',
				controllerAs: 'vm',
				resolve: {
					model: function($q) {
						var deferred = $q.defer();
						deferred.resolve({data: model});
						return deferred.promise;
					}
				}
			}).result;
		};

	})


	.controller('modalAddNotifCtrl', function ($uibModalInstance, model, blockUI, $scope, http, localStorageService) {
		var vm = this;
		vm.model = model;

		$scope.patient = '';
		$scope.sendTo = '';

		vm.user = localStorageService.get('userData');

		$scope.getFind = function (val, type) {
			return http.post('private/dashboard/' + vm.user.type + '/references/refs', {search: val, type: type} )
				.then(function (res) {
					blockUI.stop();
					if  (angular.isArray(res.result) && res.result.length>0) {
						res.result.map(function (item) {
							item.all = item.name + ', ' + item.email + ( (item.type == null) ? '' : ', ' + item.type);
							return item;
						});
					}
					return res.result;
				});
		};

		blockUI.stop();

		vm.ok = function () {
			console.log($scope.patient +' '+ $scope.sendTo);
			$uibModalInstance.close();
		};

		vm.cancel = function cancel() {
			$uibModalInstance.dismiss('cancel');
		};

	});