interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/60 bg-white/90 p-8 text-center shadow-glow ${className}`}
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-ink mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-full bg-teal text-mist hover:bg-teal/90 px-6 py-2 text-sm font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function NoApplicationsEmpty() {
  return (
    <EmptyState
      title="No Applications Yet"
      description="Search for internships and apply to start building your experience"
      icon={
        <div className="text-4xl">📋</div>
      }
      action={{
        label: "Browse Opportunities",
        onClick: () => window.location.href = "/opportunities",
      }}
    />
  );
}

export function NoOpportunitiesEmpty() {
  return (
    <EmptyState
      title="No Opportunities Found"
      description="Try adjusting your search filters or check back later"
      icon={
        <div className="text-4xl">🔍</div>
      }
      action={{
        label: "Clear Filters",
        onClick: () => window.location.reload(),
      }}
    />
  );
}

export function NoSavedSearchesEmpty() {
  return (
    <EmptyState
      title="No Saved Searches"
      description="Create a saved search to get notified about new opportunities matching your criteria"
      icon={
        <div className="text-4xl">⭐</div>
      }
      action={{
        label: "Browse Opportunities",
        onClick: () => window.location.href = "/opportunities",
      }}
    />
  );
}

export function NoFeedbackEmpty() {
  return (
    <EmptyState
      title="No Feedback Yet"
      description="There are no applications pending review"
      icon={
        <div className="text-4xl">💬</div>
      }
      className="bg-teal/5 border-teal/20"
    />
  );
}

export function NoProfileDataEmpty() {
  return (
    <EmptyState
      title="Complete Your Profile"
      description="Add your personal information to improve job matching"
      icon={
        <div className="text-4xl">👤</div>
      }
      action={{
        label: "Edit Profile",
        onClick: () => window.location.href = "/profile",
      }}
    />
  );
}

export function LoadingError({
  title = "Something Went Wrong",
  description = "There was an error loading this content. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry: () => void;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={<div className="text-4xl">⚠️</div>}
      action={{
        label: "Try Again",
        onClick: onRetry,
      }}
      className="bg-coral/10 border-coral/30"
    />
  );
}
