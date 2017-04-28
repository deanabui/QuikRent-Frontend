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
    
  function authCtrl($scope, authentication, $location){
      authCtrl.$inject = ['$scope', 'authentication', '$location'];
      
      $scope.currentUser = authentication.currentUser().name;
      $scope.isLoggedIn = authentication.isLoggedIn();
      $scope.logout = function(){
          authentication.logout();
          window.location.href = '/';
      };
      
        $scope.hi = "Hi";
      $scope.pageHeader = {
          title: 'Sign in to QuikRent'
      };
      $scope.credentials = {
          email: "",
          password: ""
      };
      
      $scope.onLoginSubmit = function(){
          $scope.formError = "";
          if(!$scope.credentials.email || !$scope.credentials.password){
              $scope.formError = "Missing email/password.";
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
              $scope.formError = err;
          })
          .then(function(){
              window.location.href = '/home';
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
              window.location.href = '/home';
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
              $scope.formError = err;
          })
            .then(function(){
              console.log("made it to the then of doLogin");
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
          return $http.post('api/register', user).then(function(data){
              saveToken(data.data.token);
          });
      };
      
      var login = function(user){
          return $http.post('/api/login', user).then(function(data){
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
                  name: payload.name
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
    
  angular.module('quikRent').controller('authCtrl', authCtrl).service("authentication", authentication)
})();