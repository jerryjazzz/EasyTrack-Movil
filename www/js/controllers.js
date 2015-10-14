angular.module('starter.controllers', [])

.controller('AppCtrl', function($ionicHistory, $scope, $ionicModal, $timeout, $http, $location,$cordovaSQLite,$ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
$scope.data = {};

    $scope.submit = function(){
        var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
        var datos = $scope.data.username + ',' + $scope.data.password;
        var usuario = $scope.data.username;
        var password = $scope.data.password;
        $http.post(link, {datos: datos, funcion :'login'}).then(function (res){
              if (res.data.validacion== 'ok') {
                  userId = res.data.user;
                  $location.path('/app/playlists');
                    db.transaction(function(tx) {
                      tx.executeSql("INSERT INTO usuarios (usuario, password) VALUES (?,?)", [usuario, password], function(tx, res) {
                      //alert("insertId: " + res.insertId);
                      //alert("rowsAffected: " + res.rowsAffected);
                      });
                    });
              }else{
                  $scope.responseUserInvalid = res.data.mensaje;
                    db.transaction(function(tx) {
                    tx.executeSql("DELETE FROM usuarios;", [], function(tx, res) {
                    console.log("registros eliminados");
                    $ionicHistory.clearCache();
                  $location.path('/app/home_login');
              });
              });
            }  
        });
    }

    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 50,
        showDelay: 0
    });

    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
  $timeout(function () {
    $ionicLoading.hide();
    db.transaction(function(tx) {
            tx.executeSql("select * from usuarios;", [], function(tx, res) {
              if(res.rows.length > 0) {
                $scope.data.username = res.rows.item(0).usuario;
                $scope.data.password = res.rows.item(0).password;
                //alert("Usuario: " + username + "Password: " + pass);
                $scope.submit();
              }else{
                console.log("La consulta no trajo resultados.");
              }
            });
          });
  }, 4000);    


    $scope.easymail=function(){
     window.open('http://www.easymail.net.ar/', '_blank', 'location=yes');
  }
  $scope.facebook=function(){
     window.open('https://es-es.facebook.com/easymailarg', '_blank', 'location=yes');
  }
})



.controller('PlaylistsCtrl', function($scope, $http, $location, $interval) {
      var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
      var datos = userId;
      $http.post(link, {datos: datos, funcion: 'listaMoviles'}).then(function (res){
      //console.log(res.data);
      $scope.playlists = res.data;
      
  });
      //$interval(actualizar($scope), 5000);
       /*$scope.actualizar = function(){
              var d = new Date();
              console.log($scope.playlists[0].dominio);
              $scope.playlists[0].fecha = d;
          }
    $interval($scope.actualizar, 3000);*/
})

.controller('mapaCtrl', function($scope, $stateParams, $http) {
  
  var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
  var datos = userId;
  $http.post(link, {datos: datos, funcion: 'listamoviles'}).then(function (res){
  $scope.playlists = res.data;

  //console.log(res.data[0].dominio);
  //console.log($scope.playlists[0].latitud);

var vectorSource = new ol.source.Vector({
  //create empty vector
});

// cycle through all entries in the array
for (var i = 0; i < $scope.playlists.length; i++){
    var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([parseFloat($scope.playlists[i].longitud), parseFloat($scope.playlists[i].latitud)],'EPSG:4326','EPSG:3857'))});

    var iconStyle = new ol.style.Style({    
                 image: new ol.style.Icon(({scale:0.3,src:$scope.playlists[i].imgrumbo}))
        });
    // THIS IS NEW - add each style individually to the feature
    iconFeature.setStyle(iconStyle);
    // First add the feature when it has got its style
    vectorSource.addFeature(iconFeature);
}

var vectorLayer = new ol.layer.Vector({
  source: vectorSource
});

var layers = [
  new ol.layer.Tile({
    extent: [-20000000, -20000000, 20000000, 20000000],
    source: new ol.source.TileWMS({
      url: 'http://tails.etrk.com.ar/cgi-bin/mapserv?map=/opt/OSM/basemaps/osm-wsm.map&',
      params: {'SERVICE': 'WMS', 'REQUEST': 'Getmap', 'VERSION' : '1.3' ,'LAYERS': 'land0,borders0,places0,land1,borders1,places1,land2,borders2,places2,land3,borders3,places3,land4,landuse4,waterarea4,borders4,places4,land5,landuse5,waterarea5,roads5,borders5,places5,land6,landuse6,waterarea6,waterways6,roads6,borders6,places6,land7,landuse7,waterarea7,waterways7,roads7,borders7,places7,land8,landuse8,waterarea8,waterways8,railways8,roads8,borders8,places8,land9,landuse9,waterarea9,waterways9,railways9,roads9,borders9,places9,land10,landuse10,waterarea10,waterways10,railways10,roads10,aeroways10,borders10,places10,land11,landuse11,transport_areas11,waterarea11,waterways11,railways11,roads11,aeroways11,borders11,places11,land12,landuse12,transport_areas12,waterarea12,waterways12,railways12,roads12,aeroways12,borders12,places12,land13,landuse13,transport_areas13,waterarea13,waterways13,railways13,roads13,aeroways13,borders13,places13,land14,landuse14,transport_areas14,waterarea14,waterways14,railways14,roads14,aeroways14,borders14,places14,land15,landuse15,transport_areas15,waterarea15,waterways15,railways15,roads15,aeroways15,borders15,places15,buildings15,land16,landuse16,transport_areas16,waterarea16,waterways16,railways16,roads16,aeroways16,borders16,places16,buildings16,land17,landuse17,transport_areas17,waterarea17,waterways17,railways17,roads17,aeroways17,borders17,places17,buildings17,land18,landuse18,transport_areas18,waterarea18,waterways18,railways18,roads18,aeroways18,borders18,places18,buildings18','SRS': 'EPSG:4326,EPSG:3857','BBOX': '-100,-60,-20,15'},
      serverType: 'mapserver'
    })
  }),
vectorLayer
];
var map = new ol.Map({
  layers: layers,
  target: 'mapaTodosLosDominios',
  view: new ol.View({
    center: ol.proj.transform([-61,-34], 'EPSG:4326', 'EPSG:3857'),
    zoom: 3
  })
});

    var posicion = map.getLayers().getArray();
    //console.log(posicion[1]);
      
    var extent = vectorLayer.getSource().getExtent();
    //console.log(extent);
    map.getView().fit(extent, map.getSize());
});
})

