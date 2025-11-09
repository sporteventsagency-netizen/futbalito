
import React, { useState, useEffect } from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
import { ChevronLeftIcon } from '../components/icons/Icons.tsx';
// FIX: Added .ts extension to module import.
import type { Article } from '../types.ts';

interface EditArticleProps {
  competitionId: string;
  articleId: string | null;
  onBack: () => void;
}

const EditArticle: React.FC<EditArticleProps> = ({ competitionId, articleId, onBack }) => {
  const { getArticleById, addArticle, updateArticle } = useCompetitions();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingArticle, setExistingArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (articleId) {
      const article = getArticleById(articleId);
      if (article) {
        setExistingArticle(article);
        setTitle(article.title);
        setContent(article.content);
        setPreviewUrl(article.featuredImageUrl);
      }
    }
  }, [articleId, getArticleById]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = (status: 'draft' | 'published') => {
    if (!title.trim() || !content.trim()) {
        alert('Title and content are required.');
        return;
    }
    
    const articleData = { competitionId, title, content, status };
    if (existingArticle) {
      updateArticle({ ...existingArticle, ...articleData }, imageFile);
    } else {
      addArticle(articleData, imageFile);
    }
    onBack();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Articles
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{articleId ? 'Edit Article' : 'Create New Article'}</h1>
        </div>
        <div className="space-x-2">
            <Button onClick={() => handleSave('draft')} variant="secondary">Save as Draft</Button>
            <Button onClick={() => handleSave('published')}>Publish Article</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Featured Image</label>
          {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 rounded-lg max-h-64 w-full object-cover" />}
          <input type="file" onChange={handleFileChange} accept="image/*" className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={15} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;
