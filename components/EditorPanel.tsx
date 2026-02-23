
import React, { useState } from 'react';
import { BannerData, BannerTheme } from '../types';
import { DEFAULT_BANNER, PRODUCTS, IP_VISUAL_IDENTITY } from '../constants';
import { generateBackgroundImage, generateEnhancedPrompt } from '../services/geminiService';

interface EditorPanelProps {
  data: BannerData;
  onChange: (data: BannerData) => void;
  onShowToast?: (msg: string) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ data, onChange, onShowToast }) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [groundingUrls, setGroundingUrls] = useState<Array<{uri: string, title: string}>>([]);

  const update = (field: keyof BannerData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productKey = e.target.value;
    const productLogos = PRODUCTS[productKey]?.logos;
    if (productLogos) {
      onChange({
        ...data,
        product: productKey,
        logo: productLogos.lightBg // Default to Light BG variant when switching product
      });
      // Clear prompt when switching products to avoid confusion
      setPrompt('');
      setGroundingUrls([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'backgroundImage' | 'logo' | 'merchantLogo' | 'dividerImageSrc') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          update(field, event.target.result);
          onShowToast?.("Image uploaded successfully");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    // Validation: If IP Co-Brand is on, we need a merchant name
    if (data.product === 'international' && data.showMerchantLogo && !data.merchantName.trim()) {
      onShowToast?.("Please enter a Merchant Name for the co-branded generation.");
      return;
    }
    if (!prompt.trim() && data.product !== 'international') {
      // For standard products, prompt is required. For IP, we can infer from scenarios if prompt is empty but that logic is handled below.
      // Actually, let's require prompt or selection for all to be safe, but allow the IP logic to proceed if a scenario is picked (which sets prompt).
      if (!prompt.trim()) return; 
    }

    const win = window as any;
    if (win.aistudio) {
      try {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await win.aistudio.openSelectKey();
        }
      } catch (e) {
        console.warn("Failed to check API key status", e);
      }
    }

    setGenerating(true);
    setGroundingUrls([]);

    try {
      let finalImagePrompt = prompt;

      // 1. If International Payments, refine the prompt first
      if (data.product === 'international') {
         // If prompt is empty but we are in IP mode, we might want to default, 
         // but the UI forces selection into the prompt box.
         // However, if we have a Merchant Name, the user prompt might just be context like "Summer Sale" 
         // or empty.
         
         const enhancement = await generateEnhancedPrompt(
           data.product, 
           prompt, 
           (data.showMerchantLogo && data.merchantName) ? data.merchantName : undefined,
           data.textOnRight
         );
         
         finalImagePrompt = enhancement.prompt;
         
         // Extract grounding URLs if any
         if (enhancement.groundingMetadata?.groundingChunks) {
            const urls = enhancement.groundingMetadata.groundingChunks
              .map(chunk => chunk.web && chunk.web.uri ? { uri: chunk.web.uri, title: chunk.web.title || 'Source' } : null)
              .filter(u => u !== null) as Array<{uri: string, title: string}>;
            setGroundingUrls(urls);
         }
      }

      // 2. Generate the Image
      const imageUrl = await generateBackgroundImage(finalImagePrompt, data.textOnRight);
      
      onChange({ 
        ...data, 
        backgroundImage: imageUrl, 
        showBg: true 
      });
      onShowToast?.("Background generated successfully!");
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found") && win.aistudio) {
         onShowToast?.("API Key issue detected. Please select your key again.");
         try { await win.aistudio.openSelectKey(); } catch (e) {}
      } else {
         onShowToast?.("Generation failed. Please try again.");
      }
    } finally {
      setGenerating(false);
    }
  };

  const currentProductLogos = PRODUCTS[data.product]?.logos || PRODUCTS.razorpay.logos;
  const isIP = data.product === 'international';

  return (
    <div className="h-full overflow-y-auto bg-base-100 p-6 pb-32 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
      
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="lg:hidden pb-4 border-b border-base-200">
           <h2 className="text-xl font-semibold">Editor</h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* 1. Layout & Background */}
          <div className="card bg-base-100 border border-base-200 shadow-sm rounded-xl overflow-hidden">
            <div className="bg-base-200/50 px-5 py-3 border-b border-base-200 flex items-center justify-between">
               <h3 className="text-sm font-medium text-base-content/70">Layout & Background</h3>
               <div className="badge badge-sm badge-ghost font-medium">Step 1</div>
            </div>
            
            <div className="p-5 space-y-6">
              <div className="form-control">
                <label className="label text-sm font-medium pb-1.5">Text Alignment</label>
                <div className="join w-full grid grid-cols-2">
                  <button 
                    onClick={() => update('textOnRight', false)}
                    className={`btn btn-sm join-item font-medium ${!data.textOnRight ? 'btn-primary' : 'btn-outline border-base-300 text-base-content hover:bg-base-200'}`}
                  >
                    Left Align
                  </button>
                  <button 
                    onClick={() => update('textOnRight', true)}
                    className={`btn btn-sm join-item font-medium ${data.textOnRight ? 'btn-primary' : 'btn-outline border-base-300 text-base-content hover:bg-base-200'}`}
                  >
                    Right Align
                  </button>
                </div>
              </div>

              <div className="bg-base-200/30 rounded-lg p-4 border border-base-200/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Background Image</span>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-sm toggle-primary" 
                    checked={data.showBg} 
                    onChange={(e) => update('showBg', e.target.checked)} 
                  />
                </div>
                
                {data.showBg && (
                  <div className="space-y-4 pt-1 animate-in slide-in-from-top-2 fade-in duration-200">
                    
                    {/* IP Specific: Scenarios */}
                    {isIP && !data.showMerchantLogo && (
                       <div className="space-y-2">
                         <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">Select a Scenario</span>
                         <div className="flex flex-wrap gap-2">
                            {IP_VISUAL_IDENTITY.promptGenerationRules.scenarioTemplates.scenarios.map(sc => (
                               <button 
                                 key={sc.name}
                                 onClick={() => setPrompt(sc.focus)}
                                 className={`badge badge-outline cursor-pointer hover:bg-primary hover:text-white transition-colors py-3 ${prompt === sc.focus ? 'bg-primary text-white' : ''}`}
                               >
                                 {sc.name}
                               </button>
                            ))}
                         </div>
                       </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <textarea 
                        className="textarea textarea-bordered w-full focus:outline-none resize-none text-sm leading-relaxed"
                        rows={isIP ? 4 : 3}
                        placeholder={isIP && data.showMerchantLogo ? "Describe the merchant context (e.g. 'Online Education Platform') or leave empty for auto-detection..." : "Describe the background image..."}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey && !generating) {
                             e.preventDefault();
                             handleGenerateAI();
                           }
                        }}
                      />
                      
                      {/* Grounding Sources Display */}
                      {groundingUrls.length > 0 && (
                        <div className="text-xs text-base-content/60 px-1">
                           <span className="font-semibold">Sources: </span>
                           {groundingUrls.map((g, i) => (
                              <a key={i} href={g.uri} target="_blank" rel="noopener noreferrer" className="link link-primary hover:underline mr-2">
                                 {g.title}
                              </a>
                           ))}
                        </div>
                      )}

                      <button 
                        disabled={generating} 
                        onClick={handleGenerateAI} 
                        className="btn btn-neutral btn-sm w-full font-medium"
                      >
                        {generating ? <span className="loading loading-spinner loading-xs"></span> : (isIP ? 'Generate Smart Background' : 'Generate Background')}
                      </button>
                    </div>
                    
                    {data.backgroundImage && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden group border border-base-300 bg-base-100">
                        <img src={data.backgroundImage} className="w-full h-full object-cover opacity-90 transition-opacity duration-300" alt="Background" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                           <button 
                             onClick={() => update('backgroundImage', '')}
                             className="btn btn-xs btn-error text-white shadow-md font-medium"
                           >
                             Remove Image
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Logos */}
          <div className="card bg-base-100 border border-base-200 shadow-sm rounded-xl overflow-hidden h-fit">
            <div className="bg-base-200/50 px-5 py-3 border-b border-base-200 flex items-center justify-between">
               <h3 className="text-sm font-medium text-base-content/70">Branding</h3>
               <div className="badge badge-sm badge-ghost font-medium">Step 2</div>
            </div>
            <div className="p-5 space-y-5">
              
              <div className="form-control w-full">
                <label className="label py-0 pb-1.5"><span className="label-text text-sm font-medium">Product</span></label>
                <select 
                  className="select select-bordered select-sm w-full font-medium" 
                  value={data.product} 
                  onChange={handleProductChange}
                >
                  {Object.entries(PRODUCTS).map(([key, p]) => (
                    <option key={key} value={key}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-control w-full">
                 <label className="label py-0 pb-1.5"><span className="label-text text-sm font-medium">Primary Logo Variant</span></label>
                 <div className="join w-full grid grid-cols-2">
                    <button 
                      onClick={() => update('logo', currentProductLogos.lightBg)}
                      className={`btn btn-sm join-item font-medium ${data.logo === currentProductLogos.lightBg ? 'btn-primary' : 'btn-outline border-base-300 text-base-content hover:bg-base-200'}`}
                    >
                      For Light BG
                    </button>
                    <button 
                      onClick={() => update('logo', currentProductLogos.darkBg)}
                      className={`btn btn-sm join-item font-medium ${data.logo === currentProductLogos.darkBg ? 'btn-primary' : 'btn-outline border-base-300 text-base-content hover:bg-base-200'}`}
                    >
                      For Dark BG
                    </button>
                 </div>
              </div>
              
              <div className="bg-base-200/30 rounded-lg p-3 border border-base-200/60">
                 <div className="flex justify-between items-center mb-2">
                   <label className="label cursor-pointer p-0 gap-2">
                     <span className="label-text text-sm font-medium">Co-Brand Logo</span>
                   </label>
                   <input type="checkbox" className="toggle toggle-sm toggle-primary" checked={data.showMerchantLogo} onChange={(e) => update('showMerchantLogo', e.target.checked)} />
                 </div>
                 
                 {data.showMerchantLogo && (
                   <div className="animate-in slide-in-from-top-1 fade-in duration-200 pt-2 border-t border-base-200/50 mt-2 space-y-3">
                     
                     {/* IP Specific: Merchant Name Input */}
                     {isIP && (
                       <div className="form-control w-full">
                          <label className="label py-0 pb-1"><span className="label-text text-xs font-semibold text-primary">Merchant Name (Required for AI)</span></label>
                          <input 
                            type="text" 
                            className="input input-sm input-bordered w-full" 
                            placeholder="e.g. Airbnb, Coursera"
                            value={data.merchantName}
                            onChange={(e) => update('merchantName', e.target.value)}
                          />
                       </div>
                     )}

                     <div className="flex gap-2 items-center">
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'merchantLogo')} className="file-input file-input-bordered file-input-sm w-full text-xs"/>
                        {data.merchantLogo && (
                           <button onClick={() => update('merchantLogo', '')} className="btn btn-square btn-sm btn-ghost text-error">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                        )}
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </div>

        </div>

        {/* 3. Main Content */}
        <div className="card bg-base-100 border border-base-200 shadow-sm rounded-xl overflow-hidden">
          <div className="bg-base-200/50 px-5 py-3 border-b border-base-200 flex items-center justify-between">
             <h3 className="text-sm font-medium text-base-content/70">Typography & Content</h3>
             <div className="badge badge-sm badge-ghost font-medium">Step 3</div>
          </div>
          <div className="p-5 space-y-6">
            
            <div className="bg-base-200/30 rounded-lg p-4 border border-base-200/60">
               <div className="flex justify-between items-center">
                 <span className="text-sm font-semibold">Tag Badge</span>
                 <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={data.showTag} onChange={(e) => update('showTag', e.target.checked)} />
               </div>
               {data.showTag && (
                 <div className="animate-in slide-in-from-top-1 fade-in duration-200 space-y-3 pt-4">
                   <div className="flex gap-3">
                     <input 
                       className="input input-bordered input-sm flex-1" 
                       value={data.tag} 
                       onChange={(e) => update('tag', e.target.value)} 
                       placeholder="e.g. Deep-Dive"
                       maxLength={20}
                     />
                     <div className="w-1/3">
                       <select 
                         className="select select-bordered select-sm w-full"
                         value={data.tagIcon}
                         onChange={(e) => update('tagIcon', e.target.value)}
                       >
                         <option value="check-circle">Check</option>
                         <option value="arrow-right-circle">Arrow</option>
                         <option value="star">Star</option>
                         <option value="zap">Zap</option>
                         <option value="award">Award</option>
                       </select>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-2 bg-base-100 p-2 rounded-lg border border-base-200/80">
                      <span className="text-xs font-medium opacity-70 pl-1">Style:</span>
                      <div className="join join-horizontal flex-1 grid grid-cols-3">
                        {(['default', 'light', 'razorpay-blue'] as BannerTheme[]).map(t => (
                          <button
                            key={t}
                            onClick={() => update('tagTheme', t)}
                            className={`join-item btn btn-xs font-medium ${data.tagTheme === t ? 'btn-primary' : 'btn-ghost border-base-200 hover:border-base-300'}`}
                          >
                            {t === 'razorpay-blue' ? 'Blue' : t.charAt(0).toUpperCase() + t.slice(1)}
                          </button>
                        ))}
                      </div>
                   </div>
                 </div>
               )}
            </div>

            <div className="space-y-4">
              {['H1', 'H2', 'H3'].map((h) => {
                 const showKey = `show${h}` as keyof BannerData;
                 const textKey = `${h.toLowerCase()}Text` as keyof BannerData;
                 return (
                   <div key={h} className="group form-control bg-base-100 rounded-lg">
                     <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-base-content/80">{h} Heading</label>
                        <input type="checkbox" className="checkbox checkbox-xs checkbox-primary rounded-sm" checked={data[showKey] as boolean} onChange={(e) => update(showKey, e.target.checked)} />
                     </div>
                     <div className={`transition-all duration-300 ease-in-out overflow-hidden ${data[showKey] ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                       <textarea 
                         rows={h === 'H1' ? 3 : 2}
                         className="textarea textarea-bordered textarea-sm w-full resize-none leading-tight"
                         value={data[textKey] as string}
                         onChange={(e) => update(textKey, e.target.value)}
                         placeholder={`Enter ${h} text...`}
                       />
                       <div className="text-right mt-1">
                          <span className="text-[10px] opacity-40">{(data[textKey] as string).length} chars</span>
                       </div>
                     </div>
                   </div>
                 )
              })}
            </div>

            <div className="divider my-2"></div>

            <div className="flex justify-between items-center">
               <span className="text-sm font-semibold">Section Divider</span>
               <input 
                 type="checkbox" 
                 className="toggle toggle-primary toggle-sm" 
                 checked={data.showDivider} 
                 onChange={(e) => onChange({ ...data, showDivider: e.target.checked, lineDivider: true, imageDivider: false })} 
               />
            </div>
          </div>
        </div>

        {/* 4. Sub-Content */}
        <div className="card bg-base-100 border border-base-200 shadow-sm rounded-xl overflow-hidden">
          <div className="bg-base-200/50 px-5 py-3 border-b border-base-200 flex items-center justify-between">
             <h3 className="text-sm font-medium text-base-content/70">Sub-Text & Details</h3>
             <div className="badge badge-sm badge-ghost font-medium">Step 4</div>
          </div>
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
               <span className="text-sm font-semibold">Enable Sub-text Section</span>
               <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={data.showSubText} onChange={(e) => update('showSubText', e.target.checked)} />
            </div>

            {data.showSubText && (
              <div className="animate-in fade-in duration-300 space-y-5">
                 <div className="tabs tabs-boxed bg-base-200 p-1 rounded-lg">
                   <button 
                     onClick={() => onChange({ ...data, showParagraph: true, showPointers: false })}
                     className={`tab flex-1 transition-all rounded-md h-8 text-sm font-medium ${data.showParagraph ? 'bg-white shadow-sm text-primary' : 'hover:bg-base-100/50'}`}
                   >
                     Paragraph
                   </button>
                   <button 
                     onClick={() => onChange({ ...data, showParagraph: false, showPointers: true })}
                     className={`tab flex-1 transition-all rounded-md h-8 text-sm font-medium ${data.showPointers ? 'bg-white shadow-sm text-primary' : 'hover:bg-base-100/50'}`}
                   >
                     Pointers
                   </button>
                 </div>

                 <div className="bg-base-100 rounded-lg border border-base-200 p-4">
                   {data.showParagraph && (
                     <div className="form-control">
                       <textarea 
                         rows={4} 
                         className="textarea textarea-bordered w-full resize-none text-sm leading-relaxed"
                         value={data.paraText}
                         onChange={(e) => update('paraText', e.target.value)}
                         placeholder="Enter descriptive paragraph..."
                         maxLength={200}
                       />
                       <label className="label pb-0"><span className="label-text-alt opacity-50 ml-auto">{data.paraText.length}/200</span></label>
                     </div>
                   )}

                   {data.showPointers && (
                     <div className="space-y-3">
                       {[1, 2, 3, 4].map((n) => {
                         const showKey = `showPoint${n}` as keyof BannerData;
                         const textKey = `p${n}Text` as keyof BannerData;
                         const iconKey = `p${n}Icon` as keyof BannerData;
                         return (
                           <div key={n} className="flex gap-2 items-start group">
                             <div className="pt-2">
                               <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" checked={data[showKey] as boolean} onChange={(e) => update(showKey, e.target.checked)} />
                             </div>
                             <div className={`flex-1 grid grid-cols-[1fr_auto] gap-2 transition-opacity duration-200 ${data[showKey] ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                <input 
                                  className="input input-bordered input-sm w-full" 
                                  value={data[textKey] as string} 
                                  onChange={(e) => update(textKey, e.target.value)}
                                  placeholder={`Pointer ${n} text`}
                                />
                                <select 
                                  className="select select-bordered select-sm w-24 bg-base-100"
                                  value={data[iconKey] as string}
                                  onChange={(e) => update(iconKey, e.target.value)}
                                >
                                   <option value="check-circle">Check</option>
                                   <option value="arrow-right-circle">Arrow</option>
                                   <option value="star">Star</option>
                                </select>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   )}
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. Theme */}
        <div className="card bg-base-100 border border-base-200 shadow-sm rounded-xl overflow-hidden">
          <div className="bg-base-200/50 px-5 py-3 border-b border-base-200 flex items-center justify-between">
             <h3 className="text-sm font-medium text-base-content/70">Visual Theme</h3>
             <div className="badge badge-sm badge-ghost font-medium">Step 5</div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4">
              {(['default', 'light', 'razorpay-blue'] as BannerTheme[]).map(t => (
                <button
                  key={t}
                  onClick={() => update('theme', t)}
                  className={`btn btn-sm capitalize h-auto py-3 border-base-300 flex flex-col gap-1 ${data.theme === t ? 'btn-active ring-2 ring-primary ring-offset-1' : 'btn-ghost bg-base-100 shadow-sm hover:shadow-md'}`}
                >
                  <span className="font-semibold">{t.replace('-', ' ')}</span>
                  <div className="flex gap-1">
                     <span className={`w-3 h-3 rounded-full ${t === 'light' ? 'bg-white border' : t === 'razorpay-blue' ? 'bg-[#3395FF]' : 'bg-[#192839]'}`}></span>
                     <span className={`w-3 h-3 rounded-full ${t === 'light' ? 'bg-gray-200' : t === 'razorpay-blue' ? 'bg-blue-200' : 'bg-gray-300'}`}></span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
