import React from 'react';
import type { Comment } from '../../types.ts';

interface CommentListProps {
    comments: Comment[];
}

/**
 * Renders a list of comments for an article.
 * @param {CommentListProps} props The component props.
 * @returns {JSX.Element} The rendered list of comments.
 */
const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    if (comments.length === 0) {
        return <p className="text-gray-500">No comments yet. Be the first to comment!</p>;
    }
    
    // Sort comments from newest to oldest
    const sortedComments = [...comments].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-6">
            {sortedComments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                        {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-800">{comment.author}</p>
                            <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                        <p className="text-gray-600 mt-1">{comment.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentList;