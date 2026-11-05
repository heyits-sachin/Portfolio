import React, { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers } from 'lucide-react';
import { Project } from '../types/portfolio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 dark:border-neutral-800 light:border-stone-200 bg-neutral-900 dark:bg-neutral-900 light:bg-stone-50 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-neutral-800 dark:border-neutral-800 light:border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-500 mb-1">
              <span>{project.category}</span>
              {project.host && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-neutral-400 dark:text-neutral-400 light:text-neutral-500">{project.host}</span>
                </>
              )}
            </div>
            <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
              {project.title}
            </h2>
            <p className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1">{project.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal dialog"
            className="w-8 h-8 rounded-lg border border-neutral-800 dark:border-neutral-800 light:border-stone-300 flex items-center justify-center text-neutral-400 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real Screenshot View if available */}
        {project.imageUrl && (
          <div className="mt-4 rounded-xl overflow-hidden border border-neutral-800 aspect-[16/9] bg-neutral-950">
            <img
              src={project.imageUrl}
              alt={`${project.title} detailed screenshot`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Long Description */}
        <div className="py-6 space-y-4 text-sm leading-relaxed text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
          <p>{project.longDescription || project.description}</p>

          {/* Key Metrics if available */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="p-3 rounded-lg border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200 bg-neutral-950/40 dark:bg-neutral-950/40 light:bg-stone-100"
                >
                  <div className="text-xl font-bold font-mono text-amber-500 dark:text-amber-400">{m.value}</div>
                  <div className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Architecture Highlights */}
          <div className="pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-400 light:text-neutral-500 mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Engineering Wins</span>
            </h3>
            <ul className="space-y-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-normal">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Tags (Zero-Pill: clean inline list) */}
          <div className="pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-400 light:text-neutral-500 mb-2">
              Technologies Utilized
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-mono">
              {project.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <span className="text-neutral-200 dark:text-neutral-200 light:text-neutral-800">{tag}</span>
                  {idx < project.tags.length - 1 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-neutral-800 dark:border-neutral-800 light:border-stone-200">
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
              >
                <span>Visit Live Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-950/60 dark:bg-neutral-950/60 light:bg-stone-100 text-neutral-200 dark:text-neutral-200 light:text-neutral-800 hover:border-neutral-700 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Repository</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-xs font-medium text-neutral-400 hover:text-neutral-200 dark:hover:text-neutral-200 light:hover:text-neutral-800 transition-colors px-2 py-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
