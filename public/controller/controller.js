var myApp = angular.module('myApp',[]);

myApp.controller('AppCtrl',['$scope','$http',function($scope,$http){

// variables...

	$scope.indicators = [
		{value:'Population, total',name:'Population'},
		{value:'CO2 emissions (kt)',name:'CO2 Emission'},
		{value:'GDP',name:'GDP'},
		{value:'Forest area (% of land area)',name:'Forest Area'}
	];



// GET functions...
	// $http.get('/api').success(function(response){
	// 	console.log("got data!");
	// 	$scope.worldlist = response;
	// });

	//  get CO2 of every contries
	$scope.getCO2 = function(){
		$http.get('/api/co2').success(function(response){
			console.log("got co2 !");
			$scope.worldlist = response;
		});
	};

		$scope.getCO2rank = function(){
			$http.get('/api/co2rank').success(function(response){
				console.log("got co2 top 10!");
				$scope.worldlist = response;
			});
		};

	//  get GDP  of every countries
	$scope.getGDP = function(){
		$http.get('/api/gdp').success(function(response){
			console.log("got gdp");
			$scope.worldlist = response;
		});
	};

		$scope.getGDPrank = function(){
			$http.get('/api/gdprank').success(function(response){
				console.log("got gdp top 10!");
				$scope.worldlist = response;
			});
		};

	// get Forest area percentage of country area
	$scope.getForest = function(){
		$http.get('/api/forest').success(function(response){
			console.log("got forest !");
			$scope.worldlist = response;
		});
	};

		$scope.getForestrank = function(){
			$http.get('/api/forestrank').success(function(response){
				console.log("got forest top 10!");
				$scope.worldlist = response;
			});
		};

	// get population of every country
	$scope.getPopulation = function(){
		$http.get('/api/population').success(function(response){
			console.log("got population !");
			$scope.worldlist = response;
		});
	};

		$scope.getPopulationrank = function(){
			$http.get('/api/populationrank').success(function(response) {
				console.log("got pop top 10!");
				$scope.worldlist = response;
			});
		};



	//  search all indicators for a country
	$scope.searchCountry = function(country){
		console.log(country);
		$http.get('/api/searchCountry/' + country).success(function(response){
			// console.log(response);
			$scope.worldlist = response;
		});
	};


	//  find edit item
	$scope.edit = function(id){
		console.log(id);
		$http.get('/api/edit/' + id).success(function(response){
			$scope.editlist = response;
		});
	};



// POST functions...
	$scope.addCountry = function(){
		console.log($scope.world);
		$http.post('/api/addCountries',$scope.world).success(function(response){
			console.log(response);
		});

		var indicator = $scope.world['Indicator Name'];
		// console.log(indicator);
		if(indicator == 'CO2 emissions (kt)'){
			$scope.getCO2();
		}
		if(indicator == 'Population, total'){
			$scope.getPopulation();
		}
		if(indicator == 'GDP'){
			$scope.getGDP();
		}
		if(indicator == 'Forest area (% of land area)'){
			$scope.getForest();
		}
	};


// PUT function...
	$scope.update = function(){
		console.log($scope.editlist._id);
		$http.put('/api/update/' + $scope.editlist._id,$scope.editlist).success(function(response){
			// console.log(response);
			var indic = $scope.editlist['Indicator Name'];
			// console.log(indic);
			if(indic == 'CO2 emissions (kt)'){
				$scope.getCO2();
			}
			if(indic == 'Population, total'){
				$scope.getPopulation();
			}
			if(indic == 'GDP'){
				$scope.getGDP();
			}
			if(indic == 'Forest area (% of land area)'){
				$scope.getForest();
			}
		});
	};


// DELETE functions...
	$scope.remove = function(id , indic){
		console.log(id);
		console.log(indic);

		$http.delete('/api/' + id);

		if(indic == 'CO2 emissions (kt)'){
			$scope.getCO2();
		}
		if(indic == 'Population, total'){
			$scope.getPopulation();
		}
		if(indic == 'GDP'){
			$scope.getGDP();
		}
		if(indic == 'Forest area (% of land area)'){
			$scope.getForest();
		}

	};




}]);



// Plot controller

myApp.controller('PlotCtrl',['$scope','$http',function($scope,$http){


	$scope.plotCname = [
		{value:'United States',name:'United States'},
		{value:'China',name:'China'},
		{value:'India',name:'India'},
		{value:'Brazil',name:'Brazil'},
		{value:'Japan',name:'Japan'},
		{value:'Russian Federation',name:'Russian Federation'}
	];

	$scope.plotIname = [
		{value:'Population, total',name:'Population'},
		{value:'CO2 emissions (kt)',name:'CO2 Emission (kt)'},
		{value:'GDP',name:'GDP ($)'},
	];

// plot function...
	$scope.plot = function(){
		console.log($scope.plotlist);
		var country = $scope.plotlist['Country Name'];
		var indic = $scope.plotlist['Indicator Name'];
		$http.get('/api/plot/' + country + '/' + indic).success(function(response){
			console.log(response);

			var keys = Object.keys(response[0]);
			var a = [];
			var data = [[]];

			for (var i = 0; i < 54; i++) {
			    var val = response[0][keys[i]];

			    a.push(keys[i],val);
			    data.push(a);

			    a = [];
			}
			data.splice(0,1);

			// plot based on data
			$.plot("#placeholder", [data]);


		});
	}

}]);





// Map Reduce controller

myApp.controller('MapCtrl',['$scope','$http',function($scope,$http){

	$scope.mapReduce1 = function(){
		$http.get('/api/mapreduce1').success(function(response){
			console.log(response);
			$scope.maplist = response;
		});
	};

	$scope.mapReduce2 = function(){
		$http.get('/api/mapreduce2').success(function(response){
			console.log(response);
			$scope.maplist = response;
		});
	};


	$scope.mapReduce3 = function(){
		$http.get('/api/mapreduce3').success(function(response){
			console.log(response);
			$scope.maplist = response;
		});
	};

	$scope.mapReduce4 = function(){
		$http.get('/api/mapreduce4').success(function(response){
			console.log(response);
			$scope.maplist = response;
		});
	};

	$scope.mapReduce5 = function(){
		$http.get('/api/mapreduce5').success(function(response){
			console.log(response);
			$scope.maplist = response;
		});
	};

	$scope.mapReduce6 = function(){
		$http.get('/api/mapreduce6').success(function(response){
			console.log(response);
			$scope.maplist = response;
		});
	};

	$scope.mapReduce7 = function(){
		$http.get('/api/mapreduce7').success(function(response){
			console.log(response);
			$scope.maplist = response;
		});
	};

	$scope.mapReduce8 = function(){
		$http.get('/api/mapreduce8').success(function(response){
			console.log(response);
			$scope.maplist = response;
		});
	};

}]);