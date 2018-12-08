/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEliminada.suscribir(function(){
    contexto.reconstruirLista();
  });
  this.modelo.nombrePreguntaEditado.suscribir(function(){
    contexto.reconstruirLista();
  });
  this.modelo.todasLasPreguntasEliminadas.suscribir(function(){
    contexto.reconstruirLista();
  })
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.configuracionDeBotones();
    this.reconstruirLista();
    this.validacionDeFormulario();
  },
  // crea un nuevo item pregunta
  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem;
    var nuevoItem = $("<li class='list-group-item' id='" + pregunta.id + "'></li>");
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  // reconstruye la lista de Preguntas
  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  //se configuran los botones
  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    // asociacion de eventos a boton
    // agrega un elemento respuesta
    e.botonAgregarRespuesta.click(function(){
      var nuevaRespuesta = "<div class='form-group answer'>" +
                            "<input class='form-control' type='text' name='option[]' />" +
                            "<button type='button' class='btn btn-default botonBorrarRespuesta' name='borrarRespuesta'><i class='fa fa-minus'></i></button>" +
                          "</div>"
      var $clone = $(nuevaRespuesta).insertBefore(e.botonAgregarRespuesta);
      var $option = $clone.find('[name="option[]"]');
      $('#localStorageForm').formValidation('addField', $option);
    });

    //quita un elemento respuesta
    $('body').on("click",'[name="borrarRespuesta"]',function(){
       var $row = $(this).parent('.form-group.answer')

       var $option = $row.find('[name="option[]"]');

       $row.remove();
      // Eliminar campo del formulario
      $('#localStorageForm').formValidation('removeField', $option);
    })

    // agregar pregunta
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function() {
        //completar
        var textoRespuesta = $(this).val();
        respuestas.push(textoRespuesta);
      });
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);

    });

    // editar pregunta
    e.botonEditarPregunta.click(function(){
      var $id = $('.list-group-item.active').attr('id');
      contexto.controlador.editarNombrePregunta($id);
    });

    //eliminar pregunta
    e.botonBorrarPregunta.click(function(){
      contexto.controlador.eliminarPregunta();
    });

    // borrar todas las preguntas
    e.borrarTodo.click(function(){
      contexto.controlador.eliminarTodasLasPreguntas();
    })
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },

  validacionDeFormulario: function(){
  $('#localStorageForm')
    .formValidation({
      framework: 'bootstrap',
      icon: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        question: {
          validators: {
            notEmpty: {
              message: 'La pregunta no puede ser vacía'
            }
          }
        },
        'option[]': {
          validators: {
            notEmpty: {
              message: 'La respuesta no puede ser vacía'
            },
            stringLength: {
              max: 100,
              message: 'La respuesta debe tener menos de 100 caracteres'
            }
          }
        }
      }
    })

    // Llamada después de agregar el campo
    .on('added.field.fv', function(e, data) {
      // data.field   --> nombre del campo
      // data.element --> el nuevo elemento del campo
      // data.options --> las nuevas opciones del campo

      if (data.field === 'option[]') {
        if ($('#localStorageForm').find(':visible[name="option[]"]').length >= 5) {
          $('#localStorageForm').find('.botonAgregarRespuesta').attr('disabled', 'disabled');
        }
      }
    })

    // Llamada después de eliminar el campo
    .on('removed.field.fv', function(e, data) {
      if (data.field === 'option[]') {
        if ($('#localStorageForm').find(':visible[name="option[]"]').length < 5) {
          $('#localStorageForm').find('.botonAgregarRespuesta').removeAttr('disabled');
        }
      }
    })
  }
}
