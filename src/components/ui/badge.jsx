const Badge = ({ children, className }) => {
  return <span className={`px-2 py-1 rounded bg-gray-200 text-gray-700 ${className}`}>{children}</span>;
};

export { Badge };
