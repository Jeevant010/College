// Requirement 3: Display the result on the webpage

interface DisplayProps {
  resultValue: number | null;
}

export default function DisplaySection({ resultValue }: DisplayProps) {
  if (resultValue === null) {
    return <div className="text-gray-400 italic mt-4">No calculation yet...</div>;
  }

  return (
    <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
      <h3 className="text-green-800 font-semibold">Result on Webpage:</h3>
      <p className="text-3xl font-bold text-green-600 mt-2">{resultValue}</p>
    </div>
  );
}