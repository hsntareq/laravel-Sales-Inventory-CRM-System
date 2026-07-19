import { Head, usePage, router, Link } from '@inertiajs/react';
import NexusLayout from '@/Layouts/NexusLayout';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import { 
    LayoutDashboard, Package, ShoppingCart, Users, UserX, UsersRound, MapPin, 
    Search, Bell, Filter, Plus, Download, Grid, List, Trash2, Mail, Phone, X
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../../css/custom.css';

export default function Dashboard({ products, employees, customers, sales, branches = [] }) {
    const initialTab = typeof window !== 'undefined' 
        ? new URLSearchParams(window.location.search).get('tab') || 'dashboard'
        : 'dashboard';
    const [activeTab, setActiveTabRaw] = useState(initialTab);
    const setActiveTab = (tab) => {
        setActiveTabRaw(tab);
        setSortField(null);
        setSortOrder('asc');
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location);
            url.searchParams.set('tab', activeTab);
            window.history.pushState({}, '', url);
        }
    }, [activeTab]);

    const [selectedBranch, setSelectedBranch] = useState(branches.length > 0 ? branches[0].id : '');

    const sortData = (array) => {
        return [...array].sort((a, b) => {
            if (!sortField) return 0;
            
            let valA = a[sortField];
            let valB = b[sortField];
            
            if (sortField === 'customer.first_name') {
                valA = (a.customer?.first_name + ' ' + a.customer?.last_name).toLowerCase();
                valB = (b.customer?.first_name + ' ' + b.customer?.last_name).toLowerCase();
            } else if (sortField === 'stock') {
                valA = getBranchStock(a, selectedBranch);
                valB = getBranchStock(b, selectedBranch);
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

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getBranchStock = (product, branchId) => {
        if (!branchId) return 0;
        const branch = product.branches?.find(b => b.id === branchId);
        return branch ? branch.pivot.stock_quantity : 0;
    };
    const [isPosOpen, setIsPosOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [savedCarts, setSavedCarts] = useState({});
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    
    // Search and Pagination
    const [globalSearch, setGlobalSearch] = useState('');
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [sortField, setSortField] = useState('first_name');
    const [sortOrder, setSortOrder] = useState('asc');
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
        setPageSales(1);
    }, [globalSearch, activeTab, assignmentFilter]);

    const itemsPerPage = 10;
    const Pagination = ({ total, page, setPage }) => {
        const totalPages = Math.ceil(total / itemsPerPage);
        if (totalPages <= 1) return null;

        const getPageNumbers = () => {
            const pages = [];
            if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
                if (page <= 4) {
                    pages.push(1, 2, 3, 4, 5, '...', totalPages);
                } else if (page >= totalPages - 3) {
                    pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                } else {
                    pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
                }
            }
            return pages;
        };

        return (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Showing page {page} of {totalPages} ({total} items)</span>
                <div className="flex gap-1 items-center">
                    <button className="nexus-btn px-3 border-0 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                    {getPageNumbers().map((p, i) => (
                        <button 
                            key={i} 
                            disabled={p === '...' || page === p}
                            onClick={() => p !== '...' && page !== p && setPage(p)}
                            className={`nexus-btn px-3.5 py-1.5 min-w-[36px] flex items-center justify-center ${page === p ? 'bg-slate-50 text-slate-900 font-semibold border-slate-200 opacity-50 cursor-not-allowed' : p === '...' ? 'border-transparent shadow-none hover:bg-transparent cursor-default px-1' : 'bg-white hover:bg-slate-50 text-slate-600'}`}
                        >
                            {p}
                        </button>
                    ))}
                    <button className="nexus-btn px-3 border-0 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            </div>
        );
    };

    // View toggles (grid vs list)
    const [productView, setProductView] = useState('grid');
    const [customerView, setCustomerView] = useState('grid');
    const [lostView, setLostView] = useState('list');
    const [employeeView, setEmployeeView] = useState('grid');
    
    // Modals
    const [isNewProductOpen, setIsNewProductOpen] = useState(false);
    const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [emailTarget, setEmailTarget] = useState(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyTarget, setHistoryTarget] = useState(null);
    
    // Notifications panel
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Forms state
    const [newProduct, setNewProduct] = useState({ name: '', sku: '', price: '', stock_quantity: '' });
    const [newCustomer, setNewCustomer] = useState({ first_name: '', last_name: '', email: '' });
    const [emailForm, setEmailForm] = useState({ subject: '', message: '' });

    const generateSKU = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const segment1 = Math.floor(1000 + Math.random() * 9000);
        let segment2 = '';
        for (let i = 0; i < 4; i++) {
            segment2 += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `SKU-${segment1}-${segment2}`;
    };

    const openNewProductModal = () => {
        setNewProduct({ name: '', sku: generateSKU(), price: '', stock_quantity: '' });
        setIsNewProductOpen(true);
    };
    
    // Filters
    const [productFilter, setProductFilter] = useState('');
    const [inactivityThreshold, setInactivityThreshold] = useState(90);

    const { errors, flash, auth } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (errors?.error) toast.error(errors.error);
    }, [flash, errors]);

    // POS Logic
    const addToCart = (product) => {
        if (!selectedCustomer) return toast.error('Please select a customer first');
        
        const existing = cart.find(i => i.product_id === product.id);
        if (existing) {
            if (existing.quantity >= getBranchStock(product, selectedBranch)) return toast.error('Not enough stock');
            setCart(cart.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            if (getBranchStock(product, selectedBranch) < 1) return toast.error('Out of stock');
            setCart([...cart, { product_id: product.id, name: product.name, price: product.price, quantity: 1, stock: getBranchStock(product, selectedBranch) }]);
        }
    };

    const updateCartQty = (productId, qty) => {
        setCart(cart.map(i => {
            if (i.product_id === productId) {
                if (qty === '') return { ...i, quantity: '' };
                const val = parseInt(qty);
                if (isNaN(val) || val < 1) return i;
                
                if (val > i.stock) {
                    toast.error(`Only ${i.stock} items left in stock!`);
                    return { ...i, quantity: i.stock };
                }
                return { ...i, quantity: val };
            }
            return i;
        }));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(i => i.product_id !== productId));
    };

    const checkout = () => {
        if (!selectedCustomer) return toast.error('Select a customer');
        if (cart.length === 0) return toast.error('Cart is empty');
        if (cart.some(i => !i.quantity || isNaN(i.quantity) || i.quantity < 1)) return toast.error('Please enter valid quantities for all items');
        
        const loadingToast = toast.loading('Processing sale...');
        router.post('/sales', {
            branch_id: selectedBranch,
            customer_id: selectedCustomer.value,
            items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
        }, {
            onSuccess: () => {
                setSavedCarts(prev => {
                    const newSaved = { ...prev };
                    if (selectedCustomer) delete newSaved[selectedCustomer.value];
                    setCart(newSaved['walk-in'] || []);
                    return newSaved;
                });
                setIsPosOpen(false);
                setSelectedCustomer(null);
                toast.dismiss(loadingToast);
            },
            onError: () => toast.dismiss(loadingToast)
        });
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // API Handlers
    const handleCreateProduct = (e) => {
        e.preventDefault();
        router.post('/products', { ...newProduct, branch_id: selectedBranch }, {
            onSuccess: () => {
                setIsNewProductOpen(false);
                setNewProduct({ name: '', sku: '', price: '', stock_quantity: '' });
            }
        });
    };

    const handleCreateCustomer = (e) => {
        e.preventDefault();
        router.post('/customers', newCustomer, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsNewCustomerOpen(false);
                setNewCustomer({ first_name: '', last_name: '', email: '' });
                toast.success('Customer created successfully!');
            },
            onError: (errors) => {
                Object.values(errors).forEach(err => toast.error(err));
            }
        });
    };

    const handleSendEmail = (e) => {
        e.preventDefault();
        router.post(`/customers/${emailTarget.id}/email`, emailForm, {
            onSuccess: () => {
                setIsEmailOpen(false);
                setEmailForm({ subject: '', message: '' });
            }
        });
    };

    const handleAssignEmployee = (customerId, employeeId) => {
        if (!employeeId) return;
        router.post(`/customers/${customerId}/assign`, { assigned_employee_id: employeeId }, {
            onSuccess: () => toast.success('Employee assigned successfully!')
        });
    };

    const openEmailModal = (customer) => {
        setEmailTarget(customer);
        const isLost = lostCustomers.find(c => c.id === customer.id);
        if (isLost) {
            setEmailForm({
                subject: `Special Offer for you, ${customer.first_name}!`,
                message: `Hi ${customer.first_name},\n\nWe haven't seen you in a while and wanted to check in. We have some exciting new updates at Nexus ERP that you might love.\n\nPlease let us know if there's anything we can help you with!\n\nBest,\nThe Team`
            });
        } else {
            setEmailForm({
                subject: `Following up on your account`,
                message: `Hello ${customer.first_name}\n\nWe appreciate you being a valued client. Please let us know if you require any help!\n\nBest,\nThe Group`
            });
        }
        setIsEmailOpen(true);
    };

    // Chart Data (Mock data for revenue over last 7 days)
    const chartData = [
        { name: 'Mon', revenue: 4000, orders: 24 },
        { name: 'Tue', revenue: 3000, orders: 18 },
        { name: 'Wed', revenue: 5500, orders: 35 },
        { name: 'Thu', revenue: 4500, orders: 28 },
        { name: 'Fri', revenue: 6000, orders: 42 },
        { name: 'Sat', revenue: 8000, orders: 55 },
        { name: 'Sun', revenue: 7500, orders: 48 },
    ];

    // Filtered Data
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productFilter.toLowerCase()) || p.sku.toLowerCase().includes(productFilter.toLowerCase()));
    const lostCustomers = customers.filter(c => {
        if (!c.last_purchase_date) return false; // Never purchased, keep as active
        const daysSince = Math.floor((new Date() - new Date(c.last_purchase_date)) / (1000 * 60 * 60 * 24));
        return daysSince >= inactivityThreshold;
    });

    // React Select Options
    const customerOptions = customers.map(c => ({ value: c.id, label: `${c.first_name} ${c.last_name}` }));
    const employeeOptions = employees.map(e => ({ value: e.id, label: `${e.first_name} ${e.last_name}` }));

    // Derived Search Data
    const filteredProductsGlobal = products.filter(p => p.name.toLowerCase().includes(globalSearch.toLowerCase()) || p.sku.toLowerCase().includes(globalSearch.toLowerCase()));
    const paginatedProducts = sortData(filteredProductsGlobal).slice((pageInventory - 1) * itemsPerPage, pageInventory * itemsPerPage);

    const activeCustomers = customers.filter(c => !lostCustomers.find(lc => lc.id === c.id));
    const filteredActiveCustomers = activeCustomers.filter(c => c.first_name.toLowerCase().includes(globalSearch.toLowerCase()) || c.last_name.toLowerCase().includes(globalSearch.toLowerCase()) || c.email.toLowerCase().includes(globalSearch.toLowerCase()));
    const paginatedActiveCustomers = sortData(filteredActiveCustomers).slice((pageActiveCustomers - 1) * itemsPerPage, pageActiveCustomers * itemsPerPage);
    
    const filteredLostCustomers = lostCustomers.filter(c => {
        const matchesSearch = c.first_name.toLowerCase().includes(globalSearch.toLowerCase()) || c.last_name.toLowerCase().includes(globalSearch.toLowerCase()) || c.email.toLowerCase().includes(globalSearch.toLowerCase());
        const matchesFilter = assignmentFilter === 'all' ? true : (assignmentFilter === 'assigned' ? c.assigned_employee_id !== null : c.assigned_employee_id === null);
        return matchesSearch && matchesFilter;
    });
    const sortedLostCustomers = sortData(filteredLostCustomers);
    const paginatedLostCustomers = sortedLostCustomers.slice((pageLostCustomers - 1) * itemsPerPage, pageLostCustomers * itemsPerPage);

    const filteredSales = sales.filter(s => s.customer.first_name.toLowerCase().includes(globalSearch.toLowerCase()) || s.customer.last_name.toLowerCase().includes(globalSearch.toLowerCase()));
    const [pageSales, setPageSales] = useState(1);
    const paginatedSales = sortData(filteredSales).slice((pageSales - 1) * itemsPerPage, pageSales * itemsPerPage);

    const filteredEmployees = employees.sort((a,b) => b.kpi_score - a.kpi_score).filter(e => e.first_name.toLowerCase().includes(globalSearch.toLowerCase()) || e.last_name.toLowerCase().includes(globalSearch.toLowerCase()) || e.email.toLowerCase().includes(globalSearch.toLowerCase()));
    const paginatedEmployees = sortData(filteredEmployees).slice((pageEmployees - 1) * itemsPerPage, pageEmployees * itemsPerPage);
    
    const filteredBranches = branches.filter(b => b.name.toLowerCase().includes(globalSearch.toLowerCase()) || (b.location || '').toLowerCase().includes(globalSearch.toLowerCase()));
    const paginatedBranches = sortData(filteredBranches).slice((pageBranches - 1) * itemsPerPage, pageBranches * itemsPerPage);

    return (
        <NexusLayout activeTab={activeTab} onTabChange={setActiveTab}>
                {/* Topbar */}
                <header className="nexus-topbar relative">
                    <div className="nexus-search"></div>
                    <div className="nexus-top-actions">
                        <button className="nexus-icon-btn relative" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        {isNotifOpen && (
                            <div className="absolute top-16 right-6 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                                <div className="p-4 border-b font-bold">Notifications</div>
                                <div className="p-4 text-sm text-gray-600 border-b hover:bg-slate-50 cursor-pointer">
                                    System: Stock for "Wireless Headphones Pro" is running low.
                                </div>
                                <div className="p-4 text-sm text-gray-600 hover:bg-slate-50 cursor-pointer">
                                    CRM: Marcus Silva was marked as lost.
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="nexus-content">
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="nexus-page-header">
                                <div className="nexus-page-title">
                                    <h1>Dashboard</h1>
                                    <p>Overview of sales, inventory and customer health.</p>
                                </div>
                                <button className="nexus-btn">
                                    <Download size={18} /> Export
                                </button>
                            </div>

                            <div className="metrics-grid">
                                <div className="nexus-card">
                                    <div className="metric-card-header">
                                        <span>Revenue (All time)</span>
                                        <span className="nexus-icon-btn" style={{width: 32, height: 32, background: '#f1f5f9'}}>$</span>
                                    </div>
                                    <div className="stat-value">${sales.reduce((sum, s) => sum + parseFloat(s.total_amount), 0).toFixed(2)}</div>
                                    <div className="text-sm text-green-600 font-medium">↗ Up to date</div>
                                </div>
                                <div className="nexus-card">
                                    <div className="metric-card-header">
                                        <span>Orders</span>
                                        <span className="nexus-icon-btn" style={{width: 32, height: 32, background: '#f1f5f9'}}><ShoppingCart size={16}/></span>
                                    </div>
                                    <div className="stat-value">{sales.length}</div>
                                    <div className="text-sm text-green-600 font-medium">↗ +{sales.slice(0,5).length} this week</div>
                                </div>
                                <div className="nexus-card">
                                    <div className="metric-card-header">
                                        <span>Low Stock Items</span>
                                        <span className="nexus-icon-btn" style={{width: 32, height: 32, background: '#fee2e2', color: '#dc2626'}}><Package size={16}/></span>
                                    </div>
                                    <div className="stat-value">{products.filter(p => getBranchStock(p, selectedBranch) < 10).length}</div>
                                    <div className="text-sm text-red-600 font-medium">↗ attention</div>
                                </div>
                                <div className="nexus-card">
                                    <div className="metric-card-header">
                                        <span>Lost Customers</span>
                                        <span className="nexus-icon-btn" style={{width: 32, height: 32, background: '#fee2e2', color: '#dc2626'}}><UserX size={16}/></span>
                                    </div>
                                    <div className="stat-value">{lostCustomers.length}</div>
                                    <div className="text-sm text-red-600 font-medium">Requires assignment</div>
                                </div>
                            </div>

                            <div className="dashboard-charts-grid">
                                <div className="nexus-card p-6">
                                    <h3 className="dashboard-section-title">Sales — last 7 days</h3>
                                    <div className="h-[300px] w-full mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} tickFormatter={(val) => `${val}`} />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    cursor={{fill: '#f8fafc'}}
                                                    formatter={(value) => [`${value}`, 'Revenue']}
                                                />
                                                <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="nexus-card p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="dashboard-section-title mb-0">Low Stock Alerts</h3>
                                        <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('products')}} className="text-sm text-blue-600 hover:underline">View all</a>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {products.filter(p => getBranchStock(p, selectedBranch) < 10).slice(0, 5).map(p => (
                                            <div key={p.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                                                <div>
                                                    <div className="font-medium text-sm">{p.name}</div>
                                                    <div className="text-xs text-gray-400 mt-1">{p.sku} · {selectedBranch ? branches.find(b => b.id === selectedBranch)?.name : 'All branches'}</div>
                                                </div>
                                                {getBranchStock(p, selectedBranch) <= 0 ? (
                                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-600 text-white">0 left</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">{getBranchStock(p, selectedBranch)} left</span>
                                                )}
                                            </div>
                                        ))}
                                        {products.filter(p => getBranchStock(p, selectedBranch) < 10).length === 0 && (
                                            <div className="text-sm text-gray-500 py-4 text-center">All stock levels are optimal!</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard-tables-grid">
                                <div className="nexus-card p-0 overflow-hidden">
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
                                                    <div className="font-medium text-sm text-slate-800">${parseFloat(s.total_amount).toFixed(2)}</div>
                                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-900 text-white">paid</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="nexus-card p-0 overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="dashboard-section-title mb-0">Newest Customers</h3>
                                        <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('customers')}} className="text-sm text-blue-600 hover:underline">Manage customers</a>
                                    </div>
                                    <div className="flex flex-col">
                                        {customers.slice(-5).reverse().map(c => (
                                            <div key={c.id} className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-0">
                                                <div className="nexus-avatar bg-slate-100 text-slate-600">
                                                    {c.first_name[0]}{c.last_name[0]}
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="font-medium text-sm">{c.first_name} {c.last_name}</span>
                                                    <span className="text-xs text-gray-500">{c.email}</span>
                                                </div>
                                                <button onClick={() => openEmailModal(c)} className="nexus-icon-btn p-2"><Mail size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'products' && (
                        <>
                            <div className="nexus-page-header">
                                <div className="nexus-page-title">
                                    <h1>Products</h1>
                                    <p>Catalog with SKU, price and real-time stock.</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="relative flex items-center h-[38px]">                                        <Search className="absolute left-3 text-gray-400" size={16} />                                        <input type="text" placeholder="Search products..." className="nexus-input !pl-9 h-full w-64 m-0" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />                                    </div>
                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <button className={`p-2 ${productView === 'list' ? 'bg-slate-100' : ''}`} onClick={() => setProductView('list')}><List size={18}/></button>
                                        <button className={`p-2 ${productView === 'grid' ? 'bg-slate-100' : ''}`} onClick={() => setProductView('grid')}><Grid size={18}/></button>
                                    </div>
                                    <button className="nexus-btn primary" onClick={openNewProductModal}>
                                        <Plus size={18} /> New product
                                    </button>
                                </div>
                            </div>

                            {productView === 'list' ? (
                                <div className="nexus-table-wrapper">
                                    <table className="nexus-table">
                                        <thead>
                                            <tr>
                                                <SortableHeader field="name" label="Product" />
                                                <SortableHeader field="sku" label="SKU" />
                                                <SortableHeader field="price" label="Price" />
                                                <SortableHeader field="stock" label="Stock" />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedProducts.map(p => (
                                                <tr key={p.id}>
                                                    <td className="font-medium">{p.name}</td>
                                                    <td className="text-gray-500 font-mono text-sm">{p.sku}</td>
                                                    <td className="font-medium">${parseFloat(p.price).toFixed(2)}</td>
                                                    <td>
                                                        {getBranchStock(p, selectedBranch) <= 0 ? <span className="nexus-badge solid-red">Out of stock</span> : 
                                                         getBranchStock(p, selectedBranch) < 10 ? <span className="nexus-badge soft-gray">Low ({getBranchStock(p, selectedBranch)})</span> : 
                                                         <span className="nexus-badge soft-gray">{getBranchStock(p, selectedBranch)} in stock</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-4">
                                    {paginatedProducts.map(p => (
                                        <div key={p.id} className="nexus-card flex flex-col justify-between">
                                            <div className="w-full h-32 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-slate-300">
                                                <Package size={48} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400 font-mono mb-1">{p.sku}</div>
                                                <div className="font-medium mb-3">{p.name}</div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="font-bold text-lg">${parseFloat(p.price).toFixed(2)}</div>
                                                {getBranchStock(p, selectedBranch) <= 0 ? <span className="nexus-badge outline-red">Out</span> : <span className="text-sm text-gray-500">{getBranchStock(p, selectedBranch)} left</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Pagination total={filteredProductsGlobal.length} page={pageInventory} setPage={setPageInventory} />
                        </>
                    )}

                    {activeTab === 'sales' && (
                        <>
                            <div className="nexus-page-header">
                                <div className="nexus-page-title">
                                    <h1>Sales</h1>
                                    <p>Every transaction deducts stock automatically. Invoices emailed on payment.</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="relative flex items-center h-[38px]">                                        <Search className="absolute left-3 text-gray-400" size={16} />                                        <input type="text" placeholder="Search sales..." className="nexus-input !pl-9 h-full w-64 m-0" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />                                    </div>
                                    <button className="nexus-btn primary" onClick={() => setIsPosOpen(true)}>
                                        <Plus size={18} /> New sale
                                    </button>
                                </div>
                            </div>

                            <div className="nexus-table-wrapper">
                                <table className="nexus-table">
                                    <thead>
                                        <tr>
                                            <SortableHeader field="invoice_number" label="Invoice" />
                                            <SortableHeader field="created_at" label="Date" />
                                            <SortableHeader field="customer.first_name" label="Customer" />
                                            <SortableHeader field="total_amount" label="Total" />
                                            <SortableHeader field="status" label="Status" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedSales.map(s => (
                                            <tr key={s.id}>
                                                <td className="text-gray-500 font-mono text-sm">INV-{new Date(s.created_at).toISOString().split('T')[0].replace(/-/g, '')}-{s.id.toString().padStart(3, '0')}</td>
                                                <td>{new Date(s.created_at).toISOString().split('T')[0]}</td>
                                                <td className="font-medium">{s.customer.first_name} {s.customer.last_name}</td>
                                                <td className="font-medium">${parseFloat(s.total_amount).toFixed(2)}</td>
                                                <td><span className="nexus-badge solid-dark">paid</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination total={filteredSales.length} page={pageSales} setPage={setPageSales} />
                        </>
                    )}

                    {activeTab === 'customers' && (
                        <>
                            <div className="nexus-page-header">
                                <div className="nexus-page-title">
                                    <h1>Customers</h1>
                                    <p>Complete purchase history, frequency and lifecycle status.</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="relative flex items-center h-[38px]">                                        <Search className="absolute left-3 text-gray-400" size={16} />                                        <input type="text" placeholder="Search customers..." className="nexus-input !pl-9 h-full w-64 m-0" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />                                    </div>
                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <button className={`p-2 ${customerView === 'list' ? 'bg-slate-100' : ''}`} onClick={() => setCustomerView('list')}><List size={18}/></button>
                                        <button className={`p-2 ${customerView === 'grid' ? 'bg-slate-100' : ''}`} onClick={() => setCustomerView('grid')}><Grid size={18}/></button>
                                    </div>
                                    <button className="nexus-btn primary" onClick={() => setIsNewCustomerOpen(true)}>
                                        <Plus size={18} /> Add customer
                                    </button>
                                </div>
                            </div>

                            {customerView === 'list' ? (
                                <div className="nexus-table-wrapper">
                                    <table className="nexus-table">
                                        <thead>
                                            <tr>
                                                <SortableHeader field="first_name" label="Customer" />
                                                <SortableHeader field="email" label="Contact" />
                                                <SortableHeader field="last_purchase_date" label="Last Purchase" />
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedActiveCustomers.map(c => {
                                                const isLost = lostCustomers.find(lc => lc.id === c.id);
                                                return (
                                                    <tr key={c.id}>
                                                        <td className="font-medium">{c.first_name} {c.last_name}</td>
                                                        <td><button onClick={() => openEmailModal(c)} className="text-blue-600 hover:underline">{c.email}</button></td>
                                                        <td>{c.last_purchase_date ? new Date(c.last_purchase_date).toISOString().split('T')[0] : 'Never'}</td>
                                                        <td><span className={`nexus-badge ${isLost ? 'solid-red' : 'solid-dark'}`}>{isLost ? 'lost' : 'active'}</span></td>
                                                        <td>
                                                            <button className="nexus-btn" onClick={() => { setHistoryTarget(c); setIsHistoryOpen(true); }} title="History"><ShoppingCart size={16}/></button>
                                                            <button className="nexus-btn" onClick={() => { openEmailModal(c); }}><Mail size={16}/></button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="customers-grid">
                                        {paginatedActiveCustomers.map(c => {
                                        const isLost = lostCustomers.find(lc => lc.id === c.id);
                                        return (
                                            <div key={c.id} className="nexus-card">
                                                <div className="customer-card-header">
                                                    <div className="flex items-center gap-3">
                                                        <div className="nexus-avatar">
                                                            {c.first_name[0]}{c.last_name[0]}
                                                        </div>
                                                        <div className="nexus-user-info">
                                                            <span className="nexus-user-name">{c.first_name} {c.last_name}</span>
                                                            <span className="nexus-user-email">{c.email}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`nexus-badge ${isLost ? 'solid-red' : 'solid-dark'}`}>
                                                        {isLost ? 'lost' : 'active'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-100 pb-3 mb-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500">Last Purchase</span>
                                                        <span className="font-medium text-sm">{c.last_purchase_date ? new Date(c.last_purchase_date).toISOString().split('T')[0] : 'Never'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="nexus-btn w-full justify-center" onClick={() => { setHistoryTarget(c); setIsHistoryOpen(true); }}><ShoppingCart size={16}/> History</button>
                                                    <button className="nexus-btn w-full justify-center" onClick={() => { openEmailModal(c); }}><Mail size={16}/> Email</button>
                                                    <a href="tel:+15550000" className="nexus-btn w-full justify-center"><Phone size={16}/> Call</a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <Pagination total={filteredActiveCustomers.length} page={pageActiveCustomers} setPage={setPageActiveCustomers} />
                        </>
                    )}

                    {activeTab === 'lost' && (
                        <>
                            <div className="nexus-page-header">
                                <div className="nexus-page-title">
                                    <h1>Lost Customers</h1>
                                    <p>Inactive for {inactivityThreshold}+ days. Assign to an employee and re-engage.</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="relative flex items-center h-[38px]">                                        <Search className="absolute left-3 text-gray-400" size={16} />                                        <input type="text" placeholder="Search lost customers..." className="nexus-input !pl-9 h-full w-64 m-0" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />                                    </div>
                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden mr-2">
                                        <button className={`p-2 ${lostView === 'list' ? 'bg-slate-100' : ''}`} onClick={() => setLostView('list')}><List size={18}/></button>
                                        <button className={`p-2 ${lostView === 'grid' ? 'bg-slate-100' : ''}`} onClick={() => setLostView('grid')}><Grid size={18}/></button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Threshold:</span>
                                        <select className="nexus-input py-1 px-2" value={inactivityThreshold} onChange={e => setInactivityThreshold(parseInt(e.target.value))}>
                                            <option value="30">30 days</option>
                                            <option value="60">60 days</option>
                                            <option value="90">90 days</option>
                                            <option value="120">120 days</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {lostView === 'list' ? (
                                <div className="nexus-table-wrapper">
                                    <table className="nexus-table">
                                        <thead>
                                            <tr>
                                                <th className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleSort('first_name')}>
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
                                                </th>
                                                <th>
                                                    <select className="bg-transparent border-0 font-semibold text-gray-500 uppercase text-xs tracking-wider outline-none p-0 cursor-pointer" value={assignmentFilter} onChange={e => setAssignmentFilter(e.target.value)}>
                                                        <option value="all">Status (All)</option>
                                                        <option value="assigned">Assigned</option>
                                                        <option value="unassigned">Unassigned</option>
                                                    </select>
                                                </th>
                                                <th>Assigned To</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedLostCustomers.map(c => (
                                                <tr key={c.id} className={c.assigned_employee_id ? 'bg-green-50' : ''}>
                                                    <td className="font-medium">{c.first_name} {c.last_name}</td>
                                                    <td>{c.last_purchase_date ? new Date(c.last_purchase_date).toISOString().split('T')[0] : 'Never'}</td>
                                                    <td>
                                                        {c.assigned_employee_id 
                                                            ? <span className="nexus-badge solid-green text-[10px] tracking-wider font-bold px-2 py-1">ASSIGNED</span> 
                                                            : <span className="nexus-badge solid-gray text-[10px] tracking-wider font-bold px-2 py-1">UNASSIGNED</span>}
                                                    </td>
                                                    <td style={{minWidth: '250px'}}>
                                                        <Select menuPosition="fixed" menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} 
                                                            options={employeeOptions}
                                                            value={employeeOptions.find(opt => opt.value === c.assigned_employee_id)}
                                                            onChange={(selected) => handleAssignEmployee(c.id, selected.value)}
                                                            placeholder="Select employee..."
                                                        />
                                                    </td>
                                                    <td>
                                                        <button className="nexus-btn" onClick={() => { setHistoryTarget(c); setIsHistoryOpen(true); }}>History</button>
                                                        <button className="nexus-btn primary" onClick={() => { openEmailModal(c); }}>Email</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="customers-grid">
                                        {paginatedLostCustomers.map(c => (
                                        <div key={c.id} className={`nexus-card ${c.assigned_employee_id ? 'bg-green-50 border-green-200' : ''}`}>
                                            <div className="customer-card-header">
                                                <div className="nexus-user-info">
                                                    <span className="nexus-user-name text-lg">{c.first_name} {c.last_name}</span>
                                                    <span className="nexus-user-email">{c.email}</span>
                                                </div>
                                                {c.assigned_employee_id 
                                                    ? <span className="nexus-badge solid-green text-[10px] tracking-wider font-bold px-2 py-1">ASSIGNED</span> 
                                                    : <span className="nexus-badge solid-gray text-[10px] tracking-wider font-bold px-2 py-1">UNASSIGNED</span>}
                                            </div>
                                            <div className="mt-4 mb-2 text-sm text-gray-500 font-medium">Assign Employee</div>
                                            <div className="mb-4">
                                                <Select menuPosition="fixed" menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} 
                                                    options={employeeOptions}
                                                    value={employeeOptions.find(opt => opt.value === c.assigned_employee_id)}
                                                    onChange={(selected) => handleAssignEmployee(c.id, selected.value)}
                                                    placeholder="Search to assign..."
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="nexus-btn w-full justify-center" onClick={() => { setHistoryTarget(c); setIsHistoryOpen(true); }}><ShoppingCart size={16}/> History</button>
                                                <button className="nexus-btn w-full justify-center" onClick={() => { openEmailModal(c); }}><Mail size={16}/> Email</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Pagination total={filteredLostCustomers.length} page={pageLostCustomers} setPage={setPageLostCustomers} />
                        </>
                    )}

                    {activeTab === 'employees' && (
                        <>
                            <div className="nexus-page-header">
                                <div className="nexus-page-title">
                                    <h1>Employees</h1>
                                    <p>KPI grows automatically when an assigned lost customer buys again.</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="relative flex items-center h-[38px]">                                        <Search className="absolute left-3 text-gray-400" size={16} />                                        <input type="text" placeholder="Search employees..." className="nexus-input !pl-9 h-full w-64 m-0" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />                                    </div>
                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <button className={`p-2 ${employeeView === 'list' ? 'bg-slate-100' : ''}`} onClick={() => setEmployeeView('list')}><List size={18}/></button>
                                    <button className={`p-2 ${employeeView === 'grid' ? 'bg-slate-100' : ''}`} onClick={() => setEmployeeView('grid')}><Grid size={18}/></button>
                                </div>
                                </div>
                            </div>

                            {employeeView === 'list' ? (
                                <div className="nexus-table-wrapper">
                                    <table className="nexus-table">
                                        <thead>
                                            <tr>
                                                <SortableHeader field="first_name" label="Employee" />
                                                <SortableHeader field="email" label="Email" />
                                                <SortableHeader field="kpi_score" label="KPI Score" />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedEmployees.map(e => (
                                                <tr key={e.id}>
                                                    <td className="font-medium">{e.first_name} {e.last_name}</td>
                                                    <td>{e.email}</td>
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold">{e.kpi_score}/100</span>
                                                            <div className="w-32 bg-slate-100 h-2 rounded-full">
                                                                <div className="bg-slate-900 h-2 rounded-full" style={{width: `${Math.min(e.kpi_score, 100)}%`}}></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="customers-grid">
                                    {paginatedEmployees.map(e => (
                                        <div key={e.id} className="nexus-card">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="nexus-avatar bg-slate-900 text-white">
                                                    {e.first_name[0]}{e.last_name[0]}
                                                </div>
                                                <div className="nexus-user-info">
                                                    <span className="nexus-user-name text-lg">{e.first_name} {e.last_name}</span>
                                                    <span className="nexus-user-email">Sales Rep</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-xs text-gray-500 font-medium">KPI Score</span>
                                                <span className="font-bold text-sm">{e.kpi_score}/100</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full mb-4">
                                                <div className="bg-slate-900 h-2 rounded-full" style={{width: `${Math.min(e.kpi_score, 100)}%`}}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Pagination total={filteredEmployees.length} page={pageEmployees} setPage={setPageEmployees} />
                        </>
                    )}

                    {activeTab === 'branches' && (
                        <>
                            <div className="nexus-page-header">
                                <div className="nexus-page-title">
                                    <h1>Branches</h1>
                                    <p>Multi-location inventory and per-branch sales.</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="relative flex items-center h-[38px]">                                        <Search className="absolute left-3 text-gray-400" size={16} />                                        <input type="text" placeholder="Search branches..." className="nexus-input !pl-9 h-full w-64 m-0" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />                                    </div>
                                </div>
                            </div>

                            <div className="customers-grid">
                                {paginatedBranches.map(branch => (
                                    <div key={branch.id} className="nexus-card">
                                        <h3 className="font-bold text-lg mb-1">{branch.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mb-4"><MapPin size={14}/> {branch.address || 'Address not set'}</p>
                                        <div className="flex justify-between border-t border-gray-100 pt-4">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Status</div>
                                                <div className="font-bold text-lg text-green-600">Active</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination total={filteredBranches.length} page={pageBranches} setPage={setPageBranches} />
                        </>
                    )}
                </div>

            {/* POS Modal */}
            {isPosOpen && (
                <div className="nexus-modal-overlay">
                    <div className="nexus-modal !max-w-none !max-h-none !w-screen !h-screen !rounded-none !border-0 !m-0 min-w-full">
                        <div className="nexus-modal-header">
                            <div className="nexus-page-title">
                                <h1>Point of Sale</h1>
                                <p>Search products, build the order, and check out.</p>
                            </div>
                            <button className="nexus-icon-btn" onClick={() => setIsPosOpen(false)}><X size={24} /></button>
                        </div>
                        <div className="nexus-modal-body bg-slate-50 p-0 flex flex-1 overflow-hidden h-full">
                            <div className="w-2/3 p-6 border-r border-gray-200 overflow-y-auto flex flex-col">
                                <div className="nexus-search w-full mb-6 flex-shrink-0">
                                    <Search size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search product or SKU..." 
                                        value={productFilter}
                                        onChange={e => setProductFilter(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto content-start">
                                    {filteredProducts.map(p => (
                                        <div key={p.id} className="nexus-card cursor-pointer hover:border-slate-400" onClick={() => addToCart(p)}>
                                            <div className="font-medium">{p.name}</div>
                                            <div className="text-xs text-gray-400 font-mono mb-4">{p.sku}</div>
                                            <div className="flex justify-between items-center">
                                                <div className="font-bold text-lg">${parseFloat(p.price).toFixed(2)}</div>
                                                {getBranchStock(p, selectedBranch) <= 0 ? (
                                                    <span className="nexus-badge soft-red">Out</span>
                                                ) : (
                                                    <span className="text-sm text-gray-500">{getBranchStock(p, selectedBranch)} left</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-1/3 p-6 flex flex-col bg-white">
                                <div className="nexus-form-group flex-shrink-0">
                                    <label>Customer</label>
                                    <Select menuPosition="fixed" menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} 
                                        options={customerOptions}
                                        value={selectedCustomer}
                                        onChange={(opt) => {
                                            const prevKey = selectedCustomer ? selectedCustomer.value : 'walk-in';
                                            const nextKey = opt ? opt.value : 'walk-in';
                                            
                                            setSavedCarts(prev => {
                                                const newSaved = { ...prev, [prevKey]: cart };
                                                setCart(newSaved[nextKey] || []);
                                                return newSaved;
                                            });
                                            
                                            setSelectedCustomer(opt);
                                        }}
                                        placeholder="Search customer..."
                                        isClearable
                                    />
                                    {(() => {
                                        const currentKey = selectedCustomer ? String(selectedCustomer.value) : 'walk-in';
                                        const savedKeys = Object.keys(savedCarts).filter(key => key !== currentKey && savedCarts[key].length > 0);
                                        
                                        if (savedKeys.length === 0) return null;
                                        
                                        return (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {savedKeys.map(key => {
                                                    const label = key === 'walk-in' ? 'Walk-in Customer' : (customerOptions.find(opt => String(opt.value) === key)?.label || 'Unknown Customer');
                                                    return (
                                                        <div key={key} className="inline-flex items-center bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                                            <span 
                                                                className="cursor-pointer font-medium hover:text-blue-600 transition-colors"
                                                                onClick={() => {
                                                                    const prevKey = selectedCustomer ? String(selectedCustomer.value) : 'walk-in';
                                                                    setSavedCarts(prev => {
                                                                        const newSaved = { ...prev, [prevKey]: cart };
                                                                        setCart(newSaved[key] || []);
                                                                        return newSaved;
                                                                    });
                                                                    if (key === 'walk-in') {
                                                                        setSelectedCustomer(null);
                                                                    } else {
                                                                        setSelectedCustomer(customerOptions.find(opt => String(opt.value) === key) || null);
                                                                    }
                                                                }}
                                                            >
                                                                {label} ({savedCarts[key].length})
                                                            </span>
                                                            <button 
                                                                className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSavedCarts(prev => {
                                                                        const newSaved = { ...prev };
                                                                        delete newSaved[key];
                                                                        return newSaved;
                                                                    });
                                                                }}
                                                                title="Clear saved cart"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </div>
                                
                                <div className="flex-1 overflow-y-auto mt-4">
                                    {cart.map(item => (
                                        <div key={item.product_id} className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <input 
                                                        type="number" 
                                                        className="nexus-input !py-1 !px-2 !w-16 !text-center !text-sm"
                                                        value={item.quantity}
                                                        onChange={(e) => updateCartQty(item.product_id, e.target.value)}
                                                        min="1"
                                                        max={item.stock}
                                                    />
                                                    <span className="text-sm text-gray-500">@ ${parseFloat(item.price).toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="font-semibold">${(item.quantity * item.price).toFixed(2)}</div>
                                                <button className="text-red-500 hover:text-red-700 p-1" onClick={() => removeFromCart(item.product_id)}>
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {cart.length === 0 && (
                                        <div className="h-full flex items-center justify-center text-gray-400">
                                            Cart is empty
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-200 flex-shrink-0">
                                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold mb-4">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <button 
                                        className="nexus-btn primary w-full justify-center py-5 text-xl font-bold shadow-md hover:shadow-lg transition-all"
                                        onClick={checkout}
                                    >
                                        Complete Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Product Modal */}
            {isNewProductOpen && (
                <div className="nexus-modal-overlay">
                    <div className="nexus-modal max-w-[500px]">
                        <div className="nexus-modal-header">
                            <div className="nexus-page-title">
                                <h1>New Product</h1>
                            </div>
                            <button className="nexus-icon-btn" onClick={() => setIsNewProductOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreateProduct} className="nexus-modal-body">
                            <div className="nexus-form-group">
                                <label>Product Name</label>
                                <input type="text" className="nexus-input" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required/>
                            </div>
                            <div className="nexus-form-group">
                                <label>SKU</label>
                                <input type="text" className="nexus-input" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} required/>
                            </div>
                            <div className="flex gap-4">
                                <div className="nexus-form-group flex-1">
                                    <label>Price ($)</label>
                                    <input type="number" step="0.01" className="nexus-input" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required/>
                                </div>
                                <div className="nexus-form-group flex-1">
                                    <label>Initial Stock</label>
                                    <input type="number" className="nexus-input" value={newProduct.stock_quantity} onChange={e => setNewProduct({...newProduct, stock_quantity: e.target.value})} required/>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button type="button" className="nexus-btn" onClick={() => setIsNewProductOpen(false)}>Cancel</button>
                                <button type="submit" className="nexus-btn primary">Create product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* New Customer Modal */}
            {isNewCustomerOpen && (
                <div className="nexus-modal-overlay">
                    <div className="nexus-modal max-w-[500px]">
                        <div className="nexus-modal-header">
                            <div className="nexus-page-title">
                                <h1>New Customer</h1>
                            </div>
                            <button className="nexus-icon-btn" onClick={() => setIsNewCustomerOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreateCustomer} className="nexus-modal-body">
                            <div className="flex gap-4">
                                <div className="nexus-form-group flex-1">
                                    <label>First Name</label>
                                    <input type="text" className="nexus-input" value={newCustomer.first_name} onChange={e => setNewCustomer({...newCustomer, first_name: e.target.value})} required/>
                                </div>
                                <div className="nexus-form-group flex-1">
                                    <label>Last Name</label>
                                    <input type="text" className="nexus-input" value={newCustomer.last_name} onChange={e => setNewCustomer({...newCustomer, last_name: e.target.value})} required/>
                                </div>
                            </div>
                            <div className="nexus-form-group">
                                <label>Email Address</label>
                                <input type="email" className="nexus-input" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} required/>
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button type="button" className="nexus-btn" onClick={() => setIsNewCustomerOpen(false)}>Cancel</button>
                                <button type="submit" className="nexus-btn primary">Create customer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Email Modal */}
            
            {/* History Modal */}
            {isHistoryOpen && historyTarget && (
                <div className="nexus-modal-overlay">
                    <div className="nexus-modal max-w-2xl">
                        <div className="nexus-modal-header">
                            <h3 className="font-bold text-lg">Purchase History: {historyTarget.first_name} {historyTarget.last_name}</h3>
                            <button className="nexus-icon-btn" onClick={() => setIsHistoryOpen(false)}>✕</button>
                        </div>
                        <div className="nexus-modal-body max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Purchase Frequency</div>
                                    <div className="text-2xl font-bold">{historyTarget.sales?.length || 0} Orders</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Lifetime Value</div>
                                    <div className="text-2xl font-bold">${historyTarget.sales?.reduce((sum, s) => sum + parseFloat(s.total_amount), 0).toFixed(2) || '0.00'}</div>
                                </div>
                            </div>
                            <h4 className="font-bold mb-3">Recent Purchases</h4>
                            {historyTarget.sales && historyTarget.sales.length > 0 ? (
                                <table className="nexus-table">
                                    <thead>
                                        <tr>
                                            <SortableHeader field="created_at" label="Date" />
                                            <th>Items</th>
                                            <SortableHeader field="total_amount" label="Total" />
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
                                                <td className="font-bold">${parseFloat(sale.total_amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500 italic">No purchase history found for this customer.</p>
                            )}
                        </div>
                        <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                            <button className="nexus-btn" onClick={() => setIsHistoryOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {isEmailOpen && emailTarget && (
                <div className="nexus-modal-overlay">
                    <div className="nexus-modal max-w-[600px]">
                        <div className="nexus-modal-header">
                            <div className="nexus-page-title">
                                <h1>Compose Email</h1>
                                <p>To: {emailTarget.first_name} {emailTarget.last_name} ({emailTarget.email})</p>
                            </div>
                            <button className="nexus-icon-btn" onClick={() => setIsEmailOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSendEmail} className="nexus-modal-body">
                            <div className="nexus-form-group">
                                <label>Subject</label>
                                <input type="text" className="nexus-input" value={emailForm.subject} onChange={e => setEmailForm({...emailForm, subject: e.target.value})} required/>
                            </div>
                            <div className="nexus-form-group">
                                <label>Message</label>
                                <textarea className="nexus-input min-h-[150px]" value={emailForm.message} onChange={e => setEmailForm({...emailForm, message: e.target.value})} required></textarea>
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button type="button" className="nexus-btn" onClick={() => setIsEmailOpen(false)}>Cancel</button>
                                <button type="submit" className="nexus-btn primary">Send Email</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Toaster position="top-right" containerStyle={{ zIndex: 999999 }} />
        </NexusLayout>
    );
}
