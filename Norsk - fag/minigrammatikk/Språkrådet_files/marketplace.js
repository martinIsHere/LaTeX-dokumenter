/*$Id$*/
var delimiter = '+';

jQuery(function(){

	var frontpage = $('#frontpage');
	if(frontpage !== null && frontpage.length > 0) {
		$('#outer').addClass('frontpage-banner');
	}

	// Hide topmenu on assessment mode
	if (jQuery(".level-2 > iframe").length > 0) {
		jQuery('iframe').iframeAutoHeight();
		//toggleTopmenuDesktop();
	}
	
	if (jQuery("#slider-duration").length > 0 || jQuery("#slider-difficulty").length > 0) addSlider();
	if (jQuery(".theme-content > table").length > 0) sortTable();
	//if(jQuery("#slide-button").length > 0 || jQuery("#mobile-menu").length > 0) toggleTopMenu();
	if (jQuery(".expandable").length > 0) toggleThemeList();
	if (jQuery(".tab").length > 0) selectTabs();
	
	if (jQuery(".print").length > 0) printSection();
	
//	if (jQuery("#bottom-boxes > #ovingsrekker").length > 0) insertPopularAssessments();
  
    var winLocation = window.location+'';

    if((document.referrer.indexOf('minigrammatikk') != -1 && jQuery('#showMinigrammar').offset() != null) || (document.referrer.indexOf('minigrammatikk') == -1 && winLocation.indexOf('/tema/') != -1 &&jQuery('#showMinigrammar').offset() != null))
    {
        var docElement = jQuery('#doc_'+winLocation.substring(winLocation.lastIndexOf('/')+1));
        if(docElement.length > 0)
            scrollToElement('doc_'+winLocation.substring(winLocation.lastIndexOf('/')+1));
        else
            scrollToElement('showMinigrammar');

	}

	
	/* Remove class on body element to prevent hover effect on touch screen devices */
	if ("ontouchstart" in document.documentElement) {
		jQuery('#portal').removeClass('noTouch');
	}
	
	/* Hide the address bar for smartphones */
	setTimeout(function(){
		window.scrollTo(0, 1);
	}, 0);



    try{
        /* Alternate colors on table rows */
        if ($(".theme-content").size() > 0) {
            $(".theme-content").each(function(index, s){
                alternateTableRows(s);
            });
        }
    }catch(err){
        // ie8
//        alert('$(".theme-content").size() '+err);
    }
	
	/*
	 * iOS hack
	 * */
	/*
	if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
	    var viewportmeta = document.querySelector('meta[name="viewport"]');
	    if (viewportmeta) {
	    	if (navigator.userAgent.match(/iPhone/i))
	    		viewportmeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
	    	else {
		    	viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
		        document.body.addEventListener('gesturestart', function () {
		            viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
		        }, false);
	    	}
	    }
	}
	*/
         
    var eMiniGrammar=jQuery('.minigrammar');
        if(eMiniGrammar.length){
           var eMiniGrammarBtn = jQuery("button#backToTopButton");
           eMiniGrammarBtn.click(function(){
               $("html, body").animate({ scrollTop: 0 }, "slow");
               return false;
           });
        }

    var eCreateCustomAssessment=jQuery('#start-oving');
    if(eCreateCustomAssessment.length){        
        //creating theme tree              
       //addChooseTagTree('theme');//TESTC-128
       
       var eGCA=jQuery("button#generateCustomAssessment"); 
       eGCA.click(function(){
           goToCustomAssessment(eGCA, eCreateCustomAssessment);
       });

       var resetGCA = jQuery("button#resetCustomAssessment");
       resetGCA.click(function() {
            resetCustomAssessment(resetGCA,eCreateCustomAssessment);
       })
    }
    
});
/*
var showAnswers = function(){
	jQuery("#idPanelSummary").hide();
	jQuery("div.front > .item").each(function(){
		jQuery(this).show();
	});
}
*/

var printSection = function(){
	jQuery(".print").click(function(e){
		e.preventDefault();
//		alert('test');
//		jQuery(this).prevAll("div.contentSection").print();
		$(this.parentNode).siblings("div.contentSection").print()
//		jQuery("#showMinigrammar").print();
		return false;
	});
}

