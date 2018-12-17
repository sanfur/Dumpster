
	  // Global variables
      var wifis = [];
      var map;
      var currentPosition;

      // Initialize
      window.onload = function (callback) {
    	    if (navigator.geolocation) {
    	        navigator.geolocation.getCurrentPosition(
    	            function(position){
    	            	generateMap(position.coords);
    	            	findHotspots(position.coords);
    	            	findToilets(position.coords);
    	            }
    	        );
    	    } else {
    	      return"Unknown";
    	    }
      }

      // Functions
      function clickBack() {
    	  location.href = 'startPoint.html';
      };  
      
      function generateMap(coords){

    	  currentPosition = coords;
    	  var latitude = coords.latitude;
    	  var longitude = coords.longitude;
    	  	
    	  	map = new OpenLayers.Map("basicMap");
			var mapnik        	= new OpenLayers.Layer.OSM();
			var fromProjection 	= new OpenLayers.Projection("EPSG:4326"); 
			var toProjection   	= new OpenLayers.Projection("EPSG:900913");
			var position       	= new OpenLayers.LonLat(longitude, latitude).transform( fromProjection, toProjection);       
			var size 			= new OpenLayers.Size(30,30);
			var icon 			= new OpenLayers.Icon('media/marker.png', size);   
			var zoom           	= 15;   
			map.addLayer(mapnik);
			
			var markers = new OpenLayers.Layer.Markers( "Markers" );
			map.addLayer(markers);
			var currentMarker = new OpenLayers.Marker(position, icon); 
			markers.addMarker(currentMarker);
			
			map.setCenter(position, zoom );
      }
	  
      function findHotspots(coords){
    	  var dif = 0.1;
    	  
    	  $.ajax({
	  			url:
	  				'https://www.overpass-api.de/api/interpreter?data=' + 
	  				'[out:json][timeout:60];' + 
	  				'node [internet_access=wlan]' + 
	  				'(' + 
	  				(coords.latitude - dif) + ',' + 
	  				(coords.longitude - dif) +',' + 
	  				(coords.latitude + dif) + ',' + 
	  				(coords.longitude + dif) + ');' + 
	  				'out;',
	  			dataType: 'json',
	  			type: 'GET',
	  			async: true,
	  			crossDomain: true,
	  			success: function(data) {
	  				 $(data.elements).each(function(index, value){
	  					 wifis[index] = value;
	  				 });	
				},	  				
	  			error: function(error) {
	  			console.log(error);
	  			console.log( "error" );
	  			}
	  		});
      }
      
      function findToilets(coords){
    	  var dif = 0.1;
    	  
    	  $.ajax({
	  			url:
	  				'https://www.overpass-api.de/api/interpreter?data=' + 
	  				'[out:json][timeout:60];' + 
	  				'node [amenity=toilets]' + 
	  				'(' + 
	  				(coords.latitude - dif) + ',' + 
	  				(coords.longitude - dif) +',' + 
	  				(coords.latitude + dif) + ',' + 
	  				(coords.longitude + dif) + ');' + 
	  				'out;',
	  			dataType: 'json',
	  			type: 'GET',
	  			async: true,
	  			crossDomain: true,
	  			success: function(data) {
					$(data.elements).each(function(index, value){											
						
						hotspotAndToiletMatches(value)
					});	
				},	  				
	  			error: function(error) {
	  			console.log(error);
	  			console.log( "error" );
	  			},
	  		});
      }
      
	  function hotspotAndToiletMatches(coords){
		  
		  var fromProjection = new OpenLayers.Projection("EPSG:4326"); 
		  var toProjection = new OpenLayers.Projection("EPSG:900913");
		  var markers = new OpenLayers.Layer.Markers( "Markers" );
		  map.addLayer(markers);
		  var position = new OpenLayers.LonLat(coords.lon, coords.lat).transform( fromProjection, toProjection);       
          var size = new OpenLayers.Size(45,55);

		  var i;
		  for(i = 0; i < wifis.length; i++){
				var pointToilet = new OpenLayers.Geometry.Point(coords.lon, coords.lat);
				var pointWifi = new OpenLayers.Geometry.Point(wifis[i].lon, wifis[i].lat)
				var distance = pointToilet.distanceTo(pointWifi);
				
				if(distance < 0.001){
					  var icon = new OpenLayers.Icon('media/hotspotToiletMarker.png', size); 
					  var marker = new OpenLayers.Marker(position, icon);
					  markers.addMarker(marker);            
					  markers.events.register( 'click', marker, function(marker){ 
						  	prepareNavigationButton(marker, fromProjection, toProjection);
					  });
					  return;
				}	 
		  }
		  
		  var icon = new OpenLayers.Icon('media/toiletMarker.png', size);  
		  var marker = new OpenLayers.Marker(position, icon);		  
		  markers.addMarker(marker);		  
		  markers.events.register( 'click', marker, function(marker){ 
			  	prepareNavigationButton(marker, fromProjection, toProjection);
		  });
	  }
	  
	  function prepareNavigationButton(marker, fromProjection, toProjection){
		  var position = new OpenLayers.LonLat(
				  marker.object.markers[0].lonlat.lon, 
				  marker.object.markers[0].lonlat.lat).transform( toProjection, fromProjection
		  );       
		  var button = document.getElementById("findRoute");
		  button.href = "http://maps.google.com/maps?saddr=" +
		  				currentPosition.latitude + 
		  				"," + 
		  				currentPosition.longitude + 
		  				"&daddr=" + 
		  				position.lat + 
		  				"," + 
		  				position.lon;
		  button.style.display = "block";
	  }
	  