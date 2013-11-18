/* This is an abstraction around the weird tt-rss API
 * 
 * ex:
 * ttrss = TtRss();
 * ttrss.login('myuser', 'mypass');
 * categories = ttrss.getCategories();
 * feeds = ttrss.getFeeds(categories[0].id);
 * headlines = ttrss.getHeadlines(feeds[0].id);
 * */

App.TtRss = Ember.Object.extend({
	sid: $.cookie('ttrss_api_sid'),

	_api: function(data) {
		// If we're not logging in, include the session id
		if (data.op != 'login') {
			data.sid = sid;
		}
		return $.ajax({
			type: 'POST',
			url: url,
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(data)
		})
		.then(function(data, textStatus, jqXHR) {
			if (data.content.error) {
				return $.Deferred().reject(jqXHR, data, data.content.error).promise();
			} else {
				return data;
			}
		});
	},

	login: function(username, password) {
		return _api({op: 'login', user: username, password: password})
			.done(function(data) {
				sid = data.content.session_id;
			});
	},

	Category: Ember.Object.create({}),

	categories: Ember.ArrayProxy.create({
		content: [],

		fetch: function() {
			var content = this.get('content');
			_api({op: 'getCategories', enable_nested: 'false'})
				.done(function(data) {
					content.clear();
					data.content.forEach(function(categoryData) {
						var category = App.TtRss.Category.create();
						category.setProperties(categoryData);
						content.pushObject(category);
					});
				});
		}

	})
});


//function TtRss(url) {
//
//	url = url || '/tt-rss/api/';
//
//	var self = this,
//		sid = null;
//		sid = $.cookie('ttrss_api_sid');
//
//	self.login = function(username, password) {
//		return api({op: 'login', user: username, password: password})
//			.done(function(data) {
//				sid = data.content.session_id;
//				return sid;
//			});
//	}
//
//	self.getCategories = function() {
//		return api({op: 'getCategories', enable_nested: 'false'})
//			.done(function(data) {
//				return data.content;
//			});
//	}
//
//	self.getFeeds = function(catId) {
//		return api({op: 'getFeeds', cat_id: catId, enable_nested: 'false'})
//			.done(function(data) {
//				return data.content;
//			});
//	}
//
//	self.getHeadlines = function(feedId) {
//		return api({op: 'getHeadlines', feed_id: feedId})
//			.done(function(data) {
//				return data.content;
//			});
//	}
//
//	/* private functions */
//	
//	function api(data) {
//		// If we're not logging in, include the session id
//		if (data.op != 'login') {
//			data.sid = sid;
//		}
//		return $.ajax({
//			type: 'POST',
//			url: url,
//			contentType: 'application/json',
//			dataType: 'json',
//			data: JSON.stringify(data)
//		})
//		.then(function(data, textStatus, jqXHR) {
//			if (data.content.error) {
//				return $.Deferred().reject(jqXHR, data, data.content.error).promise();
//			} else {
//				return data;
//			}
//		});
//	}
//
//}
