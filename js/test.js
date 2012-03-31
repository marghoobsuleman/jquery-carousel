/*
		this.addItem = function(html) {
			var allElements = $("#"+elementid + " "+settings.boxClass);
			var lastItem = allElements[allElements.length-1];
			$(lastItem).after(html);
			if(settings.vertical===false) {
				if(settings.boxClass!='.set') $("#"+elementid + "  "+settings.boxClass).addClass("set");
			};			
			var allElements = $("#"+elementid + " "+settings.boxClass);
			$(allElements[allElements.length-1]).addClass(elementid+suffixed.id+"_"+(allElements.length-1));
			carouselProp.allElements = allElements;	
		};
		this.removeItem = function(index) {
			var allElements = $("#"+elementid + " "+settings.boxClass);
			if(index<allElements.length) {
				$(allElements[index]).remove();
			}
			//re assign
			allElements = $("#"+elementid + "  "+settings.boxClass);
			carouselProp.allElements = allElements;
		};		

*/