// components/ui/label.js
export const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium">
    {children}
  </label>
);
