import React from 'react';

export const GrassIllustration = ({ className = "w-24 h-24" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8b9471" />
        <stop offset="100%" stopColor="#6b7b56" />
      </linearGradient>
    </defs>
    {/* Grass blades */}
    <path d="M20 80 Q25 50 30 80" stroke="url(#grassGradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M35 85 Q40 45 45 85" stroke="url(#grassGradient)" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M50 82 Q55 40 60 82" stroke="url(#grassGradient)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <path d="M65 87 Q70 48 75 87" stroke="url(#grassGradient)" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M10 75 Q15 55 20 75" stroke="url(#grassGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M75 78 Q80 52 85 78" stroke="url(#grassGradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M25 88 Q30 65 35 88" stroke="url(#grassGradient)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M55 90 Q60 68 65 90" stroke="url(#grassGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Small flowers */}
    <circle cx="28" cy="60" r="2" fill="#c17358" opacity="0.8"/>
    <circle cx="68" cy="55" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="42" cy="65" r="1.8" fill="#8b9471" opacity="0.7"/>
  </svg>
);

export const PeopleConnectingIllustration = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="peopleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6b7b56" />
        <stop offset="100%" stopColor="#8b9471" />
      </linearGradient>
    </defs>
    {/* People silhouettes */}
    <circle cx="25" cy="25" r="8" fill="url(#peopleGradient)" opacity="0.8"/>
    <rect x="18" y="32" width="14" height="20" rx="7" fill="url(#peopleGradient)" opacity="0.8"/>
    
    <circle cx="95" cy="30" r="8" fill="url(#peopleGradient)" opacity="0.8"/>
    <rect x="88" y="37" width="14" height="20" rx="7" fill="url(#peopleGradient)" opacity="0.8"/>
    
    <circle cx="60" cy="45" r="9" fill="url(#peopleGradient)"/>
    <rect x="52" y="53" width="16" height="22" rx="8" fill="url(#peopleGradient)"/>
    
    {/* Connection lines */}
    <path d="M35 35 Q50 20 85 40" stroke="#8b9471" strokeWidth="2" strokeDasharray="3,3" opacity="0.7"/>
    <path d="M25 45 Q45 55 60 55" stroke="#8b9471" strokeWidth="2" strokeDasharray="3,3" opacity="0.7"/>
    <path d="M75 55 Q80 50 95 50" stroke="#8b9471" strokeWidth="2" strokeDasharray="3,3" opacity="0.7"/>
    
    {/* Hearts floating */}
    <path d="M45 25 C45 22, 48 20, 50 22 C52 20, 55 22, 55 25 C55 28, 50 32, 50 32 C50 32, 45 28, 45 25 Z" 
          fill="#c17358" opacity="0.6"/>
    <path d="M70 35 C70 33, 72 32, 73 33 C74 32, 76 33, 76 35 C76 37, 73 39, 73 39 C73 39, 70 37, 70 35 Z" 
          fill="#e3e1d9" opacity="0.8"/>
  </svg>
);

export const AIBrainIllustration = ({ className = "w-28 h-28" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b9471" />
        <stop offset="50%" stopColor="#6b7b56" />
        <stop offset="100%" stopColor="#a8b08a" />
      </linearGradient>
    </defs>
    {/* Brain shape */}
    <path d="M30 35 Q20 25, 25 15 Q35 10, 45 15 Q55 10, 65 15 Q75 25, 65 35 Q70 45, 65 55 Q60 65, 50 60 Q40 65, 35 55 Q25 45, 30 35 Z" 
          fill="url(#brainGradient)" opacity="0.8"/>
    
    {/* Neural network nodes */}
    <circle cx="35" cy="30" r="2" fill="#e3e1d9"/>
    <circle cx="50" cy="25" r="2" fill="#e3e1d9"/>
    <circle cx="65" cy="32" r="2" fill="#e3e1d9"/>
    <circle cx="40" cy="45" r="2" fill="#e3e1d9"/>
    <circle cx="60" cy="48" r="2" fill="#e3e1d9"/>
    
    {/* Connections */}
    <path d="M35 30 L50 25" stroke="#e3e1d9" strokeWidth="1" opacity="0.6"/>
    <path d="M50 25 L65 32" stroke="#e3e1d9" strokeWidth="1" opacity="0.6"/>
    <path d="M35 30 L40 45" stroke="#e3e1d9" strokeWidth="1" opacity="0.6"/>
    <path d="M65 32 L60 48" stroke="#e3e1d9" strokeWidth="1" opacity="0.6"/>
    <path d="M40 45 L60 48" stroke="#e3e1d9" strokeWidth="1" opacity="0.6"/>
    
    {/* Floating elements */}
    <circle cx="20" cy="50" r="3" fill="#c17358" opacity="0.5"/>
    <circle cx="80" cy="45" r="2" fill="#8b9471" opacity="0.7"/>
    <rect x="75" y="60" width="4" height="4" fill="#e3e1d9" opacity="0.6" transform="rotate(45 77 62)"/>
    <circle cx="25" cy="70" r="2" fill="#a8b08a" opacity="0.6"/>
  </svg>
);

export const EventsIllustration = ({ className = "w-32 h-24" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="eventGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b9471" />
        <stop offset="100%" stopColor="#6b7b56" />
      </linearGradient>
    </defs>
    {/* Calendar pages */}
    <rect x="10" y="15" width="30" height="35" rx="3" fill="url(#eventGradient)" opacity="0.8"/>
    <rect x="12" y="8" width="26" height="4" rx="2" fill="#e3e1d9"/>
    <line x1="18" y1="25" x2="34" y2="25" stroke="#e3e1d9" strokeWidth="1"/>
    <line x1="18" y1="30" x2="34" y2="30" stroke="#e3e1d9" strokeWidth="1"/>
    <line x1="18" y1="35" x2="28" y2="35" stroke="#e3e1d9" strokeWidth="1"/>
    
    {/* Event cards floating */}
    <rect x="50" y="10" width="25" height="15" rx="4" fill="#c17358" opacity="0.7"/>
    <rect x="80" y="25" width="25" height="15" rx="4" fill="#a8b08a" opacity="0.7"/>
    <rect x="60" y="45" width="25" height="15" rx="4" fill="#8b9471" opacity="0.7"/>
    
    {/* People icons on events */}
    <circle cx="57" cy="17" r="2" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="87" cy="32" r="2" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="67" cy="52" r="2" fill="#e3e1d9" opacity="0.9"/>
    
    {/* Connection dots */}
    <circle cx="45" cy="25" r="1.5" fill="#6b7b56"/>
    <circle cx="50" cy="35" r="1.5" fill="#6b7b56"/>
    <circle cx="45" cy="45" r="1.5" fill="#6b7b56"/>
    
    {/* Connecting lines */}
    <path d="M40 30 Q47 27 50 17" stroke="#8b9471" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6"/>
    <path d="M45 35 Q65 30 80 32" stroke="#8b9471" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6"/>
    <path d="M47 45 Q55 50 60 52" stroke="#8b9471" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6"/>
  </svg>
);

export const WelcomeIllustration = ({ className = "w-64 h-48" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="welcomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b9471" />
        <stop offset="50%" stopColor="#6b7b56" />
        <stop offset="100%" stopColor="#a8b08a" />
      </linearGradient>
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e3e1d9" />
        <stop offset="100%" stopColor="#f0efe8" />
      </linearGradient>
    </defs>
    
    {/* Sky background */}
    <rect width="200" height="150" fill="url(#skyGradient)" opacity="0.3"/>
    
    {/* Hills in background */}
    <path d="M0 100 Q50 80, 100 90 Q150 85, 200 95 L200 150 L0 150 Z" fill="url(#welcomeGradient)" opacity="0.4"/>
    <path d="M0 110 Q80 95, 160 105 Q180 100, 200 108 L200 150 L0 150 Z" fill="url(#welcomeGradient)" opacity="0.3"/>
    
    {/* Large grass area */}
    <path d="M0 120 Q100 110, 200 125 L200 150 L0 150 Z" fill="url(#welcomeGradient)" opacity="0.6"/>
    
    {/* Grass blades */}
    <path d="M30 130 Q35 110 40 130" stroke="#6b7b56" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M50 135 Q55 115 60 135" stroke="#6b7b56" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M80 132 Q85 112 90 132" stroke="#8b9471" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M110 138 Q115 118 120 138" stroke="#6b7b56" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M140 135 Q145 115 150 135" stroke="#8b9471" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M170 133 Q175 113 180 133" stroke="#6b7b56" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    
    {/* People gathering */}
    <circle cx="60" cy="105" r="6" fill="#c17358" opacity="0.8"/>
    <rect x="55" y="110" width="10" height="15" rx="5" fill="#c17358" opacity="0.8"/>
    
    <circle cx="90" cy="108" r="6" fill="#8b9471" opacity="0.8"/>
    <rect x="85" y="113" width="10" height="15" rx="5" fill="#8b9471" opacity="0.8"/>
    
    <circle cx="120" cy="106" r="6" fill="#a8b08a" opacity="0.8"/>
    <rect x="115" y="111" width="10" height="15" rx="5" fill="#a8b08a" opacity="0.8"/>
    
    {/* Connection arcs */}
    <path d="M70 115 Q80 105 85 115" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="3,3" opacity="0.7"/>
    <path d="M95 120 Q107 110 115 120" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="3,3" opacity="0.7"/>
    
    {/* Floating elements */}
    <circle cx="40" cy="90" r="2" fill="#c17358" opacity="0.6"/>
    <circle cx="160" cy="85" r="2.5" fill="#8b9471" opacity="0.6"/>
    <circle cx="75" cy="80" r="1.5" fill="#e3e1d9" opacity="0.8"/>
    <circle cx="135" cy="88" r="2" fill="#a8b08a" opacity="0.6"/>
    
    {/* Birds */}
    <path d="M20 40 Q25 35 30 40" stroke="#6b7b56" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M180 35 Q185 30 190 35" stroke="#8b9471" strokeWidth="1.5" fill="none" opacity="0.5"/>
  </svg>
);

export const SmartOrganizationIllustration = ({ className = "w-28 h-28" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="organizationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d17a47" />
        <stop offset="50%" stopColor="#c17358" />
        <stop offset="100%" stopColor="#b8633a" />
      </linearGradient>
    </defs>
    
    {/* Central organizing hub/calendar */}
    <rect x="35" y="30" width="30" height="35" rx="4" fill="url(#organizationGradient)" opacity="0.8"/>
    
    {/* Calendar grid lines */}
    <line x1="40" y1="35" x2="60" y2="35" stroke="#e3e1d9" strokeWidth="1" opacity="0.7"/>
    <line x1="40" y1="40" x2="60" y2="40" stroke="#e3e1d9" strokeWidth="1" opacity="0.7"/>
    <line x1="40" y1="45" x2="60" y2="45" stroke="#e3e1d9" strokeWidth="1" opacity="0.7"/>
    <line x1="40" y1="50" x2="60" y2="50" stroke="#e3e1d9" strokeWidth="1" opacity="0.7"/>
    <line x1="40" y1="55" x2="60" y2="55" stroke="#e3e1d9" strokeWidth="1" opacity="0.7"/>
    
    <line x1="45" y1="30" x2="45" y2="65" stroke="#e3e1d9" strokeWidth="1" opacity="0.7"/>
    <line x1="55" y1="30" x2="55" y2="65" stroke="#e3e1d9" strokeWidth="1" opacity="0.7"/>
    
    {/* Event dots on calendar */}
    <circle cx="42" cy="37" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="52" cy="42" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="58" cy="47" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="47" cy="52" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    
    {/* Floating organized event cards */}
    <rect x="15" y="20" width="12" height="8" rx="2" fill="#8b9471" opacity="0.7"/>
    <rect x="73" y="25" width="12" height="8" rx="2" fill="#6b7b56" opacity="0.7"/>
    <rect x="20" y="70" width="12" height="8" rx="2" fill="#a8b08a" opacity="0.7"/>
    <rect x="68" y="65" width="12" height="8" rx="2" fill="#8b9471" opacity="0.7"/>
    
    {/* Organization arrows pointing to center */}
    <path d="M27 24 Q32 27 35 35" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="2,2" opacity="0.6" markerEnd="url(#arrowhead)"/>
    <path d="M73 29 Q68 32 65 35" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="2,2" opacity="0.6"/>
    <path d="M26 74 Q32 70 35 65" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="2,2" opacity="0.6"/>
    <path d="M68 69 Q65 68 65 65" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="2,2" opacity="0.6"/>
    
    {/* Smart organization symbol - gear/cog in center */}
    <circle cx="50" cy="47" r="5" fill="#e3e1d9" opacity="0.3"/>
    <path d="M47 44 L53 44 L53 50 L47 50 Z" fill="#e3e1d9" opacity="0.8"/>
    <circle cx="50" cy="47" r="2" fill="url(#organizationGradient)" opacity="0.9"/>
    
    {/* Decorative organizing elements */}
    <circle cx="10" cy="45" r="2" fill="#c17358" opacity="0.5"/>
    <circle cx="90" cy="50" r="2" fill="#8b9471" opacity="0.5"/>
    <rect x="12" y="55" width="3" height="3" fill="#e3e1d9" opacity="0.6" transform="rotate(45 13.5 56.5)"/>
    <rect x="85" y="35" width="3" height="3" fill="#e3e1d9" opacity="0.6" transform="rotate(45 86.5 36.5)"/>
  </svg>
);

export const CommunityIllustration = ({ className = "w-28 h-28" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="communityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d17a47" />
        <stop offset="50%" stopColor="#c17358" />
        <stop offset="100%" stopColor="#b8633a" />
      </linearGradient>
    </defs>
    
    {/* Central building/community space */}
    <rect x="35" y="40" width="30" height="25" rx="3" fill="url(#communityGradient)" opacity="0.7"/>
    <rect x="40" y="35" width="20" height="5" rx="2" fill="#e3e1d9" opacity="0.8"/>
    
    {/* People around the community space */}
    <circle cx="20" cy="35" r="5" fill="#8b9471" opacity="0.8"/>
    <rect x="16" y="39" width="8" height="12" rx="4" fill="#8b9471" opacity="0.8"/>
    
    <circle cx="80" cy="38" r="5" fill="#6b7b56" opacity="0.8"/>
    <rect x="76" y="42" width="8" height="12" rx="4" fill="#6b7b56" opacity="0.8"/>
    
    <circle cx="50" cy="20" r="5" fill="#a8b08a" opacity="0.8"/>
    <rect x="46" y="24" width="8" height="12" rx="4" fill="#a8b08a" opacity="0.8"/>
    
    <circle cx="25" cy="70" r="5" fill="#c17358" opacity="0.8"/>
    <rect x="21" y="74" width="8" height="12" rx="4" fill="#c17358" opacity="0.8"/>
    
    <circle cx="75" cy="72" r="5" fill="#8b9471" opacity="0.8"/>
    <rect x="71" y="76" width="8" height="12" rx="4" fill="#8b9471" opacity="0.8"/>
    
    {/* Connection paths to community center */}
    <path d="M28 40 Q35 38 35 45" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="2,2" opacity="0.6"/>
    <path d="M72 45 Q68 42 65 45" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="2,2" opacity="0.6"/>
    <path d="M50 35 Q50 38 50 40" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="2,2" opacity="0.6"/>
    <path d="M30 75 Q35 70 35 65" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="2,2" opacity="0.6"/>
    <path d="M70 75 Q68 70 65 65" stroke="#e3e1d9" strokeWidth="2" strokeDasharray="2,2" opacity="0.6"/>
    
    {/* Community symbol - heart in center */}
    <path d="M45 50 C45 48, 47 47, 49 48 C51 47, 53 48, 53 50 C53 52, 49 55, 49 55 C49 55, 45 52, 45 50 Z" 
          fill="#e3e1d9" opacity="0.9"/>
    
    {/* Decorative elements */}
    <circle cx="15" cy="55" r="2" fill="#c17358" opacity="0.5"/>
    <circle cx="85" cy="60" r="2" fill="#8b9471" opacity="0.5"/>
    <circle cx="50" cy="80" r="1.5" fill="#e3e1d9" opacity="0.7"/>
  </svg>
);

export const SmallDecorationIllustration = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20 Q15 10 20 20" stroke="#8b9471" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
    <path d="M8 22 Q12 15 16 22" stroke="#6b7b56" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
    <path d="M16 24 Q20 17 24 24" stroke="#a8b08a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
    <circle cx="18" cy="12" r="1" fill="#c17358" opacity="0.7"/>
  </svg>
);

export const TreeSilhouette = ({ className = "w-24 h-24" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8b9471" />
        <stop offset="100%" stopColor="#6b7b56" />
      </linearGradient>
    </defs>
    {/* Tree trunk */}
    <rect x="45" y="60" width="10" height="30" fill="#6b7b56" opacity="0.8"/>
    {/* Tree canopy */}
    <ellipse cx="50" cy="45" rx="25" ry="20" fill="url(#treeGradient)" opacity="0.7"/>
    <ellipse cx="50" cy="35" rx="20" ry="15" fill="url(#treeGradient)" opacity="0.6"/>
    <ellipse cx="50" cy="25" rx="15" ry="12" fill="url(#treeGradient)" opacity="0.5"/>
  </svg>
);

export const FlowerBunch = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Flower stems */}
    <path d="M25 60 Q30 40 35 60" stroke="#6b7b56" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M45 65 Q50 45 55 65" stroke="#8b9471" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M35 62 Q40 42 45 62" stroke="#6b7b56" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    
    {/* Flower heads */}
    <circle cx="35" cy="35" r="4" fill="#c17358" opacity="0.8"/>
    <circle cx="32" cy="32" r="2" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="38" cy="32" r="2" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="32" cy="38" r="2" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="38" cy="38" r="2" fill="#e3e1d9" opacity="0.9"/>
    
    <circle cx="55" cy="40" r="3" fill="#a8b08a" opacity="0.8"/>
    <circle cx="53" cy="38" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="57" cy="38" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="53" cy="42" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="57" cy="42" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    
    <circle cx="45" cy="37" r="3.5" fill="#8b9471" opacity="0.8"/>
    <circle cx="43" cy="35" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="47" cy="35" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="43" cy="39" r="1.5" fill="#e3e1d9" opacity="0.9"/>
    <circle cx="47" cy="39" r="1.5" fill="#e3e1d9" opacity="0.9"/>
  </svg>
);

export const GrassCluster = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Grass blades */}
    <path d="M15 45 Q20 25 25 45" stroke="#6b7b56" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M25 50 Q30 30 35 50" stroke="#8b9471" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M35 47 Q40 27 45 47" stroke="#6b7b56" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M10 40 Q15 25 20 40" stroke="#8b9471" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M40 52 Q45 32 50 52" stroke="#6b7b56" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M20 48 Q25 33 30 48" stroke="#8b9471" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M30 44 Q35 29 40 44" stroke="#6b7b56" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  </svg>
);

export const LeafPattern = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b9471" />
        <stop offset="50%" stopColor="#6b7b56" />
        <stop offset="100%" stopColor="#a8b08a" />
      </linearGradient>
    </defs>
    {/* Large leaves */}
    <path d="M30 40 Q50 20, 70 40 Q50 60, 30 40" fill="url(#leafGradient)" opacity="0.6"/>
    <path d="M50 60 Q70 40, 90 60 Q70 80, 50 60" fill="url(#leafGradient)" opacity="0.5"/>
    <path d="M20 70 Q40 50, 60 70 Q40 90, 20 70" fill="url(#leafGradient)" opacity="0.7"/>
    
    {/* Leaf veins */}
    <path d="M30 40 Q50 40, 70 40" stroke="#6b7b56" strokeWidth="1" opacity="0.8"/>
    <path d="M50 60 Q70 60, 90 60" stroke="#6b7b56" strokeWidth="1" opacity="0.7"/>
    <path d="M20 70 Q40 70, 60 70" stroke="#6b7b56" strokeWidth="1" opacity="0.9"/>
    
    {/* Small decorative leaves */}
    <ellipse cx="80" cy="30" rx="8" ry="12" fill="#c17358" opacity="0.4" transform="rotate(45 80 30)"/>
    <ellipse cx="40" cy="25" rx="6" ry="9" fill="#e3e1d9" opacity="0.5" transform="rotate(-30 40 25)"/>
    <ellipse cx="90" cy="85" rx="7" ry="10" fill="#8b9471" opacity="0.4" transform="rotate(60 90 85)"/>
  </svg>
);

// Export all components as a namespace for backward compatibility
export const Illustrations = {
  TreeSilhouette,
  FlowerBunch,
  GrassCluster,
  LeafPattern,
  GrassIllustration,
  PeopleConnectingIllustration,
  AIBrainIllustration,
  SmartOrganizationIllustration,
  CommunityIllustration,
  EventsIllustration,
  WelcomeIllustration,
  SmallDecorationIllustration,
};