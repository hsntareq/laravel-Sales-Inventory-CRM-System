const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Dashboard.jsx', 'utf8');

// 1. Remove the global search from the topbar (around line 303)
content = content.replace(
    /<div className="nexus-search">[\s\S]*?<\/div>/,
    `<div className="nexus-search"></div>`
);

const searchInputStr = (placeholder) => `\
                                    <div className="relative flex items-center h-[38px]">\
                                        <Search className="absolute left-3 text-gray-400" size={16} />\
                                        <input type="text" placeholder="${placeholder}" className="nexus-input pl-9 h-full w-64 m-0" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />\
                                    </div>`;

// 2. Insert into Products
content = content.replace(
    /(<div className="nexus-page-title">\s*<h1>Products<\/h1>[\s\S]*?<\/div>)\s*<div className="flex gap-3">/,
    `$1\n                                <div className="flex gap-3 items-center">\n${searchInputStr('Search products...')}`
);

// 3. Insert into Sales
content = content.replace(
    /(<div className="nexus-page-title">\s*<h1>Sales<\/h1>[\s\S]*?<\/div>)\s*<button className="nexus-btn primary" onClick=\{\(\) => setIsPosOpen\(true\)\}>/,
    `$1\n                                <div className="flex gap-3 items-center">\n${searchInputStr('Search sales...')}\n                                    <button className="nexus-btn primary" onClick={() => setIsPosOpen(true)}>`
).replace(
    // Since we wrapped the button in a div, we need to close it
    /<\/button>\s*<\/div>\s*<div className="nexus-table-wrapper">/,
    `</button>\n                                </div>\n                            </div>\n\n                            <div className="nexus-table-wrapper">`
);
// wait, the closing of nexus-page-header is already there. So `<button ...>...</button>` is followed by `</div>`. We just need to change the button to `<div className="flex gap-3 items-center">...<button>...</button></div>`.
content = content.replace(
    /(<div className="nexus-page-title">\s*<h1>Sales<\/h1>[\s\S]*?<\/div>)\s*<button className="nexus-btn primary" onClick=\{\(\) => setIsPosOpen\(true\)\}>[\s\S]*?<\/button>/,
    `$1\n                                <div className="flex gap-3 items-center">\n${searchInputStr('Search sales...')}\n                                    <button className="nexus-btn primary" onClick={() => setIsPosOpen(true)}>\n                                        <Plus size={18} /> New sale\n                                    </button>\n                                </div>`
);

// 4. Insert into Customers
content = content.replace(
    /(<div className="nexus-page-title">\s*<h1>Customers<\/h1>[\s\S]*?<\/div>)\s*<div className="flex gap-3">/,
    `$1\n                                <div className="flex gap-3 items-center">\n${searchInputStr('Search customers...')}`
);

// 5. Insert into Lost Customers
content = content.replace(
    /(<div className="nexus-page-title">\s*<h1>Lost Customers<\/h1>[\s\S]*?<\/div>)\s*<div className="flex gap-3">/,
    `$1\n                                <div className="flex gap-3 items-center">\n${searchInputStr('Search lost customers...')}`
);

// 6. Insert into Employees
content = content.replace(
    /(<div className="nexus-page-title">\s*<h1>Employees<\/h1>[\s\S]*?<\/div>)\s*<div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">/,
    `$1\n                                <div className="flex gap-3 items-center">\n${searchInputStr('Search employees...')}\n                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">`
).replace(
    /(<button className=\{.*?\} onClick=\{\(\) => setEmployeeView\('grid'\)\}\><Grid size=\{18\}\/><\/button>\s*<\/div>)\s*<\/div>/,
    `$1\n                                </div>\n                            </div>`
);

// 7. Insert into Branches
content = content.replace(
    /(<div className="nexus-page-title">\s*<h1>Branches<\/h1>[\s\S]*?<\/div>)\s*<\/div>/,
    `$1\n                                <div className="flex gap-3 items-center">\n${searchInputStr('Search branches...')}\n                                </div>\n                            </div>`
);

fs.writeFileSync('resources/js/Pages/Dashboard.jsx', content);
console.log("Refactored search bars.");