var insertPopularAssessments = function(){
	var url = servletLocation+'ICSXapi/content/json/GetPopularAssessments';
	var linkURL = servletDispatcher+'Populaere_oevingsrekkjer#';

	jQuery.ajax({
		type:		"POST",
		url: 		url,
		traditional:true,
		data: 		{max:6},
		success:	function(json){
			if(json.GetPopularAssessments.assessments){
				jQuery.each(json.GetPopularAssessments.assessments, function(k, v){
					jQuery("#ovingsrekker > .box-content > ul").append('<li><a href="'+linkURL+'cid='+v.contentItemId+'">'+v.title+'</a></li>');
				});
				
			}
		}
	});
}

var addLinkToTwitter = function(twitterParam){
	var _href = jQuery("#link-to-twitter").attr("href") + twitterParam;
	jQuery.getJSON('http://urltinyfy.appspot.com/tinyurl?url=' + encodeURIComponent(window.location) + '&callback=?', function(data){
        var myPopup = window.open(_href + ' ' + data.tinyurl, 'Share on Twitter','toolbar=0, status=0, width=626,height=336');
        if (!myPopup) window.location = _href + ' ' + data.tinyurl;
	});
	
	return false;
	
}
	
var addLinkToMail = function(){
	var _href = " " + jQuery("#link-to-mail").attr("href");
	window.location = _href + "%0D%0A" + window.location;
	return false;
}

var postToFacebook = function(url){

    var postUrl = url+window.location;
    postUrl= postUrl.replace('#','%23');
	window.open(postUrl,'sharer','toolbar=0, status=0, width=626,height=336');
	return false;
}

var getWTag=function(rootTag){
   return jQuery('.wrapper_'+rootTag);
}

/*Creates tree for question tags along with a field for gathering selected tags*/
var addChooseTagTree=function(rootTag){    
    var wtag=getWTag(rootTag);
    var initiallyOpened=[];
    var availableTags=[];
    
    jQuery.each(wtag.find('.tag_tree  li.questionTag'),function(i,eNodeTag){
       eNodeTag=jQuery(eNodeTag);
       availableTags.push(eNodeTag.attr('tagName'));
       initiallyOpened.push(eNodeTag.attr('id'));
    })

    wtag.find('.tag_tree > li.questionTag').jstree({
        "core" : { "initially_open" : initiallyOpened},
        "plugins" : [ "themes", "html_data", "ui" ]
    })
    /*Adding selected tag node into the chosen tags list*/
    .bind('select_node.jstree', function (e, data) {
        // event triggered when a node is selected in the tree
        var node = data.args[0];
        var eNode = jQuery(node).parent('li.questionTag');

        if (eNode) {
          eNode=jQuery(eNode);  
          wtag.find('.tag_all_chosen').tagit('createTag',eNode.attr('tagName'));  
        }
    }); 

    //Registering all available tags        
    wtag.find('.tag_all_chosen').tagit({          
        availableTags: availableTags
    });  
}

var getChosenTags=function(rootTag){
    var wtag=getWTag(rootTag);
    var chosenTags=wtag.find('.tag_all_chosen').tagit("assignedTags");
    
    var tagIDs=[];   
    jQuery.each(chosenTags,function(i,tagName){
       var eNodeTag = wtag.find('.tag_tree li.questionTag[tagName="'+tagName+'"]');
       if(eNodeTag.length){
           tagIDs.push(eNodeTag.attr("id"));
       }
    })
    return tagIDs;
}

var addSlider = function(){
	var valMap = [10,15,20,30];
	jQuery("#slider-duration").slider({
		min: valMap[0],
		max: valMap[valMap.length - 1],
		values: [2],
		value: 15,
		step: 5,
		start: function(e,ui){
			jQuery(this).prevAll(".slider-bubble").fadeIn("fast");
		},
		stop: function(e,ui){
			jQuery(this).prevAll(".slider-bubble").fadeOut("fast");
			/* Do action here */
			// Save chosen value
			/*var currentHash = window.location.hash.substring(1);
			var params = currentHash.split(delimiter);
			var newParams = [];
			var newHash = '';
			jQuery.each(params, function(key, value){
				if (value.indexOf('duration_') < 0){
					newParams.push(value);
				}
			});
			jQuery.each(newParams, function(key, value){
				newHash += value+delimiter;
			});
			newHash += "duration_"+ui.value;
			window.location.hash = newHash;*/
			$('#customAssessmentDuration').val(ui.value);
			//loadOvingsrekkjer();
		},
		slide: function(e,ui){
			var mypos = jQuery(this).slider("value") * 5;
			jQuery(this).prevAll(".slider-bubble").css('left', mypos).text(ui.value);
			return $.inArray(ui.value, valMap) != -1;
		}
	});
	
	// Add difficulty slider
	jQuery("#slider-difficulty").slider({
		min: 1,
		max: 3,
		stop: function(e,ui){
			/* Do action here */
			// Save chosen value
			/*var currentHash = window.location.hash.substring(1);
			var params = currentHash.split(delimiter);
			var newParams = [];
			var newHash = '';
			jQuery.each(params, function(key, value){
				if (value.indexOf('difficulty_') < 0){
					newParams.push(value);
				}
			});
			jQuery.each(newParams, function(key, value){
				newHash += value+delimiter;
			});
			newHash += "difficulty_"+ui.value;
			window.location.hash = newHash;*/
			var hiddenInput = $('#customAssessmentDifficulty');
			if(ui.value === 1) {
				$(hiddenInput).val('easy');
			} else if (ui.value === 2) {
				$(hiddenInput).val('medium');
			} else {
				$(hiddenInput).val('difficult');
			}
			//loadOvingsrekkjer();
		},
		slide: function(e,ui){
			jQuery(this).prevAll(".slider-bubble").text(ui.value);
		}
	});
}

