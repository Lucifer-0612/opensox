"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useSavedProjectsStore } from "@/store/useSavedProjectsStore";
import { DashboardProjectsProps } from "@/types";
import { SavedRepo } from "@opensox/shared";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

interface SaveToggleProps {
    project: DashboardProjectsProps;
}

export default function SaveToggle({ project }: SaveToggleProps) {
    const { toggleProject, isSaved } = useSavedProjectsStore();
    const saved = isSaved(project.id);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click event

        const savedRepo: SavedRepo = {
            id: project.id,
            name: project.name,
            url: project.url,
            language: project.primaryLanguage,
            popularity: project.popularity as "low" | "medium" | "high",
            competitionScore: parseFloat(project.competition) || 0,
            savedAt: new Date().toISOString(),
            meta: {
                avatarUrl: project.avatarUrl,
                description: project.description,
                totalIssueCount: project.totalIssueCount,
                stage: project.stage,
                activity: project.activity,
            },
        };

        toggleProject(savedRepo);
    };

    return (
        <div
            className="flex items-center justify-center"
            onClick={handleToggle}
            role="button"
            aria-label={saved ? "Remove from saved" : "Save project"}
        >
            <button
                className="p-1 hover:bg-white/10 rounded transition-colors"
                aria-pressed={saved}
            >
                {saved ? (
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                    <StarOutlineIcon className="h-5 w-5 text-gray-400 hover:text-yellow-500" />
                )}
            </button>
        </div>
    );
}
