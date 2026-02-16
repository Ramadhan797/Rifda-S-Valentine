import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Sparkles, MessageCircle, ChevronDown, RefreshCw, Laugh, Frown, Angry, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Floating Hearts Background Component
const FloatingHearts = () => {
  const hearts = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    size: Math.random() * 24 + 16,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 6,
    opacity: Math.random() * 0.3 + 0.15,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            bottom: '-50px',
            animation: `float-up ${heart.duration}s linear infinite`,
            animationDelay: `${heart.delay}s`,
            opacity: heart.opacity,
          }}
        >
          <Heart
            size={heart.size}
            fill="#FF4D7B"
            color="#FF4D7B"
          />
        </div>
      ))}
    </div>
  );
};

// Wireframe Heart Background
const WireframeHeart = () => (
  <svg
    className="fixed inset-0 w-full h-full pointer-events-none z-0"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid slice"
  >
    <path
      className="wireframe-heart"
      d="M50 85 C50 85, 10 55, 10 35 C10 20, 25 10, 40 15 C50 18, 50 25, 50 25 C50 25, 50 18, 60 15 C75 10, 90 20, 90 35 C90 55, 50 85, 50 85 Z"
      transform="scale(1.5) translate(-16.5, -25)"
    />
  </svg>
);

// Question Card Component
interface QuestionCardProps {
  imageSrc: string;
  imagePosition: 'left' | 'right';
  questionNumber: string;
  question: string;
  options: { text: string; icon: React.ReactNode; reaction: string }[];
  onAnswer?: (reaction: string) => void;
  children?: React.ReactNode;
}

