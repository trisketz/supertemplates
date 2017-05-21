/////////////////////////////////////////////////////////////////
//
//	Developers:
//
//	Please Be Mindful of javascript library being used within 
//	hub (if any). Use no conflict mode to avoid library 
//	compatibility. Native JS is always allowed.
//
/////////////////////////////////////////////////////////////////

if (!jq) {
	var jq = $;
}

jQuery(document).ready(function(jq) {
	var $ = jq,
		el = $('.super-group-menu>ul');

	// For responsive (e.g., mobile) menus
	//
	// This runs through the menu and generates a
	// <select> list of all menu items, then adds
	// an onChange event to redirect the page to
	// whatever option is selected.
	if (el.length) {
		el.addClass('js');

		var select = $("<select />").on('change', function() {
			window.location = $(this).find("option:selected").val();
		});

		$("<option />", {
			"value"   : "",
			"text"    : "Select ..." //el.attr('data-label')
		}).appendTo(select);

		el.find("a").each(function() {
			var elm = $(this),
				prfx = '';

			if (elm.hasClass('alrt')) {
				return;
			}

			if ($(elm.parent().parent()).hasClass('tab-options')) {
				prfx = '- ';
			}

			var opts = {
				"value"   : elm.attr("href"),
				"text"    : prfx + elm.text()
			};
			if ($(elm.parent()).hasClass('active')) {
				opts.selected = 'selected';
			}
			$("<option />", opts).appendTo(select);
		});

		var li = $("<li />").addClass('option-select');

		select.appendTo(li);
		li.appendTo(el);
	}

	/*
		Enter custom JS code here.
	*/
	
	/* Fix content for sticky group announcements and respond to resizing of menu. */
	var $scontainer = $(".scontainer");
	var $menuWrap = $(".super-group-menu-wrap");
	var $contentWrap = $(".super-group-content-wrap");

	$scontainer.css("margin-top", $menuWrap.css("height"));
	$contentWrap.css("margin-top", $scontainer.css("height"));
  	$menuWrap.css("margin-bottom", -1 * parseFloat($menuWrap.height()) + "px");
  	$contentWrap.css("padding-top", $menuWrap.height());
	new ResizeSensor(jQuery('.super-group-menu-wrap'), function() {
		$scontainer.css("margin-top", $menuWrap.css("height"));
		$contentWrap.css("margin-top", $scontainer.css("height"));
	  	$menuWrap.css("margin-bottom", -1 * parseFloat($menuWrap.height()) + "px");
	  	$contentWrap.css("padding-top", $menuWrap.height());
	});
	
	/* Smoothly readjust content after closing of announcements */
	$('.announcement .close').on('click', function() {
		$contentWrap.animate({marginTop: '-=' + $(this).parent().parent().outerHeight() + 'px'});
	});
  	
	/* Sticky navbar */
	/* https://teamtreehouse.com/community/forum-tip-create-a-sticky-navigation-with-css-and-jquery-2 */
	//
	// Bug in login - had to comment out the following line 
	//		$('#username, #password').placeholder();
	// in the file /www/dev/core/components/com_users/site/assets/js/login.js
	// to get it to work.
	
	var $headerId = $(".header-id");
	var $sidebarWrap = $("#sidebar-wrapper");
	var $footerWrap = $(".super-group-footer-wrap");
	var poweredBy = document.getElementsByClassName("poweredby")[0];

	var scrollTop = 0;
	var bannerHeight = $(".super-group-header-overlay").height();
	var barHeight = $(".super-group-bar").height();

	var scrollingDir = "";
	var windowTop = 0;
	var startBarFade = 0;
	pushingDown = pushingUp = false;

	// Possible problem here - changing window size won't update this - fix later.
	var thresh = $sidebarWrap.offset().top + $sidebarWrap.outerHeight(true) - $(window).height();
	console.log("Threshold = " + thresh);

	$(window).scroll(function() {
		windowTop = $(this).scrollTop();

		if (windowTop > scrollTop) {
			scrollingDown = true;
		} else {
			scrollingDown = false;
		}
		scrollTop = windowTop;

		// Fade effect for "poweredby QUBES"
		startBarFade = bannerHeight - barHeight;
		if (windowTop > startBarFade) {
			poweredBy.style["opacity"] = Math.max(1 - (4/startBarFade)*(windowTop-startBarFade), 0);
			poweredBy.style["cursor"] = "default";
			poweredBy.style["pointerEvents"] = "none";
		} else {
			poweredBy.style["opacity"] = 1.0;
			poweredBy.style["cursor"] = "inherit";	// Doesn't reset properly on Firefox
			poweredBy.style["pointerEvents"] = "inherit";
		}

		// Replace "poweredby QUBES" with group logo and title
		if (windowTop > bannerHeight - (barHeight/2)) {
			$headerId.addClass("header-id-scrolled");
		} else {
			$headerId.removeClass("header-id-scrolled");
		}
		
		// Fix menu directly under QUBES navbar
		if (windowTop > bannerHeight) {
			$menuWrap.addClass("super-group-menu-scrolled");
		} else {
			$menuWrap.removeClass("super-group-menu-scrolled");
		}

		// Negative padding on $menuWrap is a headache!
		// Fix sidebar directly under menu after announcements
		if (windowTop < bannerHeight + $scontainer.height()) {
			$sidebarWrap.removeClass("sidebar-wrapper-fixed-top");
			$sidebarWrap.css("bottom", "");
			// $sidebarWrap.css("top", $menuWrap.height());				
		} else {
			// $sidebarWrap.addClass("sidebar-wrapper-scrolled");
			// $sidebarWrap.css("top", barHeight + $menuWrap.height() + "px");
			// $sidebarWrap.css("bottom", "");

			pushingUp = !scrollingDown && (($sidebarWrap.offset().top + 1) > 
				(parseFloat($sidebarWrap.css("margin-top")) + $menuWrap.offset().top + $menuWrap.height()));
			pushingDown = scrollingDown && (($sidebarWrap.offset().top + $sidebarWrap.outerHeight(true) - 1) < 
				(windowTop + $(this).height()))

			console.log("Pushing Down: " + pushingDown);
			if (pushingDown) {
				if (scrollingDown) {
					$sidebarWrap.css("top","");
					$sidebarWrap.addClass("sidebar-wrapper-fixed-bottom");
				}
			} else {
				if ((!scrollingDown) && ($sidebarWrap.hasClass("sidebar-wrapper-fixed-bottom"))) {
					$sidebarWrap.removeClass("sidebar-wrapper-fixed-bottom");
					$sidebarWrap.css("top", (41 - 13 + windowTop - (thresh)) + "px");
				}
			}

			if (pushingUp) {
				if (!scrollingDown) {
					$sidebarWrap.css("top","");
					$sidebarWrap.css("bottom","");
					$sidebarWrap.addClass("sidebar-wrapper-fixed-top");
				}
			} else {
				if ((scrollingDown) && ($sidebarWrap.hasClass("sidebar-wrapper-fixed-top"))) {
					$sidebarWrap.removeClass("sidebar-wrapper-fixed-top");
					// I think this is the proper way - replace bottom one above with a variant of this.
					$sidebarWrap.css("top", 42 + windowTop - $contentWrap.offset().top + parseFloat($contentWrap.css("padding-top")) + "px");					
				}
			}

			// Put sidebar at bottom when footer starts to encroach and scroll with page
			// if (windowTop > (bannerHeight + $menuWrap.height() + $scontainer.height() + $contentWrap.height() - $sidebarWrap.outerHeight(true))) { //
			if (windowTop + $(this).height() > $footerWrap.offset().top + 41 - 13) {
				$sidebarWrap.removeClass("sidebar-wrapper-fixed-bottom");
				$sidebarWrap.css("bottom", "0px");
				$sidebarWrap.css("top", "");
			}
		}
	});
	
});