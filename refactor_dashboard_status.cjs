const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Dashboard.jsx', 'utf8');

// 1. Add state
content = content.replace(
    /const \[(globalSearch.*?)useState\(''(.*?)\);/,
    `const [$1useState(''$2);
    const [assignmentFilter, setAssignmentFilter] = useState('all');`
);

// 2. Add to useEffect deps
content = content.replace(
    /setPageSales\(1\);\n    \}, \[(globalSearch, activeTab)\]\);/,
    `setPageSales(1);\n    }, [$1, assignmentFilter]);`
);

// 3. Update filteredLostCustomers
content = content.replace(
    /const filteredLostCustomers = lostCustomers\.filter\(c => (.*?)\);/,
    `const filteredLostCustomers = lostCustomers.filter(c => {\n        const matchesSearch = $1;\n        const matchesFilter = assignmentFilter === 'all' ? true : (assignmentFilter === 'assigned' ? c.assigned_employee_id !== null : c.assigned_employee_id === null);\n        return matchesSearch && matchesFilter;\n    });`
);

// 4. Update the thead
content = content.replace(
    /<th>Customer<\/th>\s*<th>Last Purchase<\/th>\s*<th>Assigned To<\/th>/,
    `<th>Customer</th>
                                                <th>Last Purchase</th>
                                                <th>
                                                    <select className="bg-transparent border-0 font-semibold text-gray-500 uppercase text-xs tracking-wider outline-none p-0 cursor-pointer" value={assignmentFilter} onChange={e => setAssignmentFilter(e.target.value)}>
                                                        <option value="all">Status (All)</option>
                                                        <option value="assigned">Assigned</option>
                                                        <option value="unassigned">Unassigned</option>
                                                    </select>
                                                </th>
                                                <th>Assigned To</th>`
);

// 5. Update the tbody tr
content = content.replace(
    /<td className="font-medium">\{c\.first_name\} \{c\.last_name\}<\/td>\s*<td>\{c\.last_purchase_date \? new Date\(c\.last_purchase_date\)\.toISOString\(\)\.split\('T'\)\[0\] : 'Never'\}<\/td>\s*<td style=\{\{minWidth: '250px'\}\}>/g,
    `<td className="font-medium">{c.first_name} {c.last_name}</td>
                                                    <td>{c.last_purchase_date ? new Date(c.last_purchase_date).toISOString().split('T')[0] : 'Never'}</td>
                                                    <td>
                                                        {c.assigned_employee_id 
                                                            ? <span className="nexus-badge solid-green text-[10px] tracking-wider font-bold px-2 py-1">ASSIGNED</span> 
                                                            : <span className="nexus-badge solid-gray text-[10px] tracking-wider font-bold px-2 py-1">UNASSIGNED</span>}
                                                    </td>
                                                    <td style={{minWidth: '250px'}}>`
);

fs.writeFileSync('resources/js/Pages/Dashboard.jsx', content);
console.log("Refactored status.");
