
import React from "react";

export default function Layout({ children, currentPageName }) {
  React.useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", "#111827");
    } else {
      const meta = document.createElement('meta');
      meta.name = "theme-color";
      meta.content = "#111827";
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      const viewport = document.createElement('meta');
      viewport.name = "viewport";
      viewport.content = "width=device-width, initial-scale=1.0, user-scalable=no";
      document.getElementsByTagName('head')[0].appendChild(viewport);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      <style>{`
        :root {
          --neon-blue: #00d4ff;
          --neon-purple: #8b5cf6;
          --neon-green: #00ff88;
          --neon-pink: #ff0080;
          --neon-cyan: #38bdf8;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, var(--neon-blue), var(--neon-purple));
          border-radius: 3px;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .neon-glow-blue {
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }
        
        .neon-glow-purple {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }
        
        .neon-glow-red {
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.4);
        }

        .neon-glow-yellow {
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.4);
        }
        
        .neon-glow-green {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
        
        .neon-glow-orange {
          box-shadow: 0 0 20px rgba(251, 146, 60, 0.3);
        }
        
        @keyframes neon-pulse-blue {
          0%, 100% { box-shadow: 0 0 10px rgba(0, 212, 255, 0.3); }
          50% { box-shadow: 0 0 25px rgba(0, 212, 255, 0.6); }
        }

        @keyframes neon-pulse-yellow {
          0%, 100% { box-shadow: 0 0 10px rgba(250, 204, 21, 0.4); }
          50% { box-shadow: 0 0 25px rgba(250, 204, 21, 0.7); }
        }
        
        .pulse-neon.neon-glow-blue {
          animation: neon-pulse-blue 2s infinite;
        }

        .pulse-neon.neon-glow-yellow {
            animation: neon-pulse-yellow 2s infinite;
        }

        @keyframes active-border-glow-blue {
          0% { border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); }
          50% { border-color: rgba(56, 189, 248, 0.8); box-shadow: 0 0 25px rgba(56, 189, 248, 0.5); }
          100% { border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); }
        }

        @keyframes active-border-glow-yellow {
            0% { border-color: rgba(250, 204, 21, 0.4); box-shadow: 0 0 15px rgba(250, 204, 21, 0.3); }
            50% { border-color: rgba(250, 204, 21, 0.8); box-shadow: 0 0 25px rgba(250, 204, 21, 0.6); }
            100% { border-color: rgba(250, 204, 21, 0.4); box-shadow: 0 0 15px rgba(250, 204, 21, 0.3); }
        }
        
        .animated-active-border-blue {
          animation: active-border-glow-blue 2s infinite ease-in-out;
        }

        .animated-active-border-yellow {
          animation: active-border-glow-yellow 2s infinite ease-in-out;
        }
      `}</style>
      {children}
    </div>
  );
}
