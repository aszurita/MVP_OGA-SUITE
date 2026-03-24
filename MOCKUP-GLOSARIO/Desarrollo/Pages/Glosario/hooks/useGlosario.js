/**
 * useGlosario.js
 * Hook principal de estado para el Glosario Empresarial.
 * Replica la lógica de GlosarioApp.init() + filtros/segmentación del ASPX original.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getTerminosAll,
  getDominios,
  getCasosUso,
  getRelacionesTerminoCasoUso,
} from '../services/terminosService.js';

const STORAGE_KEY_RECIENTES = 'glosario_recientes';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortGlosario(lista) {
  return [...lista].sort((a, b) => {
    const pa = a.prioridad != null ? Number(a.prioridad) : 9999;
    const pb = b.prioridad != null ? Number(b.prioridad) : 9999;
    if (pa !== pb) return pa - pb;
    return (a.nombre || '').localeCompare(b.nombre || '', 'es');
  });
}

function buildDictionary(todos) {
  const dictCache = {};
  const nombres = [];

  todos.forEach((item) => {
    const nombre = (item.nombre || '').replace(/<br>/g, '').trim();
    const desc   = item.descripcion || 'Ver definición';
    if (nombre.length > 3) {
      nombres.push(nombre);
      dictCache[nombre.toLowerCase()]          = desc;
      dictCache[nombre.toLowerCase() + '_name'] = nombre;
    }
  });

  if (nombres.length === 0) return { dictCache, regexSeguro: null };

  nombres.sort((a, b) => b.length - a.length);
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexStr = '(?:^|[^\\p{L}\\p{N}])(' + nombres.map(escape).join('|') + ')(?=[^\\p{L}\\p{N}]|$)';

  let regexSeguro = null;
  try {
    regexSeguro = new RegExp(regexStr, 'giu');
  } catch {
    regexSeguro = null;
  }

  return { dictCache, regexSeguro };
}

export function linkifyDescription(descripcion, currentTermName, dictCache, regexSeguro) {
  if (!descripcion || !regexSeguro) return descripcion || 'Sin descripción disponible.';

  return descripcion.replace(regexSeguro, (match) => {
    const lowerMatch = match.toLowerCase();
    if (currentTermName && lowerMatch === currentTermName.toLowerCase()) return match;

    let termDesc  = dictCache[lowerMatch] || '';
    const exactName = dictCache[lowerMatch + '_name'] || match;

    if (!termDesc) return match;

    termDesc = termDesc.replace(/<[^>]*>?/gm, '').replace(/"/g, '&quot;');
    if (termDesc.length > 180) termDesc = termDesc.substring(0, 177) + '...';

    return `<span class="glosario-crosslink badge badge-light" data-termino="${exactName}" title="${termDesc}" style="cursor:pointer;">${match}</span>`;
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export default function useGlosario() {
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  // Datos crudos del servidor
  const [glosario,       setGlosario]       = useState({ todos: [], terminos: [], atributos: [], golden: [], elemento_clave: [], atributo_referencia: [], dominios: new Map() });
  const [dominiosMapa,   setDominiosMapa]   = useState(new Map()); // descripcion_dominio → id_dominio
  const [dicCasosUso,    setDicCasosUso]    = useState({});        // id → nombre
  const [mapaCUDominio,  setMapaCUDominio]  = useState({});        // idCaso → nombreDominio
  const [mapaTermCU,     setMapaTermCU]     = useState(new Map()); // terminoId → [casoIds]

  // Diccionario para cross-links
  const dictRef = useRef({ dictCache: {}, regexSeguro: null });

  // UI state
  const [searchQuery,    setSearchQuery]    = useState('');
  const [viewMode,       setViewMode]       = useState('card');
  const [showDominios,   setShowDominios]   = useState(false);
  const [showRecientes,  setShowRecientes]  = useState(false);
  const [activeDominio,  setActiveDominio]  = useState(null);   // filtra por dominio
  const [activeSegmento, setActiveSegmento] = useState('todos'); // filtra por segmento
  const [currentPage,    setCurrentPage]    = useState(1);
  const PAGE_SIZE = 10;

  // Recientes (localStorage)
  const [recientes, setRecientes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_RECIENTES) || '[]'); }
    catch { return []; }
  });

  // Modal states
  const [modalNuevo,   setModalNuevo]   = useState(false);
  const [modalElim,    setModalElim]    = useState({ open: false, id: null, nombre: '' });
  const [editingItem,  setEditingItem]  = useState(null); // item que se está editando inline

  // ─── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function cargarDatos() {
      setLoading(true);
      try {
        const [glosData, dominiosData, casosData, relacionesData] = await Promise.all([
          getTerminosAll(),
          getDominios(),
          getCasosUso(),
          getRelacionesTerminoCasoUso(),
        ]);

        if (cancelled) return;

        setGlosario(glosData);

        // Mapa dominios
        const mapDomIdNombre = new Map();
        dominiosData.forEach((d) => {
          const nombre = (d.descripcion_dominio || '').trim();
          if (nombre) mapDomIdNombre.set(nombre, d.id_dominio);
        });
        setDominiosMapa(mapDomIdNombre);

        // Diccionario casos de uso + mapa caso→dominio
        const dicCU  = {};
        const mapaCUD = {};
        casosData.forEach((item) => {
          const idCaso   = item.id_caso_uso;
          const nombre   = (item.descripcion_caso_uso || '').trim();
          if (idCaso != null && nombre) {
            dicCU[idCaso.toString()] = nombre;
            if (item.id_dominio) {
              // buscar nombre del dominio por id
              const nomDom = [...mapDomIdNombre.keys()].find(
                (k) => mapDomIdNombre.get(k) === item.id_dominio
              );
              if (nomDom) mapaCUD[idCaso.toString()] = nomDom;
            }
          }
        });
        setDicCasosUso(dicCU);
        setMapaCUDominio(mapaCUD);

        // Mapa termino → [casosUsoIds]
        const mapaTCU = new Map();
        relacionesData.forEach((rel) => {
          const idTermino = String(rel.cod_terminos || '').trim();
          const idCasoUso = String(rel.id_caso_uso || '').trim();
          if (!mapaTCU.has(idTermino)) mapaTCU.set(idTermino, []);
          mapaTCU.get(idTermino).push(idCasoUso);
        });
        setMapaTermCU(mapaTCU);

        // Diccionario cross-links
        dictRef.current = buildDictionary(glosData.todos);

      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    cargarDatos();
    return () => { cancelled = true; };
  }, []);

  // ─── Filtrado y segmentación ─────────────────────────────────────────────────
  const filtered = useCallback(() => {
    let base = glosario.todos;

    // 1. Segmento
    if (activeSegmento && activeSegmento !== 'todos') {
      if (activeSegmento === 'termino')   base = glosario.terminos;
      else if (activeSegmento === 'atributo') base = glosario.atributos;
      else if (activeSegmento === 'Golden Record') base = glosario.golden;
      else if (activeSegmento === '(CDE) Elemento clave de datos') base = glosario.elemento_clave;
      else if (activeSegmento === '(AR) Atributo de Referencia')  base = glosario.atributo_referencia;
      else if (glosario[activeSegmento])  base = glosario[activeSegmento];
    }

    // 2. Dominio activo
    if (activeDominio) {
      base = base.filter((item) => {
        const doms = (item.dominios || '').split(';').map((d) => d.trim());
        return doms.includes(activeDominio);
      });
    }

    // 3. Búsqueda texto
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(
        (item) =>
          (item.nombre || '').toLowerCase().includes(q) ||
          (item.descripcion || '').toLowerCase().includes(q)
      );
    }

    return sortGlosario(base);
  }, [glosario, activeDominio, activeSegmento, searchQuery]);

  // ─── Paginación ──────────────────────────────────────────────────────────────
  const allFiltered  = filtered();
  const totalPages   = Math.max(1, Math.ceil(allFiltered.length / PAGE_SIZE));
  const paginated    = allFiltered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset página al cambiar filtros
  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeDominio, activeSegmento]);

  // ─── Recientes ───────────────────────────────────────────────────────────────
  const registrarReciente = useCallback((item) => {
    setRecientes((prev) => {
      const sinDuplicado = prev.filter((r) => r.id !== item.id);
      const nuevo = [{ id: item.id, nombre: item.nombre, tipo: item.tipo, fecha: new Date().toLocaleDateString('es-EC') }, ...sinDuplicado].slice(0, 10);
      localStorage.setItem(STORAGE_KEY_RECIENTES, JSON.stringify(nuevo));
      return nuevo;
    });
  }, []);

  // ─── Cross-link click ────────────────────────────────────────────────────────
  const handleCrossLink = useCallback((termino) => {
    setSearchQuery(termino);
    setActiveDominio(null);
    setActiveSegmento('todos');
    setCurrentPage(1);
  }, []);

  // ─── Limpiar filtros ─────────────────────────────────────────────────────────
  const limpiarFiltros = useCallback(() => {
    setSearchQuery('');
    setActiveDominio(null);
    setActiveSegmento('todos');
    setCurrentPage(1);
  }, []);

  // ─── Toggle sidebars ─────────────────────────────────────────────────────────
  const toggleDominios  = useCallback(() => setShowDominios((v) => !v),  []);
  const toggleRecientes = useCallback(() => setShowRecientes((v) => !v), []);

  // ─── Selección de dominio desde sidebar ──────────────────────────────────────
  const seleccionarDominio = useCallback((nombre) => {
    setActiveDominio((prev) => (prev === nombre ? null : nombre));
    setCurrentPage(1);
  }, []);

  return {
    // Estado de carga
    loading, error,

    // Datos
    glosario, dominiosMapa, dicCasosUso, mapaCUDominio, mapaTermCU,

    // Diccionario cross-links
    dictRef,

    // Filtros/Búsqueda
    searchQuery, setSearchQuery,
    activeDominio, seleccionarDominio,
    activeSegmento, setActiveSegmento,
    limpiarFiltros,

    // Vista
    viewMode, setViewMode,

    // Resultados filtrados
    allFiltered,
    paginated,
    totalPages, currentPage, setCurrentPage, PAGE_SIZE,

    // Sidebars
    showDominios, toggleDominios,
    showRecientes, toggleRecientes,

    // Recientes
    recientes, registrarReciente,

    // Modales
    modalNuevo,  setModalNuevo,
    modalElim,   setModalElim,
    editingItem, setEditingItem,

    // Helpers
    handleCrossLink,
  };
}
