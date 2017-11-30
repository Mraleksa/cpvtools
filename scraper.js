var client = require('http-api-client');
//var d3 = require("d3");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("data.sqlite");


//var formatTime = d3.timeFormat("%Y-%m-%d");


//db.each("SELECT dateModified FROM data ORDER BY dateModified DESC LIMIT 1", function(err, timeStart) {
//var start =  "2017-01-01T10:18:57.452368+03:00"
var start =  "2017-10-03T11:30:19.071617+03:00"
//var end  = formatTime(new Date());
//var end  = "2017-01-03"
var p=0; var p2=0;
function piv(){  
p++;
client.request({url: 'https://public.api.openprocurement.org/api/2.3/contracts?offset='+start})
      .then(function (data) {
		var dataset = data.getJSON().data;
		start = data.getJSON().next_page.offset;			
		console.log(start)
		return dataset;
	})	
	.then(function (dataset) {	
	
		
	
		dataset.forEach(function(item) {
		client.request({url: 'https://public.api.openprocurement.org/api/2.3/contracts/'+item.id})
		.then(function (data) {	

		
		
if(data.getJSON().data.status=="active")	
{	
	var status = data.getJSON().data.status
	
	if(data.getJSON().data.changes==undefined){var changeLength = 0;}
	else{var changeLength = data.getJSON().data.changes.length;}

 	var dateModified = item.dateModified
 	var contractID = data.getJSON().data.contractID
	var tender_id = data.getJSON().data.tender_id;
	var lotIdContracts = data.getJSON().data.items[0].relatedLot;
	var dateSigned = data.getJSON().data.dateSigned;
	var amount = data.getJSON().data.value.amount;	
	var name = data.getJSON().data.procuringEntity.name;	
	var edr = data.getJSON().data.suppliers[0].identifier.id;	
	var suppliers =  data.getJSON().data.suppliers[0].name;	
	var region =  data.getJSON().data.suppliers[0].address.region;	
	var description = data.getJSON().data.items[0].description;	
	var cpv = data.getJSON().data.items[0].classification.id;	
	
		
	
	
	
	
	//////////tenders//////////////
		client.request({url: 'https://public.api.openprocurement.org/api/2.3/tenders/'+tender_id})
		.then(function (data) {
		var startAmount;var lots;
		if(data.getJSON().data.lots==undefined){
			startAmount = data.getJSON().data.value.amount;
			lots=1;
		}
		else {
			lots = data.getJSON().data.lots.length
		for (var i = 1; i <= data.getJSON().data.lots.length; i++) {
				if(lotIdContracts==data.getJSON().data.lots[data.getJSON().data.lots.length-(i)].id){
				startAmount =  data.getJSON().data.lots[data.getJSON().data.lots.length-(i)].value.amount
				};			
			}
		}
		var save=Math.round((startAmount-amount)/startAmount*100);
		
		var numberOfBids;
		if(isNaN(data.getJSON().data.numberOfBids)){numberOfBids = 1}
		else {numberOfBids=data.getJSON().data.numberOfBids};
		
		var bids;
		if(data.getJSON().data.bids==undefined){bids = 1;}
		else {bids = data.getJSON().data.bids.length}
					
		var awards = data.getJSON().data.awards.length
		
	//////////tenders AND db//////////////	
	
db.serialize(function() {
db.run("CREATE TABLE IF NOT EXISTS data (dateModified TEXT,status TEXT,contractID TEXT,name TEXT,suppliers TEXT,edr TEXT,region TEXT,cpv TEXT,description TEXT,amount INT,save INT,numberOfBids INT,bids INT,lots INT,awards INT,changeLength INT)");
var statement = db.prepare("INSERT INTO data VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
statement.run(dateModified.replace(/T.*/, ""),status,contractID,name,suppliers,edr,region,cpv,description,amount,save,numberOfBids,bids,lots,awards,changeLength);
statement.finalize();
});
	
	
	//////////tenders AND db//////////////	
		})


	

}//active			
	})
	.catch(function  (error) {
		//console.log("error_detale2")				
	});  
	});//dataset

	
	})
	.then(function () {	
	
	if (p<500){setTimeout(function() {piv ();},4000);}		
		else {
			console.log("stop")
			
		}		
					
		
		})
	.catch( function (error) {
		console.log("error")
		piv ();
	});   					
}



piv ();	

//})
