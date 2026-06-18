import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Home, Map, Activity } from 'lucide-react';

export const Onboarding = () => {
  const [slide, setSlide] = useState(0);
  const { completeOnboarding } = useAppContext();

  const slides = [
    {
      title: "Instant ML Valuations",
      desc: "Get highly accurate property estimates using our custom TensorFlow model trained on the Buea market.",
      icon: <Home size={64} className="text-white" />
    },
    {
      title: "Interactive Market Map",
      desc: "Explore neighborhood trends, heatmaps, and property values across Molyko, Bonduma, and beyond.",
      icon: <Map size={64} className="text-white" />
    },
    {
      title: "Data-Driven Insights",
      desc: "Compare properties side-by-side and view real-time market insights and neural network performance.",
      icon: <Activity size={64} className="text-white" />
    }
  ];

  return (
    <div className="min-h-screen bg-surface w-full max-w-[480px] mx-auto relative shadow-2xl sm:border-x sm:border-gray-200 flex flex-col items-center justify-center p-6">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        
        <div className="w-32 h-32 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/30 mb-8 transform transition-all">
          {slides[slide].icon}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">{slides[slide].title}</h2>
        <p className="text-center text-gray-500 text-sm px-4">{slides[slide].desc}</p>

      </div>

      <div className="w-full flex flex-col items-center gap-6 pb-8">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-primary' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={() => {
              if (slide < slides.length - 1) setSlide(s => s + 1);
              else completeOnboarding();
            }}
            className="w-full bg-hero-gradient text-white font-bold py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
          >
            {slide === slides.length - 1 ? 'Get Started' : 'Continue'}
          </button>
          
          {slide < slides.length - 1 && (
            <button onClick={completeOnboarding} className="w-full py-4 text-gray-500 font-medium text-sm">
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
