function showNotification(placementFrom, placementAlign, type, message, delay) {
    $.notify(
      {
        title: "Notification",
        message: message
      },
      {
        element: "body",
        type: type,
        placement: {
          from: placementFrom,
          align: placementAlign
        },
        z_index:9999,
        animate: {
          enter: "animated fadeInDown",
          exit: "animated fadeOutUp"
        },
        autoHideDelay: delay || 5000,
      }
    );
  }

  // function showNotification(placementFrom, placementAlign, type){
  //   $.notify(
  //     {
  //       title: "Alerta",
  //       message: "El campo se encuentra vacío!",
  //       target: "_blank"
  //     },
  //     {
  //       element: "body",
  //       position: null,
  //       type: type,
  //       allow_dismiss: true,
  //       newest_on_top: false,
  //       showProgressbar: false,
  //       placement: {
  //         from: placementFrom,
  //         align: placementAlign
  //       },
  //       offset: 20,
  //       spacing: 10,
  //       z_index: 1031,
  //       delay: 4000,
  //       timer: 2000,
  //       url_target: "_blank",
  //       mouse_over: null,
  //       animate: {
  //         enter: "animated fadeInDown",
  //         exit: "animated fadeOutUp"
  //       },
  //       onShow: null,
  //       onShown: null,
  //       onClose: null,
  //       onClosed: null,
  //       icon_type: "class",
  //       template:
  //         '<div data-notify="container" class="col-11 col-sm-3 alert  alert-{0} " role="alert">' +
  //         '<button type="button" class="close" data-notify="dismiss">×</button>' +
  //         '<span data-notify="icon"></span> ' +
  //         '<span data-notify="title">{1}</span> ' +
  //         '<span data-notify="message">{2}</span>' +
  //         '<div class="progress" data-notify="progressbar">' +
  //         '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
  //         "</div>" +
  //         '<a href="{3}" target="{4}" data-notify="url"></a>' +
  //         "</div>"
  //     }
  //   );
  // }

// window.showNotification = showNotification;