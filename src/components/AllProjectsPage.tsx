import React, { useState } from 'react';
import { ArrowLeft, Search, Github, ExternalLink, Sun, Moon } from 'lucide-react';
import { Project, GitHubRepo } from '../types/portfolio';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { PERSONAL_INFO } from '../data/staticData';

interface AllProjectsPageProps {
  featuredProjects: Project[];
  githubRepos: GitHubRepo[];
  onBack: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const AllProjectsPage: React.FC<AllProjectsPageProps> = ({
  featuredProjects,
  githubRepos,
  onBack,
  isDark,
  onToggleTheme,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Combine featured projects with GitHub repos into a unified list
  const combinedProjects: Project[] = [
    ...featuredProjects,
    ...githubRepos
      .filter(
        (repo) =>
          !featuredProjects.some(
            (fp) =>
              fp.title.toLowerCase() === repo.name.toLowerCase() ||
              fp.id === repo.name.toLowerCase() ||
              (fp.githubUrl && fp.githubUrl.toLowerCase() === repo.htmlUrl.toLowerCase())
          )
      )
      .map((repo) => {
        let cat: Project['category'] = 'Tools & Systems';
        const norm = (repo.name + ' ' + (repo.description || '')).toLowerCase();
        if (norm.includes('web') || norm.includes('full') || norm.includes('app') || norm.includes('portfolio') || norm.includes('crate')) {
          cat = 'Full-Stack';
        } else if (norm.includes('saas') || norm.includes('flask') || norm.includes('django')) {
          cat = 'SaaS & Web';
        } else if (norm.includes('spam') || norm.includes('nlp') || norm.includes('ai') || norm.includes('mining') || norm.includes('chat')) {
          cat = 'AI / ML';
        }

        const langTag =
          repo.language === 'HTML' || repo.language === 'CSS'
            ? 'HTML5 / CSS3'
            : repo.language || 'Python';

        let extraTags = [langTag, 'Git / GitHub'];
        if (norm.includes('mining')) extraTags = ['Python', 'Pandas', 'NumPy', 'Scikit-learn'];
        else if (norm.includes('prolog') || norm.includes('ai-practical')) extraTags = ['Prolog', 'Python', 'Gemini API'];
        else if (norm.includes('sheme') || norm.includes('scheme')) extraTags = ['Python', 'Flask', 'HTML5 / CSS3', 'REST APIs'];

        return {
          id: repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          title: repo.name.replace(/[-_]/g, ' '),
          subtitle: repo.language ? `${repo.language.toUpperCase()} · GITHUB REPO` : 'OPEN SOURCE REPO',
          category: cat,
          description: repo.description || `Open source software repository engineered by ${PERSONAL_INFO.name} and published on GitHub.`,
          longDescription: repo.description || `Repository maintained by ${PERSONAL_INFO.name} on GitHub with source code and documentation.`,
          highlights: [
            `Built with ${repo.language || 'modern software engineering practices'}.`,
            `Source code published and version-controlled on GitHub.`,
            `Stars: ${repo.stars} · Forks: ${repo.forks}`,
          ],
          tags: extraTags,
          host: repo.homepage ? new URL(repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`).hostname : `github.com/heyits-sachin/${repo.name}`,
          githubUrl: repo.htmlUrl,
          liveUrl: repo.homepage || undefined,
          featured: false,
        };
      }),
  ];

  const categories = ['All', 'Full-Stack', 'SaaS & Web', 'AI / ML', 'Tools & Systems'];

  const filtered = combinedProjects.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.tags.some((t) => t.toLowerCase().includes(term));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07081A] dark:bg-[#07081A] light:bg-[#ECEAE4] text-neutral-100 dark:text-neutral-100 light:text-neutral-900 transition-colors duration-300">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none daiki-sky-aura z-0" />
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern opacity-40 z-0" />

      {/* Navigation Top Bar */}
      <header className="sticky top-0 z-40 py-4 px-6 sm:px-8 border-b border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300 bg-[#07081A]/85 dark:bg-[#07081A]/85 light:bg-[#ECEAE4]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-white text-neutral-200 dark:text-neutral-200 light:text-neutral-800 hover:text-amber-500 hover:border-amber-500/50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to Wake (light) mode' : 'Switch to Dream (dark) mode'}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-white text-[11px] font-mono uppercase tracking-wider text-neutral-300 dark:text-neutral-300 light:text-neutral-800 hover:text-amber-500 cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-purple-600" />}
              <span>{isDark ? 'DREAM' : 'WAKE'}</span>
            </button>

            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 py-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-amber-500 mb-2">
            <span className="w-6 h-px bg-amber-500" />
            <span>Complete Project Directory</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-normal text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight mb-4">
            All Projects &amp; <span className="font-serif italic text-amber-500 dark:text-amber-400">Repositories.</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed font-sans">
            Every application, production deployment, client solution, and open-source project created by {PERSONAL_INFO.name}. Synced in real time with GitHub.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-200/70 border border-neutral-800 dark:border-neutral-800 light:border-stone-300">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-white shadow-sm'
                    : 'text-neutral-400 dark:text-neutral-400 light:text-neutral-700 hover:text-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, tech or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-72 pl-9 pr-4 py-2 text-xs font-mono rounded-xl border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-900/50 dark:bg-neutral-900/50 light:bg-white text-neutral-200 dark:text-neutral-200 light:text-neutral-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-6">
          Showing <strong className="text-amber-500 dark:text-amber-400">{filtered.length}</strong> project{filtered.length === 1 ? '' : 's'}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenModal={(p) => setActiveModalProject(p)}
            />
          ))}
        </div>
      </main>

      {/* Modal View */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </div>
  );
};
