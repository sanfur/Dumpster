
      function clickBack() {
          location.href = 'startPoint.html';
      };    
      
      function waitForInput(callback) {
    	    if (navigator.geolocation) {
    	        navigator.geolocation.getCurrentPosition(
    	            function(position){
    	            	generateMap(position.coords)
    	            	findToilets(position.coords)
    	            }
    	        );
    	    } else {
    	      return"Unknown";
    	    }
      }
      
      function generateMap(coords){

    	  // Temporary lat long 9.53287, 46.84986
//    	  var latitude = coords.latitude;
    	  var latitude = 46.84986;
//    	  var longitude = coords.longitude;
    	  var longitude = 9.53287;
    	  	
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
	  
      function findToilets(coords){
    	  
    	  var dif = 0.1;
//    	  var minLat = coords.latitude - dif;
//    	  var minLon = coords.longitude - dif;
//    	  var maxLat = coords.latitude + dif;
//    	  var maxLon = coords.longitude + dif;
    	  
    	  var minLat = 46.84986 - dif;
    	  var minLon = 9.53287 - dif;
    	  var maxLat = 46.84986 + dif;
    	  var maxLon = 9.53287 + dif;
    	  
    	  
    	  $.ajax({
	  			url:
	  				'https://www.overpass-api.de/api/interpreter?data=' + 
	  				'[out:json][timeout:60];' + 
	  				'node [amenity=toilets]' + 
	  				'(' + minLat + ',' + minLon +',' + maxLat + ',' + maxLon + ');' + 
	  				'out;',
	  			dataType: 'json',
	  			type: 'GET',
	  			async: true,
	  			crossDomain: true,
	  			success: function(data) {
					$(data.elements).each(function(index, value){											
						var fromProjection 	= new OpenLayers.Projection("EPSG:4326"); 
						var toProjection   	= new OpenLayers.Projection("EPSG:900913");
						var size 			= new OpenLayers.Size(30,30);
						var icon 			= new OpenLayers.Icon('toilet.png', size);   
						var position       	= new OpenLayers.LonLat(value.lon, value.lat).transform( fromProjection, toProjection);       
						var markers = new OpenLayers.Layer.Markers( "Markers" );
						map.addLayer(markers);
						markers.addMarker(new OpenLayers.Marker(position, icon));
					});	
				},	  				
	  			error: function(error) {
	  			console.log(error);
	  			console.log( "error" );
	  			},
	  		});
      }
      
	 

      













