const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Dashboard.jsx', 'utf8');

// 1. Add NexusLayout import
content = content.replace(
    /import \{ Head, usePage, router, Link \} from '@inertiajs\/react';/,
    "import { Head, usePage, router, Link } from '@inertiajs/react';\nimport NexusLayout from '@/Layouts/NexusLayout';"
);

// 2. Replace the start of the layout
// We want to replace everything from `<div className="nexus-layout">` down to `<main className="nexus-main">`
const startPattern = /<div className="nexus-layout">[\s\S]*?<main className="nexus-main">/;
content = content.replace(
    startPattern,
    `<NexusLayout activeTab={activeTab} onTabChange={setActiveTab}>`
);

// 3. Remove `</main>`
content = content.replace(/\s*<\/main>/, '');

// 4. Replace the last `</div>` before `);` with `</NexusLayout>`
content = content.replace(
    /<\/div>\s*\)\;\s*\}\s*$/,
    `</NexusLayout>\n    );\n}\n`
);

fs.writeFileSync('resources/js/Pages/Dashboard.jsx', content);
console.log("Dashboard.jsx refactored successfully.");
