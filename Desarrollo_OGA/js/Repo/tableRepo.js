(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    const AINGINE = (root && root.AINGINE) || require('../AINGINE.js');
    module.exports = factory(AINGINE);
  } else {
    root.CatalogRepo = factory(root.AINGINE);
  }
})(typeof self !== 'undefined' ? self : this, function (AINGINE) {
  'use strict';

  async function getServers() {
    const rows = await AINGINE.get({
      select: 'DISTINCT TOP 50 UPPER(SERVIDOR) AS name',
      from:   'procesos_bi.dbo.LOG_ENTIDADES_CAMPOS_OFICIAL',
      where:  '1=1'
    });
    return rows.map(r => r?.name).filter(Boolean).sort((a,b)=>a.localeCompare(b));
  }

  async function getDatabases(server) {
    if (!server) return [];
    const rows = await AINGINE.get({
      select: 'DISTINCT TOP 50 UPPER(TABLE_CATALOG) AS name',
      from:   'procesos_bi.dbo.LOG_ENTIDADES_CAMPOS_OFICIAL',
      where:  `SERVIDOR = '${server}'`
    });
    return rows.map(r=>r?.name).filter(Boolean).sort((a,b)=>a.localeCompare(b));
  }

  // agrega getSchemas, getTables, getFields, etc.
  return { getServers, getDatabases };
});
