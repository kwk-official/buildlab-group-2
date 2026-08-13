export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-kwk-luna border-t-kwk-purple" />
        <p className="mt-4 text-sm font-semibold text-slate-500">
          Loading your community...
        </p>
      </div>
    </div>
  );
}
