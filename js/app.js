window.App = Ember.Application.create();

App.Router.map(function() {
	this.resource('categories', { path: '/' });
});

App.CategoriesRoute = Ember.Route.extend({
	model: function() {
		return App.TtRss.get('login')('admin', 'songahm').
		then(function() {
			return App.TtRss.get('categories').fetch();
		});
	}
});

App.ApplicationController = Ember.Controller.extend({
	sid: $.cookie('ttrss_api_sid'),
});

