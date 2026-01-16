"use client";

import { useState } from "react";
import TopAppBar from "@/components/home/TopAppBar";
import SegmentedControl from "@/components/SegmentedControl";
import ProjectFilter from "@/components/home/ProjectFilter";
import HomeOn from "@/components/home/HomeOn";
import HomeOff from "@/components/home/HomeOff";

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState("calendar");
  const [isOnlyRecruiting, setIsOnlyRecruiting] = useState(false);

  const projects = [
    {
      title: "요리퐁 6기 신입부원 모집",
      status: "모집 중",
      dateRange: "20.00.00 ~ 20.00.00",
      applicantCount: 5,
    },
    {
      title: "KUIT 5기 신입부원 모집",
      status: "모집 완료",
      dateRange: "20.00.00 ~ 20.00.00",
      applicantCount: 12,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="relative w-[375px] bg-white min-h-screen shadow-lg">
        
        <TopAppBar />

        <div className="pt-[55px]">
          <section className="mt-4 mb-4 flex justify-center px-5">
            <SegmentedControl />
          </section>

          
          <ProjectFilter 
            isOnlyRecruiting={isOnlyRecruiting} 
            onChange={setIsOnlyRecruiting} 
          />
          
          <section className="items-center mt-7 flex flex-col gap-3 pb-10">
                {projects
                  .filter(p => !isOnlyRecruiting || p.status === "모집 중")
                  .map((project, index) => (
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
              </section>          
        </div>
      </div>
    </main>
  );
}