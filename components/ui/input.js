// components/ui/input.js
export const Input = ({ value, onChange, id, className }) => (
  <input
    id={id}
    value={value}
    onChange={onChange}
    className={`border p-2 rounded ${className}`}
  />
);
