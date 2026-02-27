export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-garnet/20 border-t-garnet animate-spin" />
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </div>
  )
}
