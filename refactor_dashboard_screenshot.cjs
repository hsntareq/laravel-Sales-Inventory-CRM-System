const fs = require('fs');
const path = './resources/js/Pages/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. User profile menu state
content = content.replace(
    /const \[isNotifOpen, setIsNotifOpen\] = useState\(false\);/,
    "const [isNotifOpen, setIsNotifOpen] = useState(false);\n    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);"
);

// 2. Profile Menu HTML
const profileHtmlOld = `<div className="nexus-user-profile">
                    <div className="nexus-avatar">
                        {auth.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="nexus-user-info">
                        <span className="nexus-user-name">{auth.user.name}</span>
                        <span className="nexus-user-email">{auth.user.email}</span>
                    </div>
                </div>`;
const profileHtmlNew = `<div className="nexus-user-profile cursor-pointer relative" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                    <div className="nexus-avatar">
                        {auth.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="nexus-user-info flex-1">
                        <span className="nexus-user-name">{auth.user.name}</span>
                        <span className="nexus-user-email">{auth.user.email}</span>
                    </div>
                    
                    {isProfileMenuOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                            <div className="p-3 border-b border-gray-50">
                                <div className="font-medium text-sm text-gray-800">{auth.user.name}</div>
                                <div className="text-xs text-gray-500">{auth.user.email}</div>
                            </div>
                            <div className="py-1">
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50">My profile</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50">Billing</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50">Settings</a>
                            </div>
                            <div className="py-1 border-t border-gray-50">
                                <a href="#" onClick={(e) => { e.preventDefault(); router.post('/logout'); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"><UserX size={14} /> Sign out</a>
                            </div>
                        </div>
                    )}
                </div>`;
content = content.replace(profileHtmlOld, profileHtmlNew);

// 3. Recharts imports
content = content.replace(
    /AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer/,
    "BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer"
);

// 4. Sales BarChart
const areaChartHtml = `<div className="nexus-card p-6">
                                    <h3 className="dashboard-section-title">Revenue Overview</h3>
                                    <div className="h-[300px] w-full mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                                                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} tickFormatter={(val) => \`$\${val}\`} />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(value) => [\`$\${value}\`, 'Revenue']}
                                                />
                                                <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>`;
const barChartHtml = `<div className="nexus-card p-6">
                                    <h3 className="dashboard-section-title">Sales — last 7 days</h3>
                                    <div className="h-[300px] w-full mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} tickFormatter={(val) => \`$\${val}\`} />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    cursor={{fill: '#f8fafc'}}
                                                    formatter={(value) => [\`$\${value}\`, 'Revenue']}
                                                />
                                                <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>`;
content = content.replace(areaChartHtml, barChartHtml);

// 5. Recent Orders List
const recentTransactionsRegex = /<div className="nexus-card p-0 overflow-hidden">[\s\S]*?<h3 className="dashboard-section-title mb-0">Recent Transactions<\/h3>[\s\S]*?<\/table>\s*<\/div>/;
const recentOrdersHtml = `<div className="nexus-card p-0 overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="dashboard-section-title mb-0">Recent orders</h3>
                                        <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('sales')}} className="text-sm text-blue-600 hover:underline">View all</a>
                                    </div>
                                    <div className="flex flex-col">
                                        {sales.slice(0, 5).map(s => (
                                            <div key={s.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-colors">
                                                <div>
                                                    <div className="font-medium text-sm text-slate-800">{s.customer.first_name} {s.customer.last_name}</div>
                                                    <div className="text-xs text-slate-500 mt-1">{s.items?.[0]?.product?.name || 'Multiple items'}</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="font-medium text-sm text-slate-800">\${parseFloat(s.total_amount).toFixed(2)}</div>
                                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-900 text-white">paid</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>`;
content = content.replace(recentTransactionsRegex, recentOrdersHtml);

// 6. Customers needing follow-up
const newestCustomersRegex = /<div className="nexus-card p-0 overflow-hidden">[\s\S]*?<h3 className="dashboard-section-title mb-0">Newest Customers<\/h3>[\s\S]*?<\/a>\s*<\/div>\s*<\/div>\s*\)\)}\s*<\/div>\s*<\/div>/;
const customersNeedingFollowupHtml = `<div className="nexus-card p-0 overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="dashboard-section-title mb-0">Customers needing follow-up</h3>
                                        <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('lost')}} className="text-sm text-blue-600 hover:underline">View all</a>
                                    </div>
                                    <div className="flex flex-col">
                                        {lostCustomers.slice(0, 5).map(c => {
                                            const daysSince = c.last_purchase_date ? Math.floor((new Date() - new Date(c.last_purchase_date)) / (1000 * 3600 * 24)) : 0;
                                            const status = daysSince >= 90 ? 'lost' : 'at-risk';
                                            return (
                                                <div key={c.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-colors">
                                                    <div>
                                                        <div className="font-medium text-sm text-slate-800">{c.first_name} {c.last_name}</div>
                                                        <div className="text-xs text-slate-500 mt-1">Last purchase {daysSince} days ago</div>
                                                    </div>
                                                    <span className={\`px-2.5 py-1 text-xs font-medium rounded-full \${status === 'lost' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}\`}>{status}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>`;
content = content.replace(newestCustomersRegex, customersNeedingFollowupHtml);

// 7. Update Low Stock Alerts style
content = content.replace(
    /<div className="text-xs text-gray-400 font-mono">\{p.sku\}<\/div>/,
    `<div className="text-xs text-gray-400 mt-1">{p.sku} · {selectedBranch ? branches.find(b => b.id === selectedBranch)?.name : 'All branches'}</div>`
);
content = content.replace(
    /<span className="nexus-badge soft-gray">\{getBranchStock\(p, selectedBranch\)\} left<\/span>/g,
    `<span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">{getBranchStock(p, selectedBranch)} left</span>`
);
content = content.replace(
    /<span className="nexus-badge solid-red">Out<\/span>/g,
    `<span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-600 text-white">0 left</span>`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated dashboard to match screenshot.');
