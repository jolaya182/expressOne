var express =require("express");
var app = express();


/*app.get("/", function(request , response){
	//response.send("hello worlds!");
	//response.end()
	response.write("hello worlds!");
	response.end();


} );
*/

/*app.get("/blocks", function(request , response){
	
	//var blocks=[ "fixed", "movable" ,"rotating" ];
	var blocks="<ul><li>Fixed</li><li>movable</li></ul>";
	response.send(blocks);

} );*/

app.get("/blocks", function(request , response){
	
	//var blocks=[ "fixed", "movable" ,"rotating" ];
	var blocks="<ul><li>Fixed</li><li>movable</li></ul>";
	response.redirect(301, '/parts');

} );


app.listen(3000, function(){
	console.log("listening on port 3000");
});