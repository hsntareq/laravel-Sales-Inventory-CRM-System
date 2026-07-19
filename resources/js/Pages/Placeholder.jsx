import { Head, Link } from '@inertiajs/react';
import NexusLayout from '@/Layouts/NexusLayout';

export default function Placeholder({ title }) {
    return (
        <NexusLayout>
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Head title={title} />
                <h1 className="text-3xl font-bold text-slate-800 mb-4">{title}</h1>
                <p className="text-slate-500 mb-8">This page is currently under construction.</p>
                <Link href="/dashboard" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                    Back to Dashboard
                </Link>
            </div>
        </NexusLayout>
    );
}
