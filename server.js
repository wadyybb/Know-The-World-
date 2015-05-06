// dependencies
var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

// mongoDB
var db = mongojs('test',['json','map1','map2','map3','map4','map5','map6','map7','map8']);

// express
var app = express();


//  static server
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


//  Restful apis

// GET functions..
	app.get('/api',function(req,res){
		console.log("I receiverd a get request");

		db.json.find({'Indicator Name':'GDP'},{},function(err,docs){
			res.json(docs);
		});
	});

	//  get CO2
	app.get('/api/co2',function(req,res){
		console.log("I receiverd a get CO2 request");

		db.json.find({'Indicator Name':'CO2 emissions (kt)'}).sort({_id:-1},function(err,docs){
			res.json(docs);
		});
	});

		app.get('/api/co2rank',function(req,res){
			console.log("I receiverd a get CO2 rank request");

			db.json.find({'Indicator Name':'CO2 emissions (kt)'},{limit:10}).sort({'2010':-1},function(err,docs){
				res.json(docs);
			});
		});

	// get GDP
	app.get('/api/gdp',function(req,res){
		console.log("I receiverd a get GDP request");

		db.json.find({'Indicator Name':'GDP'}).sort({_id:-1},function(err,docs){
			res.json(docs);
		});
	});

		app.get('/api/gdprank',function(req,res){
			console.log("I receiverd a get GDP rank request");

			db.json.find({'Indicator Name':'GDP'},{limit:10}).sort({'2013':-1},function(err,docs){
				res.json(docs);
			});
		});

	// get Forest
	app.get('/api/forest',function(req,res){
		console.log("I receiverd a get forest request");

		db.json.find({'Indicator Name':'Forest area (% of land area)'}).sort({_id:-1},function(err,docs){
			res.json(docs);
		});
	});

		app.get('/api/forestrank',function(req,res){
			console.log("I receiverd a get forest rank request");

			db.json.find({'Indicator Name':'Forest area (% of land area)'},{limit:10}).sort({'2012':-1},function(err,docs){
				res.json(docs);
			});
		});

	// get population
	app.get('/api/population',function(req,res){
		console.log("I receiverd a get population request");

		db.json.find({'Indicator Name':'Population, total'}).sort({_id:-1},function(err,docs){
			res.json(docs);
		});
	});

		app.get('/api/populationrank',function(req,res){
			console.log("I receiverd a get population rank request");

			db.json.find({'Indicator Name':'Population, total'},{limit:10}).sort({'2013':-1},function(err,docs){
				res.json(docs);
			});
		});


	// search countries
	app.get('/api/searchCountry/:country',function(req,res){
		var country = req.params.country;
		console.log(country);
		db.json.find({'Country Name':country},function(err,doc){
			res.json(doc);
		});
	});


	// edit
	app.get('/api/edit/:id',function(req,res){
		var id = req.params.id;
		db.json.findOne({_id:mongojs.ObjectId(id)},function(err,doc){
			res.json(doc);
		});
	});


	// plot
	app.get('/api/plot/:country/:indic',function(req,res){
		var country = req.params.country;
		var indic = req.params.indic;
		console.log(country);
		console.log(indic);
		db.json.find({'Country Name':country,'Indicator Name':indic} , function(err,doc){
			res.json(doc);
		});
	});



//  POST functions...
	app.post('/api/addCountries',function(req,res){
		console.log(req.body);
		db.json.insert(req.body,function(err, doc){
			res.json(doc);
		});
	});


// PUT functions...
	app.put('/api/update/:id',function(req,res){
		var id = req.params.id;
		console.log(req.body['2013']);
		db.json.findAndModify(
			{
			query:{_id:mongojs.ObjectId(id)},
			update:{$set:{2010:req.body['2010'],2012:req.body['2012'],2013:req.body['2013']}},
			new: true
			},
		function(err, doc){
				res.json(doc);
		});
	});



// DELETE functions...
	app.delete('/api/:id',function(req, res){
		var id = req.params.id;
		console.log(id);
		db.json.remove({_id:mongojs.ObjectId(id)},function(err,doc){
			res.json(doc);
		});
	});






