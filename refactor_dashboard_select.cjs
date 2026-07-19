const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Dashboard.jsx', 'utf8');
content = content.replace(/<Select /g, '<Select menuPosition="fixed" menuPortalTarget={document.body} ');
fs.writeFileSync('resources/js/Pages/Dashboard.jsx', content);
console.log("Fixed Select components.");
