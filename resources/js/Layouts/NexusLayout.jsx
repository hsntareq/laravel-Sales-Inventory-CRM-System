import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard, Package, ShoppingCart, Users, UserX, UsersRound, MapPin
} from 'lucide-react';
import '../../css/custom.css';

export default function NexusLayout({ children, activeTab = null, onTabChange = null }) {
    const { auth } = usePage().props;
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    
    const currentTab = activeTab || (typeof window !== 'undefined' 
        ? new URLSearchParams(window.location.search).get('tab') || 'dashboard'
        : 'dashboard');
        
    const isProfileRoute = usePage().url.startsWith('/profile');
    const isBillingRoute = usePage().url.startsWith('/billing');
    const isSettingsRoute = usePage().url.startsWith('/settings');

    const getIsActive = (tab) => {
        if (!activeTab && (isProfileRoute || isBillingRoute || isSettingsRoute)) return false;
        return currentTab === tab;
    };

    const handleTabClick = (e, tab) => {
        e.preventDefault();
        if (onTabChange) {
            onTabChange(tab);
        } else {
            router.visit(`/dashboard?tab=${tab}`);
        }
    };

    return (
        <div className="nexus-layout">
            <aside className="nexus-sidebar">
                <div className="nexus-logo">
                    <div className="nexus-logo-icon">N</div>
                    <div className="nexus-logo-text">
                        <span>Nexus ERP</span>
                        <span className="nexus-logo-subtext">Sales · CRM · Stock</span>
                    </div>
                </div>

                <nav className="nexus-nav">
                    <a href="/dashboard?tab=dashboard" onClick={(e) => handleTabClick(e, 'dashboard')} className={`nexus-nav-item ${getIsActive('dashboard') ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </a>
                    <a href="/dashboard?tab=products" onClick={(e) => handleTabClick(e, 'products')} className={`nexus-nav-item ${getIsActive('products') ? 'active' : ''}`}>
                        <Package size={20} /> Products
                    </a>
                    <a href="/dashboard?tab=sales" onClick={(e) => handleTabClick(e, 'sales')} className={`nexus-nav-item ${getIsActive('sales') ? 'active' : ''}`}>
                        <ShoppingCart size={20} /> Sales
                    </a>
                    <a href="/dashboard?tab=customers" onClick={(e) => handleTabClick(e, 'customers')} className={`nexus-nav-item ${getIsActive('customers') ? 'active' : ''}`}>
                        <Users size={20} /> Customers
                    </a>
                    <a href="/dashboard?tab=lost" onClick={(e) => handleTabClick(e, 'lost')} className={`nexus-nav-item ${getIsActive('lost') ? 'active' : ''}`}>
                        <UserX size={20} /> Lost Customers
                    </a>
                    <a href="/dashboard?tab=employees" onClick={(e) => handleTabClick(e, 'employees')} className={`nexus-nav-item ${getIsActive('employees') ? 'active' : ''}`}>
                        <UsersRound size={20} /> Employees
                    </a>
                    <a href="/dashboard?tab=branches" onClick={(e) => handleTabClick(e, 'branches')} className={`nexus-nav-item ${getIsActive('branches') ? 'active' : ''}`}>
                        <MapPin size={20} /> Branches
                    </a>
                </nav>

                <div className="nexus-user-profile cursor-pointer relative" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
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
                                <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50">My profile</Link>
                                <Link href={route('billing')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50">Billing</Link>
                                <Link href={route('settings')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50">Settings</Link>
                            </div>
                            <div className="py-1 border-t border-gray-50">
                                <a href="#" onClick={(e) => { e.preventDefault(); router.post('/logout'); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"><UserX size={14} /> Sign out</a>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            <main className="nexus-main">
                {children}
            </main>
        </div>
    );
}