var sortTable = function(){
	jQuery(".theme-content > table").tablesorter({
		sortList: [[0,0]],
		headers: {
			2:{sorter:false},
			3:{sorter:false}
		},
		usNumberFormat: false,
		widgets: ['zebra']
	});	
}

var toggleTopMenu = function(){
	
	// Toggle top menu
	//if (jQuery('#slide-button').size() > 0) {
		jQuery('#slide-button>a').click(function(event){
			//toggleTopmenuDesktop();
		});
	//}

	// Toggle top menu mobile
	jQuery("#mobile-menu > a").click(function(){
		addOverlayBG();
		if(jQuery("#slide-menu").height() > 0){
			jQuery(this).html("Meny");
			jQuery("#overlay").fadeOut();
		} else {
			jQuery(this).html("Lukk");
			jQuery("#overlay").fadeIn();
		}
		jQuery("#slide-menu").toggleClass("toggled");
	});	
}

var addOverlayBG = function(){
	pageHeight = Math.max(jQuery(document).height(),jQuery(window).height(),document.documentElement.clientHeight);
	pageWidth = Math.max(jQuery(document).width(),jQuery(window).width(),document.documentElement.clientWidth);
	jQuery("#overlay").css({
		height: pageHeight+'px',
		width: pageWidth+'px'
	});		
}

var toggleThemeList = function(){
	jQuery(".expandable:has(.theme-content) > .header").click(function(e){
		e.preventDefault();
		e.stopPropagation();
		var winLocation = window.location+'';
		var theme = $(this).parent('.expandable').attr('id').substring(6);
		var url = servletDispatcher+'minigrammatikk/tema/'+theme;
		
		if($(this).nextAll(".theme-content:hidden").length != 0) hideTopMenu(); //showTopMenu();
		//else hideTopMenu();
		
		if ($(this).nextAll(".theme-content").length > 0){
			// collapse all
			/*$(".theme-content").each(function(s){
				collapseDetail(this);
				$(this).prev(".circle-btn").removeClass("expanded").addClass("collapsed");
			});*/
			
			if($(this).nextAll(".theme-content").is(":visible")){
				collapseDetail($(this).nextAll(".theme-content"));
				$(this).parent().children(".subject-btn").removeClass("expanded").addClass("collapsed");
				if(theme!=winLocation.substring(winLocation.lastIndexOf('/')+1))
					window.location = url;
				
			}
			else {
				if(theme!=winLocation.substring(winLocation.lastIndexOf('/')+1))
					window.location = url;
				else{
					expandDetail($(this).nextAll(".theme-content"));
					$(this).parent().children(".subject-btn").removeClass("collapsed").addClass("expanded");
				}
			}
		}
	});
	
	jQuery(".expandable > .theme-content table tr, .expandable:not(:has(.theme-content))").click(function(e){
		e.preventDefault();
		var winLocation = window.location+'';
		var theme = $(this).attr('id').substring(6);
		if(theme!=winLocation.substring(winLocation.lastIndexOf('/')+1))
			window.location = servletDispatcher+'minigrammatikk/tema/'+theme;
	});

    jQuery(".expandable > .subject-btn,.expandable:has(.theme-content) button").click(function(e){
        e.preventDefault();
        e.stopPropagation();

        var theme = $(this).parent('.expandable').attr('id').substring(6);

        if($(this).nextAll(".theme-content:hidden").length != 0) hideTopMenu();

        if ($(this).nextAll(".theme-content").length > 0){

            if($(this).nextAll(".theme-content").is(":visible")){
                collapseDetail($(this).nextAll(".theme-content"));
                $(this).parent().children(".subject-btn").removeClass("expanded").addClass("collapsed");
            }
            else {
                expandDetail($(this).nextAll(".theme-content"));
                $(this).parent().children(".subject-btn").removeClass("collapsed").addClass("expanded");
            }
        }
    });


}

