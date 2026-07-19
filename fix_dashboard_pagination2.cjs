const fs = require('fs');
const path = './resources/js/Pages/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Define paginatedSales and sort employees
content = content.replace(
    /const filteredEmployees = employees\.filter\(e => /,
    `const filteredSales = sales.filter(s => s.customer.first_name.toLowerCase().includes(globalSearch.toLowerCase()) || s.customer.last_name.toLowerCase().includes(globalSearch.toLowerCase()));
    const [pageSales, setPageSales] = useState(1);
    const paginatedSales = filteredSales.slice((pageSales - 1) * itemsPerPage, pageSales * itemsPerPage);

    const filteredEmployees = employees.sort((a,b) => b.kpi_score - a.kpi_score).filter(e => `
);

// Add pageSales to useEffect reset
content = content.replace(
    /setPageBranches\(1\);/,
    'setPageBranches(1);\n        setPageSales(1);'
);

// 2. Sales Tab: Replace sales.map and add Pagination
content = content.replace(
    /\{sales\.map\(s => \(/g,
    '{paginatedSales.map(s => ('
);
content = content.replace(
    /\s*<\/table>\s*<\/div>\s*<\/>\s*\)\}/,
    `
                                </table>
                            </div>
                            <Pagination total={filteredSales.length} page={pageSales} setPage={setPageSales} />
                        </>
                    )}`
);

// 3. Lost Customers Tab: Replace lostCustomers.map and add Pagination
content = content.replace(
    /<tbody>\s*\{lostCustomers\.map\(c => \(/g,
    '<tbody>\n                                            {paginatedLostCustomers.map(c => ('
);
content = content.replace(
    /<div className="customers-grid">\s*\{lostCustomers\.map\(c => \(/g,
    '<div className="customers-grid">\n                                        {paginatedLostCustomers.map(c => ('
);
content = content.replace(
    /\)\)}\s*<\/div>\s*\)\)}\s*<\/div>\s*<\/div>\s*<\/>\s*\)\}/,
    `))}
                                        </div>
                                    </div>
                                )}
                                <Pagination total={filteredLostCustomers.length} page={pageLostCustomers} setPage={setPageLostCustomers} />
                            </div>
                        </>
                    )}`
);

// 4. Employees Tab: Replace employees.sort...map and add Pagination
content = content.replace(
    /\{employees\.sort\(\(a,b\) => b\.kpi_score - a\.kpi_score\)\.map\(e => \(/g,
    '{paginatedEmployees.map(e => ('
);
content = content.replace(
    /\)\)}\s*<\/div>\s*\)\)}\s*<\/div>\s*<\/>\s*\)\}/,
    `))}
                                        </div>
                                )}
                                <Pagination total={filteredEmployees.length} page={pageEmployees} setPage={setPageEmployees} />
                            </div>
                        </>
                    )}`
);

// 5. Branches Tab: Replace branches.map and add Pagination
content = content.replace(
    /\{branches\.map\(b => \(/g,
    '{paginatedBranches.map(b => ('
);
content = content.replace(
    /\)\)}\s*<\/div>\s*<\/div>\s*<\/>\s*\)\}/,
    `))}
                                </div>
                            </div>
                            <Pagination total={filteredBranches.length} page={pageBranches} setPage={setPageBranches} />
                        </>
                    )}`
);

fs.writeFileSync(path, content, 'utf8');
