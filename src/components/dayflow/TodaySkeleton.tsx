export default function TodaySkeleton() {
  return <div className="polish-skeleton" role="status" aria-label="Загрузка">
    {Array.from({length:6}, (_, i) => <div key={i} aria-hidden="true" />)}
  </div>;
}
