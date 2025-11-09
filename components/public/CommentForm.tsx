import React, { useState } from 'react';
import Button from '../ui/Button.tsx';

interface CommentFormProps {
    onAddComment: (author: string, content: string) => void;
}

/**
 * A form for users to submit a new comment.
 * Includes fields for author's name and comment content.
 * @param {CommentFormProps} props The component props.
 * @returns {JSX.Element} The rendered comment form.
 */
const CommentForm: React.FC<CommentFormProps> = ({ onAddComment }) => {
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!author.trim() || !content.trim()) {
            setError('Both name and comment are required.');
            return;
        }
        onAddComment(author, content);
        // Reset form after submission
        setAuthor('');
        setContent('');
        setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="author" className="sr-only">Your Name</label>
                    <input 
                        id="author"
                        type="text" 
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        placeholder="Your Name"
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="content" className="sr-only">Your Comment</label>
                    <textarea 
                        id="content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Write your comment here..."
                        rows={4}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="text-right">
                    <Button type="submit">Post Comment</Button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;