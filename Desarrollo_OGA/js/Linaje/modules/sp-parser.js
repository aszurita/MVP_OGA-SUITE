(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.SpParser = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const cleanIdentifier = (value = '') => {
    return value
      .replace(/[\[\]]/g, '')
      .replace(/["`]/g, '')
      .replace(/\s+/g, '')
      .trim();
  };

  const normalizeObjectName = (value = '') => {
    if (!value) return '';
    const cleaned = cleanIdentifier(value);
    if (!cleaned) return '';
    return cleaned.toUpperCase();
  };

  const stripSqlComments = (text = '') => {
    return text
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/--.*$/gm, '');
  };

  const toArray = (value) => Array.isArray(value) ? value : (value ? [value] : []);

  const extractProcedureName = (text, fallback = 'Procedimiento') => {
    const regex = /create\s+(?:or\s+alter\s+)?proc(?:edure)?\s+([A-Za-z0-9_\.\[\]"]+)/i;
    const match = regex.exec(text);
    if (match && match[1]) {
      return cleanIdentifier(match[1]) || fallback;
    }
    return fallback;
  };

  const parseProcedureQualifiedName = (name = '') => {
    const tokens = name.split('.');
    const cleaned = tokens.map(cleanIdentifier).filter(Boolean);
    let objectName = (cleaned.pop() || 'PROCEDIMIENTO').toUpperCase();
    let schema = (cleaned.pop() || 'dbo').toUpperCase();
    const database = cleaned.pop() || null;
    return {
      database,
      schema,
      objectName,
      entityId: `[SP].[${schema}].[${objectName}]`
    };
  };

  const collectMatches = (regex, text) => {
    regex.lastIndex = 0;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        matches.push(cleanIdentifier(match[1]));
      }
    }
    return matches;
  };

  const isTempTable = (name = '') => name.trim().startsWith('#');

  const extractInsertColumns = (text) => {
    const results = [];
    const regex = /insert\s+into\s+([^\s(]+)\s*\(([^)]+)\)/gi;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const table = cleanIdentifier(match[1]);
      const columns = match[2]
        .split(',')
        .map(col => cleanIdentifier(col))
        .filter(Boolean);
      results.push({ table, columns });
    }
    return results;
  };

  const extractSelectIntoTargets = (text) => {
    const targets = [];
    const regex = /\bselect\b[\s\S]*?\binto\b\s+([^\s;]+)/gi;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        targets.push(cleanIdentifier(match[1]));
      }
    }
    return targets;
  };

  const extractDroppedTables = (text) => {
    const drops = [];
    const regex = /drop\s+table\s+([^\s;]+)/gi;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        drops.push(cleanIdentifier(match[1]));
      }
    }
    return drops;
  };

  const extractWhereClauses = (text) => {
    const clauses = [];
    const regex = /\bwhere\b([\s\S]*?)(?=\b(?:group|order|join|insert|update|delete|merge|with|union)\b|;|$)/gi;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const clause = match[1].trim();
      if (clause) clauses.push(clause.replace(/\s+/g, ' '));
    }
    return clauses;
  };

  const extractJoinClauses = (text) => {
    const joins = [];
    const regex = /\b(left|right|inner|outer|full|cross)?\s*join\s+([^\s,]+)(?:\s+as)?\s+([^\s]+)?\s+on\s+([\s\S]*?)(?=\b(?:join|where|group|order|insert|update|delete|merge|union|with)\b|;|$)/gi;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const type = (match[1] || 'JOIN').trim().toUpperCase();
      const table = cleanIdentifier(match[2]);
      const alias = cleanIdentifier(match[3] || '');
      const condition = (match[4] || '').replace(/\s+/g, ' ').trim();
      joins.push({ type, table, alias, condition });
    }
    return joins;
  };

  const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const resolveAliasReference = (alias, sqlText) => {
    if (!alias || !sqlText) return '';
    const aliasPattern = escapeRegex(alias);
    const regex = new RegExp(`\\b(?:from|join)\\s+([^\\s]+)\\s+(?:as\\s+)?${aliasPattern}\\b`, 'i');
    const match = regex.exec(sqlText);
    if (match && match[1]) {
      return cleanIdentifier(match[1]);
    }
    return '';
  };

  const extractUpdateTargets = (text) => {
    const results = [];
    const regex = /update\s+([^\s]+)\s+set[\s\S]*?from\s+([^\s]+?)(?:\s+(?:as\s+)?([^\s]+))?(?=\s+(?:with|join|where|update|insert|delete|merge|select)\b|;|$)/gi;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const aliasOrTable = cleanIdentifier(match[1]);
      let resolved = aliasOrTable;
      if (!aliasOrTable.includes('.') && match[2]) {
        resolved = cleanIdentifier(match[2]);
      } else if (!aliasOrTable.includes('.')) {
        const local = resolveAliasReference(aliasOrTable, match[0]);
        const global = local || resolveAliasReference(aliasOrTable, text);
        if (global) {
          resolved = global;
        }
      }
      results.push(resolved);
    }
    return results;
  };

  const dedupeList = (items = []) => {
    const seen = new Set();
    return items.filter(item => {
      const key = normalizeObjectName(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const buildNodesAndEdges = ({ procedureName, sources, targets, joins, filters, columnMap }) => {
    const nodes = [];
    const edges = [];
    const padreId = 'padre';

    const nodeRegistry = new Map();

    const registerNode = (rawName, { columns = [] } = {}) => {
      if (!rawName) return null;
      const display = rawName || `Entidad ${nodeRegistry.size + 1}`;
      const key = normalizeObjectName(display) || display.toUpperCase();
      if (nodeRegistry.has(key)) {
        const entry = nodeRegistry.get(key);
        if (columns.length) {
          const current = entry.data.campos || [];
          const merged = Array.from(new Set(current.concat(columns)));
          entry.data.campos = merged;
        }
        return entry.id;
      }

      const safeBase = (key || `NODO_${nodeRegistry.size}`).replace(/[^A-Z0-9_]/gi, '_');
      const nodeId = `${safeBase}_${nodeRegistry.size}`;
      const data = {
        id: nodeId,
        nombre: display,
        tipo: 'tabla',
        descripcion: display,
        origen: display
      };
      if (columns.length) {
        data.campos = columns;
        data.descripcion = `${display}\nCampos: ${columns.join(', ')}`;
      }

      nodes.push({ data });
      nodeRegistry.set(key, { id: nodeId, data });
      return nodeId;
    };

    const connectSource = (name) => {
      if (!name) return;
      const normalized = normalizeObjectName(name);
      const columns = columnMap.get(normalized) || [];
      const nodeId = registerNode(name, { columns });
      if (!nodeId) return;
      edges.push({
        data: {
          source: nodeId,
          target: padreId
        }
      });
    };

    const connectTarget = (name) => {
      if (!name) return;
      const normalized = normalizeObjectName(name);
      const columns = columnMap.get(normalized) || [];
      const nodeId = registerNode(name, { columns });
      if (!nodeId) return;
      edges.push({
        data: {
          source: padreId,
          target: nodeId
        }
      });
    };

    nodes.push({
      data: {
        id: padreId,
        nombre: procedureName,
        tipo: 'sp',
        descripcion: `${procedureName} (procedimiento)`,
        esPadre: true,
        metadata: {
          joins,
          filtros: filters
        }
      }
    });

    const joinSummary = (joins || [])
      .map(j => {
        const base = `${j.type || 'JOIN'} ${j.table}${j.alias ? ` AS ${j.alias}` : ''}`;
        return j.condition ? `${base} ON ${j.condition}` : base;
      })
      .join(' | ');
    if (joinSummary) {
      nodes[0].data.descripcion = `${procedureName} (procedimiento)\nJoins: ${joinSummary}`;
    }

    sources.forEach(src => connectSource(src));
    targets.forEach(dst => connectTarget(dst));

    return { nodes, edges };
  };

  const parseToSnapshot = (rawText = '', { fileName } = {}) => {
    const text = stripSqlComments(rawText);
    if (!text.trim()) {
      return { snapshot: null, meta: null };
    }

    const procedureName = extractProcedureName(text, fileName || 'Procedimiento');

    const targetRegexes = [
      /insert\s+into\s+([^\s(]+)/gi,
      /merge\s+into\s+([^\s]+)/gi
    ];
    const sourceRegexes = [
      /from\s+([^\s,]+)/gi,
      /join\s+([^\s,]+)/gi
    ];

    const insertTargetsRaw = dedupeList([
      ...targetRegexes.flatMap(regex => collectMatches(regex, text)),
      ...extractSelectIntoTargets(text)
    ]);
    const updateTargetsRaw = dedupeList(extractUpdateTargets(text));
    const rawSources = dedupeList(sourceRegexes.flatMap(regex => collectMatches(regex, text)));

    const tempTables = new Set(
      [...rawSources, ...insertTargetsRaw, ...updateTargetsRaw]
        .filter(isTempTable)
        .map(name => cleanIdentifier(name))
    );

    const droppedTables = new Set(extractDroppedTables(text).map(cleanIdentifier));

    const insertTargets = insertTargetsRaw.filter(name => !isTempTable(name));
    const updateTargets = updateTargetsRaw.filter(name => !isTempTable(name));
    let targets = (updateTargets.length ? updateTargets : insertTargets);
    targets = targets.filter(name => !droppedTables.has(cleanIdentifier(name)));
    const targetSet = new Set(targets.map(name => normalizeObjectName(name)));
    const sources = rawSources
      .filter(name => !isTempTable(name))
      .filter(name => !targetSet.has(normalizeObjectName(name)));

    const columnInfo = extractInsertColumns(text);
    const columnMap = new Map();
    columnInfo.forEach(({ table, columns }) => {
      const key = normalizeObjectName(table);
      if (!key) return;
      columnMap.set(key, columns);
    });

    const joins = extractJoinClauses(text);
    const filters = extractWhereClauses(text);

    const procInfo = parseProcedureQualifiedName(procedureName);

    const { nodes, edges } = buildNodesAndEdges({
      procedureName,
      sources,
      targets,
      joins,
      filters,
      columnMap
    });

    const snapshot = {
      elements: {
        nodes,
        edges
      }
    };

    const meta = {
      procedureName,
      sourceCount: sources.length,
      targetCount: targets.length,
      hasFilters: filters.length > 0,
      schema: procInfo.schema,
      objectName: procInfo.objectName,
      entityId: procInfo.entityId,
      tempTables: Array.from(tempTables)
    };

    return { snapshot, meta };
  };

  return {
    parseToSnapshot
  };
});