var selectTabs = function(){
	jQuery(".tab").click(function(e){
		var currentHash = window.location.hash.substring(1);
		var themes = [];
		var chosenHash = this.hash.substring(1);
		
		if (chosenHash == 'alle') {
			window.location.hash = '';
			if(currentHash != chosenHash){ //.indexOf(chosenHash) < 0){
				// selected
				jQuery(".tab").each(function(i,s){
					jQuery(s).removeClass('chosen');
				});
				jQuery(this).addClass('chosen');
			} else {
				// deselected
				e.preventDefault();
				jQuery(this).removeClass('chosen');
			}
			
		} else {
			jQuery(this).toggleClass('chosen');
			jQuery('.alle > a').removeClass('chosen');
			if (currentHash != '') themes = currentHash.split(delimiter);
			themes = jQuery.grep(themes, function(value){return value != 'alle'});
			
			if (themes.length > 0){
				e.preventDefault();
				if(jQuery.inArray(chosenHash, themes) < 0)
					themes.push(chosenHash);
				else
					themes = jQuery.grep(themes, function(value){return value != chosenHash});
				window.location.hash = themes.join("+");
			}
		}
		
		// remove delimiter at the beginning of hash string
		/*
		if (window.location.hash.charAt(1) == delimiter){
			window.location.hash = currentHash.substring(1,currentHash.length);
		}
	 	*/

		loadOvingsrekkjer();
	});	

	// Preserve chosen themes after page reload
	if (jQuery(".tab").length > 0 && window.location.hash.length > 0){
		var currentHash = window.location.hash.substring(1);
		var themes = currentHash.split(delimiter);
		jQuery.each(themes, function(key, value){
			if ((value.indexOf('duration_') < 0) && (value.indexOf('difficulty_') < 0)){
				jQuery('.'+value+' > a').addClass('chosen');
			}
		});

		loadOvingsrekkjer();
	}
}

var toggleTopmenuDesktop = function(){
	jQuery("#slide-menu > ul").show();
	if (jQuery(".hide-menu").length > 0) {
		hideTopMenu();
	} else {
		showTopMenu();
	}
}

var hideTopMenu = function(){
	var contentSection = jQuery('.test_deg_wrapper > .intro-document-wrapper > .contentDocument > .contentSection')[0];
	if (jQuery('.level-2 > .intro-document-wrapper > .contentDocument').length > 0) {
		jQuery('.level-2 > .intro-document-wrapper > .contentDocument').slideUp('slow');
	}
    if (contentSection && contentSection.innerHTML.length > 0) {
        jQuery('.test_deg_wrapper > .intro-document-wrapper > .contentDocument').slideUp('slow');
    } else {
        jQuery('.test_deg_wrapper > .intro-document-wrapper > .contentDocument').hide();
    }
	jQuery('#slide-button').removeClass("hide-menu").addClass("show-menu");
}

var showTopMenu = function(){
	jQuery('#slide-menu > ul, #inner').animate({marginTop: '0'}, 500);
	if (jQuery('.level-2 > .intro-document-wrapper > .contentDocument').length > 0) {
		jQuery('.level-2 > .intro-document-wrapper > .contentDocument').slideDown('slow');
	}
    if (jQuery('.test_deg_wrapper > .intro-document-wrapper > .contentDocument > .contentSection')[0].innerHTML.length > 0) {
        jQuery('.test_deg_wrapper > .intro-document-wrapper > .contentDocument').slideDown('slow');
    }
	jQuery('#slide-button').removeClass("show-menu").addClass("hide-menu");
}

var alternateTableRows = function(table){
	jQuery(table).find("tbody > tr:even").addClass("odd");
	jQuery(table).find("tbody > tr:odd").addClass("even");
}