const QuestionCard = ({ imageSrc, imagePosition, questionNumber, question, options, onAnswer }: QuestionCardProps) => {
  const isImageLeft = imagePosition === 'left';
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (reaction: string) => {
    setSelectedAnswer(reaction);
    onAnswer?.(reaction);
  };

  return (
    <div className="valentine-card w-full h-full flex flex-col md:flex-row overflow-hidden">
      {/* Image Panel */}
      <div
        className={`relative ${isImageLeft ? 'md:order-1' : 'md:order-2'} w-full md:w-[50%] h-[35%] md:h-full`}
      >
        <img
          src={imageSrc}
          alt="Ilustrasi lucu"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14141B]/40 to-transparent md:hidden" />
      </div>

      {/* Question Panel */}
      <div
        className={`relative ${isImageLeft ? 'md:order-2' : 'md:order-1'} w-full md:w-[50%] h-[65%] md:h-full p-5 md:p-8 lg:p-10 flex flex-col justify-center`}
      >
        <span className="font-accent text-xs uppercase tracking-[0.2em] text-valentine-pink mb-3">
          Pertanyaan {questionNumber}
        </span>
        <h2 className="font-heading font-semibold text-2xl md:text-3xl lg:text-4xl text-valentine-cream mb-4 md:mb-6 leading-tight">
          {question}
        </h2>
        
        {!selectedAnswer ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.reaction)}
                className="btn-option flex items-center gap-3 p-4 rounded-xl border border-valentine-cream/20 bg-valentine-cream/5 hover:bg-valentine-pink/20 hover:border-valentine-pink/50 transition-all duration-200 text-left"
              >
                <span className="text-valentine-pink">{option.icon}</span>
                <span className="text-valentine-cream text-sm md:text-base">{option.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in">
            <div className="p-4 rounded-xl bg-valentine-pink/20 border border-valentine-pink/40">
              <p className="text-valentine-cream text-lg font-medium">{selectedAnswer}</p>
            </div>
            <p className="text-valentine-muted text-sm mt-3">Scroll untuk pertanyaan selanjutnya! 👇</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Final Card Component
interface FinalCardProps {
  onYes: () => void;
  onNoHover: () => void;
  noButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const FinalCard = ({ onYes, onNoHover, noButtonRef }: FinalCardProps) => {
  return (
    <div className="valentine-card w-full h-full flex flex-col md:flex-row overflow-hidden">
      <div className="relative w-full md:w-[50%] h-[35%] md:h-full md:order-2">
        <img
          src="/final_yes.jpg"
          alt="Couple happy"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative w-full md:w-[50%] h-[65%] md:h-full p-5 md:p-8 lg:p-10 flex flex-col justify-center md:order-1">
        <span className="font-accent text-xs uppercase tracking-[0.2em] text-valentine-pink mb-3">
          Pertanyaan Terakhir!
        </span>
        <h2 className="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-valentine-cream mb-4 md:mb-6 leading-tight">
          Will U Be My Valentine? 🥺
        </h2>
        <p className="text-valentine-muted text-base md:text-lg mb-6 md:mb-8">
          Jawab yang jujur ya... tapi kalau jawabannya enggak, tombolnya bakal kabur sih 😏
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onYes} className="btn-primary flex items-center justify-center gap-2">
            <Heart size={20} fill="white" />
            MAU BANGET!
          </button>
          <button
            ref={noButtonRef}
            onMouseEnter={onNoHover}
            onClick={onNoHover}
            className="btn-secondary"
          >
            Enggak deh...
          </button>
        </div>
      </div>
    </div>
  );
};

// Success Overlay Component
interface SuccessOverlayProps {
  isVisible: boolean;
  onRestart: () => void;
}

const SuccessOverlay = ({ isVisible, onRestart }: SuccessOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="valentine-card w-full max-w-[500px] p-6 md:p-10 text-center animate-in fade-in zoom-in">
        <div className="flex justify-center mb-4">
          <Heart size={64} fill="#FF4D7B" color="#FF4D7B" className="heart-pulse" />
        </div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-valentine-cream mb-3">
          YEAY! 🎉
        </h2>
        <p className="text-valentine-muted text-base md:text-lg mb-6">
          Kamu udah setuju jadi Valentine aku! <br/>
          Siap-siap ya, aku bakal bikin harimu spesial! 💕
        </p>
        <div className="flex flex-col gap-3">
          <p className="text-valentine-pink text-sm font-accent uppercase tracking-wider">
            Happy Valentine's Day!
          </p>
          <button
            onClick={onRestart}
            className="btn-secondary inline-flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  // Questions data
  const questions = [
    {
      imageSrc: "/q1_confused.jpg",
      imagePosition: "left" as const,
      questionNumber: "1",
      question: "Kalau aku tiba-tiba ngilang jam 2 pagi, kamu...",
      options: [
        { text: "Langsung cariin", icon: <Heart size={20} />, reaction: "Awww, sweet banget! 💕" },
        { text: "Nunggu biar ngechat lagi", icon: <Smile size={20} />, reaction: "OK sih, tapi... 😅" },
        { text: "Bodoamat", icon: <Frown size={20} />, reaction: "Ehh, gitu amat! 😤" },
        { text: "Makin Bodoamat", icon: <Laugh size={20} />, reaction: "WKWKWKWK" },
      ],
    },
    {
      imageSrc: "/q2_food.jpg",
      imagePosition: "right" as const,
      questionNumber: "2",
      question: "Kamu makan di tempat favoritku, tapi aku cuma boleh pilih 1 menu...",
      options: [
        { text: "Kasih semua menu ke kamu", icon: <Heart size={20} />, reaction: "Sayangnya kebangetan! 🥰" },
        { text: "Bagi dua setengah-setengah", icon: <Smile size={20} />, reaction: "Fair enough lah ya 😌" },
        { text: "Pesen sendiri aja", icon: <Angry size={20} />, reaction: "Selfish banget sih! 😠" },
        { text: "Curi-curi makan punyamu", icon: <Laugh size={20} />, reaction: "Itu mah biasa wkwk 😂" },
      ],
    },
    {
      imageSrc: "/q3_movie.jpg",
      imagePosition: "left" as const,
      questionNumber: "3",
      question: "Kita nonton film horror, tapi aku ketiduran di bahu kamu...",
      options: [
        { text: "Biarin, aku seneng liatnya", icon: <Heart size={20} />, reaction: "Gemesin banget! 🥺" },
        { text: "Foto buat blackmail", icon: <Laugh size={20} />, reaction: "Jahat banget! 😂" },
        { text: "Bangunin pelan-pelan", icon: <Smile size={20} />, reaction: "Baik juga sih 😊" },
        { text: "Ikutan tidur juga", icon: <Frown size={20} />, reaction: "Filmnya sepi sendiri dong 😴" },
      ],
    },
    {
      imageSrc: "/q4_selfie.jpg",
      imagePosition: "right" as const,
      questionNumber: "4",
      question: "Aku minta foto couple buat upload IG, tapi hasilnya jelek...",
      options: [
        { text: "Tetep upload, yang penting kita", icon: <Heart size={20} />, reaction: "True love indeed! 💖" },
        { text: "Edit dulu sampe cakep", icon: <Smile size={20} />, reaction: "Hasilnya glowing! ✨" },
        { text: "Foto ulang 100x", icon: <Laugh size={20} />, reaction: "Sampe pegel tangan! 😂" },
        { text: "Gak usah upload deh", icon: <Frown size={20} />, reaction: "Yahh, sedih 😢" },
      ],
    },
  ];

  // Trigger confetti
  const triggerConfetti = useCallback(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF4D7B', '#F4F1EC', '#FFB6C1', '#FF69B4', '#FFD700'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF4D7B', '#F4F1EC', '#FFB6C1', '#FF69B4', '#FFD700'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Handle Yes click
  const handleYesClick = useCallback(() => {
    setShowSuccess(true);
    triggerConfetti();
  }, [triggerConfetti]);

  // Handle No button evade
  const handleNoHover = useCallback(() => {
    if (noButtonRef.current) {
      const button = noButtonRef.current;
      const rect = button.getBoundingClientRect();
      const parentRect = button.parentElement?.getBoundingClientRect();
      
      if (parentRect) {
        const maxX = parentRect.width - rect.width - 20;
        const maxY = parentRect.height - rect.height - 20;
        
        const newX = Math.max(10, Math.random() * maxX);
        const newY = Math.max(10, Math.random() * maxY);
        
        gsap.to(button, {
          x: newX - (rect.left - parentRect.left),
          y: newY - (rect.top - parentRect.top),
          duration: 0.2,
          ease: 'power2.out',
        });
      }
    }
  }, []);

  // Reset and restart
  const handleRestart = useCallback(() => {
    setShowSuccess(false);
    if (noButtonRef.current) {
      gsap.set(noButtonRef.current, { x: 0, y: 0 });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Setup GSAP ScrollTrigger
  useEffect(() => {
    const sections = sectionRefs.current.filter(Boolean);
    const cards = cardRefs.current.filter(Boolean);
    
    const ctx = gsap.context(() => {
      // Section 1: Opening Card
      gsap.fromTo(
        cards[0],
        { y: '110vh', rotate: -2, opacity: 0 },
        {
          y: 0,
          rotate: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sections[0],
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 0.6,
          },
        }
      );

      // Question cards
      cards.slice(1, 5).forEach((card, index) => {
        const directions = [
          { x: '100vw', rotate: 3 },
          { y: '-110vh', rotate: -3 },
          { x: '-100vw', rotate: -3 },
          { y: '110vh', rotate: 2 },
        ];
        const dir = directions[index % directions.length];
        
        gsap.fromTo(
          card,
          { ...dir, opacity: 0 },
          {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sections[index + 1],
              start: 'top top',
              end: '+=120%',
              pin: true,
              scrub: 0.6,
            },
          }
        );
      });

      // Final card
      gsap.fromTo(
        cards[5],
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sections[5],
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 0.6,
          },
        }
      );

      // Global snap to sections
      ScrollTrigger.create({
        snap: {
          snapTo: (progress) => {
            const sectionCount = 6;
            const sectionProgress = 1 / sectionCount;
            const currentSection = Math.round(progress / sectionProgress);
            return currentSection * sectionProgress;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-valentine-black min-h-screen">
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Background Elements */}
      <FloatingHearts />
      <WireframeHeart />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 md:px-8 py-4">
        <div className="font-heading font-semibold text-valentine-cream text-lg md:text-xl tracking-tight flex items-center gap-2">
          <Heart size={20} fill="#FF4D7B" color="#FF4D7B" />
          ValentineQuiz
        </div>
        <button
          onClick={() => setShowNoteModal(true)}
          className="p-2.5 rounded-full bg-valentine-charcoal/80 border border-valentine-cream/10 text-valentine-cream hover:bg-valentine-pink/20 transition-colors"
          aria-label="Buka pesan"
        >
          <MessageCircle size={18} />
        </button>
      </header>

      {/* Note Modal */}
      {showNoteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowNoteModal(false)}
        >
          <div 
            className="valentine-card max-w-sm w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Sparkles className="mx-auto mb-4 text-valentine-pink" size={32} />
            <h3 className="font-heading font-semibold text-xl text-valentine-cream mb-3">
              Pesan Rahasia 💌
            </h3>
            <p className="text-valentine-muted leading-relaxed text-sm">
              "Kalau kamu baca ini, berarti kamu udah aku senyum-senyum sendiri. 
              Makasih ya udah mau main kuis ini!"
            </p>
            <button
              onClick={() => setShowNoteModal(false)}
              className="btn-primary mt-5 text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Sections */}
      <main className="relative">
        {/* Section 1: Hero */}
        <section
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="section-pinned flex items-center justify-center z-10"
        >
          <div
            ref={(el) => { cardRefs.current[0] = el; }}
            className="relative w-[min(92vw,900px)] h-[min(80vh,550px)]"
          >
            <div className="valentine-card w-full h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-6">
                <Heart size={72} fill="#FF4D7B" color="#FF4D7B" className="floating-heart mx-auto" />
              </div>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-valentine-cream mb-4">
                Mari Kita Tes! 💕
              </h1>
              <p className="text-valentine-muted text-lg md:text-xl max-w-md mx-auto mb-8">
                Seberapa cocok rifduy be my Valentine <br/>
                <span className="text-valentine-pink">Jawab 4 pertanyaan ini dulu!</span>
              </p>
              <div className="flex items-center gap-2 text-valentine-pink font-accent text-sm uppercase tracking-widest">
                <span>Scroll ke bawah</span>
                <ChevronDown className="animate-bounce" size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* Question Cards */}
        {questions.map((q, index) => (
          <section
            key={index}
            ref={(el) => { sectionRefs.current[index + 1] = el; }}
            className="section-pinned flex items-center justify-center"
            style={{ zIndex: 20 + index }}
          >
            <div
              ref={(el) => { cardRefs.current[index + 1] = el; }}
              className="relative w-[min(92vw,900px)] h-[min(80vh,550px)]"
            >
              <QuestionCard {...q} />
            </div>
          </section>
        ))}

        {/* Section 6: Final Ask */}
        <section
          ref={(el) => { sectionRefs.current[5] = el; }}
          className="section-pinned flex items-center justify-center z-50"
        >
          <div
            ref={(el) => { cardRefs.current[5] = el; }}
            className="relative w-[min(92vw,900px)] h-[min(80vh,550px)]"
          >
            <FinalCard 
              onYes={handleYesClick}
              onNoHover={handleNoHover}
              noButtonRef={noButtonRef}
            />
            <SuccessOverlay isVisible={showSuccess} onRestart={handleRestart} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-valentine-muted text-sm">
        <p className="flex items-center justify-center gap-2">
          Dibuat dengan <Heart size={14} fill="#FF4D7B" color="#FF4D7B" /> untuk Valentine
        </p>
      </footer>
    </div>
  );
}

export default App;
