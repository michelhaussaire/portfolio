"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, Mail, Github, Linkedin, ArrowUp } from "lucide-react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Script from "next/script";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { SkillCard } from "@/components/skill-card";
import { ContactForm } from "@/components/contact-form";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { CursorEffect } from "@/components/cursor-effect";

// Project categories
const categories = ["All", "Frontend", "Backend", "Full Stack", "UI/UX"];

// Project data
const projects = [
  {
    id: 1,
    title: "Hibi.dev Website Platform",
    description:
      "A full-stack website platform with custom content management, SEO optimization, and responsive design for clients across multiple industries.",
    tags: ["React", "Node.js", "Tailwind CSS", "Supabase"],
    categories: ["Full Stack", "Frontend", "Backend"],
    imageUrl: "/placeholder.svg?height=300&width=500",
    demoUrl: "https://hibi.dev",
    repoUrl: "#",
  },
  {
    id: 2,
    title: "Mobile Appointment Scheduler",
    description:
      "A cross-platform mobile application for scheduling and managing appointments with real-time notifications and calendar integration.",
    tags: ["React Native", "Expo", "Firebase", "NativeWind"],
    categories: ["Frontend", "Mobile"],
    imageUrl: "/placeholder.svg?height=300&width=500",
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: 3,
    title: "AI Document Processor",
    description:
      "An intelligent document processing system that uses AI to extract, classify, and process information from various document types.",
    tags: ["Python", "OpenAI", "React", "Supabase"],
    categories: ["Full Stack", "UI/UX", "Backend"],
    imageUrl: "/placeholder.svg?height=300&width=500",
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description:
      "A responsive portfolio website with modern design, dark mode support, and smooth animations to showcase professional skills and projects.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    categories: ["Frontend", "UI/UX"],
    imageUrl: "/placeholder.svg?height=300&width=500",
    demoUrl: "#",
    repoUrl: "#",
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll references
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // Detect when sections are in view
  const aboutInView = useInView(aboutRef, { once: false, amount: 0.3 });
  const skillsInView = useInView(skillsRef, { once: false, amount: 0.3 });
  const projectsInView = useInView(projectsRef, { once: false, amount: 0.3 });
  const contactInView = useInView(contactRef, { once: false, amount: 0.3 });

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Filter projects by category
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) =>
          project.categories.includes(selectedCategory)
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-slate-50 to-cyan-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30">
      {/* Structured data for SEO */}
      <Script
        id="schema-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: "Michel Haussaire - Portfolio",
            url: "https://hibi.dev",
            mainEntity: {
              "@type": "Person",
              name: "Michel Haussaire",
              url: "https://hibi.dev",
              jobTitle: "Full Stack & Mobile Developer",
              sameAs: [
                "https://github.com/michelhaussaire",
                "https://linkedin.com/in/michelhaussaire",
                "https://twitter.com/hibidev",
              ],
              knowsAbout: [
                "Web Development",
                "Mobile Development",
                "AI Solutions",
                "React Native",
                "Expo",
                "Supabase",
              ],
              workExample: projects.map((project) => ({
                "@type": "CreativeWork",
                name: project.title,
                description: project.description,
                url: project.demoUrl,
              })),
            },
          }),
        }}
      />

      {/* Efecto de luz del cursor con partículas */}
      <CursorEffect />

      {/* Desktop Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/70 border-b border-[#13d4dd]/20 dark:border-[#13d4dd]/10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold text-[#005265] dark:text-[#13d4dd] neon-text">
            Michel Haussaire
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center space-x-6">
              {["Home", "About", "Skills", "Projects", "Contact"].map(
                (item, index) => (
                  <a
                    key={item}
                    href={`#${
                      index === 0
                        ? ""
                        : ["about", "skills", "projects", "contact"][index - 1]
                    }`}
                    className="text-slate-700 dark:text-slate-300 hover:text-[#005265] dark:hover:text-[#13d4dd] transition-colors hover:scale-105 transition-transform duration-300"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>

            <div className="hidden md:flex items-center">
              <ThemeToggle />
            </div>

            <button
              className="md:hidden text-[#005265] dark:text-[#13d4dd] flex items-center justify-center"
              onClick={() => setIsNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isNavOpen && (
          <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-20 mb-16 min-h-[80vh] relative overflow-visible">
          <div className="container mx-auto px-4 relative z-10 overflow-visible">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 overflow-visible">
              {/* Hero Content */}
              <motion.div
                className="md:max-w-xl w-full text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 bg-gradient-to-r from-[#13d4dd] to-[#005265] dark:from-[#13d4dd] dark:to-[#005265] text-transparent bg-clip-text neon-text"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Michel{" "}
                  <span className="relative inline-block">
                    Haussaire
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#13d4dd] dark:bg-[#13d4dd] animate-pulse"></span>
                  </span>
                </motion.h1>
                <motion.h2
                  className="text-lg sm:text-xl md:text-2xl font-medium mb-4 cyberpunk-text"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <span className="text-slate-700 dark:text-slate-300">
                    {"<"}
                  </span>
                  <span className="text-[#005265] dark:text-[#13d4dd]">
                    Full Stack & Mobile Developer
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {"/>"}
                  </span>
                </motion.h2>
                <motion.p
                  className="text-slate-700 dark:text-slate-300 mb-8 max-w-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Strategic technology leader focused on building high-impact
                  Web, Mobile, and AI solutions. Experienced in developing
                  responsive websites, mobile applications, and implementing
                  advanced AI solutions.
                </motion.p>
                <motion.div
                  className="flex flex-wrap md:justify-start justify-center gap-4 mb-8 md:mb-0"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button
                    asChild
                    className="rounded-full gradient-btn border-none shadow-lg shadow-[#13d4dd]/20 hover:shadow-xl hover:shadow-[#13d4dd]/30 hover:scale-105 active:scale-95 transition-transform duration-300"
                  >
                    <Link href="#contact" className="px-6">
                      Get in touch
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full neo-button border-none text-[#005265] dark:text-[#13d4dd] hover:scale-105 active:scale-95 transition-transform duration-300"
                  >
                    <Link href="#projects" className="px-6">
                      View projects
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Hero Image with vapor effects */}
              <motion.div
                className="w-full md:w-auto flex justify-center md:justify-end overflow-visible"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="relative w-[400px] h-[340px] md:w-[650px] md:h-[500px] lg:w-[750px] lg:h-[550px] overflow-visible">
                  {/* Extended smoke/vapor effects */}
                  <div className="absolute -inset-16 bg-gradient-to-br from-[#13d4dd]/50 to-[#005265]/15 rounded-full blur-2xl animate-pulse-slow"></div>

                  {/* Smaller asymmetric vapor effects */}
                  <div className="absolute -bottom-16 -right-16 w-[120%] h-[120%] bg-gradient-to-tr from-[#13d4dd]/40 to-[#005265]/5 rounded-full blur-xl"></div>
                  <div className="absolute -top-20 -left-16 w-[120%] h-[100%] bg-gradient-to-bl from-[#13d4dd]/35 to-transparent rounded-full blur-xl animate-float"></div>
                  <div className="absolute bottom-0 right-0 w-[110%] h-[70%] bg-gradient-to-t from-[#13d4dd]/30 to-transparent rounded-full blur-xl animate-float-delayed"></div>

                  {/* Smaller vapor clouds */}
                  <div className="absolute top-[5%] right-[-10%] w-56 h-48 bg-gradient-to-t from-transparent via-[#13d4dd]/40 to-transparent rounded-full blur-xl rotate-12 animate-float-slow"></div>
                  <div className="absolute bottom-[15%] left-[-15%] w-64 h-52 bg-gradient-to-r from-transparent via-[#13d4dd]/30 to-transparent rounded-full blur-xl -rotate-[25deg] animate-float-delayed"></div>
                  <div className="absolute top-[30%] left-[-5%] w-48 h-56 bg-gradient-to-br from-[#13d4dd]/35 to-transparent rounded-full blur-xl rotate-45 animate-pulse-slow"></div>

                  <Image
                    src="/hero-img.png"
                    alt="Michel Haussaire - Full Stack & Mobile Developer"
                    fill
                    className="object-contain relative z-10"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 mb-16" ref={aboutRef}>
          <h2 className="text-3xl font-bold text-center mb-16 text-[#005265] dark:text-[#13d4dd] neon-text">
            About Me
          </h2>
          <motion.div
            className="glow"
            initial={{ opacity: 0, y: 50 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="neo-card overflow-hidden neon-border">
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="aspect-square rounded-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/5 group-hover:opacity-70 transition-opacity duration-500 opacity-0 z-10"></div>
                    <Image
                      src="/placeholder.svg"
                      alt="Miguel Romero - Full Stack & Mobile Developer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      width={400}
                      height={400}
                      loading="lazy"
                      priority={false}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-[#005265] dark:text-[#13d4dd] neon-text">
                      My Journey
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 mb-4">
                      As the founder of Hibi.dev, I design, develop, and
                      maintain websites and web applications, ensuring optimal
                      performance, security, and exceptional user experiences.
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 mb-4">
                      I develop mobile applications for iOS and Android using
                      React Native and Expo, focusing on intuitive interfaces
                      and seamless backend integration.
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      My experience also includes implementing advanced AI
                      solutions, including multi-step agents and model tuning,
                      complemented by my background in CPR techniques, emergency
                      management, and problem-solving under pressure from my
                      time as a Lifeguard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 mb-16" ref={skillsRef}>
          <h2 className="text-3xl font-bold text-center mb-16 text-[#005265] dark:text-[#13d4dd] neon-text">
            Skills
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={
              skillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={
                skillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SkillCard
                title="Frontend Development"
                skills={[
                  "React",
                  "TypeScript",
                  "Next.js",
                  "HTML/CSS",
                  "Tailwind CSS",
                ]}
                icon="layout"
              />
            </motion.div>
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={
                skillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SkillCard
                title="Backend & Mobile"
                skills={["C#", "Python", "Node.js", "Expo", "React Native"]}
                icon="server"
              />
            </motion.div>
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={
                skillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SkillCard
                title="Database & Other Skills"
                skills={[
                  "SQL Server",
                  "Supabase",
                  "AI Solutions",
                  "Linux",
                  "LaTeX",
                ]}
                icon="tool"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 mb-16" ref={projectsRef}>
          <h2 className="text-3xl font-bold text-center mb-10 text-[#005265] dark:text-[#13d4dd] neon-text">
            Projects
          </h2>

          {/* Category filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={
              projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5 }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full ${
                  selectedCategory === category
                    ? "gradient-btn border-none shadow-lg"
                    : "neo-button border-none text-blue-600 dark:text-blue-300"
                } hover:scale-105 active:scale-95 transition-transform duration-300`}
              >
                {category}
              </Button>
            ))}
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" layout>
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    tags={project.tags}
                    imageUrl={project.imageUrl}
                    demoUrl={project.demoUrl}
                    repoUrl={project.repoUrl}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 mb-8" ref={contactRef}>
          <h2 className="text-3xl font-bold text-center mb-16 text-[#005265] dark:text-[#13d4dd] neon-text">
            Contact
          </h2>
          <motion.div
            className="glow"
            initial={{ opacity: 0, y: 50 }}
            animate={
              contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.6 }}
          >
            <div className="neo-card max-w-3xl mx-auto neon-border">
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-[#005265] dark:text-[#13d4dd] neon-text">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                        <div className="p-2 rounded-full bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900">
                          <Mail className="h-5 w-5 text-[#005265] dark:text-[#13d4dd]" />
                        </div>
                        <a
                          href="mailto:contact@hibi.dev"
                          className="text-slate-700 dark:text-slate-300 hover:text-[#005265] dark:hover:text-[#13d4dd] transition-colors"
                        >
                          contact@hibi.dev
                        </a>
                      </div>
                      <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                        <div className="p-2 rounded-full bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900">
                          <Github className="h-5 w-5 text-[#005265] dark:text-[#13d4dd]" />
                        </div>
                        <a
                          href="https://github.com/michelhaussaire"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-700 dark:text-slate-300 hover:text-[#005265] dark:hover:text-[#13d4dd] transition-colors"
                        >
                          github.com/michelhaussaire
                        </a>
                      </div>
                      <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                        <div className="p-2 rounded-full bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900">
                          <Linkedin className="h-5 w-5 text-[#005265] dark:text-[#13d4dd]" />
                        </div>
                        <a
                          href="https://linkedin.com/in/michelhaussaire"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-700 dark:text-slate-300 hover:text-[#005265] dark:hover:text-[#13d4dd] transition-colors"
                        >
                          linkedin.com/in/michelhaussaire
                        </a>
                      </div>
                      <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                        <div className="p-2 rounded-full bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900">
                          <X className="h-5 w-5 text-[#005265] dark:text-[#13d4dd]" />
                        </div>
                        <a
                          href="https://twitter.com/hibidev"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-700 dark:text-slate-300 hover:text-[#005265] dark:hover:text-[#13d4dd] transition-colors"
                        >
                          twitter.com/hibidev
                        </a>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-[#005265] dark:text-[#13d4dd] neon-text">
                      Send a Message
                    </h3>
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Floating Theme Toggle */}
      <div className="md:hidden">
        <ThemeToggle variant="floating" />
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-12 right-12 p-4 rounded-full bg-gradient-to-r from-[#13d4dd] to-[#005265] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
