import React, { useState, useEffect } from 'react';
import { BannerData } from './types';
import { DEFAULT_BANNER, BANNER_WIDTH, BANNER_HEIGHT } from './constants';
import { BannerPreview } from './components/BannerPreview';
import { EditorPanel } from './components/EditorPanel';

declare var html2canvas: any;

function App() {
  const [bannerData, setBannerData] = useState<BannerData>(DEFAULT_BANNER);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = async () => {
    const element = document.getElementById('capture-area');
    if (!element) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, {
        width: BANNER_WIDTH,
        height: BANNER_HEIGHT,
        scale: 1,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: BANNER_WIDTH, 
        windowHeight: BANNER_HEIGHT,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.getElementById('capture-area');
          if (clonedElement && clonedElement.parentElement) {
             const wrapper = clonedElement.parentElement;
             wrapper.style.transform = 'none';
             wrapper.style.boxShadow = 'none';
             wrapper.style.margin = '0';
             wrapper.style.padding = '0';
          }
        }
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = 'banner.png';
      link.href = image;
      link.click();
      showToast("Banner exported successfully!");
    } catch (error) {
      console.error('Export failed:', error);
      showToast("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-base-200 overflow-hidden text-base-content font-sans selection:bg-primary selection:text-primary-content">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast toast-end toast-top z-50 animate-in slide-in-from-right-10 fade-in duration-300">
          <div className="alert alert-success shadow-lg text-sm font-medium py-2 px-4 rounded-lg">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="navbar bg-base-100 border-b border-base-300 px-4 h-16 flex-none z-20 shadow-sm">
        <div className="flex-1 gap-3 items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md text-primary-content">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-lg font-semibold">Banner Creator</span>
        </div>
        
        <div className="flex-none gap-3">
          <button 
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-base-content hover:bg-base-200"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`btn btn-primary btn-sm px-6 font-semibold shadow-md rounded-lg ${isExporting ? 'loading' : ''}`}
          >
            {isExporting ? 'Exporting...' : 'Export PNG'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Preview Panel */}
        <div className="w-full lg:w-[45%] xl:w-[40%] h-full bg-base-200/50 flex flex-col relative border-r border-base-300 overflow-hidden justify-center items-center p-8">
           <BannerPreview data={bannerData} />
           
           {/* Size Badge */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 badge badge-neutral badge-lg py-3 px-4 font-mono text-xs font-medium shadow-sm opacity-80 backdrop-blur-md">
             1200 × 628 px
           </div>
        </div>

        {/* Right: Editor Panel */}
        <div className="w-full lg:w-[55%] xl:w-[60%] h-full bg-base-100 relative">
          <EditorPanel data={bannerData} onChange={setBannerData} onShowToast={showToast} />
        </div>
      </main>
    </div>
  );
}

export default App;