var loadOvingsrekkjer = function(){
	var url = '';
	var currentHash = window.location.hash.substring(1);
	var params = currentHash.split(delimiter);
	var selectedThemes = '';
	
	jQuery(".tab.chosen").each(function(key, value){
			selectedThemes += "theme="+jQuery(value).parent().attr('class');
			if (key < jQuery(".tab.chosen").length-1) selectedThemes += "&";
	});
	
	if(document.location.href.indexOf('ovingar') != -1){
		url = servletDispatcher+'ovingar/Ovingar_liste';
		jQuery('#content > #ovingar_liste').css("opacity","0.5");
		jQuery('#content').prepend('<div class="loader"><img src="'+staticFileLocation+'sprakradet/gfx/ajax-loader.gif"/></div>');
		jQuery.ajax({
	//		type:		"GET",
			url: 		url,
			data: 		selectedThemes,
			success:	function(transport){
				jQuery("#content").html(transport);
				var contentItems = jQuery("#content").find('.contentItem');
				var contentItemsArray = [];
				for (i = 0; i < contentItems.length; i++) {
                    contentItemsArray.push(jQuery(contentItems[i]).attr('logicalname'));
                }
                window.sessionStorage.setItem('contentItemsArray', contentItemsArray);
			},
			complete: function() {
				
			}
		});
	}else{
		url = servletDispatcher+'ovingsrekkjer/Oevingsrekkjer_liste';
		
		jQuery.each(params, function(key,value){
			if(value.indexOf("duration") > -1) selectedThemes += "&duration="+value.substring(value.indexOf("_")+1);
			if(value.indexOf("difficulty") > -1) selectedThemes += "&difficulty="+value.substring(value.indexOf("_")+1);
		});
		
		jQuery('#content > #ovingsrekker_liste').css("opacity","0.5");
		jQuery('#content').prepend('<div class="loader"><img src="'+staticFileLocation+'sprakradet/gfx/ajax-loader.gif"/></div>');
		jQuery.ajax({
	//		type:		"GET",
			url: 		url,
			data: 		selectedThemes,
			success:	function(transport){
                var resultContainer = jQuery(transport).find('div#ovingsrekker_liste');
                jQuery("#content").html(transport);
                if (resultContainer.prevObject[1].children.length > 1) {
                    jQuery('.no-results').hide();
                } else {
                    jQuery('.no-results').show();
                }
			},
			complete: function() {
				if (window.devicePixelRatio > 1 || jQuery(window).width() < 650)
					scrollToElement('wrapper');

				if($(".chosen:visible").length < 1) {} // showTopMenu();
				else hideTopMenu();
				//generateAssessmentUsage();
				loadSingleTestClick();
			}
		});
	}
};

var generateAssessmentUsage = function(){
	var url = servletLocation+'ICSXapi/content/json/GetAssessmentUsage';
	var assessmentParam = "";
	jQuery("#ovingsrekker_liste > .contentItem").each(function(i,s){
		assessmentParam += "assessmentId="+jQuery(s).attr("id");
		if(i < jQuery("#ovingsrekker_liste > .contentItem").length - 1) assessmentParam += "&";
	});
	if (assessmentParam.length > 0) {
		jQuery.ajax({
			type: "POST",
			url: url,
			data: assessmentParam,
			success: function (json) {
				if (json.GetAssessmentUsage.assessmentsUsage) {
					var maximumAssessmentUsage = json.GetAssessmentUsage.assessmentsMaximumUsage;

					jQuery(json.GetAssessmentUsage.assessments).each(function (i, s) {

						jQuery("#" + s.contentRevisionId).find(".popularity > .noDisplay").html(s.usage / maximumAssessmentUsage * 100);
						var usagePercentage = (s.usage / maximumAssessmentUsage) * 100;
						var popularity = "";
						switch (true) {
							case (1 > usagePercentage):
								popularity = 0;
								break;
							case (11 > usagePercentage):
								popularity = 1;
								break;
							case (21 > usagePercentage):
								popularity = 2;
								break;
							case (31 > usagePercentage):
								popularity = 3;
								break;
							case (41 > usagePercentage):
								popularity = 4;
								break;
							case (51 > usagePercentage):
								popularity = 5;
								break;
							case (61 > usagePercentage):
								popularity = 6;
								break;
							case (71 > usagePercentage):
								popularity = 7;
								break;
							case (81 > usagePercentage):
								popularity = 8;
								break;
							case (91 > usagePercentage):
								popularity = 9;
								break;
							case (101 > usagePercentage):
								popularity = 10;
								break;
						}

						jQuery("#" + s.contentRevisionId).find(".stars > li").each(function (i, s) {
							if (popularity / 2 >= (i + 1)) {
								jQuery(s).addClass("full");
							} else if (popularity == (i + 1) * 2 - 1) {
								jQuery(s).addClass("half");
							}

						});

//    			   jQuery("#"+s.contentRevisionId).find(".popularity").addClass("popularity_"+popularity);
					});
				}

			}
		});
	}
};

