import { useEffect, useRef } from 'react';
import Button from './Button';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen pt-24 px-6 flex items-center justify-center opacity-0"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/50 rounded-full blur-3xl opacity-60" />
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <span className="inline-block py-1 px-3 text-xs font-medium bg-secondary rounded-full mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          For Ingredient Manufacturers
        </span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <span className="block">Streamline Your</span>
          <span className="block">Ingredient Testing</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          A comprehensive platform for ingredient manufacturers to submit, track, and manage their ingredient test results. 
          Get instant feedback and detailed analysis of your submissions.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <Button size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
