import React, { useState, useEffect } from 'react';
import type { Announcement } from '../types.ts';
import Button from './ui/Button.tsx';

interface AnnouncementFormProps {
    announcement?: Announcement | null;
    onSave: (data: Omit<Announcement, 'id'>) => void;
    onClose: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ announcement, onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [error, setError] = useState('');

    useEffect(() => {
        if (announcement) {
            setTitle(announcement.title);
            setContent(announcement.content);
            setDate(new Date(announcement.date).toISOString().slice(0, 10));
        } else {
            setTitle('');
            setContent('');
            setDate(new Date().toISOString().slice(0, 10));
        }
        setError('');
    }, [announcement]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required.');
            return;
        }
        onSave({ title, content, date });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium">Title</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium">Content</label>
                    <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={5} className="mt-1 block w-full border rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium">Date</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
        </form>
    );
};

export default AnnouncementForm;