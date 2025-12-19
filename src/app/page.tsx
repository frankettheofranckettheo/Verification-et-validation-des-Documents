'use client'

import { useState, useEffect, useRef, FC } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Zap, ScanLine, ArrowRight, UploadCloud, Cpu, FileCheck, Twitter, Linkedin, Github, MessageSquare } from 'lucide-react'

// --- HOOK POUR DÉTECTER QUAND UN ÉLÉMENT EST VISIBLE ---
function useInView(ref: React.RefObject<HTMLElement>) {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);
  return isInView;
}

// --- COMPOSANT POUR LE FOND EN GRILLE ANIMÉE ---
function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] animate-grid-pan"></div>
  )
}

// --- NOUVEAU VISUEL 3D "WOW" ---
function WowFactorVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const rotateX = -((y - height / 2) / (height / 2)) * 10;
      const rotateY = ((x - width / 2) / (width / 2)) * 10;
      container.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[400px] transition-transform duration-300 ease-out" style={{ transformStyle: 'preserve-3d' }}>
      {/* Phone */}
      <div className="absolute w-[250px] h-[500px] bg-slate-800 rounded-[40px] border-4 border-slate-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotateX(60deg) rotateZ(-30deg) translateZ(-50px)', transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-2 bg-black rounded-[32px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-xl"></div>
      </div>
      {/* CNI Card */}
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[190px] bg-slate-100 rounded-xl p-4 shadow-2xl animate-card-float" style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%) translateZ(100px)' }}>
        <div className="text-slate-500 font-bold text-xs">REPUBLIQUE DU CAMEROUN</div>
        <div className="flex mt-4 space-x-4">
          <div className="w-16 h-20 bg-slate-300 rounded-md"></div>
          <div className="flex-1 space-y-2">
            <div className="w-full h-3 bg-slate-300 rounded-sm"></div>
            <div className="w-3/4 h-3 bg-slate-300 rounded-sm"></div>
            <div className="w-full h-3 bg-slate-300 rounded-sm"></div>
          </div>
        </div>
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent top-1/2 left-0 animate-scan-light"></div>
      </div>
      {/* Checkmarks */}
      <div className="absolute w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg animate-check-1" style={{ transform: 'translateZ(50px)' }}>
        <ShieldCheck className="w-7 h-7 text-green-500" />
      </div>
      <div className="absolute w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg animate-check-2" style={{ transform: 'translateZ(80px)' }}>
        <Zap className="w-7 h-7 text-blue-500" />
      </div>
    </div>
  );
}

// --- COMPOSANT POUR LES STATS EN TEMPS RÉEL ---
const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      setCount(currentCount);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return <span ref={ref}>{count.toLocaleString('fr-FR')}</span>;
};

