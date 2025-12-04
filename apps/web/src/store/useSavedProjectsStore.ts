import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SavedRepo } from "@opensox/shared";

interface SavedProjectsState {
    savedProjects: SavedRepo[];
    addProject: (project: SavedRepo) => void;
    removeProject: (id: string) => void;
    toggleProject: (project: SavedRepo) => void;
    clearAllSaved: () => void;
    setAll: (projects: SavedRepo[]) => void;
    isSaved: (id: string) => boolean;
}

export const useSavedProjectsStore = create<SavedProjectsState>()(
    persist(
        (set, get) => ({
            savedProjects: [],

            addProject: (project: SavedRepo) =>
                set((state) => {
                    // Check if project already exists
                    const exists = state.savedProjects.some((p) => p.id === project.id);
                    if (exists) return state;

                    return {
                        savedProjects: [...state.savedProjects, project],
                    };
                }),

            removeProject: (id: string) =>
                set((state) => ({
                    savedProjects: state.savedProjects.filter((p) => p.id !== id),
                })),

            toggleProject: (project: SavedRepo) =>
                set((state) => {
                    const exists = state.savedProjects.some((p) => p.id === project.id);
                    if (exists) {
                        return {
                            savedProjects: state.savedProjects.filter(
                                (p) => p.id !== project.id
                            ),
                        };
                    } else {
                        return {
                            savedProjects: [...state.savedProjects, project],
                        };
                    }
                }),

            clearAllSaved: () => set({ savedProjects: [] }),

            setAll: (projects: SavedRepo[]) => set({ savedProjects: projects }),

            isSaved: (id: string) => {
                return get().savedProjects.some((p) => p.id === id);
            },
        }),
        {
            name: "oss_saved_repos_v1",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ savedProjects: state.savedProjects }),
        }
    )
);
