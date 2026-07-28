import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AttendanceChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="font-semibold mb-4">Attendance Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis domain={[80, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}