"use client";

import { Layout, Server, PenToolIcon as Tool } from "lucide-react";

interface SkillCardProps {
  title: string;
  skills: string[];
  icon: "layout" | "server" | "tool";
}

export function SkillCard({ title, skills, icon }: SkillCardProps) {
  const IconComponent = {
    layout: Layout,
    server: Server,
    tool: Tool,
  }[icon];

  const iconColors = {
    layout: "text-cyan-500 dark:text-cyan-400",
    server: "text-blue-500 dark:text-blue-400",
    tool: "text-cyan-600 dark:text-cyan-300",
  }[icon];

  return (
    <div className="neo-card glow h-full flex flex-col">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 hover:rotate-3 transition-transform duration-300">
            <IconComponent className={`h-5 w-5 ${iconColors}`} />
          </div>
          <h3 className="text-xl font-semibold text-cyan-600 dark:text-cyan-300 neon-text">
            {title}
          </h3>
        </div>
        <ul className="space-y-2 flex-grow">
          {skills.map((skill) => (
            <li
              key={skill}
              className="flex items-center gap-2 hover:translate-x-2 transition-transform duration-300"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-500"></div>
              <span className="text-slate-700 dark:text-slate-300">
                {skill}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
