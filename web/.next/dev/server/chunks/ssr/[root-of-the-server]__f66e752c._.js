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
"[project]/lib/category-display.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ABOUTME: Category display name overrides for visual presentation
// ABOUTME: Maps database category names to user-facing display names
/**
 * Override certain category names for display purposes
 * without modifying the database
 */ __turbopack_context__.s([
    "getCategoryDisplayName",
    ()=>getCategoryDisplayName
]);
function getCategoryDisplayName(categoryName) {
    const overrides = {
        'Ambiente y Liderazgo Verde': 'Ambiente'
    };
    return overrides[categoryName] || categoryName;
}
}),
"[project]/components/Accordion.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Accordion",
    ()=>Accordion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Accordion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Accordion() from the server but Accordion is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/Accordion.tsx <module evaluation>", "Accordion");
}),
"[project]/components/Accordion.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Accordion",
    ()=>Accordion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Accordion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Accordion() from the server but Accordion is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/Accordion.tsx", "Accordion");
}),
"[project]/components/Accordion.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Accordion$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/Accordion.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Accordion$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/Accordion.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Accordion$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/partido/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ABOUTME: Party detail page showing complete platform with TOC and PDF link
// ABOUTME: Displays all positions organized by category with quick navigation
__turbopack_context__.s([
    "default",
    ()=>PartyDetailPage,
    "generateMetadata",
    ()=>generateMetadata,
    "generateStaticParams",
    ()=>generateStaticParams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/party-colors.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$category$2d$display$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/category-display.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Accordion$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Accordion.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
async function generateStaticParams() {
    const parties = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllParties"])();
    return parties.map((party)=>({
            slug: party.abbreviation.toLowerCase()
        }));
}
async function generateMetadata({ params }) {
    const { slug } = await params;
    const party = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPartyWithPositions"])(slug);
    if (!party) {
        return {
            title: 'Partido no encontrado'
        };
    }
    return {
        title: `${party.name} (${party.abbreviation}) - Plataforma 2026`,
        description: `Plataforma política completa del ${party.name} para las elecciones de Costa Rica 2026`
    };
}
async function PartyDetailPage({ params }) {
    const { slug } = await params;
    const party = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPartyWithPositions"])(slug);
    if (!party) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const colors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPartyColors"])(party.abbreviation);
    const document = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPartyDocument"])(party.id);
    const extractedText = document ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocumentText"])(document.id) : null;
    // Prepare accordion items
    const accordionItems = party.positions.map((pos)=>{
        const proposals = pos.key_proposals ? JSON.parse(pos.key_proposals) : [];
        return {
            id: pos.category.category_key,
            title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$category$2d$display$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategoryDisplayName"])(pos.category.name),
            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-medium text-gray-400 mb-2",
                                children: "Resumen"
                            }, void 0, false, {
                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-300 leading-relaxed",
                                children: pos.summary
                            }, void 0, false, {
                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/partido/[slug]/page.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this),
                    proposals.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-medium text-gray-400 mb-2",
                                children: "Propuestas Clave"
                            }, void 0, false, {
                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                lineNumber: 66,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-2",
                                children: proposals.map((proposal, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex gap-3 text-gray-300",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-blue-400 font-bold",
                                                children: "•"
                                            }, void 0, false, {
                                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                                lineNumber: 70,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: proposal
                                            }, void 0, false, {
                                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                                lineNumber: 71,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/app/partido/[slug]/page.tsx",
                                        lineNumber: 69,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                lineNumber: 67,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/partido/[slug]/page.tsx",
                        lineNumber: 65,
                        columnNumber: 13
                    }, this),
                    pos.ideology_position && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-medium text-gray-400 mb-2",
                                children: "Posición Ideológica"
                            }, void 0, false, {
                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                lineNumber: 81,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-300",
                                children: pos.ideology_position
                            }, void 0, false, {
                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                lineNumber: 82,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/partido/[slug]/page.tsx",
                        lineNumber: 80,
                        columnNumber: 13
                    }, this),
                    pos.budget_mentioned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-medium text-gray-400 mb-2",
                                children: "Presupuesto Mencionado"
                            }, void 0, false, {
                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                lineNumber: 89,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-300",
                                children: pos.budget_mentioned
                            }, void 0, false, {
                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                lineNumber: 90,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/partido/[slug]/page.tsx",
                        lineNumber: 88,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/partido/[slug]/page.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this)
        };
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-7xl mx-auto space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                href: "/",
                className: "inline-flex items-center gap-2 text-gray-400 hover:text-white transition",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "h-5 w-5",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M15 19l-7-7 7-7"
                        }, void 0, false, {
                            fileName: "[project]/app/partido/[slug]/page.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/partido/[slug]/page.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    "Volver a todos los partidos"
                ]
            }, void 0, true, {
                fileName: "[project]/app/partido/[slug]/page.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-gray-800 bg-gray-900 p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex h-32 w-32 items-center justify-center rounded-full ${colors.bg} shrink-0 font-bold ${colors.text} text-4xl`,
                            children: party.abbreviation
                        }, void 0, false, {
                            fileName: "[project]/app/partido/[slug]/page.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold text-white",
                                    children: party.name
                                }, void 0, false, {
                                    fileName: "[project]/app/partido/[slug]/page.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-2 text-lg text-gray-400",
                                    children: party.abbreviation
                                }, void 0, false, {
                                    fileName: "[project]/app/partido/[slug]/page.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 flex flex-wrap gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/comparar?parties=${party.abbreviation.toLowerCase()}`,
                                            className: "rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700",
                                            children: "Comparar con otros"
                                        }, void 0, false, {
                                            fileName: "[project]/app/partido/[slug]/page.tsx",
                                            lineNumber: 126,
                                            columnNumber: 15
                                        }, this),
                                        document && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: `/../data/partidos/${party.folder_name}/${party.abbreviation}.pdf`,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "rounded-lg border border-gray-700 bg-gray-800 px-6 py-2 font-medium text-white transition hover:bg-gray-700",
                                            children: "📄 Ver PDF Original"
                                        }, void 0, false, {
                                            fileName: "[project]/app/partido/[slug]/page.tsx",
                                            lineNumber: 133,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/partido/[slug]/page.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/partido/[slug]/page.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/partido/[slug]/page.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/partido/[slug]/page.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-8 lg:grid-cols-[250px_1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:sticky lg:top-8 lg:self-start",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-gray-800 bg-gray-900 p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-white mb-3",
                                    children: "Navegación Rápida"
                                }, void 0, false, {
                                    fileName: "[project]/app/partido/[slug]/page.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                    className: "space-y-1",
                                    children: [
                                        party.positions.map((pos)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `#${pos.category.category_key}`,
                                                className: "block rounded px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$category$2d$display$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategoryDisplayName"])(pos.category.name)
                                            }, pos.category.category_key, false, {
                                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                                lineNumber: 154,
                                                columnNumber: 17
                                            }, this)),
                                        extractedText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "#texto-completo",
                                            className: "block rounded px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white",
                                            children: "Texto Completo"
                                        }, void 0, false, {
                                            fileName: "[project]/app/partido/[slug]/page.tsx",
                                            lineNumber: 163,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/partido/[slug]/page.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/partido/[slug]/page.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/partido/[slug]/page.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "plataforma",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-white mb-4",
                                        children: "Plataforma Política"
                                    }, void 0, false, {
                                        fileName: "[project]/app/partido/[slug]/page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 13
                                    }, this),
                                    party.positions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: party.positions.map((pos)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                id: pos.category.category_key,
                                                className: "scroll-mt-8",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Accordion$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Accordion"], {
                                                    items: [
                                                        accordionItems.find((item)=>item.id === pos.category.category_key)
                                                    ]
                                                }, void 0, false, {
                                                    fileName: "[project]/app/partido/[slug]/page.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 21
                                                }, this)
                                            }, pos.category.category_key, false, {
                                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                                lineNumber: 182,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/partido/[slug]/page.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl border border-gray-800 bg-gray-900 p-12 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-400",
                                            children: "No hay información de plataforma disponible para este partido."
                                        }, void 0, false, {
                                            fileName: "[project]/app/partido/[slug]/page.tsx",
                                            lineNumber: 193,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/partido/[slug]/page.tsx",
                                        lineNumber: 192,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            extractedText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "texto-completo",
                                className: "scroll-mt-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-white mb-4",
                                        children: "Texto Completo Extraído"
                                    }, void 0, false, {
                                        fileName: "[project]/app/partido/[slug]/page.tsx",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl border border-gray-800 bg-gray-900 p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-400 mb-4",
                                                children: "Este es el texto completo extraído del documento PDF oficial del partido."
                                            }, void 0, false, {
                                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                                lineNumber: 205,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "prose prose-invert max-w-none",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                    className: "whitespace-pre-wrap text-sm text-gray-300 leading-relaxed",
                                                    children: extractedText
                                                }, void 0, false, {
                                                    fileName: "[project]/app/partido/[slug]/page.tsx",
                                                    lineNumber: 209,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/partido/[slug]/page.tsx",
                                        lineNumber: 204,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/partido/[slug]/page.tsx",
                                lineNumber: 202,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/partido/[slug]/page.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/partido/[slug]/page.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/partido/[slug]/page.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/partido/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/partido/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f66e752c._.js.map