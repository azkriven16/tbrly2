export default function DailyReadingPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Reading</h1>
          <p className="text-muted-foreground">
            Track your daily reading progress and build consistent reading
            habits.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">{"Today's Progress"}</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Pages Read</span>
                <span className="font-bold">0 / 25</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-0"></div>
              </div>
              <div className="flex justify-between items-center">
                <span>Reading Time</span>
                <span className="font-bold">0 min</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Current Book</h2>
            <div className="space-y-2">
              <p className="text-muted-foreground">No book selected</p>
              <button className="text-primary hover:underline">
                Select a book to start reading
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
