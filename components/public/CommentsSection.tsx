import React from 'react';
import { useCompetitions } from '../../context/CompetitionContext.tsx';
import CommentList from './CommentList.tsx';
import CommentForm from './CommentForm.tsx';

interface CommentsSectionProps {
    articleId: string;
}

/**
 * Main component for handling the entire comments section for an article.
 * It fetches the relevant comments and provides the functionality to add new ones.
 * @param {CommentsSectionProps} props The component props.
 * @returns {JSX.Element} The rendered comments section.
 */
const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId }) => {
    const { comments, addComment } = useCompetitions();

    // Filter comments for the current article
    const articleComments = comments.filter(c => c.articleId === articleId);

    const handleAddComment = (author: string, content: string) => {
        addComment({ articleId, author, content });
    };

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Comments ({articleComments.length})</h2>
            <div className="space-y-8">
                <CommentForm onAddComment={handleAddComment} />
                <CommentList comments={articleComments} />
            </div>
        </div>
    );
};

export default CommentsSection;