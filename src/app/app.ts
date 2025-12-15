import { Component, signal, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Video {
  title: string;
  thumbnail: string;
  videoUrl: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('PulguisDev');

  // Hero section
  protected readonly heroTitle = signal('Bienvenido a PulguisDev');
  protected readonly heroSubtitle = signal('Contenido educativo que entretiene y enseña');

  // About section
  protected readonly aboutTitle = signal('¿Quiénes Somos?');
  protected readonly aboutDescription = signal(`
    PulguisDev es un simpático gatito apasionado por compartir conocimiento. 
    A través de videos e imágenes informativas, exploramos el fascinante mundo de la historia, 
    la ciencia, la tecnología y mucho más. Nuestro contenido está diseñado para despertar 
    la curiosidad y hacer que el aprendizaje sea una experiencia divertida y memorable.
  `);

  // Objectives section
  protected readonly objectivesTitle = signal('Nuestro Objetivo');
  protected readonly objectives = signal([
    {
      icon: '🎓',
      title: 'Educar',
      description: 'Compartir conocimientos sobre historia, ciencia y tecnología de manera clara y accesible.'
    },
    {
      icon: '🎬',
      title: 'Entretener',
      description: 'Crear contenido dinámico y atractivo que mantenga tu atención de principio a fin.'
    },
    {
      icon: '🌟',
      title: 'Inspirar',
      description: 'Motivar a nuestra audiencia a seguir aprendiendo y explorando el mundo.'
    },
    {
      icon: '🤝',
      title: 'Conectar',
      description: 'Construir una comunidad de personas curiosas que aman aprender juntas.'
    }
  ]);

  // Videos for carousel (vertical format 9:16 for TikTok/Reels)
  protected readonly videos = signal<Video[]>([
    {
      title: '¿Cómo Sobrevivir a Dos Bombas Atómicas?',
      thumbnail: 'assets/videos/thumbnail_3.png',
      videoUrl: 'assets/videos/video_1.mp4'
    },
    {
      title: '¿Qué Pasa Si Caes en un Agujero Negro?',
      thumbnail: 'assets/videos/thumbnail_1.png',
      videoUrl: 'assets/videos/video_2.mp4'
    },
  ]);

  // Social links
  protected readonly socialLinks = signal<SocialLink[]>([
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@PulguisDev',
      icon: 'assets/social/youtube.png'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@pulguisdev',
      icon: 'assets/social/tiktok.webp'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/pulguisdev/',
      icon: 'assets/social/instagram.png'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61584898142419',
      icon: 'assets/social/facebook.webp'
    }
  ]);

  // Contact info
  protected readonly email = signal('pulguis.dev@gmail.com');

  // Carousel state
  protected currentSlide = signal(0);
  private autoSlideInterval: any;
  private isBrowser: boolean;

  // Video Modal state
  protected isModalOpen = signal(false);
  protected currentVideo = signal<Video | null>(null);

  // Mobile Menu state
  protected isMobileMenuOpen = signal(false);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Mobile Menu Methods
  protected toggleMobileMenu() {
    const isOpen = !this.isMobileMenuOpen();
    this.isMobileMenuOpen.set(isOpen);

    // Prevent body scroll when menu is open
    if (this.isBrowser) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }

  protected closeMobileMenu() {
    this.isMobileMenuOpen.set(false);

    // Re-enable body scroll
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  protected nextSlide() {
    const current = this.currentSlide();
    const total = this.videos().length;
    this.currentSlide.set((current + 1) % total);
  }

  protected prevSlide() {
    const current = this.currentSlide();
    const total = this.videos().length;
    this.currentSlide.set((current - 1 + total) % total);
  }

  protected goToSlide(index: number) {
    this.currentSlide.set(index);
    this.resetAutoSlide();
  }

  private startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  private stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  private resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  protected scrollToSection(sectionId: string) {
    if (this.isBrowser) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Video Modal Methods
  protected openVideoModal(video: Video) {
    this.currentVideo.set(video);
    this.isModalOpen.set(true);
    this.stopAutoSlide();

    // Prevent body scroll when modal is open
    if (this.isBrowser) {
      document.body.style.overflow = 'hidden';
    }
  }

  protected closeVideoModal() {
    this.isModalOpen.set(false);
    this.currentVideo.set(null);
    this.startAutoSlide();

    // Re-enable body scroll
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  protected onModalBackdropClick(event: MouseEvent) {
    // Close only if clicked on the backdrop, not the video container
    if ((event.target as HTMLElement).classList.contains('video-modal')) {
      this.closeVideoModal();
    }
  }
}
