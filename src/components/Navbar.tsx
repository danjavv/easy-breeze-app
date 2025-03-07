
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import Button from './Button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userRole, signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleAuthAction = () => {
    if (userRole) {
      signOut();
      navigate('/auth');
    } else {
      navigate('/auth');
    }
  };

  const handleGetStarted = () => {
    if (userRole) {
      // Navigate to dashboard 
      const dashboardRoute = userRole === 'admin' ? '/admin-dashboard' : '/supplier-dashboard';
      navigate(dashboardRoute);
    } else {
      navigate('/auth');
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-bounce-ease py-4 px-6 sm:px-8 md:px-12 backface-hidden will-change-transform",
        scrolled ? "glass shadow-sm py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="text-xl font-medium flex items-center">
          <span className="mr-1 text-2xl">●</span>
          <span className="font-semibold">Essence</span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {['Products', 'Features', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
        
        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:inline-flex"
            onClick={handleAuthAction}
          >
            {userRole ? 'Log out' : 'Log in'}
            {userRole && <LogOut className="ml-2 h-4 w-4" />}
          </Button>
          <Button size="sm" onClick={handleGetStarted}>
            {userRole ? 'Dashboard' : 'Get Started'}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass shadow-md py-4 px-6">
          <nav className="flex flex-col space-y-4">
            {['Products', 'Features', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <hr className="border-foreground/10" />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-center"
              onClick={() => {
                handleAuthAction();
                setMobileMenuOpen(false);
              }}
            >
              {userRole ? 'Log out' : 'Log in'}
              {userRole && <LogOut className="ml-2 h-4 w-4" />}
            </Button>
            <Button 
              size="sm" 
              className="w-full justify-center"
              onClick={() => {
                handleGetStarted();
                setMobileMenuOpen(false);
              }}
            >
              {userRole ? 'Dashboard' : 'Get Started'}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
