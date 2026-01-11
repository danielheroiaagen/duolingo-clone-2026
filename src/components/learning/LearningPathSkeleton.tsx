import { SkeletonModule } from "@/components/ui/Skeleton";

// ============================================
// LEARNING PATH SKELETON - Loading state
// ============================================

export function LearningPathSkeleton() {
  return (
    <div className="flex flex-col items-center gap-12 py-32 max-w-xl mx-auto">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-4"
          style={{
            transform:
              i % 3 === 0
                ? "none"
                : i % 3 === 1
                  ? "translateX(60px)"
                  : "translateX(-60px)",
          }}
        >
          <SkeletonModule />
        </div>
      ))}
    </div>
  );
}
