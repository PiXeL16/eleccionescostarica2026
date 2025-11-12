module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("better-sqlite3", () => require("better-sqlite3"));

module.exports = mod;
}),
"[project]/lib/database.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ABOUTME: Database connection layer for SQLite using better-sqlite3
// ABOUTME: Provides read-only access to political party data
__turbopack_context__.s([
    "compareParties",
    ()=>compareParties,
    "getAllCategories",
    ()=>getAllCategories,
    "getAllParties",
    ()=>getAllParties,
    "getCategoryByKey",
    ()=>getCategoryByKey,
    "getDocumentText",
    ()=>getDocumentText,
    "getPartyBySlug",
    ()=>getPartyBySlug,
    "getPartyDocument",
    ()=>getPartyDocument,
    "getPartyPositions",
    ()=>getPartyPositions,
    "getPartyWithPositions",
    ()=>getPartyWithPositions
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
// Database path (shared with pipeline)
const DB_PATH = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(process.cwd(), '..', 'data', 'database.db');
// Database singleton
let db = null;
function getDatabase() {
    if (!db) {
        db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](DB_PATH, {
            readonly: true,
            fileMustExist: true
        });
    }
    return db;
}
function getAllParties() {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM parties ORDER BY name');
    return stmt.all();
}
function getPartyBySlug(slug) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM parties WHERE abbreviation = ?');
    return stmt.get(slug.toUpperCase()) || null;
}
function getAllCategories() {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM categories WHERE active = 1 ORDER BY display_order');
    return stmt.all();
}
function getCategoryByKey(key) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM categories WHERE category_key = ? AND active = 1');
    return stmt.get(key) || null;
}
function getPartyPositions(partyId) {
    const db = getDatabase();
    const stmt = db.prepare(`
    SELECT
      pp.*,
      c.id as category_id,
      c.category_key,
      c.name as category_name,
      c.description as category_description,
      c.display_order
    FROM party_positions pp
    JOIN categories c ON pp.category_id = c.id
    WHERE pp.party_id = ? AND c.active = 1
    ORDER BY c.display_order
  `);
    const rows = stmt.all(partyId);
    return rows.map((row)=>({
            id: row.id,
            party_id: row.party_id,
            category_id: row.category_id,
            document_id: row.document_id,
            summary: row.summary,
            key_proposals: row.key_proposals,
            ideology_position: row.ideology_position,
            budget_mentioned: row.budget_mentioned,
            confidence_score: row.confidence_score,
            tokens_used: row.tokens_used,
            cost_usd: row.cost_usd,
            created_at: row.created_at,
            category: {
                id: row.category_id,
                category_key: row.category_key,
                name: row.category_name,
                description: row.category_description,
                prompt_context: null,
                display_order: row.display_order,
                active: 1,
                created_at: ''
            }
        }));
}
function getPartyDocument(partyId) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM documents WHERE party_id = ?');
    return stmt.get(partyId);
}
function getDocumentText(documentId) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT raw_text FROM document_text WHERE document_id = ? ORDER BY page_number');
    const results = stmt.all(documentId);
    if (results.length === 0) return null;
    return results.map((r)=>r.raw_text).join('\n\n');
}
function getPartyWithPositions(slug) {
    const party = getPartyBySlug(slug);
    if (!party) return null;
    const positions = getPartyPositions(party.id);
    return {
        ...party,
        positions
    };
}
function compareParties(slugs) {
    const parties = slugs.map((slug)=>getPartyBySlug(slug)).filter((p)=>p !== null);
    const categories = getAllCategories();
    // Build a map of party slug -> category key -> position
    const positions = new Map();
    for (const party of parties){
        const partyPositions = getPartyPositions(party.id);
        const positionMap = new Map();
        for (const pos of partyPositions){
            positionMap.set(pos.category.category_key, pos);
        }
        positions.set(party.abbreviation, positionMap);
    }
    return {
        parties,
        categories,
        positions
    };
}
}),
"[project]/lib/party-colors.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ABOUTME: Party color configuration for visual branding
// ABOUTME: Provides color palettes and badge colors for all 20 parties
__turbopack_context__.s([
    "PARTY_COLORS",
    ()=>PARTY_COLORS,
    "getPartyColors",
    ()=>getPartyColors
]);
const PARTY_COLORS = {
    PLN: {
        bg: 'bg-green-600',
        text: 'text-white',
        border: 'border-green-700',
        hover: 'hover:bg-green-700'
    },
    PUSC: {
        bg: 'bg-blue-600',
        text: 'text-white',
        border: 'border-blue-700',
        hover: 'hover:bg-blue-700'
    },
    FA: {
        bg: 'bg-red-600',
        text: 'text-white',
        border: 'border-red-700',
        hover: 'hover:bg-red-700'
    },
    PAC: {
        bg: 'bg-yellow-500',
        text: 'text-black',
        border: 'border-yellow-600',
        hover: 'hover:bg-yellow-600'
    },
    ACRM: {
        bg: 'bg-purple-600',
        text: 'text-white',
        border: 'border-purple-700',
        hover: 'hover:bg-purple-700'
    },
    CAC: {
        bg: 'bg-indigo-600',
        text: 'text-white',
        border: 'border-indigo-700',
        hover: 'hover:bg-indigo-700'
    },
    CDS: {
        bg: 'bg-teal-600',
        text: 'text-white',
        border: 'border-teal-700',
        hover: 'hover:bg-teal-700'
    },
    CR1: {
        bg: 'bg-orange-600',
        text: 'text-white',
        border: 'border-orange-700',
        hover: 'hover:bg-orange-700'
    },
    PA: {
        bg: 'bg-pink-600',
        text: 'text-white',
        border: 'border-pink-700',
        hover: 'hover:bg-pink-700'
    },
    PDLCT: {
        bg: 'bg-rose-600',
        text: 'text-white',
        border: 'border-rose-700',
        hover: 'hover:bg-rose-700'
    },
    PEL: {
        bg: 'bg-cyan-600',
        text: 'text-white',
        border: 'border-cyan-700',
        hover: 'hover:bg-cyan-700'
    },
    PEN: {
        bg: 'bg-amber-600',
        text: 'text-white',
        border: 'border-amber-700',
        hover: 'hover:bg-amber-700'
    },
    PIN: {
        bg: 'bg-lime-600',
        text: 'text-black',
        border: 'border-lime-700',
        hover: 'hover:bg-lime-700'
    },
    PJSC: {
        bg: 'bg-emerald-600',
        text: 'text-white',
        border: 'border-emerald-700',
        hover: 'hover:bg-emerald-700'
    },
    PLP: {
        bg: 'bg-sky-600',
        text: 'text-white',
        border: 'border-sky-700',
        hover: 'hover:bg-sky-700'
    },
    PNG: {
        bg: 'bg-violet-600',
        text: 'text-white',
        border: 'border-violet-700',
        hover: 'hover:bg-violet-700'
    },
    PNR: {
        bg: 'bg-fuchsia-600',
        text: 'text-white',
        border: 'border-fuchsia-700',
        hover: 'hover:bg-fuchsia-700'
    },
    PPSO: {
        bg: 'bg-slate-600',
        text: 'text-white',
        border: 'border-slate-700',
        hover: 'hover:bg-slate-700'
    },
    PSD: {
        bg: 'bg-zinc-600',
        text: 'text-white',
        border: 'border-zinc-700',
        hover: 'hover:bg-zinc-700'
    },
    PUCD: {
        bg: 'bg-neutral-600',
        text: 'text-white',
        border: 'border-neutral-700',
        hover: 'hover:bg-neutral-700'
    },
    UP: {
        bg: 'bg-stone-600',
        text: 'text-white',
        border: 'border-stone-700',
        hover: 'hover:bg-stone-700'
    }
};
function getPartyColors(abbreviation) {
    return PARTY_COLORS[abbreviation] || {
        bg: 'bg-gray-600',
        text: 'text-white',
        border: 'border-gray-700',
        hover: 'hover:bg-gray-700'
    };
}
}),
"[project]/lib/party-images.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ABOUTME: Party image utilities for accessing flag images
// ABOUTME: Provides path to party flag images stored in public folder
/**
 * Get the path to a party's flag image
 * @param abbreviation - Party abbreviation (e.g., "PLN", "PUSC")
 * @returns Path to the flag image
 */ __turbopack_context__.s([
    "getPartyFlagPath",
    ()=>getPartyFlagPath,
    "hasPartyFlag",
    ()=>hasPartyFlag
]);
function getPartyFlagPath(abbreviation) {
    // All flags are .jpg
    return `/party_flags/${abbreviation}.jpg`;
}
function hasPartyFlag(abbreviation) {
    // All 20 parties in our database have flags
    const partiesWithFlags = [
        'ACRM',
        'CAC',
        'CDS',
        'CR1',
        'FA',
        'PA',
        'PDLCT',
        'PEL',
        'PEN',
        'PIN',
        'PJSC',
        'PLN',
        'PLP',
        'PNG',
        'PNR',
        'PPSO',
        'PSD',
        'PUCD',
        'PUSC',
        'UP'
    ];
    return partiesWithFlags.includes(abbreviation);
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ABOUTME: Home page displaying grid of all political parties
// ABOUTME: Shows party cards with logo placeholders and links to details/comparison
__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/party-colors.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/party-images.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
function HomePage() {
    const parties = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllParties"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-white",
                                children: "Partidos Políticos"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 17,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-gray-400",
                                children: "Selecciona un partido para ver su plataforma completa o compara hasta 3 partidos"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 18,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-sm text-gray-500",
                                children: [
                                    "Información extraída de los",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://www.tse.go.cr/2026/planesgobierno.html",
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-blue-400 hover:underline",
                                        children: "planes de gobierno publicados por el TSE"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 23,
                                        columnNumber: 13
                                    }, this),
                                    ". Solo se muestran partidos que han publicado su plan de gobierno."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 21,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/comparar",
                        className: "rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700",
                        children: "Comparar Partidos"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                children: parties.map((party)=>{
                    const colors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPartyColors"])(party.abbreviation);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: `/partido/${party.abbreviation.toLowerCase()}`,
                        className: "group",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-700 hover:shadow-xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-auto w-full aspect-[5/2] relative rounded-lg overflow-hidden max-w-[240px] bg-gray-800",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPartyFlagPath"])(party.abbreviation),
                                        alt: `Bandera de ${party.name}`,
                                        fill: true,
                                        className: "object-contain",
                                        unoptimized: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 55,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold text-white group-hover:text-blue-400",
                                            children: party.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 66,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-gray-500",
                                            children: party.abbreviation
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 69,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 65,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full rounded-lg bg-gray-800 py-2 text-center text-sm font-medium text-white transition group-hover:bg-gray-700",
                                        children: "Ver Plataforma"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 74,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 73,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 52,
                            columnNumber: 15
                        }, this)
                    }, party.id, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 47,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            parties.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-gray-800 bg-gray-900 p-12 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400",
                    children: "No hay partidos políticos disponibles."
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 86,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__17028cfe._.js.map