window.App = Ember.Application.create();

App.Router.map(function() {
	this.resource('categories', { path: '/' });
	this.resource('feeds', { path: '/category/:category_id' });
	this.resource('headlines', { path: '/feed/:feed_id' });
});

App.CategoriesRoute = Ember.Route.extend({
	model: function() {
		App.Categories.fetch();
		return App.Categories;
	}
});

App.FeedsRoute = Ember.Route.extend({
	model: function(params) {
		App.Feeds.fetch(params.category_id);
		return App.Feeds;
	}
});

App.HeadlinesRoute = Ember.Route.extend({
	model: function(params) {
		App.Headlines.fetch(params.feed_id);
		return App.Headlines;
	}
});

/* models */
App.Category = Ember.Object.extend({});
App.Categories = Ember.ArrayProxy.create({
	content: [],

	fetch: function() {
		var content = this.get('content');
		var ttrss = new TtRss();
		ttrss.getCategories().then(function(categories) {
			content.clear();
			categories.content.forEach(function(data) {
				var category = App.Category.create();
				category.setProperties(data);
				content.pushObject(category);
			});
		});
	}
});

App.Feed = Ember.Object.extend({});
App.Feeds = Ember.ArrayProxy.create({
	content: [],

	fetch: function(categoryId) {
		var content = this.get('content');
		var ttrss = new TtRss();
		ttrss.getFeeds(categoryId).then(function(feeds) {
			content.clear();
			feeds.content.forEach(function(data) {
				var feed = App.Feed.create();
				feed.setProperties(data);
				content.pushObject(feed);
			});
		});
	}
});

App.Headline = Ember.Object.extend({});
App.Headlines = Ember.ArrayProxy.create({
	content: [],

	fetch: function(feedId) {
		var content = this.get('content');
		var ttrss = new TtRss();
		ttrss.getHeadlines(feedId).then(function(headlines) {
			content.clear();
			headlines.content.forEach(function(data) {
				var headline = App.Headline.create();
				headline.setProperties(data);
				content.pushObject(headline);
			});
		});
	}
});
