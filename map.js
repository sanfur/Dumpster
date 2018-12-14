
      function clickBack() {
          location.href = 'startPoint.html';
      };    
      
      function waitForInput(callback) {
    	    if (navigator.geolocation) {
    	        navigator.geolocation.getCurrentPosition(
    	            function(position){
    	            	generateMap(position.coords)
    	            }
    	        );
    	    } else {
    	      return"Unknown";
    	    }
      }
      
      function generateMap(coords){

    	  	var latitude = coords.latitude;
    	  	var longitude = coords.longitude;
    	  	map = new OpenLayers.Map("basicMap");
			var mapnik        	= new OpenLayers.Layer.OSM();
			var fromProjection 	= new OpenLayers.Projection("EPSG:4326"); 
			var toProjection   	= new OpenLayers.Projection("EPSG:900913");
			var position       	= new OpenLayers.LonLat(longitude, latitude).transform( fromProjection, toProjection);       
			var size 			= new OpenLayers.Size(30,30);
			var icon 			= new OpenLayers.Icon('marker.png', size);   
			var zoom           	= 15;         
			map.addLayer(mapnik);
			
			var markers = new OpenLayers.Layer.Markers( "Markers" );
			map.addLayer(markers);
			markers.addMarker(new OpenLayers.Marker(position, icon));
			
			map.setCenter(position, zoom );
      }
	  
	  $.ajax({
			url:
				'https://www.overpass-api.de/api/interpreter?data=' + 
				'[out:json][timeout:60];' + 
				'area["boundary"~"administrative"]["name"~"Berlin"];' + 
				'node(area)["amenity"~"school"];' + 
				'out;',
			dataType: 'json',
			type: 'GET',
			async: true,
			crossDomain: true
		}).done(function() {
			console.log( "second success" );
		}).fail(function(error) {
			console.log(error);
			console.log( "error" );
		}).always(function() {
			console.log( "complete" );
		});

      













