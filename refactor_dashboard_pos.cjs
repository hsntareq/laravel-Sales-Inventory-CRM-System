const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Dashboard.jsx', 'utf8');

content = content.replace(
    /<div className="nexus-modal min-w-\[900px\]">/,
    `<div className="nexus-modal !max-w-none !max-h-none !w-screen !h-screen !rounded-none !border-0 !m-0 min-w-full">`
);

content = content.replace(
    /<div className="nexus-modal-body bg-slate-50 p-0 flex h-\[600px\]">/,
    `<div className="nexus-modal-body bg-slate-50 p-0 flex flex-1 overflow-hidden h-full">`
);

content = content.replace(
    /<Select menuPosition="fixed" menuPortalTarget=\{document\.body\} /g,
    `<Select menuPosition="fixed" menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} `
);

fs.writeFileSync('resources/js/Pages/Dashboard.jsx', content);
console.log("POS and dropdowns updated.");
