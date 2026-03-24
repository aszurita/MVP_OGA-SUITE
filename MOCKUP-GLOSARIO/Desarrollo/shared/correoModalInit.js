// Inicializa el modal de correo usando ModalGeneral cuando exista #correoBtn.
document.addEventListener('DOMContentLoaded', function () {
    if (!document || !window) return;

    document.addEventListener('click', function (event) {
        const btn = event.target && event.target.closest ? event.target.closest('#correoBtn') : null;
        if (!btn) return;
        if (!window.ModalGeneral || typeof window.ModalGeneral.openCorreoModal !== 'function') return;

        const titulo = document.getElementById('tituloFlujoActual')?.value || 'Linaje';
        const userEmail = (window.ModalGeneral && typeof window.ModalGeneral.getCurrentEmail === 'function'
            ? window.ModalGeneral.getCurrentEmail()
            : (window._spPageContextInfo && _spPageContextInfo.userEmail) || window.current_email || '');

        const initial = {
            subject: `Linaje: ${titulo}`,
            cc: userEmail,
            bodyHtml: `<p>Hola,</p><p>Te comparto el diagrama de linaje <strong>${titulo}</strong>.</p>`,
        };

        window.ModalGeneral.openCorreoModal({
            initialValues: initial,
            defaultCc: userEmail,
        }).then((controller) => {
            if (controller && typeof controller.hydrate === 'function') {
                controller.hydrate({ cc: userEmail });
            }
        });
    });
});
