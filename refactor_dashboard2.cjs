const fs = require('fs');
const path = './resources/js/Pages/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add state for History Modal
content = content.replace(
    "const [emailTarget, setEmailTarget] = useState(null);",
    "const [emailTarget, setEmailTarget] = useState(null);\n    const [isHistoryOpen, setIsHistoryOpen] = useState(false);\n    const [historyTarget, setHistoryTarget] = useState(null);"
);

// 2. Add History Button to Customer row actions (Grid view)
content = content.replace(
    /<button className="nexus-btn" onClick={() => { openEmailModal\(c\); }}><Mail size={16}\/><\/button>/g,
    `<button className="nexus-btn" onClick={() => { setHistoryTarget(c); setIsHistoryOpen(true); }} title="Purchase History"><ShoppingCart size={16}/></button>\n                                                            <button className="nexus-btn" onClick={() => { openEmailModal(c); }} title="Send Email"><Mail size={16}/></button>`
);

// 3. Add History Button to Customer card actions (List view)
content = content.replace(
    /<button className="nexus-btn w-full justify-center" onClick={() => { openEmailModal\(c\); }}><Mail size={16}\/> Email<\/button>/g,
    `<button className="nexus-btn w-full justify-center" onClick={() => { setHistoryTarget(c); setIsHistoryOpen(true); }}><ShoppingCart size={16}/> History</button>\n                                                    <button className="nexus-btn w-full justify-center" onClick={() => { openEmailModal(c); }}><Mail size={16}/> Email</button>`
);

// 4. Add History Button to Lost Customer row actions
content = content.replace(
    /<button className="nexus-btn primary" onClick={() => { openEmailModal\(c\); }}>Email<\/button>/g,
    `<button className="nexus-btn" onClick={() => { setHistoryTarget(c); setIsHistoryOpen(true); }}>History</button>\n                                                        <button className="nexus-btn primary" onClick={() => { openEmailModal(c); }}>Email</button>`
);

// 5. Add History Modal at the bottom
const historyModalHTML = `
            {/* History Modal */}
            {isHistoryOpen && historyTarget && (
                <div className="nexus-modal-overlay">
                    <div className="nexus-modal max-w-2xl">
                        <div className="nexus-modal-header">
                            <h3 className="font-bold text-lg">Purchase History: {historyTarget.first_name} {historyTarget.last_name}</h3>
                            <button onClick={() => setIsHistoryOpen(false)}>✕</button>
                        </div>
                        <div className="nexus-modal-body max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Purchase Frequency</div>
                                    <div className="text-2xl font-bold">{historyTarget.sales?.length || 0} Orders</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Lifetime Value</div>
                                    <div className="text-2xl font-bold">\${historyTarget.sales?.reduce((sum, s) => sum + parseFloat(s.total_amount), 0).toFixed(2) || '0.00'}</div>
                                </div>
                            </div>
                            <h4 className="font-bold mb-3">Recent Purchases</h4>
                            {historyTarget.sales && historyTarget.sales.length > 0 ? (
                                <table className="nexus-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyTarget.sales.map(sale => (
                                            <tr key={sale.id}>
                                                <td>{new Date(sale.created_at).toISOString().split('T')[0]}</td>
                                                <td>
                                                    <ul className="list-disc pl-4">
                                                        {sale.items?.map(item => (
                                                            <li key={item.id} className="text-sm text-gray-600">
                                                                {item.quantity}x {item.product?.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="font-bold">\${parseFloat(sale.total_amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500 italic">No purchase history found for this customer.</p>
                            )}
                        </div>
                        <div className="nexus-modal-footer">
                            <button className="nexus-btn" onClick={() => setIsHistoryOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
`;

content = content.replace(
    "{isEmailOpen && emailTarget && (",
    historyModalHTML + "\n            {isEmailOpen && emailTarget && ("
);

fs.writeFileSync(path, content, 'utf8');
console.log('Added history modal successfully.');
