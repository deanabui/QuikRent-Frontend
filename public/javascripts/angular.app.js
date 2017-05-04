(function () {

  angular.module('quikRent', ['ngRoute']).config(myConfig); 

  // $routeProvider allows to set up routes 
  function myConfig ($routeProvider) {
    $routeProvider    // inline template
      .when('/', { templateUrl: '/home',
                 /*controller: 'SearchController'*/})
      
      .when('/about', { templateUrl: '/about'})
      
      .when('/faq', { templateUrl: '/faq'})
      
      .when('/account', { templateUrl: '/account'})
      
      .when('/login', { templateUrl: '/login'})
      
      .when('/register', { templateUrl: '/register'})
      
      .otherwise( { redirectTo: '/'});  
  }
    
  function profileCtrl($scope, $location, authentication, $window, $http){
      profileCtrl.$inject = ['$scope', '$location', 'authentication', '$window', '$http'];
      
    $scope.currentUser =     authentication.currentUser().name;
    $scope.currentUserEmail = authentication.currentUser().email;
    $scope.currentUserId = authentication.currentUser().id;
      
     try{
          $scope.formError = "";
          return $http.get('api/user/search/' + $scope.currentUserId).then(function(data){
              $scope.currentUserSearch = data;
              console.log(data);
          });
          }catch(err){
              console.log(err);
          } 
  }
    
  function searchCtrl($scope, $location, authentication, $http, $window){
      searchCtrl.$inject = ['$scope', '$location', 'authentication', '$http', '$window'];
        $scope.currentUserId = authentication.currentUser().id;
      
      $scope.searchCred = {
          craigslist_housing_section: "",
          craigslist_site: "",
          areas: [""],
          min_price: "",
          max_price: "",
          bed: "",
          bath: "",
          neighborhoods:"",
          max_transit_distance:"",
          slack_token: ""
      };
      
      $scope.onSearchSubmit = function(){
          $scope.formError = "";
          if(!$scope.searchCred.craigslist_housing_section || !$scope.searchCred.craigslist_site || !$scope.searchCred.min_price || !$scope.searchCred.max_price || !$scope.searchCred.bed || !$scope.searchCred.bath || !$scope.searchCred.slack_token){
              console.log("missing param");
              $scope.formError = "Missing search parameter.";
              return false;
          } else {
              $scope.doSearch();
              
          }
      };
      
      $scope.doSearch = function(){
          try{
          $scope.formError = "";
          console.log($scope.searchCred);
          return $http.post('api/user/search/' + $scope.currentUserId + '/newsearch', $scope.searchCred).then(function(data){
              console.log("data from post req " + data);
              window.location.href='#/account';
          });
          }catch(err){
              console.log(err);
          }
          
      }
  }
  
  function authCtrl($scope, authentication, $location){
      authCtrl.$inject = ['$scope', 'authentication', '$location'];
      
      $scope.currentUser = authentication.currentUser().name;
      $scope.isLoggedIn = authentication.isLoggedIn();
      $scope.logout = function(){
          authentication.logout();
          window.location.href = '/';
      };
      
      $scope.credentials = {
          email: "",
          password: ""
      };
      
      $scope.onLoginSubmit = function(){
          console.log("made it to loginSubmit");
          $scope.formError = "";
          if(!$scope.credentials.email || !$scope.credentials.password){
              $scope.formError = "Missing email/password.";
              return false;
          } else {
              $scope.doLogin();
          }
      };
      
      $scope.doLogin = function(){
          console.log("made it to dologin");
          $scope.formError = "";
          authentication
            .login($scope.credentials)
            .catch(function(err){
              console.log(err);
              $scope.formError = err;
          })
          .then(function(){
              window.location.href = '/';
          });
      }
      
      $scope.formError = authentication.currentUser.name;
      $scope.pageHeader = {
          title: "Sign into QuikRent"
      };
      $scope.regcredentials = {
          rname: "",
          remail: "",
          rpassword: ""
      };
      
      $scope.onRegisterSubmit = function(){
          $scope.formError = "";
          if(!$scope.regcredentials.remail || !$scope.regcredentials.rpassword){
              $scope.formError = "Email and password required. Please try again."
          } else {
              $scope.doRegister();
          }
      };
      
      $scope.doRegister = function(){
          $scope.formError = "";
          authentication
            .register($scope.regcredentials)
            .catch(function(err){
              $scope.formError = err;
          })
          .then(function(data){
              window.location.href = '/';
          });
      }
  }
    
  function loginCtrl($scope, authentication, $location){
      loginCtrl.$inject = ['$scope', 'authentication', '$location'];
      
      $scope.currentUser = authentication.currentUser().name;
      $scope.hi = "Hello";
      $scope.pageHeader = {
          title: "Sign into QuikRents"
      };
      $scope.credentials = {
          email: "",
          password: ""
      };
      
      $scope.onSubmit = function(){
          $scope.formError = "";
          if(!$scope.credentials.email || !$scope.credentials.password){
              $scope.formError = "Missing email/password. Try again.";
              return false;
          } else {
              $scope.doLogin();
          }
      };
      
      $scope.doLogin = function(){
          $scope.formError = "";
          authentication
            .login($scope.credentials)
            .catch(function(err){
              console.log(err);
              $scope.formError = err;
          })
            .then(function(){
          });
      }
  }
    
  function authentication($http, $window){
      authentication.$inject = ['$http', '$window'];
      var saveToken = function(token){
          $window.localStorage['quikrent-token'] = token; //figure out where quikrent-token is
      };
      
      var getToken = function(){
          return $window.localStorage['quikrent-token'];
      };
      
      var register = function(user){
          return $http.post('api/user/register', user).then(function(data){
              saveToken(data.data.token);
          });
      };
      
      var login = function(user){
          return $http.post('api/user/login', user).then(function(data){
              saveToken(data.data.token);
          });
      };
      
      var isLoggedIn = function(){
          var token = getToken();
          if(token){
              var payload = JSON.parse($window.atob(token.split('.')[1]));
              return payload.exp > Date.now() / 1000;
          } else {
              return false;
          }
      };
      
      var currentUser = function(){
          if(isLoggedIn()){
              var token = getToken();
              var payload = JSON.parse($window.atob(token.split('.')[1]));
              return{
                  email: payload.email,
                  name: payload.name,
                  id: payload._id,
                  searches: payload.searches
              };
          }
          return{
              email: "",
              name: ""
          };
      };
      
      var logout = function(){
          $window.localStorage.removeItem('quikrent-token');
      };
      
      return {
          register: register,
          login: login,
          saveToken: saveToken,
          getToken: getToken,
          isLoggedIn: isLoggedIn,
          currentUser: currentUser,
          logout: logout
      };
  }
    
  angular.module('quikRent').controller('authCtrl', authCtrl).service("authentication", authentication);
  angular.module('quikRent').controller('searchCtrl', searchCtrl);            
  angular.module('quikRent').controller('profileCtrl', profileCtrl);
                                                     
})();