// src/app/page.tsx
import Link from 'next/link';
import { apps, Project } from '../data/app'; 

export default function Home() {
  // Group apps by their assignment property
  const groupedApps = apps.reduce((acc, app) => {
    if (!acc[app.assignment]) {
      acc[app.assignment] = [];
    }
    acc[app.assignment].push(app);
    return acc;
  }, {} as Record<string, Project[]>);

  const assignmentGroups = Object.keys(groupedApps);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="text-center space-y-4 pt-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse">
            College Dashboard
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            A premium collection of assignments, projects, and explorations.
          </p>
        </header>

        <div className="space-y-16 pb-20">
          {assignmentGroups.map((assignmentName) => (
            <section key={assignmentName} className="space-y-6">
              <h2 className="text-3xl font-bold text-white/90 border-b border-white/10 pb-4">
                {assignmentName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedApps[assignmentName].map((app) => (
                  <Link href={app.link} key={app.id} className="group block h-full">
                    <article className="h-full bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-xl relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-semibold text-indigo-300 bg-indigo-900/40 border border-indigo-500/30 px-3 py-1 rounded-full">
                          {app.assignment}
                        </span>
                        <span className="text-xs text-white/40 font-mono">
                          {app.date}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white/90 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-pink-400 transition-all">
                        {app.title}
                      </h3>
                      
                      <p className="text-white/60 text-sm flex-grow">
                        {app.description}
                      </p>
                      
                      <div className="mt-6 flex items-center text-sm font-medium text-indigo-400 group-hover:text-pink-400 transition-colors">
                        Explore Project
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}