var scrollToElement = function(elementName){
	jQuery('html, body').animate({
	    scrollTop: jQuery('#'+elementName).offset().top
	}, 1000);
};

var loadSingleTestClick = function() {

    jQuery(".buttons > .button").click(function(e){
      var trigger=jQuery(this);
      var eContentItem=trigger.closest('.contentItem');
      var contentItemId= eContentItem.attr('contentItemId');
      var logicalName= eContentItem.attr('logicalName');
     
      if(logicalName){
          var location =window.location+'';
          var url = location.split('#');

          var mode='';
          if (trigger.attr("assessmentMode") == 'individual')
            mode='oving';
          else if (trigger.attr("assessmentMode") == 'simultaneous')
            mode='test';
          else
            mode='test';

        window.location=url[0]+'/'+mode+'#'+logicalName;
        //loadSingleTest(contentItemId,trigger.attr("assessmentMode"),trigger);
      }      
    });
};

var loadSingleQuestionClick = function(logicalName, mode) {
        var location =window.location+'';
        var url = location.split('#');
        window.location=url[0]+'/'+mode+'#'+logicalName;
};




var loadSingleTest = function(contentItemId, assessmentMode, trigger, skipJs) {
	if(typeof skipJs == 'undefined')
		skipJs = true;
	
    var url = '/content';
    var embeddedTo='.level-2';

    if (trigger) {
     trigger.attr("disabled","disabled");    
    }
    jQuery(embeddedTo).addClass("loading2");
    
	var param = {
		embeddedTo:embeddedTo,
		contentItemId:contentItemId,
		runAs:assessmentMode
	};
	
	if(skipJs){
		param['skip_js_question_scripts']=true; //SPRN-117
	}
	
    jQuery.ajax({
        type: 'POST',
        url: url,
        traditional:true,        
        data: param,        
        success: function(text) {
           if(text && text!=""){                   
               jQuery(embeddedTo).html(text);
               //toggleTopmenuDesktop();
           }
        },
        complete:function(){
            if(trigger){                
                trigger.attr("disabled",null);                
            }
            jQuery(embeddedTo).removeClass("loading2");          
        }
   });        
};

var loadSingleTestByLogicalName = function(logicalName, assessmentMode, trigger) {

    var url = '/content';
    var embeddedTo='.level-2';

    if (trigger) {
     trigger.attr("disabled","disabled");
    }
    jQuery(embeddedTo).addClass("loading2");
    jQuery.ajax({
        type: 'POST',
        url: url,
        traditional:true,
        data: {
          embeddedTo:embeddedTo,
          logicalName:logicalName,
          runAs:assessmentMode,
          skip_js_question_scripts:'true' // SPRN-117
        },
        success: function(text) {
           if(text && text!=""){
               jQuery(embeddedTo).html(text);
               //toggleTopmenuDesktop();
           }
        },
        complete:function(){
            if(trigger){
                trigger.attr("disabled",null);
            }
            jQuery(embeddedTo).removeClass("loading2"); 
        }
   });
}

var loadSingleQuestion = function(contentItemId, assessmentMode) {

    var url = '/content/preview?method=previewInStructure';
    var embeddedTo='.level-2';
    jQuery(embeddedTo).addClass("loading2");

    jQuery.ajax({
        type: 'POST',
        url: url,
        traditional:true,
        data: {
          embeddedTo:embeddedTo,
          contentItemId:contentItemId,
          runAs:assessmentMode,
          skip_js_question_scripts:'true' // SPRN-117
        },
        success: function(text) {
           if(text && text!=""){
               jQuery(embeddedTo).html(text);
           }
        },
        complete:function(){            
            jQuery(embeddedTo).removeClass("loading2");
        }
   });
}

var loadSingleQuestionByLogicalName = function(logicalName, assessmentMode) {

    var url = '/content/preview?method=previewInStructure';
    var embeddedTo='.level-2';
    jQuery(embeddedTo).addClass("loading2");

    jQuery.ajax({
        type: 'POST',
        url: url,
        traditional:true,
        data: {
          embeddedTo:embeddedTo,
          logicalName:logicalName,
          runAs:assessmentMode,
          skip_js_question_scripts:'true' // SPRN-117
        },
        success: function(text) {
           if(text && text!=""){
               jQuery(embeddedTo).html(text);
               attachNavigationListeners();
           }
        },
        complete:function(){            
            jQuery(embeddedTo).removeClass("loading2");
        }
   });
}

