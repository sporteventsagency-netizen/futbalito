

import React from 'react';
import Card from '../components/ui/Card.tsx';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';

const Marketplace: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Marketplace</h1>
            <p className="mt-2 text-gray-600">Upgrade your plan to unlock PRO features.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-2 border-transparent">
                    <h2 className="text-2xl font-bold text-gray-800">Standard Plan</h2>
                    <p className="mt-2 text-gray-500">For small leagues and communities.</p>
                    <p className="mt-6 text-4xl font-extrabold text-gray-900">Free</p>
                     <ul className="mt-6 space-y-2 text-gray-600">
                        <li>Basic competition management</li>
                        <li>Team and player registration</li>
                        <li>Public results page</li>
                    </ul>
                    <Button variant="outline" className="mt-8 w-full" disabled>Current Plan</Button>
                </Card>
                <Card className="border-2 border-blue-500 relative">
                    <div className="absolute top-0 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">Most Popular</div>
                    <h2 className="text-2xl font-bold text-blue-600">PRO Plan</h2>
                    <p className="mt-2 text-gray-500">Advanced tools for professional organizations.</p>
                    <p className="mt-6 text-4xl font-extrabold text-gray-900">$49 <span className="text-base font-medium text-gray-500">/mo</span></p>
                    <ul className="mt-6 space-y-2 text-gray-600">
                        <li>Advanced referee management</li>
                        <li>Player transfers and penalties</li>
                        <li>Advanced match commentary</li>
                        <li>Data import/export (XLS, PDF)</li>
                        <li>Full Web Builder access</li>
                    </ul>
                    <Button variant="primary" className="mt-8 w-full">Upgrade to PRO</Button>
                </Card>
            </div>
        </div>
    );
};

export default Marketplace;
