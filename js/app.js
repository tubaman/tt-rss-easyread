(function() {
	'use strict';

	// global: for easy use on the console
	// example: ttrss.login('admin', 'admin');
	window.ttrss = new TtRss();

	var content = $("#content"),
		loginTemplate = $("[type='html/login']").html(),
		categoriesTemplate = $("[type='html/categories']").html(),
		categoryTemplate = $("[type='html/category']").html(),
		feedsTemplate = $("[type='html/feeds']").html(),
		feedTemplate = $("[type='html/feed']").html(),
		headlinesTemplate = $("[type='html/headlines']").html(),
		headlineTemplate = $("[type='html/headline']").html();

	// Listen to user events
	$(".category").click(function(e) {
		e.preventDefault();
		$.route($(this).attr("href"));	
	});

	$(".feed").click(function(e) {
		e.preventDefault();
		$.route($(this).attr("href"));	
	});

	// Listen to model events
	ttrss.on("error", function(error) {
		if (error == "NOT_LOGGED_IN") {
			$.route("#login");	
		}
	});

	ttrss.on("getCategories", function(categories) {
		console.log(categories);
		content.empty();
		var categoriesElement = $.el(categoriesTemplate).appendTo(content);
		$.each(categories, function(i, category) {
			console.log(category);
			$.el(categoryTemplate, category).appendTo(categoriesElement);
		})
	});
	
	ttrss.on("getFeeds", function(feeds) {
		console.log(feeds);
		content.empty();
		var feedsElement = $.el(feedsTemplate).appendTo(content);
		$.each(feeds, function(i, feed) {
			console.log(feed);
			$.el(feedTemplate, feed).appendTo(feedsElement);
		})
	});
	
	ttrss.on("getHeadlines", function(headlines) {
		console.log(headlines);
		content.empty();
		var headlinesElement = $.el(headlinesTemplate).appendTo(content);
		$.each(headlines, function(i, headline) {
			console.log(headline);
			$.el(headlineTemplate, headline).appendTo(headlinesElement);
		})
	});
	
	// Routing
	$.route(function(hash) {
		console.log("hash: " + hash);
		console.log("hash.slice(1, 'category'.length + 1): " + hash.slice(1, 'category'.length + 1));
		if (hash == "" || hash == "#") {
			ttrss.getCategories();
		} else if (hash.slice(1, 'login'.length + 1) == 'login') {
			content.empty();
			$.el(loginTemplate).appendTo(content);
			
			$("#loginFail").hide();

			$("#login").click(function(e) {
				e.preventDefault();
				ttrss.login($("#user").val(), $("#password").val())
				.done(function() {
				  $("#loginFail").hide();
					$.route("#");
				})
				.fail(function(response) {
					$("#loginFail").show();
				});
			});

		} else if (hash.slice(1, 'category'.length + 1) == 'category') {
			// show feeds for a category
			var catId = parseInt(hash.slice('category'.length + 2), 10);
			console.log("catId: " + catId);
			ttrss.getFeeds(catId);
		} else if (hash.slice(1, 'feed'.length + 1) == 'feed') {
			// show headlines for a feed
			var feedId = parseInt(hash.slice('feed'.length + 2), 10);
			console.log("feedId: " + feedId);
			ttrss.getHeadlines(feedId);
		}
		
	});

})()
