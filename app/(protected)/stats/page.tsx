export default function StatsPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reading Stats</h1>
          <p className="text-muted-foreground">
            View your reading statistics and track your progress over time.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border p-6 text-center">
            <div className="text-3xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Books Read</div>
          </div>

          <div className="rounded-lg border p-6 text-center">
            <div className="text-3xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Pages Read</div>
          </div>

          <div className="rounded-lg border p-6 text-center">
            <div className="text-3xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Reading Streak</div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Reading Activity</h2>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Reading activity chart will appear here
          </div>
        </div>
      </div>
    </div>
  );
}
