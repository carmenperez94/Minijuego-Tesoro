var app = {
  inicio: function(){

    DIAMETRO_BOAT = 50;
    dificultad = 0;
    velocidadX= 0;
    velocidadY= 0;
    puntuacion= 0;

    alto = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;

    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){
    function preload(){
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#0F6ACF';
      game.load.image('boat', 'assets/boat.png');
      game.load.image('tesoro', 'assets/tesoro.png');
    }
    function create(){
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#FFFFFF' });

      tesoro = game.add.sprite(app.inicioX(), app.inicioY(), 'tesoro');
      boat = game.add.sprite(app.inicioX(), app.inicioY(), 'boat');

      game.physics.arcade.enable(boat);
      game.physics.arcade.enable(tesoro);

      boat.body.collideWorldBounds = true;
      boat.body.onWorldBounds = new Phaser.Signal();
      boat.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }

    function update() {
      var factorDificultad = (300 + (dificultad * 100));
      boat.body.velocity.y = (velocidadY * factorDificultad);
      boat.body.velocity.x = (velocidadX * (-1 * factorDificultad));

      game.physics.arcade.overlap(boat, tesoro, app.incrementaPuntuacion, null, this);

    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion=puntuacion-1;
    scoreText.text = puntuacion;
    },

  incrementaPuntuacion: function(){
    puntuacion=puntuacion+1;
    scoreText.text = puntuacion;

    tesoro.body.x = app.inicioX();
    tesoro.body.y = app. inicioY();

    if (puntuacion > 0) {
      dificultad = dificultad + 1;
    }

  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOAT);
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOAT);
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    function onError(){
      console.log('onError!');
    }
    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }
    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){

    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },


  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x;
    velocidadY = datosAceleracion.y;
  }
};

if('addEventListener' in document) {
  document.addEventListener('deviceready', function() {
    app.inicio();
  }, false);
}
