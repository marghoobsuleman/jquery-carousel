/*
// msCarousel - jquery.msCarousel.js
// author: Marghoob Suleman
// Date: 5th April, 2010, {date: 7th July, 2010, 21st Feb, 2011}
// Revision: 28
// Version: 2.0 
// web: www.marghoobsuleman.com
// Example: 
// carousel_photos = $("#photopageGallery").msCarousel({boxClass:'.bigImg', blockWidth:400, width:400, height:315, callback:managePhotosNumber, autoSlide:autoPlay, showMessage:true, messageClass:'.overlapTxt'}).data("msCarousel");
//*/
/*
// msCarousel is free jQuery Plugin: you can redistribute it and/or modify
// it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
*/

;(function($){
	var msMyCarousel = function(element, opt) {
		var ver = "2.0";
		var $this = this;
		var settings = $.extend({
							scrollSpeed:1000,
							autoSlide:0,
							defaultid:0,
							width:515,
							blockWidth:'auto',
							height:258,
							vertical:false,
							boxClass:'.set',
							messageClass:'.message',
							showMessage:false,
							messageOpacity:0.8,
							loop:true,
							callback:''
							}, opt);	  
		var suffixed = {id:'msc'};
		var carouselProp = new Object();
		var elementid = $(element).attr("id");		
		var childid = elementid + "_mscchild";
		var unquieClass = elementid + "_mscss";
		var intervalid = 0;
		carouselProp.moveToZero = 0;
		
		var pauseFromOutSide = false;
		
		var init = function() {
			makeLayout();
		};
		var makeLayout = function () {
			addScrollerDiv();
		};
		var addScrollerDiv = function() {
			//alert("elementid"+elementid)
			$("#"+elementid).addClass("mscarousel");
			if(settings.vertical===false) {
				if(settings.boxClass!='.set') $("#"+elementid + " >"+settings.boxClass).addClass("set");
			};
			$("#"+elementid + " >"+settings.boxClass).addClass(unquieClass);
			var sDiv = '<div class="child" id="'+childid+'"></div>';
			$("#"+elementid).append(sDiv);
			//alert("settings.width " +settings.width);
			$("#"+elementid).css({width:settings.width+'px', height:settings.height+'px', overflow:'hidden',  position:'relative'});
			$("#"+childid).css({width:settings.width+'px'});
			//$("#"+elementid + " > ."+settings.boxClass).css({position:'absolute', float:'left'});
			if(settings.showMessage===true) {
				$("#"+elementid + "  "+settings.messageClass).css({display:'none', width:settings.width+'px', opacity:settings.messageOpacity});
			};
			//alert("allEl`ements "+allElements)
			//insert intro scroller div
			$("#"+elementid + "  >."+unquieClass).appendTo($("#"+childid));
			$("#"+childid).append("<strong class='clear last'></strong>");
			var allElements = $("#"+childid + " >."+unquieClass);
			//update carouselProp
			carouselProp.allElements = allElements;

			//next previous
			
			var prop = calculateWidthHeight();
			//if horizontal
			if(settings.vertical===false) {
				$("#"+childid).css({width:prop.width+'px'});
			};
			setClasses();
			if(settings.autoSlide>0) {
				startInterval();
				carouselProp.isPlaying = true;
			};
			if(settings.defaultid > 0) {
				settings.defaultid = settings.defaultid-1;
				next();
			} else if(settings.defaultid == 0) {
				settings.defaultid = -1;
				next();
			};
		};
		var setClasses = function() {
			//will do something later on this method
			var allElements = $("#"+childid + "  >."+unquieClass);
			if(settings.vertical===false) {
				if(settings.boxclass!='.set') $("#"+childid + "  "+settings.boxclass).addClass("set");
			};
			//set identifier class
			for(var iCount=0;iCount<allElements.length; iCount++) {
				$(allElements[iCount]).addClass(elementid+suffixed.id+"_"+iCount);
			};			
			allElements = $("#"+childid + "  >."+unquieClass);
			carouselProp.allElements = allElements;
		};						
		var next = function(isNext) {
			if(isNext===undefined) {
				if(settings.defaultid<carouselProp.allElements.length) {
					settings.defaultid++;
				}; 
				if((settings.defaultid==carouselProp.allElements.length || carouselProp.moveToZero>=2) && settings.loop==true) {
					settings.defaultid = 0;
					carouselProp.moveToZero = 0;
				} else if(settings.loop==false && (settings.defaultid==carouselProp.allElements.length)) {
					settings.defaultid--;
				};
			}; 
			if(isNext=='fromGoto') {
				//i'll do something later
			};
			if(settings.defaultid < carouselProp.allElements.length) {
				if(carouselProp.currentItem!==undefined) {
					carouselProp.previousItem = carouselProp.currentItem;
				};
				carouselProp.currentItem = childid + " > ."+elementid+suffixed.id+"_"+settings.defaultid;
				var pos = $("#"+carouselProp.currentItem).position();
				var tempw = $("#"+elementid).position().left + $("#"+carouselProp.currentItem).width();
				carouselProp.moveH = "-"+(pos.left)+"px";
				var pb = 0;
				var mb = 0;
				if($("#"+carouselProp.currentItem).css("padding-bottom") != 'auto') {
					pb = parseInt($("#"+carouselProp.currentItem).css("padding-bottom"));
				};
				if($("#"+carouselProp.currentItem).css("margin-bottom") != 'auto') {
					mb = parseInt($("#"+carouselProp.currentItem).css("margin-bottom"));
				};				
				var vSpacer = pb + mb;
				carouselProp.moveV = "-"+(pos.top+vSpacer)+"px";
				carouselProp.currentID = settings.defaultid;
				scrollContent();
				if(settings.defaultid == carouselProp.allElements.length) {
					settings.defaultid = 0;
				};
			};					
		};
		var previous = function() {
			if(settings.defaultid>0) {
				carouselProp.moveToZero = 0;
				settings.defaultid--;
				next("fromGoto");
			};
		};
		var afterScroll = function(evt) {			
			//scroll message
			if($("#"+carouselProp.currentItem+" "+settings.messageClass).length>0 && settings.showMessage==true) {
				$("#"+carouselProp.currentItem+" "+settings.messageClass).fadeIn("slow", function() {
					$(this).css({opacity:settings.messageOpacity})
				});
			};
			//call back
			//alert("after scroll settings.callback "+settings.callback);
			if(settings.callback!='') {
				eval(settings.callback)($this);
			};
			var lft = $("#"+childid).css("left");
			var lastItem = $(carouselProp.allElements[carouselProp.allElements.length-1]).position();
			if((lastItem.left - Math.abs(lft.substr(0, lft.length-2))) < settings.width) {
				carouselProp.moveToZero++;
				if(carouselProp.moveToZero>=2 || settings.defaultid==carouselProp.allElements.length-1) {
					carouselProp.moveToZero = 0;
				};
			};
		};
		var scrollContent = function() {
			if(carouselProp.previousItem!=undefined && settings.showMessage==true) {
				$("#"+carouselProp.previousItem+" "+settings.messageClass).fadeOut("slow");
			};
			if(settings.vertical===false) {
				//scroll horizontal
				$("#"+childid).animate({"left":carouselProp.moveH}, settings.scrollSpeed, function(evt) {
																								   afterScroll(evt);
																								   });
			} else {
				//scroll vertical
				$("#"+childid).animate({"top":carouselProp.moveV}, settings.scrollSpeed, function(evt) { 
																								  afterScroll(evt);
																								  });
			};
		};
		var calculateWidthHeight = function() {
			var prop = new Object();
			prop.width = 0;
			prop.height = 0;			
			var allElements = $("#"+childid + " >"+settings.boxClass);
			if(settings.vertical === false) {
				//what is this?
				//I can calcuate by count :P
				//but i dont want to have fix width for each slide
				//alert("childid " +childid +" : " +settings.blockWidth)
				if(settings.blockWidth == 'auto') {
					for(var iCount=0;iCount<allElements.length; iCount++) {
						//console.debug("childid " +childid + " : " +$(allElements[iCount]).width() + " : "+$(allElements[iCount]).css("width"))
						prop.width += $(allElements[iCount]).width();
						prop.height += $(allElements[iCount]).height();//incase of vertical
						//$(allElements[iCount]).addClass(elementid+suffixed.id+"_"+iCount);
					};
					//add spacer
					//prop.width += ($(allElements[allElements.length-1]).width()*2);
					//prop.width += 20;
				} else {
					prop.width = settings.blockWidth*allElements.length;
					prop.height = settings.height*allElements.length;
				};
				//alert("1 elementid "+elementid+ " width " +prop.width)
				prop.width += ($("#"+elementid).width()*2);
			} else {
				prop.width = settings.width;
				prop.height = settings.height*allElements.length;				
			};
			return prop;
		};
		var startInterval = function() {
			clearInterval(intervalid);
			intervalid = setInterval(function(){
													 next();
													 }, settings.autoSlide);
			//alert(elementid);
			$("#"+elementid).bind("mouseover", function(arg) {
													   $("#"+elementid).unbind("mouseout");
													   endInterval();
													   carouselProp.isPlaying = false;
													   });
			carouselProp.isPlaying = true;
			
		};
		var endInterval = function() {
			clearInterval(intervalid);
			$("#"+elementid).unbind("mouseover");
			$("#"+elementid).bind("mouseout", function(arg) {
													   if(pauseFromOutSide==false) {
														   startInterval();
													   }
													   });
			carouselProp.isPlaying = false;
		};
		this.forceScroll = function(pos) {
			if(settings.vertical===false) {
				//scroll horizontal
				$("#"+childid).animate({"left":pos}, settings.scrollSpeed, function(evt) {
																								   afterScroll(evt);
																								   });
			} else {
				//scroll vertical
				$("#"+childid).animate({"top":pos}, settings.scrollSpeed, function(evt) { 
																								  afterScroll(evt);
																								  });
			};
		};
		this.play = function(slideDelay) {
			if(typeof(slideDelay) != "undefined") {
				settings.autoSlide = slideDelay;
			};
			if(settings.autoSlide>0) {
				startInterval();
			};
			pauseFromOutSide = false;
		};
		this.isPlaying = function() {
			return carouselProp.isPlaying;
		};
		this.pause = function() {
			if(settings.autoSlide>0) {
				endInterval();
			};
			pauseFromOutSide = true;
		};
		this.next = function(keepInterval) {
			if(settings.defaultid == 0) {
				carouselProp.moveToZero = 0;
			}						
			if(settings.autoSlide>0) {if(typeof(keepInterval)=="undefined" || keepInterval === false) {endInterval()}};
			next();
		};
		this.goto = function(no, force) {
			//console.debug(elementid +" no "+no + " carouselProp.moveToZero "+carouselProp.moveToZero)
			//|| no==carouselProp.allElements.length-1
			if(no == 0) {
				carouselProp.moveToZero = 0;
			}
			if(no>carouselProp.allElements.length-1) {
				
			} else {
				settings.defaultid = no;
				next("fromGoto");
			};
		};				
		this.previous = function() {
			if(settings.defaultid == 0) {
				carouselProp.moveToZero = 0;
			};						
			if(settings.autoSlide>0) {endInterval()};
			previous();
		};
		this.getCurrentID = function() {
			return settings.defaultid;
		};
		//alias
		this.getCurrentId = this.getCurrentID;
		this.item = function(i) {
			if(typeof(i)=="undefined") {
				return carouselProp.allElements;
			} else {
				return carouselProp.allElements[i];
			};
		};
		//alias
		this.items = this.item;
		this.getNumbers = function(noul, ucs, lcs) {
			var items = this.item();
			var ulCSS = (typeof ucs=="undefined" || ucs.length==0) ? "" : " class="+ucs;
			var ul = (noul==true) ?  "" : "<ul"+ulCSS+">";
			var li = "";
			var liCSS = (typeof lcs=="undefined" || lcs.length==0) ? "" : " class="+lcs;
			for(var i=1;i<=items.length;i++) {
				li += "<li"+liCSS+">"+i+"</li>";
			};
			var last = (noul==true) ?  "" : "</ul>";
			ul = ul+li+last;
			return ul;
		};
		this.getVersion = function() {
			return ver;
		};
		this.setAutoScroll = function(i) {
			settings.autoSlide = i;
		};
		//init
		init();		
	};
	//fixed for prop
	if(typeof($.fn.prop)=='undefined') {
		$.fn.prop = function(w, v) {
			if(typeof v == "undefined") {
				return $(this).attr(w);
			};
			try {
				$(this).attr(w, v);
			} catch(e) {
				//some properties are read only.
			};
		};
	};	
	//now make object
	$.fn.msCarousel = function(opt) {
		return this.each(function() {
								  var element = $(this);
								  var myplugin = new msMyCarousel(element, opt);
								  element.data("msCarousel", myplugin);
								  });
	}
})(jQuery);