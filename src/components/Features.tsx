
import { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

const Feature = ({ title, description, icon, index }: FeatureProps) => {
  const featureRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    if (featureRef.current) {
      observer.observe(featureRef.current);
    }
    
    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, [index]);

  return (
    <div 
      ref={featureRef}
      className={cn(
        "bg-white rounded-xl p-6 shadow-sm border border-border opacity-0",
        "hover:shadow-md transition-all duration-400 transform-gpu backface-hidden"
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      title: "Thoughtful Design",
      description: "Meticulous attention to every design detail creates an intuitive, seamless experience.",
      icon: "✦"
    },
    {
      title: "Premium Quality",
      description: "Crafted with precision and care for those who appreciate the finer aspects of technology.",
      icon: "◈"
    },
    {
      title: "Intuitive Experience",
      description: "An interface so natural that using it feels like second nature, requiring no learning curve.",
      icon: "◉"
    },
    {
      title: "Refined Simplicity",
      description: "Complex functionality distilled to its essence—powerful yet elegantly simple.",
      icon: "◎"
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 text-xs font-medium bg-secondary rounded-full mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Elegant Solutions for Modern Needs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've carefully crafted each feature to enhance your experience while maintaining the integrity of our design philosophy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              index={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
