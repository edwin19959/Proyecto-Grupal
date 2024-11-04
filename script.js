
function mostrarMensaje(tipo, mensaje) {
    const alert = $(`
        <div class="alert alert-${tipo} alert-dismissible fade show mensaje-flotante">
            ${mensaje}
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </div>
    `);
    $('#alert-container').append(alert);
    setTimeout(() => alert.alert('close'), 3000);
}

function cargarComentarios() {
    $('#loading-comments').removeClass('d-none');
    $('#comentarios').empty();

    $.get('obtener_comentarios.php')
        .done(function(response) {
            if (response.status === 'success') {
                if (response.data.length > 0) {
                    response.data.forEach(comentario => {
                        $('#comentarios').append(`
                            <div class="comentario">
                                <div class="comentario-header">
                                    <h5 class="comentario-nombre">${comentario.nombre}</h5>
                                    <span class="comentario-fecha">${comentario.fecha}</span>
                                </div>
                                <p class="comentario-texto">${comentario.comentario}</p>
                            </div>
                        `);
                    });
                } else {
                    $('#comentarios').append('<p>No hay comentarios disponibles.</p>');
                }
            }
        })
        .fail(function() {
            mostrarMensaje('danger', 'Error al cargar los comentarios');
        })
        .always(function() {
            $('#loading-comments').addClass('d-none');
        });
}


$(document).ready(function() {
    cargarComentarios();


    $('#comentario').on('input', function() {
        const restantes = 500 - $(this).val().length;
        $('.caracteres-restantes').text(`${restantes} caracteres restantes`);
    });

    $('#comentarioForm').on('submit', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const $button = $form.find('button[type="submit"]');
        const $btnText = $button.find('.btn-text');
        const $spinner = $button.find('.spinner-border');
        

        $button.prop('disabled', true);
        $btnText.addClass('d-none');
        $spinner.removeClass('d-none');
        
        $.post('guardar_comentario.php', $form.serialize())
            .done(function(response) {
                if (response.status === 'success') {
                    mostrarMensaje('success', response.message);
                    $form[0].reset();
                    $('.caracteres-restantes').text('500 caracteres restantes');
                    cargarComentarios(); // Recargar comentarios después de agregar uno nuevo
                } else {
                    mostrarMensaje('danger', response.message);
                }
            })
            .fail(function() {
                mostrarMensaje('danger', 'Error al guardar el comentario');
            })
            .always(function() {
                $button.prop('disabled', false);
                $btnText.removeClass('d-none');
                $spinner.addClass('d-none');
            });
    });
});
