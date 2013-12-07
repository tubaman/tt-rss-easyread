window.App = Ember.Application.create();

App.Router.map(function() {
  this.resource('login', { path: '/login' });
  this.resource('categories', { path: '/' });
  this.resource('feeds', { path: '/category/:category_id' });
  this.resource('headlines', { path: '/feed/:feed_id' });
});

App.LoginRoute = Ember.Route.extend({
  setupController: function(controller, context) {
    controller.reset();
  }
});

App.AuthenticatedRoute = Ember.Route.extend({
  actions: {
    error: function(error, transition) {
      console.log("error: " + error);
      if (error == 'NOT_LOGGED_IN') {
        var loginController = this.controllerFor('login');
        loginController.set('attemptedTransition', transition);
        this.transitionTo('login');
      } 
    }
  }
});

App.CategoriesRoute = App.AuthenticatedRoute.extend({
  model: function() {
    return App.Categories.fetch();
  }
});

App.FeedsRoute = App.AuthenticatedRoute.extend({
  model: function(params) {
    var category_id = parseInt(params.category_id);
    var category = App.Category.create({id: category_id});
    category.set("feeds", App.Feeds);
    return App.Feeds.fetch(category_id).then(function(response) {
      return category;
    });
  },

  setupController: function(controller, context) {
    App.Feeds.fetch(context.get("id"));
    context.set("feeds", App.Feeds);
    controller.set('model', context);
  }

});

App.HeadlinesRoute = App.AuthenticatedRoute.extend({
  model: function(params) {
    var feed_id = parseInt(params.feed_id);
    var feed = App.Feed.create({id: feed_id});
    feed.set("headlines", App.Headlines);
    return App.Headlines.fetch(feed_id).then(function(response) {
      return feed;
    });
  },

  setupController: function(controller, context) {
    App.Headlines.fetch(context.get("id"));
    context.set("headlines", App.Headlines);
    controller.set('model', context);
  }
});

/* controllers */
App.LoginController = Ember.Controller.extend({
  reset: function() {
    this.setProperties({
      user: '',
      password: '',
      errorMessage: '',
    });
  },

  login: function() {
    var self = this;
    var ttrss = new TtRss();
    self.set('errorMessage', null);
    ttrss.login(this.get('user'), this.get('password')).then(
      function(sid) {
        console.log('got a sid: ' + sid);
        self.set('sid', sid);
        var attemptedTransition = self.get('attemptedTransition');
        if (attemptedTransition) {
          attemptedTransition.retry()
          self.set('attemptedTransition', null);
        } else {
          self.transitionTo('categories');
        }
      },
      function(error) {
        self.set('errorMessage', "User and password combo don't match");
        console.log("error: " + JSON.stringify(error));
      });
  }
});

/* models */
App.Category = Ember.Object.extend({});
App.Categories = Ember.ArrayProxy.create({
  content: [],

  fetch: function() {
    var self = this
    var content = self.get('content');
    var ttrss = new TtRss();
    content.clear();
    return ttrss.getCategories().then(function(categories) {
      console.log("categories: " + JSON.stringify(categories));
      categories.forEach(function(data) {
        var category = App.Category.create();
        category.setProperties(data);
        category.set("feeds", []);
        content.pushObject(category);
      });
      return self;
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
    return ttrss.getFeeds(categoryId).then(function(feeds) {
      feeds.forEach(function(data) {
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
    return ttrss.getHeadlines(feedId).then(function(headlines) {
      headlines.forEach(function(data) {
        var headline = App.Headline.create();
        headline.setProperties(data);
        content.pushObject(headline);
      });
    });
  }
});