const LiveStats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  return (
    <section ref={ref} className="py-24 bg-white">
      <div className={`container mx-auto px-6 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-extrabold text-blue-600"><AnimatedCounter value={42589} />+</div>
            <div className="mt-2 text-lg text-slate-600">Documents Vérifiés ce mois-ci</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-blue-600">99.8%</div>
            <div className="mt-2 text-lg text-slate-600">Taux de précision de l'IA</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-blue-600">&lt;<AnimatedCounter value={15} />s</div>
            <div className="mt-2 text-lg text-slate-600">Temps de réponse moyen</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- PRÉSENTATION DES SERVICES (COMMENT ÇA MARCHE) ---
const ServicesShowcase = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  return (
    <section ref={ref} className="py-24 bg-slate-50 border-t border-slate-200">
      <div className={`container mx-auto px-6 text-center transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-4xl font-bold text-slate-900">Un processus d'une simplicité déconcertante</h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Trois étapes suffisent pour authentifier un document.</p>
        <div className="relative grid md:grid-cols-3 gap-8 mt-16">
          <div className="absolute top-1/3 left-0 w-full h-1 bg-slate-200 hidden md:block"></div>
          {howItWorksSteps.map((step, index) => (
            <div key={index} className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white border-2 border-blue-600 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto font-bold text-2xl">{index + 1}</div>
              <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- DÉMONSTRATION INTERACTIVE ---
const InteractiveDemo = () => {
  const [step, setStep] = useState<'idle' | 'processing' | 'done'>('idle');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  
  const handleDemo = () => {
    setStep('processing');
    setTimeout(() => setStep('done'), 3000);
  };

  useEffect(() => {
    // Reset demo when it's out of view
    if (!isInView) setTimeout(() => setStep('idle'), 500);
  }, [isInView]);

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">Voyez la magie opérer</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Cliquez pour lancer une simulation de vérification.</p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all duration-500">
          {step === 'idle' && (
            <div className="text-center animate-fadeIn">
              <Button size="lg" onClick={handleDemo} className="bg-blue-600 text-white hover:bg-blue-700">
                <Zap className="w-5 h-5 mr-2" />
                Lancer la démo
              </Button>
            </div>
          )}
          {step === 'processing' && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-center space-x-4">
                <Cpu className="w-8 h-8 text-blue-500 animate-pulse" />
                <p className="text-lg font-medium">Analyse en cours...</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                <div className="bg-blue-600 h-2.5 rounded-full animate-progress"></div>
              </div>
            </div>
          )}
          {step === 'done' && (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 text-green-600 bg-green-100 px-4 py-2 rounded-full font-semibold">
                  <ShieldCheck />
                  <span>Document Authentique</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold text-slate-500">Nom:</span> DUPONT</div>
                <div><span className="font-semibold text-slate-500">Prénom:</span> JEAN</div>
                <div><span className="font-semibold text-slate-500">Né le:</span> 25/08/1985</div>
                <div><span className="font-semibold text-slate-500">N° Doc:</span> 21XX12345</div>
              </div>
              <div className="text-center mt-6">
                <Button variant="ghost" onClick={() => setStep('idle')}>Réinitialiser</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// --- TÉMOIGNAGES ---
const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">Ils nous font confiance</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-sm border-slate-200">
              <CardContent className="p-6">
                <p className="text-slate-700 italic">"{testimonial.quote}"</p>
                <div className="flex items-center mt-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};


// --- CALL TO ACTION ---
const CTASection = () => {
  const router = useRouter();
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-extrabold text-slate-900">Prêt à éliminer la fraude ?</h2>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
          Intégrez notre solution en quelques minutes et sécurisez vos processus d'identification dès aujourd'hui.
        </p>
        <Button 
          size="lg"
          className="mt-8 bg-blue-600 text-white hover:bg-blue-700 px-10 py-7 text-lg font-semibold rounded-lg shadow-lg shadow-blue-500/20"
          onClick={() => router.push('/verify')}
        >
          Commencer la vérification
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
};


// --- FOOTER ---
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-white text-lg">VerifyCo</h3>
            <p className="mt-2 text-sm">La solution de confiance pour la vérification d'identité.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Produit</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-white">Tarifs</a></li>
              <li><a href="#" className="hover:text-white">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Entreprise</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">À propos</a></li>
              <li><a href="#" className="hover:text-white">Carrières</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white"><Twitter /></a>
            <a href="#" className="hover:text-white"><Github /></a>
            <a href="#" className="hover:text-white"><Linkedin /></a>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} VerifyCo. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
export default function HomePage() {
  const router = useRouter()
  
  const handleGetStarted = () => {
    router.push('/verification') 
  }

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 overflow-x-hidden relative">
      <GridBackground />
      
      <div className="relative z-10">
        <header className="container mx-auto px-6 py-5">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white"/>
              </div>
              <span className="text-xl font-bold text-slate-900">VerifyCo</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hidden sm:inline-flex">Connexion Admin</Button>
              <Button 
                className="bg-slate-900 text-white hover:bg-slate-800"
                onClick={handleGetStarted}
              >
                Vérifier un ID
              </Button>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-6 pt-16 md:pt-24 pb-24 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fadeIn">
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                La confiance,
                <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                  vérifiée en un instant.
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
                Notre plateforme IA authentifie les pièces d'identité camerounaises avec une précision inégalée.
                Simple, rapide et entièrement sécurisé.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-6 text-base font-semibold rounded-lg shadow-lg shadow-blue-500/20"
                  onClick={handleGetStarted}
                >
                  Vérifier un document
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center justify-center h-[400px]">
              <WowFactorVisual />
            </div>
          </div>
        </main>
        
        <LiveStats />
        <ServicesShowcase />
        <InteractiveDemo />
        <Testimonials />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}

// --- DONNÉES POUR LES SECTIONS ---
const features = [
  { icon: ShieldCheck, title: 'Analyse de Sécurité', description: "Détection des hologrammes et motifs spécifiques aux documents camerounais." },
  { icon: Zap, title: 'Résultats en Temps Réel', description: "Obtenez un verdict de validation en moins de 30 secondes." },
  { icon: ScanLine, title: 'Capture Intelligente', description: "Notre guide assure une qualité d'image parfaite pour une précision maximale." }
];

const howItWorksSteps = [
  { title: 'Capturez ou importez', description: "Prenez une photo claire de votre document ou importez-la depuis votre galerie." },
  { title: 'Analyse par l\'IA', description: "Notre système analyse les points de sécurité et extrait les informations en quelques secondes." },
  { title: 'Recevez le verdict', description: "Obtenez un résultat clair et un rapport de vérification détaillé." }
];

const testimonials = [
  { quote: "La solution de VerifyCo a réduit notre temps d'intégration de 80%. C'est un changement radical pour notre fintech.", name: 'Marie Dupont', title: 'CEO, Kobo Bank', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { quote: "Enfin une solution fiable et rapide pour la vérification des CNI camerounaises. L'intégration de l'API a été un jeu d'enfant.", name: 'Ahmed Bello', title: 'CTO, Yobale', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { quote: "Nous avons considérablement réduit les cas de fraude depuis que nous utilisons VerifyCo. La précision est impressionnante.", name: 'Chloé Nguena', title: 'Responsable Conformité, Wassa', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' }
];