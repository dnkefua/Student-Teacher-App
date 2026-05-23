import React, { useState } from 'react';
import { BookText, Newspaper, Megaphone, MonitorPlay, ExternalLink, Library, Image, Maximize2 } from 'lucide-react';
import { UnitId, SubjectId, Asset } from '../../types';
import { englishUnit1Assets, englishUnit2Assets, englishUnit3Assets, englishUnit4Assets, englishUnit5Assets } from '../../data/englishCurriculum';
import { scienceAssets } from '../../data/scienceCurriculum';
import ImageModal from '../ImageModal';
import { QuickAssignButton } from '../QuickAssignButton';

export function AssetsView({ unit, subject }: { unit: UnitId, subject?: SubjectId }) {
  const [modalImage, setModalImage] = useState<{url: string, caption?: string} | null>(null);
  
  const getAssets = (): Asset[] => {
    if (subject === 'science') {
      return scienceAssets.filter(asset => asset.id.includes(`u${unit.replace('unit', '')}`));
    }
    if (subject === 'english') {
      if (unit === 'unit1') return englishUnit1Assets;
      if (unit === 'unit2') return englishUnit2Assets;
      if (unit === 'unit3') return englishUnit3Assets;
      if (unit === 'unit4') return englishUnit4Assets;
      if (unit === 'unit5') return englishUnit5Assets;
    }
    return [];
  };

  const assets = getAssets();

  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
        case 'novel': return <BookText className="w-5 h-5 text-indigo-500" />;
        case 'newspaper': return <Newspaper className="w-5 h-5 text-slate-500" />;
        case 'advertisement': return <Megaphone className="w-5 h-5 text-rose-500" />;
        case 'video': return <MonitorPlay className="w-5 h-5 text-cyan-500" />;
        case 'image': return <Image className="w-5 h-5 text-fuchsia-500" />;
        case 'diagram': return <Image className="w-5 h-5 text-fuchsia-500" />;
        default: return <Library className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getAssetBadgeColor = (type: Asset['type']) => {
      switch (type) {
        case 'novel': return 'bg-indigo-100 text-indigo-700';
        case 'newspaper': return 'bg-slate-100 text-slate-700';
        case 'advertisement': return 'bg-rose-100 text-rose-700';
        case 'video': return 'bg-cyan-100 text-cyan-700';
        case 'image': return 'bg-fuchsia-100 text-fuchsia-700';
        case 'diagram': return 'bg-fuchsia-100 text-fuchsia-700';
        default: return 'bg-emerald-100 text-emerald-700';
      }
  };

  if (assets.length === 0) {
      return (
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-12 text-center text-slate-500">
               <Library className="w-12 h-12 mb-4 mx-auto opacity-50" />
               <p>No learning assets currently available for this unit.</p>
          </div>
      )
  }

  return (
    <>
    <ImageModal 
      isOpen={!!modalImage}
      onClose={() => setModalImage(null)}
      imageUrl={modalImage?.url || ''}
      caption={modalImage?.caption}
      theme={{ solidBg: 'bg-emerald-600', text: 'text-emerald-600' }}
    />
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="mb-10">
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
          <Library className="w-8 h-8 text-amber-500" />
          Learning Assets & Library
        </h1>
        <p className="text-slate-500 font-medium">Curated materials, articles, and media mapping to Unit 1 principles.</p>
      </header>

      <div className={`grid grid-cols-1 ${assets.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md group">
            <div className="h-48 overflow-hidden relative group/image">
              <img 
                 src={asset.url} 
                 alt={asset.title} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                 referrerPolicy="no-referrer"
              />
              {(asset.type === 'diagram' || asset.type === 'image') && (
                <button 
                  onClick={() => setModalImage({ url: asset.url, caption: asset.title })}
                  className="absolute bottom-4 left-4 p-2 bg-slate-900/40 hover:bg-slate-900/60 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover/image:opacity-100 transition-all shadow-sm"
                  aria-label="Expand image"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              )}
              <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${getAssetBadgeColor(asset.type)}`}>
                      {getAssetIcon(asset.type)}
                      {asset.type}
                  </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold text-slate-900">{asset.title}</h3>
                {subject && (
                  <QuickAssignButton
                    refId={`asset-${subject}-${unit}-${asset.id}`}
                    label={asset.title}
                    subject={subject}
                    unit={unit}
                    kind="reading"
                    defaultTitle={asset.title}
                  />
                )}
              </div>
              <p className="text-slate-600 leading-relaxed text-sm flex-1 mb-6">
                {asset.description}
              </p>

              <a
                href={asset.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 font-medium border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                onClick={(e) => !asset.link && e.preventDefault()}
              >
                <ExternalLink className="w-4 h-4" />
                Open Assignment Material
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