.controller('PlaylistCtrl', function($scope, $stateParams, $http, $ionicPlatform) {

  var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
  var datos = $stateParams.playlistId + ',' + userId;
  $http.post(link, {datos: datos, funcion: 'mapaDominio'}).then(function (res){
  $scope.playlist = res.data.movil[0];

  var vectorSource = new ol.source.Vector({
  //create empty vector
  });

  var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.transform([parseFloat($scope.playlist.longitud), parseFloat($scope.playlist.latitud)],'EPSG:4326','EPSG:3857'))});

    var iconStyle = new ol.style.Style({    
            image: new ol.style.Icon(({scale:0.3,src:$scope.playlist.imgrumbo}))
        });
    // THIS IS NEW - add each style individually to the feature
    iconFeature.setStyle(iconStyle);
    // First add the feature when it has got its style
    vectorSource.addFeature(iconFeature);
    var vectorLayer = new ol.layer.Vector({
  source: vectorSource
});

var layers = [
  new ol.layer.Tile({
    //extent: [-20000000, -20000000, 20000000, 20000000],
    source: new ol.source.TileWMS({
      url: 'http://tails.etrk.com.ar/cgi-bin/mapserv?map=/opt/OSM/basemaps/osm-wsm.map&',
      params: {'SERVICE': 'WMS', 'REQUEST': 'Getmap', 'VERSION' : '1.3' ,'LAYERS': 'land0,borders0,places0,land1,borders1,places1,land2,borders2,places2,land3,borders3,places3,land4,landuse4,waterarea4,borders4,places4,land5,landuse5,waterarea5,roads5,borders5,places5,land6,landuse6,waterarea6,waterways6,roads6,borders6,places6,land7,landuse7,waterarea7,waterways7,roads7,borders7,places7,land8,landuse8,waterarea8,waterways8,railways8,roads8,borders8,places8,land9,landuse9,waterarea9,waterways9,railways9,roads9,borders9,places9,land10,landuse10,waterarea10,waterways10,railways10,roads10,aeroways10,borders10,places10,land11,landuse11,transport_areas11,waterarea11,waterways11,railways11,roads11,aeroways11,borders11,places11,land12,landuse12,transport_areas12,waterarea12,waterways12,railways12,roads12,aeroways12,borders12,places12,land13,landuse13,transport_areas13,waterarea13,waterways13,railways13,roads13,aeroways13,borders13,places13,land14,landuse14,transport_areas14,waterarea14,waterways14,railways14,roads14,aeroways14,borders14,places14,land15,landuse15,transport_areas15,waterarea15,waterways15,railways15,roads15,aeroways15,borders15,places15,buildings15,land16,landuse16,transport_areas16,waterarea16,waterways16,railways16,roads16,aeroways16,borders16,places16,buildings16,land17,landuse17,transport_areas17,waterarea17,waterways17,railways17,roads17,aeroways17,borders17,places17,buildings17,land18,landuse18,transport_areas18,waterarea18,waterways18,railways18,roads18,aeroways18,borders18,places18,buildings18','SRS': 'EPSG:4326,EPSG:3857','BBOX': '-100,-60,-20,15'},
      serverType: 'mapserver'
    })
  }),
vectorLayer
];

var map = new ol.Map({
  layers: layers,
  target: 'mapaUnDominio',
  view: new ol.View({
    center: ol.proj.transform([parseFloat($scope.playlist.longitud), parseFloat($scope.playlist.latitud)], 'EPSG:4326', 'EPSG:3857'),
    zoom: 12
  })
});

});
})

