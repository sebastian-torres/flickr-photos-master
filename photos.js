/*global jQuery*/

var setupPhotos = (function ($) {
    function each (items, callback) {
        var i;
        for (i = 0; i < items.length; i += 1) {
            setTimeout(callback.bind(this, items[i]), 0);
        }
    }

    function flatten (items) {
        return items.reduce(function (a, b) {
            return a.concat(b);
        });
    }

    function loadPhotosByTag (tag, max, callback) {
        var photos = [];
        var callback_name = 'callback_' + Math.floor(Math.random() * 100000);

        window[callback_name] = function (data) {
            delete window[callback_name];
            var i;
            for (i = 0; i < max; i += 1) {
                photos.push(data.items[i].media.m);
            }
            callback(null, photos);
        };

        $.ajax({
            url: 'http://api.flickr.com/services/feeds/photos_public.gne',
            data: {
                tags: tag,
                lang: 'en-us',
                format: 'json',
                jsoncallback: callback_name
            },
            dataType: 'jsonp'
        })
    }

    function loadAllPhotos (tags, max, callback) {
        var results = [];
        function handleResult (err, photos) {
            if (err) { return callback(err); }

            results.push(photos);
            if (results.length === tags.length) {
                callback(null, flatten(results));
            }
        }

        each(tags, function (tag) {
            loadPhotosByTag(tag, max, handleResult);
        });
    }

    function renderPhoto (photo) {
        var img = new Image();
        img.src = photo;
        return img;
    }

    function imageAppender (id) {
        var holder = document.getElementById(id);
        return function (img) {
            var elm = document.createElement('div');
            elm.className = 'photo';
            
            //START ---- Append Favorite icon html elements
            var favit = document.createElement('div');
            favit.className = 'favit-holder';
            
            var favbutton = document.createElement('i');
            favbutton.className = 'icon-heart-empty';
            
            var img_url = img.src;
            
            var filename = img_url.substring(img_url.lastIndexOf('/')+1);
            filename = filename.substring(0, filename.length - 4)
            
            favbutton.id = filename;
            
            
            elm.appendChild(favit);
            favit.appendChild(favbutton);
            
            //END --------------------------- Favorite icon
            
            elm.appendChild(img);
                       
            
            holder.appendChild(elm);
            
            
            //START -------------- Favorite icon Hover states
            
            $('.favit-holder i').hover(function () {
            			$(this).removeClass('icon-heart-empty');
                        $(this).addClass('icon-heart');
                        $(this).css('color','#ce0000');
                    }, function () {
                        $(this).removeClass('icon-heart');
                        $(this).addClass('icon-heart-empty');
                        $(this).css('color','#fff');
                    });
                    
            if (document.cookie.indexOf('favIMG') >= 0) {
            	var cookieImgString = document.cookie;
            	cookieImgString = cookieImgString.replace('favIMG=','');
            	
            	var cookieImgArray = cookieImgString.split(',');
            	
            	        	
            	$.each(cookieImgArray, function(index, value) {
            	    $('#'+value).addClass('faved');
            	});
            }
                         
        };
        
                
    }

    // ----
    
    var max_per_tag = 5;
    return function setup (tags, callback) {
        loadAllPhotos(tags, max_per_tag, function (err, items) {
            if (err) { return callback(err); }

            each(items.map(renderPhoto), imageAppender('photos'));
            callback();
       
        });
    };
}(jQuery));
