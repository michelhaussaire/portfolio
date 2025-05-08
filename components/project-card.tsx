"use client";

import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
}

export function ProjectCard({
  title,
  description,
  tags,
  imageUrl,
  demoUrl,
  repoUrl,
}: ProjectCardProps) {
  return (
    <div
      className="neo-card glow"
      itemScope
      itemType="https://schema.org/CreativeWork"
    >
      <div className="overflow-hidden rounded-t-2xl">
        <div className="aspect-video w-full overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#13d4dd]/20 to-[#005265]/5 group-hover:opacity-70 transition-opacity duration-500 opacity-0 z-10"></div>
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            width={600}
            height={340}
            itemProp="image"
            loading="lazy"
            priority={false}
          />
        </div>
      </div>
      <div className="p-6">
        <h3
          className="text-xl font-semibold mb-2 text-[#005265] dark:text-[#13d4dd] neon-text"
          itemProp="name"
        >
          {title}
        </h3>
        <p
          className="text-slate-700 dark:text-slate-300 mb-4"
          itemProp="description"
        >
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="neo-tag px-3 py-1 text-xs text-[#005265] dark:text-[#13d4dd] hover:-translate-y-1 transition-transform duration-300"
              itemProp="keywords"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 neo-button text-[#005265] dark:text-[#13d4dd] border-none hover:scale-105 active:scale-95 transition-transform duration-300"
          >
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              itemProp="url"
              aria-label={`View demo of ${title}`}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Demo
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 neo-button text-[#005265] dark:text-[#13d4dd] border-none hover:scale-105 active:scale-95 transition-transform duration-300"
          >
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View code repository of ${title}`}
            >
              <Github className="h-4 w-4 mr-2" />
              Code
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
