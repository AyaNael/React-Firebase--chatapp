export default function DayDivider({ label = "Today" }) {
  return (
    <div className="day-divider"><span>{label}</span></div>
  );
}