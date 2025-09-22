import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--info))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))'
];

// Performance data for charts
export const performanceData = [
  { name: 'Mon', tasks: 12, completed: 10, pending: 2 },
  { name: 'Tue', tasks: 15, completed: 13, pending: 2 },
  { name: 'Wed', tasks: 8, completed: 7, pending: 1 },
  { name: 'Thu', tasks: 18, completed: 15, pending: 3 },
  { name: 'Fri', tasks: 22, completed: 20, pending: 2 },
  { name: 'Sat', tasks: 6, completed: 6, pending: 0 },
  { name: 'Sun', tasks: 4, completed: 4, pending: 0 },
];

export const departmentData = [
  { name: 'Engineering', value: 35, color: COLORS[0] },
  { name: 'Operations', value: 25, color: COLORS[1] },
  { name: 'Safety', value: 20, color: COLORS[2] },
  { name: 'HR', value: 12, color: COLORS[3] },
  { name: 'Procurement', value: 8, color: COLORS[4] },
];

export const taskStatusData = [
  { name: 'Completed', value: 68, color: COLORS[3] },
  { name: 'In Progress', value: 24, color: COLORS[4] },
  { name: 'Pending', value: 8, color: COLORS[5] },
];

interface ChartContainerProps {
  children: React.ReactElement;
  title: string;
  className?: string;
}

export const ChartContainer = ({ children, title, className = "" }: ChartContainerProps) => (
  <div className={`bg-gradient-card rounded-lg border shadow-md ${className}`}>
    <div className="p-4 border-b">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
    <div className="p-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export const PerformanceAreaChart = () => (
  <ChartContainer title="Weekly Performance">
    <AreaChart data={performanceData}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
      <YAxis stroke="hsl(var(--muted-foreground))" />
      <Tooltip 
        contentStyle={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-md)'
        }}
      />
      <Area
        type="monotone"
        dataKey="completed"
        stackId="1"
        stroke="hsl(var(--success))"
        fill="hsl(var(--success) / 0.6)"
        name="Completed"
      />
      <Area
        type="monotone"
        dataKey="pending"
        stackId="1"
        stroke="hsl(var(--warning))"
        fill="hsl(var(--warning) / 0.6)"
        name="Pending"
      />
    </AreaChart>
  </ChartContainer>
);

export const DepartmentPieChart = () => (
  <ChartContainer title="Tasks by Department">
    <PieChart>
      <Pie
        data={departmentData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {departmentData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ChartContainer>
);

export const TaskStatusBarChart = () => (
  <ChartContainer title="Task Status Overview">
    <BarChart data={taskStatusData}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
      <YAxis stroke="hsl(var(--muted-foreground))" />
      <Tooltip 
        contentStyle={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-md)'
        }}
      />
      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ChartContainer>
);

export const PerformanceLineChart = () => (
  <ChartContainer title="Daily Performance Trend">
    <LineChart data={performanceData}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
      <YAxis stroke="hsl(var(--muted-foreground))" />
      <Tooltip 
        contentStyle={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-md)'
        }}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey="completed"
        stroke="hsl(var(--success))"
        strokeWidth={3}
        dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
        name="Completed Tasks"
      />
      <Line
        type="monotone"
        dataKey="pending"
        stroke="hsl(var(--warning))"
        strokeWidth={3}
        dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
        name="Pending Tasks"
      />
    </LineChart>
  </ChartContainer>
);