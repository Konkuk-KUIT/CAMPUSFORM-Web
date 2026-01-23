"use client";

import HomeOn from "@/components/home/HomeOn";
import HomeOff from "@/components/home/HomeOff";

interface ProjectData {
  title: string;
  status: string;
  dateRange: string;
  applicantCount: number;
}

export default function ProjectList({ projects }: { projects: ProjectData[] }) {
  return (
    <div className="flex flex-col gap-[12px] items-center px-4">
      {projects.map((project, index) => (
        <div key={index}>
          {project.status === "모집 중" ? (
            <HomeOn 
              title={project.title}
              status={project.status}
              dateRange={project.dateRange}
              applicantCount={project.applicantCount}
            />
          ) : (
            <HomeOff 
              title={project.title}
              status={project.status}
              dateRange={project.dateRange}
              applicantCount={project.applicantCount}
            />
          )}
        </div>
      ))}
    </div>
  );
}