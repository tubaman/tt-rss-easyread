angular.module( 'ngBoilerplate.reader', [
  'ui.state',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'reader', {
    url: '/reader',
    views: {
      "main": {
        controller: 'ReaderCtrl',
        templateUrl: 'reader/reader.tpl.html'
      }
    },
    data:{ pageTitle: 'Reader' }
  });
})

.controller( 'ReaderCtrl', ['$scope', '$http', '$q', function ReaderCtrl( $scope, $http, $q ) {

  var ttRssSid;

  function ttRssApi(data) {
    if (data.op != 'login') {
      data.sid = ttRssSid;
    }
    return $http({'method': 'POST', 'url': '/tt-rss/api/', 'data': data})
      .then(function(response) {
        if (response.data.content.error) {
          return $q.reject(response.data.content.error);
        } else {
          return response;
        }
      })
      ;
  }
  
  function rssLogin() {
    return ttRssApi({op: 'login', user: 'admin', password: 'songahm'})
      .then(function(response) {
        ttRssSid = response.data.content.session_id;
        return ttRssSid;
      })
      ;
  }

  function getCategories() {
    return ttRssApi({op: 'getCategories', enable_nested: 'false'})
      .then(function(response) {
        console.log(response.data.content);
        $scope.categories = response.data.content;
      })
      ;
  }

  function getFeeds(catId) {
    return ttRssApi({op: 'getFeeds', cat_id: catId, enable_nested: 'false'})
      .then(function(response) {
        console.log(response.data.content);
        $scope.feeds = response.data.content;
      })
      ;
  }

  //rssLogin();
  rssLogin().then(getCategories);

}])

;
