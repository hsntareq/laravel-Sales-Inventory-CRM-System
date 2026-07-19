const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Dashboard.jsx', 'utf8');
content = content.replace(/className="nexus-input pl-9/g, 'className="nexus-input !pl-9');
fs.writeFileSync('resources/js/Pages/Dashboard.jsx', content);
console.log("Fixed overlapping icon.");
