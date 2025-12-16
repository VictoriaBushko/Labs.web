export default function Select({ label, children, ...props }) {
  return (
    <label className="select">
      <span className="select-label">{label}</span>
      <select {...props}>{children}</select>
    </label>
  );
}
