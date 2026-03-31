//  /**
//          * Función para aclarar un color HEX (hace más claro el color).
//          * @param {string} hex - Código de color en formato HEX.
//          * @param {number} percent - Cantidad a aclarar (0.1 a 1).
//          * @returns {string} - Nuevo código de color HEX más claro.
//          */
 function lightenColor(hex, percent) {
    let num = parseInt(hex.replace("#", ""), 16),
        amt = Math.round(255 * percent),
        r = (num >> 16) + amt,
        g = ((num >> 8) & 0x00FF) + amt,
        b = (num & 0x0000FF) + amt;

    return `#${(0x1000000 + (Math.min(r, 255) * 0x10000) + (Math.min(g, 255) * 0x100) + Math.min(b, 255)).toString(16).slice(1)}`;
}