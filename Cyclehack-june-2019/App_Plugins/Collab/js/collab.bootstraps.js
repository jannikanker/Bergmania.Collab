var packages = angular.module("bergmania.collab");
packages.run(["collabSignalrService", "eventsService", "$templateRequest", "$compile", "$rootScope", "$routeParams", "$timeout", "editorState", "editorService", "eventsService"
	, function (collabSignalrService, eventsService, $templateRequest, $compile, $rootScope, $routeParams, $timeout, editorState, editorService, eventsService) {


		function appendTempateToElement(templatePath, element) {
			$templateRequest(templatePath).then(function (template) {
				var compiled = $compile(template)($rootScope);
				angular.element(element).append(compiled);
			});
		}

		function afterTempateToElement(templatePath, element) {
			$templateRequest(templatePath).then(function (template) {
				var compiled = $compile(template)($rootScope);
				angular.element(element).after(compiled);
			});
		}
		eventsService.on("app.ready", function () {

			appendTempateToElement(
				"/App_Plugins/Collab/views/appHeader/collabAppHeader.html",
				document.getElementsByClassName('umb-app-header__actions')[0]);

		});

		$rootScope.$watch(function () {
			return editorState.current;
		}, function (e) {
			console.log('editorState.current changed', e);
		});

		eventsService.on("appState.editors.close", function (name, args) {
			console.log("editorState on close", editorState.current);
		});

		eventsService.on("appState.editors.open", function (name, args) {
			console.log("editorState on open", editorState.current);
		});

		//TODO maybe there exists an event to hock up when the editor is ready
		$rootScope.$on('$routeChangeSuccess', function (e, current, pre) {

			if ($routeParams.section === "content" && $routeParams.tree === "content" && $routeParams.method === "edit") {
				$timeout(function () {
					afterTempateToElement("/App_Plugins/Collab/views/contentEditor/collabContentEditorFooter.html", document.getElementsByClassName('umb-editor-footer-content__left-side')[0]);
					appendTempateToElement("/App_Plugins/Collab/views/contentEditor/collabContentEditorOverlay.html", document.getElementById('contentwrapper'));
				}, 1000);

			}

		});
	}]);