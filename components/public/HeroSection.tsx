import React from 'react';
import type { Article, Competition } from '../../types.ts';
import { useCompetitions } from '../../context/CompetitionContext.tsx';
import { ArrowRightIcon } from '../icons/Icons.tsx';

interface HeroSectionProps {
  heroArticle: Article | null;
}

/**
 * The Hero Section for the main portal homepage.
 * It displays the most recent published article from any public competition.
 * @param {HeroSectionProps} props The component props.
 * @returns {JSX.Element | null} The rendered hero section or null if no article is available.
 */
const HeroSection: React.FC<HeroSectionProps> = ({ heroArticle }) => {
  const { getCompetitionById } = useCompetitions();

  if (!heroArticle) {
    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-800">Welcome to Futbalito Portal</h1>
            <p className="mt-4 text-lg text-gray-600">Your central hub for all competitions. Select a competition below to get started.</p>
        </div>
    );
  }
  
  const competition = getCompetitionById(heroArticle.competitionId);
  const articleUrl = `${window.location.origin}${window.location.pathname}?publicCompetitionId=${heroArticle.competitionId}&articleId=${heroArticle.id}`;


  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <span className="text-sm font-bold uppercase tracking-widest mb-2" style={{color: competition?.publicConfig?.primaryColor || '#000'}}>{competition?.name}</span>
          <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">
            {heroArticle.title}
          </h1>
          <p className="mt-4 text-gray-600 line-clamp-3">
            {heroArticle.content}
          </p>
          <a href={articleUrl} className="inline-flex items-center mt-6 font-bold text-lg group" style={{color: competition?.publicConfig?.primaryColor || '#000'}}>
            Read More
            <ArrowRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="hidden md:block">
            <img src={heroArticle.featuredImageUrl} alt={heroArticle.title} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