.controller('HistoricoCtrl', function($scope, $http, $stateParams) {
    var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
    var datos = $stateParams.playlistId + ',' + userId;
    $http.post(link, {datos: datos, funcion: 'historico'}).then(function (res){
    //console.log(res.data);
    $scope.playlist = res.data.historico[0];
  });
})

.controller('HistoricoPosicionesCtrl', function($scope, $http, $stateParams, $ionicLoading, $timeout) {
    var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
    var datos = $stateParams.playlistId + ',' + userId;
    $http.post(link, {datos: datos, funcion: 'historicoPosiciones'}).then(function (res){
    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 50,
        showDelay: 0
    });

    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
  $timeout(function () {
    $ionicLoading.hide();
    $scope.playlists = res.data;
  }, 2000);    
  });
})
.controller('HistoricoVelocidadCtrl', function($scope, $http, $stateParams, $ionicLoading, $timeout) {
    var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
    var datos = $stateParams.playlistId + ',' + userId;
    $http.post(link, {datos: datos, funcion: 'HistoricoVelocidad'}).then(function (res){
    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 50,
        showDelay: 0
    });

    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
  $timeout(function () {
    $ionicLoading.hide();
    $scope.playlists = res.data;
  }, 2000);    
  });
})
.controller('HistoricoDetencionesCtrl', function($scope, $http, $stateParams, $ionicLoading, $timeout) {
    var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
    var datos = $stateParams.playlistId + ',' + userId;
    $http.post(link, {datos: datos, funcion: 'HistoricoDetenciones'}).then(function (res){
    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 50,
        showDelay: 0
    });

    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
  $timeout(function () {
    $ionicLoading.hide();
    $scope.playlists = res.data;
  }, 2000);    
  });
})

.controller('PosicionCtrl', function($scope, $http, $stateParams, $location) {
    var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
    var datos = $stateParams.playlistId + ',' + userId;
    $http.post(link, {datos: datos, funcion: 'solicitudPosicion'}).then(function (res){
    $scope.playlists = res.data;
  });
})

.controller('MasDatosCtrl', function($scope, $stateParams, $http) {
  
  var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
  var datos = $stateParams.playlistId + ',' + userId;
  $http.post(link, {datos: datos, funcion: 'masDatos'}).then(function (res){
  $scope.playlist = res.data.chofer[0];
  });
})

.controller('EstadisticaCtrl', ['$scope', '$timeout', '$http', '$ionicLoading', function ($scope, $timeout, $http, $ionicLoading) {
      
    var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
    var datos = $scope.responseUser;
    $http.post(link, {datos: datos, funcion: 'estVelocidad'}).then(function (res){
    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 50,
        showDelay: 0
    });

  // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
    $timeout(function () {
    $ionicLoading.hide();
    $scope.playlists = res.data;
    resultDominio = [];
    resultCant = [];

    for(var i = 0; i < $scope.playlists.length;i++){
        resultDominio.push($scope.playlists[i].dominio);
        resultCant.push($scope.playlists[i].cantidad);
    }
    $scope.options = { scaleShowVerticalLines: false };
    $scope.labels = resultDominio;
    //$scope.series = ['Series A', 'Series B'];
    $scope.data = [resultCant];
    $timeout(function () {
      $scope.options = { scaleShowVerticalLines: true };
    }, 3000);
  }, 2000);  
  });
}])
.controller('PerfilCtrl', function($scope, $stateParams, $http, $location) {
  var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
  var datos = userId;
  $http.post(link, {datos: datos, funcion: 'perfil'}).then(function (res){
  $scope.playlists = res.data.user[0];
  });

  $scope.data = {};
  
    $scope.submit = function(){
        var link = 'http://mobile.etrk.com.ar/easytrack_web_service/apirest.php';
        var datos = userId + ',' + $scope.playlists.descripcion + ',' + $scope.playlists.email + ',' + $scope.data.password;
        
        $http.post(link, {datos: datos, funcion :'updateUser'}).then(function (res){
              if (res.data != 'error') {
                  $scope.responseUpdate = "Datos actualizados correctamente";
              }else{
                  $scope.responseUpdate = "Error";
              };  
        });
    }

})

.controller('salirCtrl', ['$scope','$location','$cordovaSQLite','$state','$timeout','$ionicLoading','$ionicHistory', function($scope, $location, $cordovaSQLite, $state, $timeout, $ionicLoading, $ionicHistory){
    $scope.logout=function(){
    $scope.data.username = "";
    $scope.data.password = "";
    $scope.responseUser = "";
    window.close();
    ionic.Platform.exitApp();
  }
   $scope.otherUser=function(){
      // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 50,
        showDelay: 0
    });

    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
  $timeout(function () {
    $ionicLoading.hide();
    db.transaction(function(tx) {
            tx.executeSql("DELETE FROM usuarios;", [], function(tx, res) {
                $scope.data.username = "";
                $scope.data.password = "";
                userId="";
                console.log("registros eliminados");
                $ionicHistory.clearCache();
                $state.go('app.home_login');
            });
          });
  }, 1500);    

}
}]);