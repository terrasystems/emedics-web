'use strict';
/*jshint -W117, -W097*/

angular.module('modules.public', [])

	.controller('LoginCtrl111', function ($translate, $state, $timeout, blockUI, alertService, auth, http) {
		var vm = this;
		vm.user = {};
		vm.options = {};
		vm.userFields = [
			{
				className: 'col-md-12',
				key: 'email',
				type: 'input',
				templateOptions: {
					type: 'email',
					required: true,
					label: $translate.instant('EMAIL'),
					placeholder: $translate.instant('EMAIL_1'),
					addonRight: {
						class: 'glyphicon glyphicon-user'
					}
				}
			},
			{
				className: 'col-md-12',
				key: 'password',
				type: 'input',
				templateOptions: {
					type: 'password',
					required: true,
					label: $translate.instant('PASSWORD'),
					placeholder: $translate.instant('PASSWORD_1'),
					addonRight: {
						class: 'glyphicon glyphicon-lock'
					}
				}
			}
		];

		vm.onSubmit = function () {
			if (vm.form.$valid) {
				doLogin();
			}
		};

		function doLogin() {
			var paramsPOST = {
				email: vm.user.email,
				password: vm.user.password
			};
			http.post('public/login', paramsPOST).then(function (res) {
				blockUI.stop();
				auth.saveUserData(res);
				alertService.success(res.state.message);
				$timeout(function () {
					$state.go('main.private.dashboard.tasks');
				}, 0);
			});
		}

	})


	.controller('RegistrationCtrl1111', function ($translate, $state, pat_fields, doc_fields, org_fields, $timeout, blockUI, alertService, auth, http, DTO) {
		var vm = this;
		vm.pat_fields = pat_fields;
		vm.doc_fields = doc_fields;
		vm.org_fields = org_fields;

		vm.reg = {pat: {}, doc: {}, org: {}};

		vm.tabs = [
			{
				title: $translate.instant('PATIENT'),
				active: true,
				index: 0,
				type: 'pat',
				form: {
					options: {},
					model: vm.reg.pat,
					fields: vm.pat_fields
				}
			},
			{
				title: $translate.instant('DOCTOR'),
				active: false,
				index: 1,
				type: 'doc',
				form: {
					options: {},
					model: vm.reg.doc,
					fields: vm.doc_fields
				}
			},
			{
				title: $translate.instant('ORGANIZATION'),
				active: false,
				index: 2,
				type: 'org',
				form: {
					options: {},
					model: vm.reg.org,
					fields: vm.org_fields
				}
			}
		];

		vm.active = 0;

		vm.getTypes = function (type) {

			var criteriaDTO = DTO.criteriaDTO;
			criteriaDTO.type = type;
			return http.post('/type/all', criteriaDTO)
				.then(function (res) {
					blockUI.stop();
					vm.tabs[1].form.fields[5].templateOptions.options = res.result;
					return res.result;
				});
		};
		vm.getTypesDoc();

		//vm.getTypesOrg = function () {
		//	http.get('public/dashboard/doc_type/organization')
		//		.then(function (res) {
		//			blockUI.stop();
		//			if (res.result && angular.isArray(res.result)) {
		//				res.result.map(function (item) {
		//					var x = angular.copy(item.id);
		//					delete item.id;
		//					item.value = x;
		//					item.name = $translate.instant(item.name);
		//					return item;
		//				});
		//				vm.tabs[2].form.fields[5].templateOptions.options = res.result;
		//			}
		//		});
		//};
		//vm.getTypesOrg();

		vm.onSubmit = function () {
			var paramsPOST = {
				"type": vm.tabs[vm.active].type,
				"user": vm.reg[vm.tabs[vm.active].type].user,
				"organisation": {}
			};
			if (vm.tabs[vm.active].type === 'org') {
				paramsPOST.organisation = vm.reg[vm.tabs[vm.active].type].org;
				paramsPOST.organisation.name = vm.reg[vm.tabs[vm.active].type].user.username;
			}
			http.post('public/registration', paramsPOST).then(function (res) {
				blockUI.stop();
				auth.saveUserData(res);
				alertService.success(res.state.message);
				$timeout(function () {
					$state.go('main.public.login');
				}, 0);
			});
		};

		function selTab(index) {
			vm.active = index;
		}

		vm.selTab = selTab;
	})


	.controller('NewPasswordCtrl1111', function ($state, $timeout, http, blockUI, alertService, $translate) {
		var vm = this;
		vm.forgotPass = '';

		vm.fieldforemail = [
			{
				key: 'email',
				type: 'input',
				validators: {
					EmailAddress: {
						expression: function ($viewValue, $modelValue) {
							var value = $modelValue || $viewValue;
							return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(value);
						},
						message: '$viewValue + $translate.instant("NO_VALID_EMAIL")'
					}
				},
				validation: {
					messages: {
						required: function ($viewValue, $modelValue, scope) {
							return scope.to.label + ' is required';
						}
					}
				},
				templateOptions: {
					placeholder: $translate.instant('RESET_PASS'),
					type: 'text',
					required: true,
					addonRight: {
						class: 'glyphicon glyphicon-envelope'
					}
				}
			}
		];


		vm.onSubmit = function () {
			var paramsPOST = vm.forgotPass.email;
			blockUI.start();
			http.post('public/reset_pass', paramsPOST)
				.then(function (res) {
					blockUI.stop();
					alertService.success(res.state.message);
					$timeout(function () {
						$state.go('main.public.login');
					}, 500);
				}, function () {
					blockUI.stop();
					$timeout(function () {
						$state.go('main.public.login');
					}, 500);
				});
		};

	})


	.controller('confirmNewPasswordCtrl1111', function ($state, $timeout, http, blockUI, alertService, $translate, $stateParams) {
		var vm = this;
		if (!$stateParams.key) {
			$state.go('main.public.login');
			return;
		}
		vm.newPass = {};
		vm.options = {};

		vm.fieldsPass = [
			{
				key: 'password',
				type: 'input',
				templateOptions: {
					label: 'Password',
					type: 'password',
					required: true,
					placeholder: $translate.instant('Enter new password...')
				},
				validation: {
					show: false
				}
			},
			{
				key: 'confirmPassword',
				type: 'input',
				templateOptions: {
					label: 'Confirm password',
					type: 'password',
					required: true,
					placeholder: $translate.instant('Confirm new password...')
				},
				validation: {
					show: true
				},
				validators: {
					samePassword2: function ($viewValue, $modelValue, scope) {
						var value = $modelValue || $viewValue;
						if (value) {
							return $modelValue === scope.model.password;
						} else {
							return true;
						}
					}
				}
			}
		];


		vm.onSubmit = function () {
			var paramsPOST = {
				validKey: $stateParams.key,
				newPassword: vm.newPass.password
			};

			blockUI.start();
			http.post('public/changePassword', paramsPOST)
				.then(function (res) {
					blockUI.stop();
					alertService.success(res.state.message);
					$timeout(function () {
						$state.go('main.public.login');
					}, 500);
				}, function () {
					blockUI.stop();
					$timeout(function () {
						$state.go('main.public.login');
					}, 500);
				});
		};

	});
