const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Dashboard.jsx', 'utf8');

// 1. Add state
content = content.replace(
    /const \[assignmentFilter, setAssignmentFilter\] = useState\('all'\);/,
    `const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [sortField, setSortField] = useState('first_name');
    const [sortOrder, setSortOrder] = useState('asc');`
);

// 2. Add sorting logic
content = content.replace(
    /const paginatedLostCustomers = filteredLostCustomers\.slice\(\(pageLostCustomers - 1\) \* itemsPerPage, pageLostCustomers \* itemsPerPage\);/,
    `const sortedLostCustomers = [...filteredLostCustomers].sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortField === 'first_name') {
            valA = (a.first_name + ' ' + a.last_name).toLowerCase();
            valB = (b.first_name + ' ' + b.last_name).toLowerCase();
        }
        if (!valA) valA = '';
        if (!valB) valB = '';
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    const paginatedLostCustomers = sortedLostCustomers.slice((pageLostCustomers - 1) * itemsPerPage, pageLostCustomers * itemsPerPage);`
);

// 3. Add toggleSort function
content = content.replace(
    /const getBranchStock = \(product, branchId\) => \{/,
    `const toggleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getBranchStock = (product, branchId) => {`
);

// 4. Update the thead
content = content.replace(
    /<th>Customer<\/th>\s*<th>Last Purchase<\/th>/,
    `<th className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleSort('first_name')}>
                                                    <div className="flex items-center gap-1">
                                                        Customer
                                                        {sortField === 'first_name' && <span className="text-gray-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                                    </div>
                                                </th>
                                                <th className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleSort('last_purchase_date')}>
                                                    <div className="flex items-center gap-1">
                                                        Last Purchase
                                                        {sortField === 'last_purchase_date' && <span className="text-gray-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                                    </div>
                                                </th>`
);

fs.writeFileSync('resources/js/Pages/Dashboard.jsx', content);
console.log("Refactored sorting.");
