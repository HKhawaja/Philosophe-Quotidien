(function() {

	angular
		.module('QuotesModule')
		.controller('QuotesController', QuotesController);

	QuotesController.$inject = ['$scope', 'getQuotes', '$timeout'];

	function QuotesController ($scope, getQuotes, $timeout) {
		$scope.quote = "";
		$scope.author = "";
		$scope.book = "";

		$scope.changeQuote = function() {
			console.log("here");
			getQuotes.getNewQuote().then(function(response){
				console.log(response);	
				$scope.quote = response.data.quote;
				$scope.author = response.data.author;
				if (response.data.book !== undefined) {
					$scope.author += ",";
					$scope.book = response.data.book;
				}
				else 
					$scope.book = "";
				}, function(error) {
				console.log(error);
				throw error;
			});
		};
		
		var refreshQuote = function() {
			console.log("Refreshing quote");
			$scope.changeQuote();
			$timeout(refreshQuote, 86400000);
		}

		$scope.changeQuote();
		$timeout(refreshQuote, 86400000);


	}

})();

