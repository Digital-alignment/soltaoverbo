import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Banner {
  id: string;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  link_url: string | null;
  display_order: number;
  visible_to_roles: string[];
}

export default function BannerSlider() {
  const { profile } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchBanners();
    }
  }, [profile]);

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, banners.length, isAutoPlaying]);

  const fetchBanners = async () => {
    try {
      if (!profile) return;

      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const userRole = profile.role || 'free';
      const filteredBanners = (data || []).filter(banner =>
        banner.visible_to_roles && banner.visible_to_roles.includes(userRole)
      );

      setBanners(filteredBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const isInternalLink = (url: string | null) => {
    if (!url) return false;
    return url.startsWith('/');
  };

  const renderButton = () => {
    if (!currentBanner.button_text || !currentBanner.button_link) {
      return null;
    }

    const buttonClasses = "inline-flex items-center px-8 py-3 btn-primary transform hover:scale-105";

    if (isInternalLink(currentBanner.button_link)) {
      return (
        <Link
          to={currentBanner.button_link}
          className={buttonClasses}
          onClick={(e) => e.stopPropagation()}
        >
          {currentBanner.button_text}
        </Link>
      );
    }

    return (
      <a
        href={currentBanner.button_link!}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {currentBanner.button_text}
      </a>
    );
  };

  const renderBannerContent = (banner: Banner, index: number) => {
    const hasButton = banner.button_text && banner.button_link;
    const shouldMakeBannerClickable = banner.link_url && !hasButton;

    const content = (
      <>
        <img
          src={banner.image_url}
          alt={`Banner ${banner.display_order}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        {index === currentIndex && hasButton && (
          <div className="absolute inset-0 flex items-start justify-start px-8 py-12 md:px-16 md:py-20 z-10">
            <div className="animate-fade-in">
              {renderButton()}
            </div>
          </div>
        )}
      </>
    );

    if (shouldMakeBannerClickable) {
      if (isInternalLink(banner.link_url)) {
        return (
          <Link
            to={banner.link_url!}
            className="absolute inset-0 cursor-pointer"
          >
            {content}
          </Link>
        );
      }
      return (
        <a
          href={banner.link_url!}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 cursor-pointer"
        >
          {content}
        </a>
      );
    }

    return <div className="absolute inset-0">{content}</div>;
  };

  return (
    <div
      className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl border border-darkNeutral/10"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            {renderBannerContent(banner, index)}
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-white'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/75'
                } rounded-full`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
