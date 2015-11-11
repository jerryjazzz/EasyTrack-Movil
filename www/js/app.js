// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

/** Variable Global para instanciar la base de datos SQLite */
var db = null; 
/** Variable Global para pasar en diferentes Scope el ID usuario enviado desde el apirest */
var userId = null;
/**  */
var username = null;
/** */
var pass = null;  
/** Variable global para guardar un dominio en particular y mandar como parametro al servicio*/
var dominio = null; 
/** Variable global para la creación de mapas */
var map = null;
/** Variable global para la creación de mapas */
var vectorSource = null;
/** Variable global para la creación de mapas */
var vectorLayer = null;
/** Variable global para la creación de iconFeatures*/
var iconFeature = null;




angular.module('starter', ['ng.confirmField','chart.js','ngMessages','ionic','ionic.service.core','ionic.service.push','ngCordova', 'starter.controllers'])


.run(function($ionicPlatform, $ionicPopup, $http, $location, $rootScope) {

  $ionicPlatform.ready(function() {
    //verifricar Connection

    /**  */
    if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                        title: "No esta conectado a internet",
                        content: "Necesita estar conectado a internet para poder usar la apliacion"
                    })
                    .then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    });
                }
            }
            
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

         if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({ name: "easytrack.sqlite", androidDatabaseImplementation: 2, androidLockWorkaround: 1}); //device
            db.transaction(function(tx) {
              tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, usuario VARCHAR, password VARCHAR, userid INTEGER)');
            });
        }else{
            db = window.openDatabase("easytrack.sqlite", '1', 'easytrack', 1024 * 1024 * 100); // browser
            db.transaction(function(tx) {
              tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, usuario VARCHAR, password VARCHAR, userid INTEGER)');
            });
        }

  });// cierra ready function
  
})// cierra app.run


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');

  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
  
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
    module: 'public'
  })

    .state('app.home_login', {
    url: '/home_login',
    module: 'public',
    controller: 'AppCtrl',
    views: {
      'menuContent': {
        templateUrl: 'templates/home_login.html',
        
      }
    }
  })

    .state('app.playlists', {
      url: '/playlists',
      module: 'private',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
    url: '/playlists/:playlistId',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })


  .state('app.salir', {
    url: '/salir',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/salir.html',
        controller: 'salirCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      module: 'private',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })

  .state('app.contactos', {
      url: '/contactos',
      module: 'public',
      views: {
        'menuContent': {
          templateUrl: 'templates/contactos.html'
        }
      }
    })

    .state('app.nosotros', {
      url: '/nosotros',
      module: 'public',
      views: {
        'menuContent': {
          templateUrl: 'templates/nosotros.html'
        }
      }
    })


  .state('app.mapa', {
    url: '/mapa',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/mapa.html',
        controller: 'mapaCtrl',
      }
    }
  })  

  .state('app.posicion', {
    url: '/posicion/:playlistId',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/solicitudPosicion.html',
        controller: 'PosicionCtrl'
      }
    }
  })

  .state('app.masdatos', {
    url: '/masdatos/:playlistId',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/masdatos.html',
        controller: 'MasDatosCtrl'
      }
    }
  })

  .state('app.historico', {
    url: '/historico/:playlistId',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/historico.html',
        controller: 'HistoricoCtrl'
      }
    }
  })

  .state('app.historicoPosiciones', {
    url: '/historicoposiciones/:playlistId',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/historicoposiciones.html',
        controller: 'HistoricoPosicionesCtrl'
      }
    }
  })
  .state('app.historicoVelocidad', {
    url: '/historicovelocidad/:playlistId',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/historicovelocidad.html',
        controller: 'HistoricoVelocidadCtrl'
      }
    }
  })
  .state('app.resumen', {
    url: '/resumen',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/resumen.html',
        controller: 'EstadisticaCtrl'
      }
    }
  })
  .state('app.historicoDetenciones', {
    url: '/historicodetenciones/:playlistId',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/historicodetenciones.html',
        controller: 'HistoricoDetencionesCtrl'
      }
    }
  })
  .state('app.perfil', {
    url: '/perfil',
    module: 'private',
    views: {
      'menuContent': {
        templateUrl: 'templates/perfil.html',
        controller: 'PerfilCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home_login');
});