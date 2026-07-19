const fs = require('fs');
const path = './resources/js/Pages/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove rogue active customers pagination from products tab
content = content.replace(
    /<Pagination total={filteredActiveCustomers\.length} page={pageActiveCustomers} setPage={setPageActiveCustomers} \/>\n\s*<Pagination total={filteredProducts(Global)?\.length} page={pageInventory} setPage={setPageInventory} \/>/g,
    '<Pagination total={filteredProductsGlobal.length} page={pageInventory} setPage={setPageInventory} />'
);

// 2. Customers Tab - List View
content = content.replace(
    /<tbody>\s*\{customers\.map\(c => \{/g,
    '<tbody>\n                                            {paginatedActiveCustomers.map(c => {'
);

// 3. Customers Tab - Grid View
content = content.replace(
    /<div className="customers-grid">\s*\{customers\.map\(c => \{/g,
    '<div className="customers-grid">\n                                        {paginatedActiveCustomers.map(c => {'
);

// 4. Add Pagination to Customers Tab
content = content.replace(
    /\)\)}\s*<\/div>\s*\)\)}\s*<\/div>\s*<\/div>\s*<\/>\s*\)}/,
    `))}
                                        </div>
                                    </div>
                                )}
                                <Pagination total={filteredActiveCustomers.length} page={pageActiveCustomers} setPage={setPageActiveCustomers} />
                            </div>
                        </>
                    )}`
);
// Actually, regex 4 is dangerous, let's use a simpler one.

fs.writeFileSync(path, content, 'utf8');