function attachNavigationListeners() {
	var navigateToPreviousTest = jQuery('#navigateToPreviousTest')[0],
		navigateToNextTest = jQuery('#navigateToNextTest')[0],
		testsFromSessionStorage = window.sessionStorage.getItem('contentItemsArray').split(','),
		currentIndex = getCurrentIndexOfTest(testsFromSessionStorage),
		currentTestIsLastInArray = testsFromSessionStorage.indexOf(window.location.hash.substring(1)) === testsFromSessionStorage.length - 1;

	if (document.location.href.indexOf('ovingar') != -1 && testsFromSessionStorage !== undefined) {
		if (currentTestIsLastInArray) {
			navigateToPreviousTest.show();
		} else if (currentIndex > 0) {
			navigateToPreviousTest.show();
			navigateToNextTest.show();
		} else if (currentIndex === 0) {
			navigateToNextTest.show();
		}
		navigateToPreviousTest.addEventListener('click', function() {
            navigateToTest(-1);
        });

        navigateToNextTest.addEventListener('click', function() {
            navigateToTest(1);
        });
	}
}

function getCurrentIndexOfTest(contentItemsArray) {
	return contentItemsArray.indexOf(window.location.hash.substring(1));
}

function navigateToTest(indexChange) {
	var embeddedTo='.level-2';

	if (window.sessionStorage.getItem('contentItemsArray') !== undefined) {
	    var contentItemsArray = window.sessionStorage.getItem('contentItemsArray').split(',');
	    var currentIndex = getCurrentIndexOfTest(contentItemsArray);

	    window.location.hash = contentItemsArray[currentIndex + indexChange];
	    window.location.reload();
	}
}

function expandDetail(content){
	jQuery(content).slideDown('fast');
}

function collapseDetail(content){
	jQuery(content).slideUp('fast');
	//$(content).hide();
	//alert('h');
}

/**Exercise room where this user belongs to. See template js_exercise_room*/
var getExerciseRoom=function(){
  return selected_exerciseRoom;
}

var resetCustomAssessment = function(button,eContainer) {
	var eCategoryTags=eContainer.find('input[name="customTheme"]:checked');
	if(eCategoryTags.length > 0) {
		eCategoryTags.each(function(tag) {
			$( this ).prop('checked', false);
		})
	}
	$("#slider-difficulty").slider('value', 1);
	$("#slider-duration").slider('values', 0, 10);
	$("#chooseTheme").hide();
	eContainer.find('.messages .message.show').removeClass('show');
}

var goToCustomAssessment=function(button,eContainer){
   var eCategoryTags=eContainer.find('input[name="customTheme"]:checked');
   var categoryTags=[];
   jQuery.each(eCategoryTags,function(i,eSelectedCategory){
       categoryTags.push(jQuery(eSelectedCategory).val());
   })

    /*Keeping this since it is no harmful and it provides general functionality
     *for just any category tree we decide to add in the future*/
    jQuery.each(eContainer.find(".categoryTag"),function(i,eTree){
      var treeName=jQuery(eTree).attr('treeName');
       categoryTags=categoryTags.concat(getChosenTags(treeName));
    });
        
    if(categoryTags.length){
      jQuery(button).attr("disabled","disabled");
      eContainer.find('.messages .message.show').removeClass('show');
      eContainer.addClass("loading2");
      $("#chooseTheme").hide();
      
      var itemPropertyTags=[];      
      jQuery.each(eContainer.find(".itemPropertyTag"),function(i,eInput){
         var ip=jQuery(eInput).attr('itemProperty');
         var vals=jQuery(eInput).val();
         if(vals){
             if(!jQuery.isArray(vals)){
                vals=[vals];
             }
             jQuery.each(vals,function(j,val){                
                if(val && jQuery.trim(val)!='' && (!jQuery.isNumeric(val) || val>=0)){
                    itemPropertyTags.push({
                        itemProperty:ip,
                        itemValue:val
                    })
                }
             }); 
         }             
      });
      
      if(getExerciseRoom()){
         itemPropertyTags.push({
           itemProperty:'exercise_room',
           itemValue:getExerciseRoom() 
         }); 
      }
      
      generateCustomAssessment(
          categoryTags,
          itemPropertyTags,
          eContainer.find("#customAssessmentDuration").val(),
          /*success*/
          function(json){
             var assessment=json.assessment; 
             var url="/content?contentItemId="+assessment.contentItemId;
             var mode = 'simultaneous';
             if(eContainer.find("#show-hint:checked").length || eContainer.find("#show-minigrammar:checked").length){
               url=url+"&runAs=individual";
               mode = 'individual';
             }

               loadSingleTest(assessment.contentItemId,mode, null, false);
             //window.open(url);
          },
          /*complete*/
          function(){
             jQuery(button).attr("disabled",null); 
             eContainer.removeClass("loading2");
          },
          /*onCode*/
          function(code){
             eContainer.find('.messages .message.'+code).addClass('show');
          }
      );      
    } else {
        eContainer.find('.messages .message.show').removeClass('show');
        $('#chooseTheme').show();
    }
}

