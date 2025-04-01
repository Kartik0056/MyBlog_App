const Card = ({ children, className }) => {
    return <div className={`border rounded-lg shadow-md p-4 ${className}`}>{children}</div>;
  };
  
  const CardHeader = ({ children }) => <div className="font-bold text-lg mb-2">{children}</div>;
  const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;
  const CardDescription = ({ children }) => <p className="text-gray-600">{children}</p>;
  const CardContent = ({ children }) => <div className="mt-2">{children}</div>;
  const CardFooter = ({ children }) => <div className="border-t mt-4 pt-2">{children}</div>;
  
  export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
  