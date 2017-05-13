var express =require("express");
var app = express();

//app.disable("x-powered-by");//block headers for security reasons

//define main handle bars
//404 500 main
var handlebars=require('express-handlebars').create({defaultLayout:'main'});

//define the engine and views will be transported to our main.handle layouts
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(require('body-parser').urlencoded({extended: true}));

var formidable=require("formidable");

var credentials=require("./credentials.js");

app.use(require("cookie-parser")(credentials.cookieSecret) );



//more import here


app.set('port', process.env.PORT || 3000);


//allows us to call the files from the sub folder
app.use(express.static(__dirname + '/public'));

//define roots action with urls
//not case sensitive 

app.get('/', function(req, res){
 
  // Point at the home.handlebars view
  res.render('home');
});//eof  render('home')

app.use(function(req, res, next){
	console.log('looking for url '+req.url);
	next();

});//eof looking for url

app.get('/junk',function(req, res, next){
	console.log('tried to access /junk ');
	throw new Error("/junk does not exist");

});//eof junk

app.use( function(err, req, res, next){
	console.log("error: "+ err.message)
	next();
} );//eof

app.get('/about', function(req, res){
 
  // Point at the home.handlebars view
  res.render('about');
});//eof about


app.get("/contact", function(req,res){
	res.render("contact", { csrf: "CSRF token"} );

});//eof contact

app.get("/thankyou", function(req, res, next){
	res.render("thankyou" );

});//eof thankyou

app.post("/process", function(req, res){

	console.log("Form "+ req.query.form );
	console.log("CSRF Token "+ req.body._csrf );
	console.log("Email : "+ req.body.email );

	console.log("question : "+ req.body.ques );
	res.redirect(303, "/thankyou" );

} );//eof process

app.get("/file-upload", function(req, res){
var now=new Date();
	res.render("file-upload", {
		year:now.getFullYear(), 
		month:now.getMonth()
	} );

});//eof file-upload

app.post("/file-upload/:year/:month", function(req, res){

	var form=new formidable.IncomingForm();
	form.parse(req, function(err, fields, file){
		if(err){
			console.log(err.stack)
			return res.redirect(303, "/error");

		}
		console.log("received  the file");
		res.redirect(303, "/thankyou");

	});

});//eof file-upload/:year/:month


app.get("/cookie", function(req, res){
	res.cookie('username', 'javi', 
		{expire:new Date()+9999}).send('userName has the value of javi');


});//eof cookie

app.get("/listcookies", function(req,res){
	console.log("Cookies: ", req.cookies );
	res.send("look in the console for cookies");

} );//eof listcookies


app.get("/deletecookie", function(req, res){

	res.clearCookie("username");
	res.send("username Cookie deleted")
});//eof deletecoockie


/*app.use();
app.();
app.get("/", function(req, res){

});*/


var session=require("express-session");
var parseurl=require("parseurl");

app.use(session({ 
	resave:false,
	saveUninitialized: true,
	secret:credentials.cookieSecret

}) );

app.use(function(req, res, next){
	var views=req.session.views;
	if(!views){
		views=req.session.views ={};
	}//end of if

	var pathname=parseurl(req).pathname;
	views[pathname]=(views[pathname] || 0)+1;
	next();

});

app.get("/viewcount", function(req, res, next){
	res.send("You viewed this page: "+ req.session.views["/viewcount"] +" times" );
	
});

var fs=require("fs");

app.get("/readfile", function(req, res, next){
	fs.readFile("./public/reandomfile.txt",
	function(err, data){
		if(err){
			return console.log(err.stack);
		}
		res.send("the file : "+ data.toString() );


	});//eof of function err data


});//eof readFile

app.get("/writefile", function(req, res, next){
	fs.writeFile("./public/randomfile2.txt",
	 "more random text. ", function(err){
		if(err){
			return console.log(err);
		}//end of if
	} );//eof writefile()

		fs.readFile("./public/randomfile2.txt" , 
			function(err, data){
				if(err){
					return console.log(err);
				}//eof if
			res.send("the File: "+data.toString() );	

		});//eof readfile()

});//end of writefile

app.use(function(req, res , next){
	res.type("text/html");
	res.status(404);
	res.render('404');

} );//eof 404

app.use(function(err, req, res, next){
console.error(err.stack);
res.status(500);
res.render('500');
});//eof 500



/*app.get('/404', function(req, res){
 
  // Point at the home.handlebars view
  res.render('404');
});


app.get('/500', function(req, res){
 
  // Point at the home.handlebars view
  res.render('500');
});
*/
app.listen(app.get('port'), function(){
	console.log("Express started on http local host "+app.get('port')+ " press Ctrl-C to terminate" );
});