var getItemPropertyTagsParams=function(itemPropertyTags){
     var itemProperty=[];
     var itemValue=[];
     jQuery.each(itemPropertyTags,function(i,itemPropertyTag){
         itemProperty.push(itemPropertyTag.itemProperty);
         itemValue.push(itemPropertyTag.itemValue);
     });
     return {
         itemProperty:itemProperty,
         itemValue:itemValue
     };
}

var loadAssessmentByLogicalName = function(assessmentModeStr){
    var assessmentMode = '';
    if(assessmentModeStr.indexOf('/test') != -1)
      assessmentMode = 'simultaneous'
    else if(assessmentModeStr.indexOf('/oving') != -1)
        assessmentMode = 'individual'
    else
      assessmentMode = 'simultaneous'



    var currentHash = window.location.hash.substring(1);

    if (currentHash.indexOf("cid=") > -1) {
    	currentHash = currentHash.substring(4);
    	loadSingleTest(currentHash,assessmentMode);
    }
    else	
    	loadSingleTestByLogicalName(currentHash,assessmentMode);
}

var loadQuestionByLogicalName = function(assessmentModeStr){

    var assessmentMode = '';
    if(assessmentModeStr.indexOf('/test') != -1)
      assessmentMode = 'simultaneous'

    else if(assessmentModeStr.indexOf('/oving') != -1)
        assessmentMode = 'individual'
    else
      assessmentMode = 'simultaneous'
    var currentHash = window.location.hash.substring(1);

    loadSingleQuestionByLogicalName(currentHash,assessmentMode);
}

function openWindow(url) {
	var availheight=((screen.availHeight-500)/2);
	var availwidth=((screen.availWidth-700)/2);
	winStats='toolbar=no,location=no,directories=no,menubar=no,resizable=yes,';
	winStats+='scrollbars=yes,status=no,width=350,height=200';
	if (navigator.appName.indexOf("Microsoft")>=0) {
		winStats+=',left='+availwidth+',top='+availheight;
	}else{
		winStats+=',screenX='+availwidth+',screenY='+availheight;
	}
	//JE@2006-09-20 - Assumes that we never use more than two popups
	//floater=window.open(url,"sprettopp",winStats)
	floater=window.open(url,'',winStats)
}

var showlinkInModal = function(modalId) {
   jQuery( "#"+modalId ).dialog();
}

/**
 *@param tags
 *@param duration In minutes**/
var generateCustomAssessment=function(
   categoryTags, 
   itemPropertyTags,
   duration,
   onSuccess,
   onComplete,
   onCode){
 
 onSuccess=onSuccess?onSuccess:function(){};
 onComplete=onComplete?onComplete:function(){};
 onCode=onCode?onCode:function(){};
 
 var iptp=getItemPropertyTagsParams(itemPropertyTags);

 jQuery.ajax({
    type: 'POST',
    url: '/ICSXapi/content/json/GetCustomAssessment',
    traditional:true, /*So that arrays are parsed as a=1&a=2 instead of a[]=1&a[]=2*/
    data: {  
      categoryId:categoryTags, 
      itemProperty:iptp.itemProperty,
      itemValue:iptp.itemValue,
      duration: duration
    },
    success: function(json) {
       if(json.GetCustomAssessment.assessment){
          onSuccess(json.GetCustomAssessment);
       }else if(json.GetCustomAssessment.code){
           onCode(json.GetCustomAssessment.code);
       }
    },
    error:function(data){
       onCode('INTERNAL_ERROR');
    },
    complete:onComplete
   });   
}
