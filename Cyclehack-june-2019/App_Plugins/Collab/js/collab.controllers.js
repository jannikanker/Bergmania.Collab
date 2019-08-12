angular.module('bergmania.collab').controller('collabAppHeaderController',
	[
		'eventsService', 'collabSignalrService', 'overlayService',
		function (eventsService, collabSignalrService, overlayService) {
			var vm = this;

			vm.onlineUsersDialog = null;
			vm.userInfo = collabSignalrService.getUserInfo();

			vm.contentEditorInfo = [];

			eventsService.on("collab.userInfoUpdated", function (event, userInfo, contentEditorInfo) {
				vm.userInfo = userInfo;
				vm.contentEditorInfo = contentEditorInfo;
			});

			vm.toggleOnlineUsers = function () {
				// Open discard changes overlay
				var overlay = {
					"view": "/App_Plugins/Collab/views/overlays/onlineUsers.html",
					"title": "Online Backoffice Users",
					"userInfo": vm.userInfo,
					"clickItem": clickItem,
					"tableProperties": [
						{ alias: "url", header: "Url" }
					],
					"position": "right",
					"size": "small",
					close: function () {
						overlayService.close();
					}
				};

				overlayService.open(overlay);
			};


			function clickItem(item) {
				var overlay = {
					"view": "/App_Plugins/Collab/views/overlays/singleOnlineUser.html",
					"title": item.name,
					"item": item,
					"position": "right",
					"submitButtonLabel": "Back",
					"size": "small",
					submit: function () {
						vm.toggleOnlineUsers();
					},
					close: function () {
						overlayService.close();
					}
				};

				overlayService.open(overlay);
			}
		}
	]);

angular.module('bergmania.collab').controller('Collab.contentEditorController',
	[
		'eventsService', 'collabSignalrService', '$routeParams', 'usersResource', 'userService', 'editorState',
		function (eventsService, collabSignalrService, $routeParams, usersResource, userService, editorState) {
			var vm = this;

			updateUsersOnThisPage(collabSignalrService.getUserInfo());

			eventsService.on("collab.userInfoUpdated", function (event, userInfo) {
				updateUsersOnThisPage(userInfo);
			});

			vm.logEditorState = function () {
				console.log("editorState NOW", editorState.current);
			};

			/*vm.theOtherEditors = function () {
				userService.getCurrentUser().then(function (user) {

					var notCurrentUser = [];

					if (usersOnThisPage !== undefined && usersOnThisPage !== null) {
						notCurrentUser = usersOnThisPage.filter(function (elem) {
							elem !== user;
						});
					}

					return notCurrentUser;
				});
			};*/

			userService.getCurrentUser().then(
				function (user) {
					vm.currentUser = user;
				});

			function updateUsersOnThisPage(userInfo) {

				var usersOnThisPage = [];

				for (var i = 0; i < userInfo.length; i++) {

					var user = userInfo[i];

					var userIsHere = user.section === $routeParams.section
						&& user.tree === $routeParams.tree
						&& user.method === $routeParams.method
						&& user.id === $routeParams.id;

					if (userIsHere) {

						usersResource.getUser(user.userId).then(
							function (userObject) {
								if (usersOnThisPage.indexOf(userObject) === -1) {
									usersOnThisPage.push(userObject);
								}
							}
						).finally(function () {
							console.log("UPDATE", usersOnThisPage);
							
							vm.userInfo = usersOnThisPage;

						});
					}
				}

				var overlay = document.getElementById('collabOverlay');

				if (usersOnThisPage.length > 1 && usersOnThisPage.indexOf(vm.currentUser) > 0 && overlay !== null) {
					overlay.style.display = 'block';
					overlay.style.visibility = 'visible';
				}
				else if (usersOnThisPage.length < 2 && overlay !== null) {
					overlay.style.display = 'none';
					overlay.style.visibility = 'hidden';
				}
			}
		}
	]);