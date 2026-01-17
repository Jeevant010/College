// src/app/page.tsx
import Link from 'next/link';
// We import 'apps' data. We don't strictly need to import 'Project' type here unless we use it explicitly.
import { apps } from '../data/app'; 

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          My College Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Link href={app.link} key={app.id} className="group block">
              <article className="h-full bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {app.date}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">
                  {app.title}
                </h2>
                
                <p className="text-gray-600 text-sm">
                  {app.description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}