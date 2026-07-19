const fs = require('fs');
const path = './resources/js/Pages/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Pagination Component and States
const stateAdditions = `
    // Search and Pagination
    const [globalSearch, setGlobalSearch] = useState('');
    const [pageInventory, setPageInventory] = useState(1);
    const [pageActiveCustomers, setPageActiveCustomers] = useState(1);
    const [pageLostCustomers, setPageLostCustomers] = useState(1);
    const [pageEmployees, setPageEmployees] = useState(1);
    const [pageBranches, setPageBranches] = useState(1);

    useEffect(() => {
        setPageInventory(1);
        setPageActiveCustomers(1);
        setPageLostCustomers(1);
        setPageEmployees(1);
        setPageBranches(1);
    }, [globalSearch, activeTab]);

    const itemsPerPage = 10;
    const Pagination = ({ total, page, setPage }) => {
        const totalPages = Math.ceil(total / itemsPerPage);
        if (totalPages <= 1) return null;
        return (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Showing page {page} of {totalPages} ({total} items)</span>
                <div className="flex gap-2">
                    <button className="nexus-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                    <button className="nexus-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            </div>
        );
    };
`;
content = content.replace(
    "// UI State\n    const [activeTab, setActiveTab] = useState('dashboard');",
    stateAdditions + "\n    // UI State\n    const [activeTab, setActiveTab] = useState('dashboard');"
);

// 2. Wire Global Search Input
content = content.replace(
    /<input type="text" placeholder="Search products, customers, invoices..." \/>/,
    `<input type="text" placeholder="Search active tab..." value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />`
);

// 3. Filter and Paginate Inventory
const filterInventory = `
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(globalSearch.toLowerCase()) || p.sku.toLowerCase().includes(globalSearch.toLowerCase()));
    const paginatedProducts = filteredProducts.slice((pageInventory - 1) * itemsPerPage, pageInventory * itemsPerPage);
`;
content = content.replace(
    /const handleProductSubmit = /
    , filterInventory + "\n    const handleProductSubmit = "
);
content = content.replace(/products\.map\(\(product\) =>/g, "paginatedProducts.map((product) =>");
content = content.replace(
    /(\<div className="nexus-table-wrapper"\>[\s\S]*?<\/table>\s*<\/div>)/,
    `$1\n                                <Pagination total={filteredProducts.length} page={pageInventory} setPage={setPageInventory} />`
);
content = content.replace(
    /(\<div className="nexus-grid"\>[\s\S]*?<\/div>\s*<\/div>)/,
    `$1\n                                <Pagination total={filteredProducts.length} page={pageInventory} setPage={setPageInventory} />`
);

// 4. Filter and Paginate Customers
const filterCustomers = `
    const filteredActiveCustomers = activeCustomersList.filter(c => c.first_name.toLowerCase().includes(globalSearch.toLowerCase()) || c.last_name.toLowerCase().includes(globalSearch.toLowerCase()) || c.email.toLowerCase().includes(globalSearch.toLowerCase()));
    const paginatedActiveCustomers = filteredActiveCustomers.slice((pageActiveCustomers - 1) * itemsPerPage, pageActiveCustomers * itemsPerPage);
    
    const filteredLostCustomers = lostCustomersList.filter(c => c.first_name.toLowerCase().includes(globalSearch.toLowerCase()) || c.last_name.toLowerCase().includes(globalSearch.toLowerCase()) || c.email.toLowerCase().includes(globalSearch.toLowerCase()));
    const paginatedLostCustomers = filteredLostCustomers.slice((pageLostCustomers - 1) * itemsPerPage, pageLostCustomers * itemsPerPage);
`;
content = content.replace(
    /const handleCustomerSubmit = /,
    filterCustomers + "\n    const handleCustomerSubmit = "
);
content = content.replace(/activeCustomersList\.map\(\(c\) =>/g, "paginatedActiveCustomers.map((c) =>");
content = content.replace(/lostCustomersList\.map\(\(c\) =>/g, "paginatedLostCustomers.map((c) =>");

// Add pagination to active customers (List view)
content = content.replace(
    /(<tbody>[\s\S]*?<\/tbody>\s*<\/table>\s*<\/div>)/,
    `$1\n                                        <Pagination total={filteredActiveCustomers.length} page={pageActiveCustomers} setPage={setPageActiveCustomers} />`
);
// Add pagination to active customers (Grid view)
content = content.replace(
    /(\<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"\>[\s\S]*?<\/div>\s*<\/div>)/,
    `$1\n                                        <Pagination total={filteredActiveCustomers.length} page={pageActiveCustomers} setPage={setPageActiveCustomers} />`
);
// Add pagination to lost customers
content = content.replace(
    /(\<h3 className="nexus-card-title mb-4"\>Lost Customers<\/h3>[\s\S]*?<\/tbody>\s*<\/table>\s*<\/div>\s*<\/div>)/,
    `$1\n                                        <Pagination total={filteredLostCustomers.length} page={pageLostCustomers} setPage={setPageLostCustomers} />`
);

// 5. Filter and Paginate Employees & Branches
const filterEmpBranch = `
    const filteredEmployees = employees.filter(e => e.first_name.toLowerCase().includes(globalSearch.toLowerCase()) || e.last_name.toLowerCase().includes(globalSearch.toLowerCase()) || e.email.toLowerCase().includes(globalSearch.toLowerCase()));
    const paginatedEmployees = filteredEmployees.slice((pageEmployees - 1) * itemsPerPage, pageEmployees * itemsPerPage);
    
    const filteredBranches = branches.filter(b => b.name.toLowerCase().includes(globalSearch.toLowerCase()) || b.location.toLowerCase().includes(globalSearch.toLowerCase()));
    const paginatedBranches = filteredBranches.slice((pageBranches - 1) * itemsPerPage, pageBranches * itemsPerPage);
`;
content = content.replace(
    /const handleEmployeeSubmit = /,
    filterEmpBranch + "\n    const handleEmployeeSubmit = "
);
content = content.replace(/employees\.map\(\(emp\) =>/g, "paginatedEmployees.map((emp) =>");
content = content.replace(/branches\.map\(\(branch\) =>/g, "paginatedBranches.map((branch) =>");

// Employees Pagination (Table)
content = content.replace(
    /(\<h3 className="font-bold mb-4"\>Employees<\/h3>[\s\S]*?<\/tbody>\s*<\/table>\s*<\/div>\s*<\/div>)/,
    `$1\n                                        <Pagination total={filteredEmployees.length} page={pageEmployees} setPage={setPageEmployees} />`
);
// Employees Pagination (Grid)
content = content.replace(
    /(\<h3 className="font-bold mb-4"\>Employees<\/h3>[\s\S]*?\<\/div\>\s*\<\/div\>\s*\<\/div\>)/,
    `$1\n                                        <Pagination total={filteredEmployees.length} page={pageEmployees} setPage={setPageEmployees} />`
);
// Branches Pagination (Table)
content = content.replace(
    /(\<h3 className="font-bold mb-4"\>Branches<\/h3>[\s\S]*?<\/tbody>\s*<\/table>\s*<\/div>\s*<\/div>)/,
    `$1\n                                        <Pagination total={filteredBranches.length} page={pageBranches} setPage={setPageBranches} />`
);
// Branches Pagination (Grid)
content = content.replace(
    /(\<h3 className="font-bold mb-4"\>Branches<\/h3>[\s\S]*?\<\/div\>\s*\<\/div\>\s*\<\/div\>)/,
    `$1\n                                        <Pagination total={filteredBranches.length} page={pageBranches} setPage={setPageBranches} />`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Search and pagination added successfully.');
