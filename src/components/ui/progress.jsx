export function Progress({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded h-2">
      <div
        className="bg-indigo-500 h-2 rounded"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
