'use strict';

angular.module( 'modules.core')

.constant('statesList', [
		{
			name: 'main',
			url: '',
			templateUrl:'modules/core/views/main.html',
			abstract: true
		},
		// public
		{
			name: 'main.public',
			url: '/',
			//templateUrl: 'modules/core/views/main.public.html',
			abstract: true
		},
		{
			name: 'main.public.login',
			url: 'login',
			views: {
				'content@main': {
					templateUrl: 'modules/public/views/login.html',
					controller: 'LoginCtrl as vm'
				}
			},
			onEnter: function($rootScope, $stateParams) {
					console.log('...befor login state');
			}
		},
		{
			name: 'main.public.registration',
			url: 'registration',
			views: {
				'content@main': {
					templateUrl: 'modules/public/views/registration.html',
					controller: 'RegistrationCtrl as vm'
				}
			},
			onEnter: function($rootScope, $stateParams) {
				console.log('...befor registration state');
			}
		},
		{
			name: 'main.public.newpassword',
			url: 'newpassword',
			views: {
				'content@main': {
					templateUrl: 'modules/public/views/newpassword.html',
					controller: 'NewPasswordCtrl as vm'
				}
			},
			onEnter: function($rootScope, $stateParams) {
				console.log('...befor newpassword state');
			}
		},
		{
			name: 'main.public.activation',
			url: 'activation/:code',
			onEnter: function($stateParams, http, $state, auth) {
				http.get('activation/' + $stateParams.code).then(function(response) {
					console.log(response.data);
					auth.saveUserData(response.data);
					$state.go('main.private.dashboard');
				});
				console.log($stateParams.code);
			}
		},
		// private
		{
			name: 'main.private',
			url:'',
			abstract: true,
			parent:'main'
		},
		{
			name:'main.private.dashboard',
			url:'/dashboard',
			parent:'main.private',
			views:{
				'content@main':{
					templateUrl:'modules/dashboard/views/dashboard.html',
					controller:'DashCtrl as vm'
				}
			}
		},
		{
			name:'main.private.dashboard.forms',
			url:'/forms',
			parent:'main.private.dashboard',
			views:{
				'forms@main.private.dashboard':{
					templateUrl:'modules/dashboard/views/dashboard.patForms.html',
					controller:'DashboardPatFormsCtrl as vm'
				}

			}
		},
		{
			name:'main.private.dashboard.ref',
			url:'/references',
			views:{
				'forms@main.private.dashboard':{
					templateUrl:'modules/dashboard/views/dashboard.patRefs.html'
					//controller:'DashboardPatFormsCtrl'
				}
			}
		},
		{
			name:'main.private.dashboard.notifications',
			url:'/notifications',
			views:{
				'forms@main.private.dashboard':{
					templateUrl:'modules/dashboard/views/dashboard.patNotif.html',
					controller:'NotificationsCtrl as vm'
				}
			},
			parent: 'main.private.dashboard'
		},
		{
			name:'main.private.dashboard.tasks',
			url:'/tasks',
			views:{
				'forms@main.private.dashboard':{
					templateUrl:'modules/dashboard/views/dashboard.patTasks.html'
					//controller:'DashboardPatFormsCtrl'
				}
			}
		}

	]);
