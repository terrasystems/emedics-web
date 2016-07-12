'use strict';
/*jshint -W117, -W097, -W116*/

angular.module('modules.dash')

	.controller('pTemplatesCtrl', function(localStorageService, $stateParams, $state, blockUI, http){
		var vm = this;
		vm.user = localStorageService.get('userData');
		vm.templates = [];

		if (!$stateParams.id || $stateParams.id === '' || $stateParams.id === null) {
			$state.go('main.private.dashboard.abstract.patients');
			return;
		}

		vm.patient = {
			id: $stateParams.id,
			name: $stateParams.name,
			email: $stateParams.email,
			phone: $stateParams.phone
		};

		vm.onOpenPatient = function (id) {
			vm.templates = [];
			http.get('private/dashboard/patients/' + id + '/events')
				.then(function (res) {
					blockUI.stop();
					if (res.result && angular.isArray(res.result) ) {
						vm.templates = res.result;
					}
				});
		};
		vm.onOpenPatient($stateParams.id);

		vm.onReturn = function() {
			$state.go('main.private.dashboard.abstract.patients');
		};

		vm.onOpenHistory = function(arr) {
			$state.go('main.private.dashboard.abstract.patients.history',{patient: vm.patient, obj: arr});
		};

	});
