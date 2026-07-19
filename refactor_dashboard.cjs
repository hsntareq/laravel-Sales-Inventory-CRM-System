const fs = require('fs');
const path = './resources/js/Pages/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add selectedBranch state & branch selector UI
content = content.replace(
    "const [activeTab, setActiveTab] = useState('dashboard');",
    "const [activeTab, setActiveTab] = useState('dashboard');\n    const [selectedBranch, setSelectedBranch] = useState(branches.length > 0 ? branches[0].id : '');\n\n    const getBranchStock = (product, branchId) => {\n        if (!branchId) return 0;\n        const branch = product.branches?.find(b => b.id === branchId);\n        return branch ? branch.pivot.stock_quantity : 0;\n    };"
);

// 2. Add Branch dropdown to Topbar
content = content.replace(
    /<div className="flex items-center gap-4">/,
    `<div className="flex items-center gap-4">\n                        <div className="flex items-center gap-2 mr-4">\n                            <span className="text-sm text-gray-500 font-medium">Branch:</span>\n                            <select className="nexus-input py-1.5 px-3 text-sm min-w-[150px]" value={selectedBranch} onChange={e => setSelectedBranch(parseInt(e.target.value))}>\n                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}\n                            </select>\n                        </div>`
);

// 3. Fix references to stock_quantity
content = content.replace(/p\.stock_quantity/g, 'getBranchStock(p, selectedBranch)');
content = content.replace(/product\.stock_quantity/g, 'getBranchStock(product, selectedBranch)');

// 4. Update sales POST request to include branch_id
content = content.replace(
    "router.post('/sales', {",
    "router.post('/sales', {\n            branch_id: selectedBranch,"
);

// 5. Update new product POST request to include branch_id
content = content.replace(
    "router.post('/products', newProduct, {",
    "router.post('/products', { ...newProduct, branch_id: selectedBranch }, {"
);

// 6. Fix the cart item stock reference (now it's just 'stock' in cart)
content = content.replace(
    "stock: product.stock_quantity",
    "stock: getBranchStock(product, selectedBranch)"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Dashboard refactored successfully.');
