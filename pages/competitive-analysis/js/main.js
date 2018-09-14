jQuery(document).ready(function(event){
	var projectsContainer = $('.cd-projects-container'),
		navigation = $('.cd-primary-nav'),
		triggerNav = $('.cd-nav-trigger'),
		logo = $('.cd-logo');

	triggerNav.on('click', function(){
		if( triggerNav.hasClass('project-open') ) {
			//close project
			var intro1 = $('.sb1-intro-block'),
				sb1projectsContainer = $('.sb1-projects-wrapper'),
				sb1projectsSlider = sb1projectsContainer.children('.sb1-slider'),
				sb1singleProjectContent = $('.sb1-project-content'),
				sb1sliderNav = $('.sb1-slider-navigation');
				//projects slider is visible - hide slider and show the intro panel
				if( intro1.hasClass('projects-visible') ) {
					intro1.removeClass('projects-visible');
					sb1projectsContainer.removeClass('projects-visible');
				};

				var intro2 = $('.sb2-intro-block'),
				  sb2projectsContainer = $('.sb2-projects-wrapper'),
				  sb2projectsSlider = sb2projectsContainer.children('.sb2-slider'),
				  sb2singleProjectContent = $('.sb2-project-content'),
				  sb2sliderNav = $('.sb2-slider-navigation');
				  //projects slider is visible - hide slider and show the intro panel
				  if( intro2.hasClass('projects-visible') ) {
				    intro2.removeClass('projects-visible');
				    sb2projectsContainer.removeClass('projects-visible');
				  };

					var intro3 = $('.sb3-intro-block'),
					  sb3projectsContainer = $('.sb3-projects-wrapper'),
					  sb3projectsSlider = sb3projectsContainer.children('.sb3-slider'),
					  sb3singleProjectContent = $('.sb3-project-content'),
					  sb3sliderNav = $('.sb3-slider-navigation');
					  //projects slider is visible - hide slider and show the intro panel
					  if( intro3.hasClass('projects-visible') ) {
					    intro3.removeClass('projects-visible');
					    sb3projectsContainer.removeClass('projects-visible');
					  };

			projectsContainer.removeClass('project-open').find('.selected').removeClass('selected').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$(this).children('.cd-project-info').scrollTop(0).removeClass('has-boxshadow');

			});
			triggerNav.add(logo).removeClass('project-open');
		} else {
			//trigger navigation visibility
			triggerNav.add(projectsContainer).add(navigation).toggleClass('nav-open');
		}
	});

	projectsContainer.on('click', '.single-project', function(){
		var selectedProject = $(this);
		if( projectsContainer.hasClass('nav-open') ) {
			//close navigation
			triggerNav.add(projectsContainer).add(navigation).removeClass('nav-open');
		} else {
			//open project
			selectedProject.addClass('selected');
			projectsContainer.add(triggerNav).add(logo).addClass('project-open');
		}
	});

	projectsContainer.on('click', '.cd-scroll', function(){
		//scroll down when clicking on the .cd-scroll arrow
		var visibleProjectContent =  projectsContainer.find('.selected').children('.cd-project-info'),
			windowHeight = $(window).height();

		visibleProjectContent.animate({'scrollTop': windowHeight}, 300);
	});

	//add/remove the .has-boxshadow to the project content while scrolling
	var scrolling = false;
	projectsContainer.find('.cd-project-info').on('scroll', function(){
		if( !scrolling ) {
		 	(!window.requestAnimationFrame) ? setTimeout(updateProjectContent, 300) : window.requestAnimationFrame(updateProjectContent);
		 	scrolling = true;
		}
	});

	function updateProjectContent() {
		var visibleProject = projectsContainer.find('.selected').children('.cd-project-info'),
			scrollTop = visibleProject.scrollTop();
		( scrollTop > 0 ) ? visibleProject.addClass('has-boxshadow') : visibleProject.removeClass('has-boxshadow');
		scrolling = false;
	}
});
