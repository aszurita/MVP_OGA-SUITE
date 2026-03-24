<div class="correo-composer" data-modal-root>
  <button type="button" class="close-inline" data-action="close" aria-label="Cerrar">&times;</button>
  <div class="mail-header">
    <h1 class="mail-title">Nuevo correo</h1>
  </div>
  <div class="correo-composer-body">

    <div class="field-group">
      <div class="correo-field inline">
        <p class="correo-label">Para<span class="required">*</span></p>
        <input data-field="to" type="text" placeholder="usuario1  usuario 2  usuario 3" autocomplete="off"
          spellcheck="false" autocorrect="off" autocapitalize="off">
        <div class="error" data-error="to"></div>
        <div class="correo-suggestions hidden"></div>
      </div>
    </div>

    <div class="field-group">
      <div class="correo-field inline">
        <p class="correo-label">CC</p>
        <input data-field="cc" type="email" disabled />
      </div>
    </div>

    <div class="field-group">
      <div class="correo-field inline">
        <p class="correo-label">Asunto<span class="required">*</span></p>
        <input data-field="subject" type="text" placeholder="Asunto del correo" />
        <div class="error" data-error="subject"></div>
      </div>
    </div>

    <div class="field-group">
      <div class="editor-wrapper">
        <div class="toolbar">
          <button class="tool-btn" type="button" data-cmd="bold"><b>B</b></button>
          <button class="tool-btn" type="button" data-cmd="italic"><i>I</i></button>
          <button class="tool-btn" type="button" data-cmd="underline"><u>U</u></button>
          <span class="tool-sep"></span>
          <button class="tool-btn" type="button" data-cmd="insertUnorderedList">&#8226; Lista</button>
          <button class="tool-btn" type="button" data-cmd="insertOrderedList">1. Lista</button>
          <span class="tool-sep"></span>
          <button class="tool-btn" type="button" data-cmd="justifyLeft">&#11013;</button>
          <button class="tool-btn" type="button" data-cmd="justifyCenter">&#8801;</button>
          <button class="tool-btn" type="button" data-cmd="justifyRight">&#10145;</button>
          <span class="tool-sep"></span>
          <select class="tool-select" data-field="formatBlock">
            <option value="p">Parrafo</option>
            <option value="h1">Titulo (H1)</option>
            <option value="h2">Subtitulo (H2)</option>
          </select>
          <input class="tool-color" data-field="foreColor" type="color" title="Color de texto" />
          <span class="tool-sep"></span>
          <button class="tool-btn" type="button" data-field="btnLink">Link</button>
          <button class="tool-btn" type="button" data-cmd="removeFormat">Limpiar formato</button>
        </div>
        <div class="link-modal" data-link-modal>
          <div class="link-modal-panel">
            <label class="link-modal-label" for="link-input">Pega el enlace</label>
            <input id="link-input" data-field="linkInput" type="url" placeholder="https://ejemplo.com" />
            <div class="link-modal-actions">
              <button type="button" class="btn btn-link-apply" data-action="apply-link">Aceptar</button>
              <button type="button" class="btn btn-link-cancel" data-action="cancel-link">Cancelar</button>
            </div>
          </div>
        </div>
        <div data-field="bodyEditor" class="editor-body" contenteditable="true"></div>
      </div>
      <div class="error" data-error="body"></div>
    </div>
    <div class="field-group">
      <div class="attach-header">
        <div class="correo-field">Adjuntos</div>
        <button class="btn-attach" type="button" data-field="btnAttach">&#128206; Adjuntar archivos</button>
        <div class="file-list" data-field="fileList"></div>
      </div>
      <div class="attach-row">
        <input data-field="attachments" type="file" multiple style="display:none" />
      </div>
      <div class="error" data-error="attach"></div>
    </div>
  </div>
  <div class="mail-footer">
    <button class="btn btn-cancel" type="button" data-field="btnCancel">Cancelar</button>
    <button class="btn btn-send" type="button" data-field="btnSend">Enviar</button>
  </div>
  <div class="close-warning" data-close-warning aria-hidden="true">
    <div class="close-warning-panel" role="alertdialog" aria-live="polite">
      <p class="close-warning-text">
        Los cambios no guardados se perderán.<br>¿Quieres salir de todas formas?
      </p>
      <div class="close-warning-actions">
        <button type="button" class="btn btn-close-confirm" data-action="confirm-close">Aceptar</button>
        <button type="button" class="btn btn-close-cancel" data-action="cancel-close">Cancelar</button>
      </div>
    </div>
  </div>