//   Map Reduce...
	app.get('/api/mapreduce1', function(req,res){

		    var mapper = function () {
		        // emit(this.[], 1);
		        emit(this['Country Name'],1);
		    };

		    var reducer = function (country, count) {
		        return Array.sum(count);
		    };

		    db.json.mapReduce(
		        mapper,
		        reducer, {
		            out: "map1"
		        }
		    );

		    db.map1.find({}).count( function (err, doc) {
		        if (err) console.log(err);
		        // console.log("\n", docs);
		        res.json(doc);
    		});

	});


	app.get('/api/mapreduce2', function(req,res){

		    var mapper = function () {
		        // emit(this.[], 1);
		        emit(this['Country Name'],1);
		    };

		    var reducer = function (country, count) {
		        return Array.sum(count);
		    };

		    db.json.mapReduce(
		        mapper,
		        reducer, {
		            out: "map2"
		        }
		    );

		    db.map2.find({},{_id:1}, function (err, doc) {
		        if (err) console.log(err);
		        // console.log("\n", docs);
		        res.json(doc);
    		});

	});


	app.get('/api/mapreduce3', function(req,res){

		    db.json.mapReduce( 
		    	function(){ 
		    		if(this['2013']>80000000){ 
		    			emit(this['Country Name'],this['2013']); 
		    		} 
		    	}, 
		    	function(key,values){ 
		    		return Array.sum(values); 
		    	}, 
		    	{ 
		    		query:{"Indicator Name":"Population, total"},
		    		out:'map3', 
		    	});

		    db.map3.find( function (err, doc) {
		        if (err) console.log(err);
		        // console.log("\n", doc);
		        res.json(doc);
    		});

	});

	app.get('/api/mapreduce4', function(req,res){

		    db.json.mapReduce(
				function(){
					if(this['2013']>80000000){
						emit(this['Indicator Name'],1);
					}
					else 
						emit(this['Indicator Name'],0);
				},

				function(key,values){
					var total=0;
					for (var i=0;i<values.length;i++){
						total+=values[i];
					}
					return total;
				},
				{
				query:{"Indicator Name":"Population, total"},
				out:'map4'
			});

		    db.map4.find( function (err, doc) {
		        if (err) console.log(err);
		        // console.log("\n", doc);
		        res.json(doc);
    		});

	});


	app.get('/api/mapreduce5', function(req,res){

		    db.json.mapReduce(
				function(){
					emit(this['Indicator Name'],this['2010']);
				},
				function(key,values){
					var total=0;
					for (var i=0;i<values.length;i++){
						total+=values[i];
					}
					return total;
				},
				{
				query:{'Indicator Name':'CO2 emissions (kt)'},
				out:'map5',
			})

		    db.map5.find( function (err, doc) {
		        if (err) console.log(err);
		        // console.log("\n", doc);
		        res.json(doc);
    		});

	});




	app.get('/api/mapreduce6', function(req,res){

		    db.json.mapReduce( 
				function(){ 
					if(this['2013']>3000000000000){ 
						emit(this['Country Name'],this['2013']); 
					} 
				}, 
				function(key,values){ 
					return Array.sum(values);
				}, 
				{ 
					query:{"Indicator Name":"GDP"},
					out:'map6', 
				}
			);

		    db.map6.find( function (err, doc) {
		        if (err) console.log(err);
		        // console.log("\n", doc);
		        res.json(doc);
    		});

	});




	app.get('/api/mapreduce7', function(req,res){

			db.json.mapReduce( 
			function(){ 
					emit(this['Indicator Name'],this['2013']); 
			}, 
			function(key,values){ 
				var total=0;
				for (var i=0;i<values.length;i++){
					total+=values[i];
				}
				return total;
			}, 
			{ 
				query:{"Indicator Name":"GDP"},
				out:'map7'
			}
			);

		    db.map7.find( function (err, doc) {
		        if (err) console.log(err);
		        // console.log("\n", doc);
		        res.json(doc);
    		});

	});



	app.get('/api/mapreduce8', function(req,res){

			db.json.mapReduce( 
				function(){ 
					if(this['2012']>80){
						emit(this['Country Name'],this['2012']); 
					}
				}, 
				function(key,values){ 
					return values;

				}, 
				{ 
					query:{"Indicator Name":"Urban population (% of total)"},
					out:'map8', 
				}
			)

		    db.map8.find( function (err, doc) {
		        if (err) console.log(err);
		        // console.log("\n", doc);
		        res.json(doc);
    		});

	});





// start server
app.listen(3000);
console.log('API is running on port 3000');