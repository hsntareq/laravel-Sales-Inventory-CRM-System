const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Dashboard.jsx', 'utf8');

// 1. Tab switching
content = content.replace(
    /const \[activeTab, setActiveTab\] = useState\(initialTab\);/,
    `const [activeTab, setActiveTabRaw] = useState(initialTab);
    const setActiveTab = (tab) => {
        setActiveTabRaw(tab);
        setSortField(null);
        setSortOrder('asc');
    };`
);

// 2. Sorting logic
content = content.replace(
    /const toggleSort = \(field\) => \{/,
    `const sortData = (array) => {
        return [...array].sort((a, b) => {
            if (!sortField) return 0;
            
            let valA = a[sortField];
            let valB = b[sortField];
            
            if (sortField === 'customer.first_name') {
                valA = (a.customer?.first_name + ' ' + a.customer?.last_name).toLowerCase();
                valB = (b.customer?.first_name + ' ' + b.customer?.last_name).toLowerCase();
            } else if (sortField === 'first_name') {
                valA = (a.first_name + ' ' + a.last_name).toLowerCase();
                valB = (b.first_name + ' ' + b.last_name).toLowerCase();
            } else if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();
            }
            
            if (!valA && valA !== 0) valA = '';
            if (!valB && valB !== 0) valB = '';
            
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    };
    
    const SortableHeader = ({ field, label, width }) => (
        <th className="cursor-pointer hover:bg-slate-50 transition-colors" style={width ? { width } : {}} onClick={() => toggleSort(field)}>
            <div className="flex items-center gap-1">
                {label}
                {sortField === field && <span className="text-gray-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
            </div>
        </th>
    );

    const toggleSort = (field) => {`
);

// 3. Update arrays
content = content.replace(
    /const paginatedProducts = filteredProductsGlobal\.slice\(/g,
    `const paginatedProducts = sortData(filteredProductsGlobal).slice(`
);
content = content.replace(
    /const paginatedActiveCustomers = filteredActiveCustomers\.slice\(/g,
    `const paginatedActiveCustomers = sortData(filteredActiveCustomers).slice(`
);
content = content.replace(
    /const paginatedSales = filteredSales\.slice\(/g,
    `const paginatedSales = sortData(filteredSales).slice(`
);
content = content.replace(
    /const paginatedEmployees = filteredEmployees\.slice\(/g,
    `const paginatedEmployees = sortData(filteredEmployees).slice(`
);
content = content.replace(
    /const paginatedBranches = filteredBranches\.slice\(/g,
    `const paginatedBranches = sortData(filteredBranches).slice(`
);

// Replace Lost Customers custom sort logic with sortData
content = content.replace(
    /const sortedLostCustomers = \[\.\.\.filteredLostCustomers\]\.sort\(\(a, b\) => \{[\s\S]*?return 0;\n    \}\);/,
    `const sortedLostCustomers = sortData(filteredLostCustomers);`
);

// 4. Update th tags
// Products
content = content.replace(
    /<th>Product<\/th>\s*<th>SKU<\/th>\s*<th>Price<\/th>\s*<th>Stock<\/th>/,
    `<SortableHeader field="name" label="Product" />\n                                                <SortableHeader field="sku" label="SKU" />\n                                                <SortableHeader field="price" label="Price" />\n                                                <th>Stock</th>`
);

// Sales (Dashboard overview)
content = content.replace(
    /<th>Date<\/th>\s*<th>Items<\/th>\s*<th>Total<\/th>/,
    `<SortableHeader field="created_at" label="Date" />\n                                            <th>Items</th>\n                                            <SortableHeader field="total_amount" label="Total" />`
);

// Sales (Sales tab)
content = content.replace(
    /<th>Invoice<\/th>\s*<th>Date<\/th>\s*<th>Customer<\/th>\s*<th>Total<\/th>\s*<th>Status<\/th>/,
    `<SortableHeader field="invoice_number" label="Invoice" />\n                                            <SortableHeader field="created_at" label="Date" />\n                                            <SortableHeader field="customer.first_name" label="Customer" />\n                                            <SortableHeader field="total_amount" label="Total" />\n                                            <SortableHeader field="status" label="Status" />`
);

// Active Customers
content = content.replace(
    /<th>Customer<\/th>\s*<th>Contact<\/th>\s*<th>Last Purchase<\/th>\s*<th>Status<\/th>\s*<th>Actions<\/th>/,
    `<SortableHeader field="first_name" label="Customer" />\n                                                <SortableHeader field="email" label="Contact" />\n                                                <SortableHeader field="last_purchase_date" label="Last Purchase" />\n                                                <th>Status</th>\n                                                <th>Actions</th>`
);

// Employees
content = content.replace(
    /<th>Employee<\/th>\s*<th>Email<\/th>\s*<th>KPI Score<\/th>/,
    `<SortableHeader field="first_name" label="Employee" />\n                                                <SortableHeader field="email" label="Email" />\n                                                <SortableHeader field="kpi_score" label="KPI Score" />`
);

fs.writeFileSync('resources/js/Pages/Dashboard.jsx', content);
console.log("All tabs sort headers added.");
