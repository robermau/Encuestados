/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.votoAgregado = new Evento(this);
  this.nombrePreguntaEditado = new Evento(this);
  this.todasLasPreguntasEliminadas = new Evento(this);
  this.descargarPreguntasLocal(); /** Inicializamos el evento que contiene los datos **/
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    var maxId = -1;
    for(var i=0;i<this.preguntas.length;++i){
      if(this.preguntas[i].id > maxId)
        maxId = this.preguntas[i].id;
    }
    return maxId;
  },

  //crea el array de objetos de respuestas
  crearRespuesta: function(resp){
    var respuestas = [];
    for (var i = 0; i < resp.length; i++) {
      respuestas[i] = {'textoRespuesta': resp[i], 'cantidad': 0};
    }
    return respuestas;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    respuestas = this.crearRespuesta(respuestas);
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardarLocal(nuevaPregunta);
    this.preguntaAgregada.notificar();
  },

  //agrega un voto a una pregunta
  agregarVoto: function(preguntaId, respuesta){
    for (var i = 0; i < this.preguntas.length; i++) {
      if (this.preguntas[i].id == preguntaId) {
        for (var j = 0; j <   this.preguntas[i].cantidadPorRespuesta.length; j++) {
          if (this.preguntas[i].cantidadPorRespuesta[j].textoRespuesta == respuesta) {
            this.preguntas[i].cantidadPorRespuesta[j].cantidad += 1;
            this.guardarLocal();
            this.votoAgregado.notificar();
            return;
          }
        }
      }
    }
  },

  // edita el nombre de una pregunta
  editarNombrePregunta: function(id, nuevoNombre){
    for (var i = 0; i < this.preguntas.length; i++) {
      if (this.preguntas[i].id == id) {
          this.preguntas[i].textoPregunta = nuevoNombre;
          this.guardarLocal();
          this.nombrePreguntaEditado.notificar();
          return;
      }
    }
  },

  //se elimina una pregunta seleccionada dado un id
  eliminarPregunta: function(id){
    for (var i = 0; i < this.preguntas.length; i++) {
      if (this.preguntas[i].id == id) {
        this.preguntas.splice(i,1);
        this.guardarLocal();
        this.preguntaEliminada.notificar();
        return;
      }
    }
  },

  // elimina todas las preguntas
  eliminarTodasLasPreguntas: function(){
    this.preguntas = [];
    this.guardarLocal();
    this.todasLasPreguntasEliminadas.notificar();
  },

  //se guardan la preguntas en localStorage
  guardarLocal: function(nuevaPregunta){
    localStorage.setItem('preguntas', JSON.stringify(this.preguntas));
  },

  // descarga preguntas guardadas en localStorage y las pushea en this.preguntas[]
  descargarPreguntasLocal: function(){
    if (localStorage.getItem('preguntas') !== null) {
      this.preguntas = JSON.parse(localStorage.getItem('preguntas'));
    }
  }
};
