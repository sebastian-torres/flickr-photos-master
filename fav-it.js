//Favorite this image and store favs as cookie - ver 1.0 

function FAVit() {
	var img_id = 0;
	
	$( '.photo' ).each(function( index ) {
	  $(this).append('<div class="fav-it">&nbsp;</div>');
	});
}