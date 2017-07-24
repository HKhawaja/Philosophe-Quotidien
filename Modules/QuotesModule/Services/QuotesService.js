(function() {
	
	angular
		.module('QuotesModule')
		.factory('getQuotes', getQuotes);

	getQuotes.$inject = ['$http'];

	function getQuotes ($http) {
		var myObject = {};
		myObject.getNewQuote = function() {
			return $http.get("http://philosophe-quotidien-app-git.azurewebsites.net/getNewQuote");
		};
		return myObject;
	}

})();

// http://localhost:8001
