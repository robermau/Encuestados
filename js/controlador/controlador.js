/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },
  eliminarPregunta: function(id){
    var respuesta = window.confirm("¿Está seguro que desea borrar pregunta?");
    if (respuesta) {
      var $id = $('.list-group-item.active').attr('id');
      this.modelo.eliminarPregunta($id);
    }
  },
  agregarVoto: function(preguntaId, respuesta){
    this.modelo.agregarVoto(preguntaId, respuesta);
  },
  editarNombrePregunta: function(id){
    var nuevoNombre = prompt("Ingrese nuevo nombre de pregunta");
    if (nuevoNombre != null) {
      this.modelo.editarNombrePregunta(id, nuevoNombre);
    }
  },
  eliminarTodasLasPreguntas(){
    var respuesta = window.confirm("¿Está seguro que desea borrar todas las preguntas?");
    if(respuesta){
      this.modelo.eliminarTodasLasPreguntas();
    }
  }
};
