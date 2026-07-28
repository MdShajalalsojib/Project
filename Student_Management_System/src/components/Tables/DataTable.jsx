// Generic reusable table: columns = [{ key, label }], rows = array of objects
export default function DataTable({ columns, rows, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-100">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="p-3">{c.label}</th>
            ))}
            {(onEdit || onDelete) && <th className="p-3">Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="p-3">{row[c.key]}</td>
              ))}
              {(onEdit || onDelete) && (
                <td className="p-3 space-x-2">
                  {onEdit && (
                    <button className="text-primary" onClick={() => onEdit(row)}>Edit</button>
                  )}
                  {onDelete && (
                    <button className="text-danger" onClick={() => onDelete(row)}>Delete</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}