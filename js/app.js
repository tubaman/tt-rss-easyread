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
    var category = App.Category.create({});
    category.set("feeds", App.Feeds);
    App.Feeds.fetch(params.category_id);
    return category;
  },

  setupController: function(controller, context) {
    App.Feeds.fetch(context.get("id"));
    context.set("feeds", App.Feeds);
    controller.set('model', context);
  }


});

App.HeadlinesRoute = Ember.Route.extend({
  model: function(params) {
    var feed = App.Feed.create({});
    feed.set("headlines", App.Headlines);
    App.Headlines.fetch(params.feed_id);
    return feed;
  },

  setupController: function(controller, context) {
    App.Headlines.fetch(context.get("id"));
    context.set("headlines", App.Headlines);
    controller.set('model', context);
  }
});

/* models */
App.Category = Ember.Object.extend({});
App.Categories = Ember.ArrayProxy.create({
  content: [],

  fetch: function() {
    var content = this.get('content');
    var ttrss = new TtRss();
    content.clear();
    ttrss.getCategories().then(function(categories) {
      categories.content.forEach(function(data) {
        var category = App.Category.create();
        category.setProperties(data);
        category.set("feeds", []);
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
    content.clear();
    ttrss.getFeeds(categoryId).then(function(feeds) {
      feeds.content.forEach(function(data) {
        var feed = App.Feed.create();
        feed.setProperties(data);
        feed.set("headlines", []);
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
    content.clear();
    ttrss.getHeadlines(feedId).then(function(headlines) {
      headlines.content.forEach(function(data) {
        var headline = App.Headline.create();
        headline.setProperties(data);
        content.pushObject(headline);
      });
    });
  }
});
