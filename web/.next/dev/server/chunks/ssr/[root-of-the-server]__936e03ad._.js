module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/not-found.tsx [app-rsc] (ecmascript)"));
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
"[project]/components/ComparisonView.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "ComparisonView",
    ()=>ComparisonView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ComparisonView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ComparisonView() from the server but ComparisonView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ComparisonView.tsx <module evaluation>", "ComparisonView");
}),
"[project]/components/ComparisonView.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "ComparisonView",
    ()=>ComparisonView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ComparisonView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ComparisonView() from the server but ComparisonView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ComparisonView.tsx", "ComparisonView");
}),
"[project]/components/ComparisonView.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ComparisonView$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/ComparisonView.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ComparisonView$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/ComparisonView.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ComparisonView$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/comparar/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ABOUTME: Comparison page for side-by-side party platform comparison
// ABOUTME: Server component that loads all data and passes to client component
__turbopack_context__.s([
    "default",
    ()=>ComparePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ComparisonView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ComparisonView.tsx [app-rsc] (ecmascript)");
;
;
;
function ComparePage() {
    const allParties = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllParties"])();
    const allCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllCategories"])();
    // Pre-fetch comparison data for all parties (will be filtered client-side)
    const allSlugs = allParties.map((p)=>p.abbreviation);
    const comparisonData = allSlugs.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["compareParties"])(allSlugs) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ComparisonView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ComparisonView"], {
        allParties: allParties,
        allCategories: allCategories,
        comparisonData: comparisonData
    }, void 0, false, {
        fileName: "[project]/app/comparar/page.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/comparar/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/comparar/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__936e03ad._.js.map