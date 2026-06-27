import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

const useGrid = () => {
  if (typeof document === "undefined") return "#2C2C2E";
  return document.documentElement.classList.contains("dark") ? "#2C2C2E" : "#E5E5EA";
};

function CustomTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3.5 py-2.5 text-xs">
      {label && <div className="text-muted-foreground mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 font-mono-num">
          <span className="size-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-foreground font-medium">{formatter ? formatter(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function PortfolioAreaChart({ data, color = "var(--primary)" }: { data: { date: string; value: number }[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="areafill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.12} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={useGrid()} strokeOpacity={0.4} strokeDasharray="0" vertical={false} horizontalPoints={[140]} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => v.slice(5)} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} width={50} />
        <Tooltip content={<CustomTooltip formatter={(v: number) => formatCurrency(v)} />} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill="url(#areafill)" activeDot={{ r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AllocationPie({ data }: { data: { name: string; value: number }[] }) {
  const COLORS = ["var(--primary)", "var(--muted-foreground)", "var(--gain)"];
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={66} outerRadius={88} paddingAngle={4} strokeWidth={0}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip formatter={(v: number) => formatCurrency(v)} />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="size-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-mono-num font-medium">{((d.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Sparkline({ data, positive = true, height = 36, width = 100 }: { data: number[]; positive?: boolean; height?: number; width?: number }) {
  const d = data.map((v, i) => ({ i, v }));
  const color = positive ? "var(--gain)" : "var(--loss)";
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={d}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SimpleBarChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={useGrid()} strokeOpacity={0.4} strokeDasharray="0" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} width={50} />
        <Tooltip content={<CustomTooltip formatter={(v: number) => formatCurrency(v)} />} cursor={{ fill: "color-mix(in srgb, var(--primary) 8%, transparent)" }} />
        <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MiniAreaChart({ data }: { data: { date: string; price: number }[] }) {
  const positive = data[data.length - 1].price >= data[0].price;
  const color = positive ? "var(--gain)" : "var(--loss)";
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="mini" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.12} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={<CustomTooltip formatter={(v: number) => formatCurrency(v)} />} />
        <Area type="monotone" dataKey="price" stroke={color} fill="url(#mini)" strokeWidth={1.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
