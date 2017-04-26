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
      
      .when('/contact', {
        templateUrl:  'contact/contact.html',
        controller: 'ContactController', controllerAs: 'conCon' })
      .when('/test', { 
        templateUrl: 'other/test.html',
        controller: 'TestController', controllerAs: 'testCon' })
      
      .when('/faculty', { 
         templateUrl: 'other/faculty.html',
         controller: 'FacController', controllerAs: 'facCon' })
      
      .when('/allfaculty', { 
         templateUrl: 'other/all_faculty.html',
         controller: 'AllFacController', controllerAs: 'allfacCon' })
      
      .when('/students', { 
         templateUrl: 'other/students.html',
         controller: 'StuController', controllerAs: 'stuCon' })   
      
      .when('/faculty/:id', { 
         templateUrl: 'other/one_faculty.html',
         controller: 'GetOneFacController', controllerAs: 'onefacCon' })
      
      .when('/student/:id', { 
         templateUrl: 'other/one_student.html',
         controller: 'GetOneStuController', controllerAs: 'onestuCon' })
    
    
      .when('/addfaculty', { 
          templateUrl: 'other/add_faculty.html',
          controller: 'AddFacController', controllerAs: 'addfacCon' })
    
    .when('/allusers', { 
         templateUrl: 'other/all_users.html',
         controller: 'AllUsersController', controllerAs: 'allusersCon' })    
                
      .otherwise( { redirectTo: '/'});  
  }
})();