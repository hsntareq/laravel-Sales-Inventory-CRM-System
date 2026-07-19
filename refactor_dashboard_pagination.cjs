const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Dashboard.jsx', 'utf8');

content = content.replace(
    /(<\/div>\s*)\}\s*<\/>\s*\)\}\s*\{activeTab === 'lost'/,
    `$1    <Pagination total={filteredActiveCustomers.length} page={pageActiveCustomers} setPage={setPageActiveCustomers} />\n                        </>\n                    )}\n\n                    {activeTab === 'lost'`
);

content = content.replace(
    /(<\/div>\s*)\}\s*<\/>\s*\)\}\s*\{activeTab === 'employees'/,
    `$1    <Pagination total={filteredLostCustomers.length} page={pageLostCustomers} setPage={setPageLostCustomers} />\n                        </>\n                    )}\n\n                    {activeTab === 'employees'`
);

content = content.replace(
    /(<\/div>\s*)\}\s*<\/>\s*\)\}\s*\{activeTab === 'branches'/,
    `$1    <Pagination total={filteredEmployees.length} page={pageEmployees} setPage={setPageEmployees} />\n                        </>\n                    )}\n\n                    {activeTab === 'branches'`
);

content = content.replace(
    /(<\/div>\s*)<\/>\s*\)\}\s*\{\/\* Modals \*\/\}/,
    `$1    <Pagination total={filteredBranches.length} page={pageBranches} setPage={setPageBranches} />\n                        </>\n                    )}\n\n            {/* Modals */}`
);

fs.writeFileSync('resources/js/Pages/Dashboard.jsx', content);
console.log("Refactored pagination.");
