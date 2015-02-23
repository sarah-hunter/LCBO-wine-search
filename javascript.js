	var wineApp = {};

	wineApp.price = function() {

	}

	wineApp.from  = 0;
	wineApp.to  = 2000; // $20 


//    HERE WE ARE GETTING THE DATA FROM CUSTOMER 

	wineApp.collectInfo = function() {
		
		$('form').on('submit', function(e) {
			e.preventDefault();

			// User is going to select a type of wine from a predefined list.
			// Get the value of the element they clicked (the input field) and save it to a global variable.
			// Get contents of first input box and save them in a variable
			wineApp.type = $('select#winetype').val();

			// Get the price that a user asked for
			wineApp.price = $('input.price').val();

			// Let a user select Canadian or international and save it in a variable.
			wineApp.keywords = $('.keywords input').val();

			wineApp.getWine();

			$('html,body').animate({
	      scrollTop: $('#wineselection').offset().top
	    }, 1000);

		});

	}


// MAKE AN API CALL TO LCBO API

	wineApp.getWine = function() {
	
	$.ajax({
		url : 'https://lcboapi.com/products',
		headers: {
		   'Authorization': 'Token MDplNWY3N2ZjMi1iODgyLTExZTQtODEzOS03YjdlNjA3YzNjYTg6TTFFRmtseU1qY3FJcmNKbFVVRUQ5bVFnam8wSWZpcVdhYkRB'
		 },
		type : 'GET',
		dataType : 'json',
		// we provide all of the parameters that need to go along with the request in this data object. For possible parameters check out the API documentation.
		data : {
			q : wineApp.type + "+" + wineApp.keywords,
			// order : 'price_in_cents.asc',
			per_page : 100
		},
		success : function(data) {
			wineApp.stuff = data.result;
			wineApp.displayWine(wineApp.stuff);
		}
	});

} // end of getWine		

wineApp.displayWine = function(wines) {
	$('.showWine').html('');
	// we have an array of product_id, we need to loop through each one, and display them.
	
	// before we go over the wines

	// 1. shuffle the array
	wines = wineApp.shuffle(wines);
	// 2. slice out the first 5
	var newWines = wines.slice(0,9);

	var wineCount = 0;

	for (var i = 0; i < newWines.length; i++) {
		var wine = newWines[i];
		console.log(wine);
		if (
			wine.price_in_cents >= wineApp.from
			&&
			wine.price_in_cents <= wineApp.to
			&& 
			wine.primary_category === 'Wine'
		){
			var output = $('<div>').addClass('selection');
			var h2 = $('<h2>').text(wine.name);
			var p = $('<p>').text(wine.stock_type + " #" + wine.id);
			var details = $('<p class="price">').text(" $" + wine.price_in_cents/100);
			var overlay = $('<div>').addClass('overlay');
			var tastingNote = $('<p class="tasting">').text(wine.tasting_note);
			var wineSugg = $('<p class="wineSugg">').text(wine.serving_suggestion);
			overlay.append(wineSugg,tastingNote);

			// add thumbnail images if there are images available.
			if(wine.image_url) {
				var img = $('<img>').attr('src',wine.image_url)
			} else {
				var img = $('<img>').attr("http://placehold.it/350x400");
			} 

			var imageBox = $('<div class="image-container">').prepend(overlay,img);

			// var overlayText = $('<p>')text(" $" + wine.price_in_cents/100);

			output.append(h2,p,details,imageBox);
			$('div.showWine').append(output);

			wineCount++;
			if (wineCount === 3){
				// stop loop!
				return false;
			}
		} // end check for price and wine type

	} //end of for loop


} // end of wineApp.displayWine()


wineApp.init = function() {
	//Add event listener on submit button
	wineApp.collectInfo();

	$("#priceSlider").ionRangeSlider({
	    type: "double",
	    // grid: true,
	    grid_snap: true,
	    step: 5,
	    min: 0,
	    max: 50,
	    from: 0,
	    to: 50,
	    prefix: "$",
	    onFinish: function (data) {
			wineApp.from = data.from * 100;
			wineApp.to = data.to * 100;
			console.log(wineApp.from + " / " + wineApp.to);
    }
	});

};


wineApp.shuffle = function(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

//Document is ready
	$(function() {
		//Call in to start application 
		wineApp.init();
	});

 
