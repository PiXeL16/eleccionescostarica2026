(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/category-display.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/party-images.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/party-colors.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/PartySelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ABOUTME: Party selector component for comparison page
// ABOUTME: Client-side component allowing selection of up to 3 parties
__turbopack_context__.s([
    "PartySelector",
    ()=>PartySelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/party-colors.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$images$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/party-images.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function PartySelector({ parties }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const selectedSlugs = searchParams.get('parties')?.split(',').filter((s)=>s.trim().length > 0) || [];
    const handleToggleParty = (slug)=>{
        let newSlugs;
        if (selectedSlugs.includes(slug)) {
            // Remove party
            newSlugs = selectedSlugs.filter((s)=>s !== slug);
        } else {
            // Add party (max 3)
            if (selectedSlugs.length >= 3) {
                return; // Don't allow more than 3
            }
            newSlugs = [
                ...selectedSlugs,
                slug
            ];
        }
        // Update URL
        const params = new URLSearchParams();
        if (newSlugs.length > 0) {
            params.set('parties', newSlugs.join(','));
        }
        router.push(`/comparar?${params.toString()}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-white",
                        children: [
                            "Selecciona hasta 3 partidos (",
                            selectedSlugs.length,
                            "/3)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PartySelector.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    selectedSlugs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/comparar'),
                        className: "text-sm text-red-400 hover:text-red-300 transition",
                        children: "Limpiar selección"
                    }, void 0, false, {
                        fileName: "[project]/components/PartySelector.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PartySelector.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
                children: parties.map((party)=>{
                    const slug = party.abbreviation.toLowerCase();
                    const isSelected = selectedSlugs.includes(slug);
                    const colors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPartyColors"])(party.abbreviation);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleToggleParty(slug),
                        disabled: !isSelected && selectedSlugs.length >= 3,
                        className: `rounded-lg border p-4 text-left transition ${isSelected ? 'border-blue-500 bg-blue-950/50' : 'border-gray-800 bg-gray-900 hover:border-gray-700'} ${!isSelected && selectedSlugs.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-20 aspect-[5/2] shrink-0 relative rounded overflow-hidden bg-gray-800",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$images$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPartyFlagPath"])(party.abbreviation),
                                        alt: `Bandera de ${party.name}`,
                                        fill: true,
                                        className: "object-contain",
                                        unoptimized: true
                                    }, void 0, false, {
                                        fileName: "[project]/components/PartySelector.tsx",
                                        lineNumber: 84,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/PartySelector.tsx",
                                    lineNumber: 83,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-white truncate",
                                            children: party.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/PartySelector.tsx",
                                            lineNumber: 93,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500",
                                            children: party.abbreviation
                                        }, void 0, false, {
                                            fileName: "[project]/components/PartySelector.tsx",
                                            lineNumber: 94,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/PartySelector.tsx",
                                    lineNumber: 92,
                                    columnNumber: 17
                                }, this),
                                isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5 shrink-0 text-blue-400",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PartySelector.tsx",
                                        lineNumber: 98,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/PartySelector.tsx",
                                    lineNumber: 97,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/PartySelector.tsx",
                            lineNumber: 82,
                            columnNumber: 15
                        }, this)
                    }, party.id, false, {
                        fileName: "[project]/components/PartySelector.tsx",
                        lineNumber: 72,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/PartySelector.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/PartySelector.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(PartySelector, "A57ZQKsSKoH4xi482IWIv7kTTfs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = PartySelector;
var _c;
__turbopack_context__.k.register(_c, "PartySelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CategoryFilter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ABOUTME: Category filter dropdown for comparison page
// ABOUTME: Client-side component for filtering comparison by category
__turbopack_context__.s([
    "CategoryFilter",
    ()=>CategoryFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$category$2d$display$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/category-display.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function CategoryFilter({ categories }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const selectedCategory = searchParams.get('category') || 'all';
    const handleChange = (categoryKey)=>{
        const params = new URLSearchParams(searchParams);
        if (categoryKey === 'all') {
            params.delete('category');
        } else {
            params.set('category', categoryKey);
        }
        router.push(`/comparar?${params.toString()}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: "category-filter",
                className: "text-sm font-medium text-gray-400",
                children: "Categoría:"
            }, void 0, false, {
                fileName: "[project]/components/CategoryFilter.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                id: "category-filter",
                value: selectedCategory,
                onChange: (e)=>handleChange(e.target.value),
                className: "rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "all",
                        children: "Todas las categorías"
                    }, void 0, false, {
                        fileName: "[project]/components/CategoryFilter.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: cat.category_key,
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$category$2d$display$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCategoryDisplayName"])(cat.name)
                        }, cat.id, false, {
                            fileName: "[project]/components/CategoryFilter.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/CategoryFilter.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CategoryFilter.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(CategoryFilter, "A57ZQKsSKoH4xi482IWIv7kTTfs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = CategoryFilter;
var _c;
__turbopack_context__.k.register(_c, "CategoryFilter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ComparisonView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ABOUTME: Client-side comparison view component
// ABOUTME: Handles URL search params and displays party comparison
__turbopack_context__.s([
    "ComparisonView",
    ()=>ComparisonView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$category$2d$display$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/category-display.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$images$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/party-images.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PartySelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PartySelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CategoryFilter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CategoryFilter.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function ComparisonView({ allParties, allCategories, comparisonData }) {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const partiesParam = searchParams.get('parties');
    const categoryParam = searchParams.get('category');
    // Parse selected parties from URL
    const selectedSlugs = partiesParam?.split(',').filter((s)=>s.trim().length > 0).map((s)=>s.toUpperCase()) || [];
    // Filter comparison data to only show selected parties
    const comparison = comparisonData && selectedSlugs.length > 0 ? {
        ...comparisonData,
        parties: comparisonData.parties.filter((p)=>selectedSlugs.includes(p.abbreviation))
    } : null;
    // Filter categories if specific category selected
    const displayCategories = categoryParam ? allCategories.filter((c)=>c.category_key === categoryParam) : allCategories;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "h-5 w-5",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M15 19l-7-7 7-7"
                                }, void 0, false, {
                                    fileName: "[project]/components/ComparisonView.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ComparisonView.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            "Volver a inicio"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ComparisonView.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-white",
                        children: "Comparar Partidos"
                    }, void 0, false, {
                        fileName: "[project]/components/ComparisonView.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-gray-400",
                        children: "Selecciona hasta 3 partidos para comparar sus plataformas lado a lado"
                    }, void 0, false, {
                        fileName: "[project]/components/ComparisonView.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ComparisonView.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-gray-800 bg-gray-900 p-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PartySelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PartySelector"], {
                    parties: allParties
                }, void 0, false, {
                    fileName: "[project]/components/ComparisonView.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ComparisonView.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            comparison && comparison.parties.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 pb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-white",
                                        children: "Comparación"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ComparisonView.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CategoryFilter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CategoryFilter"], {
                                        categories: allCategories
                                    }, void 0, false, {
                                        fileName: "[project]/components/ComparisonView.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ComparisonView.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-3",
                                style: {
                                    gridTemplateColumns: `repeat(${comparison.parties.length}, minmax(0, 1fr))`
                                },
                                children: comparison.parties.map((party)=>{
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-20 aspect-[5/2] shrink-0 relative rounded overflow-hidden bg-gray-800",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$party$2d$images$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPartyFlagPath"])(party.abbreviation),
                                                    alt: `Bandera de ${party.name}`,
                                                    fill: true,
                                                    className: "object-contain",
                                                    unoptimized: true
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ComparisonView.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ComparisonView.tsx",
                                                lineNumber: 104,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0 flex-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-white truncate",
                                                    children: party.name
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ComparisonView.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ComparisonView.tsx",
                                                lineNumber: 113,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, party.id, true, {
                                        fileName: "[project]/components/ComparisonView.tsx",
                                        lineNumber: 103,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/ComparisonView.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ComparisonView.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: displayCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-gray-800 bg-gray-900 p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-white mb-4",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$category$2d$display$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCategoryDisplayName"])(category.name)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ComparisonView.tsx",
                                        lineNumber: 129,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-6",
                                        style: {
                                            gridTemplateColumns: `repeat(${comparison.parties.length}, minmax(0, 1fr))`
                                        },
                                        children: comparison.parties.map((party)=>{
                                            const position = comparison.positions.get(party.abbreviation)?.get(category.category_key);
                                            const proposals = position?.key_proposals ? JSON.parse(position.key_proposals) : [];
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: position ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-300 leading-relaxed",
                                                                children: position.summary
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ComparisonView.tsx",
                                                                lineNumber: 151,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ComparisonView.tsx",
                                                            lineNumber: 150,
                                                            columnNumber: 29
                                                        }, this),
                                                        proposals.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-xs font-medium text-gray-500 mb-2 uppercase",
                                                                    children: "Propuestas Clave"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ComparisonView.tsx",
                                                                    lineNumber: 159,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                    className: "space-y-1",
                                                                    children: [
                                                                        proposals.slice(0, 3).map((proposal, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                className: "flex gap-2 text-sm text-gray-400",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-blue-400",
                                                                                        children: "•"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/ComparisonView.tsx",
                                                                                        lineNumber: 165,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: proposal
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/ComparisonView.tsx",
                                                                                        lineNumber: 166,
                                                                                        columnNumber: 39
                                                                                    }, this)
                                                                                ]
                                                                            }, idx, true, {
                                                                                fileName: "[project]/components/ComparisonView.tsx",
                                                                                lineNumber: 164,
                                                                                columnNumber: 37
                                                                            }, this)),
                                                                        proposals.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                            className: "text-xs text-gray-500 pl-4",
                                                                            children: [
                                                                                "+",
                                                                                proposals.length - 3,
                                                                                " más..."
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/ComparisonView.tsx",
                                                                            lineNumber: 170,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ComparisonView.tsx",
                                                                    lineNumber: 162,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ComparisonView.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-500 italic",
                                                    children: "No hay información disponible para esta categoría"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ComparisonView.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 27
                                                }, this)
                                            }, party.id, false, {
                                                fileName: "[project]/components/ComparisonView.tsx",
                                                lineNumber: 146,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/components/ComparisonView.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, category.id, true, {
                                fileName: "[project]/components/ComparisonView.tsx",
                                lineNumber: 125,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ComparisonView.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ComparisonView.tsx",
                lineNumber: 86,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-gray-800 bg-gray-900 p-12 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400",
                    children: "Selecciona al menos un partido para comenzar la comparación"
                }, void 0, false, {
                    fileName: "[project]/components/ComparisonView.tsx",
                    lineNumber: 193,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ComparisonView.tsx",
                lineNumber: 192,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ComparisonView.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(ComparisonView, "a+DZx9DY26Zf8FVy1bxe3vp9l1w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ComparisonView;
var _c;
__turbopack_context__.k.register(_c, "ComparisonView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1efd1323._.js.map