
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { ECNRecord, ECNStatus } from '../types';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Filter
} from 'lucide-react';

interface Props {
  records: ECNRecord[];
}

const Dashboard: React.FC<Props> = ({ records }) => {
  const stats = {
    total: records.length,
    completed: records.filter(r => r.status === ECNStatus.COMPLETED).length,
    pending: records.filter(r => r.status !== ECNStatus.COMPLETED && r.status !== ECNStatus.REJECTED).length,
    rejected: records.filter(r => r.status === ECNStatus.REJECTED).length,
  };

  const statusData = Object.values(ECNStatus).map(status => ({
    name: status,
    value: records.filter(r => r.status === status).length
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#94a3b8'];

  const categoryData = ['产品', '工艺', '材料', '设备'].map(cat => ({
    name: cat,
    count: records.filter(r => r.category.includes(cat as any)).length
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<ClipboardList className="text-blue-500" />} label="变更总数" value={stats.total} trend="较上月 +12%" />
        <StatCard icon={<CheckCircle2 className="text-emerald-500" />} label="已完成" value={stats.completed} trend="成功率 75%" />
        <StatCard icon={<Clock className="text-amber-500" />} label="执行中" value={stats.pending} trend="平均周期 14 天" />
        <StatCard icon={<AlertCircle className="text-rose-500" />} label="已拒绝" value={stats.rejected} trend="控制在目标内" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" /> 变更状态分布
            </h3>
            <button className="text-xs text-slate-400 hover:text-blue-500 flex items-center gap-1">
              <Filter size={14} /> 筛选
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6">分类占比</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                  {cat.name}
                </div>
                <span className="font-semibold">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6">最近变更动态</h3>
        <div className="space-y-4">
          {records.slice(0, 3).map(rec => (
            <div key={rec.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  rec.status === ECNStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {rec.docNumber.split('-').pop()}
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{rec.title}</p>
                  <p className="text-xs text-slate-400">申请人: {rec.applicant} • {rec.applyDate}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                rec.status === ECNStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                {rec.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: number, trend: string }> = ({ icon, label, value, trend }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:translate-y-[-2px] transition-all">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-500">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</span>
      <span className="text-xs text-emerald-500 font-medium mb-1">{trend}</span>
    </div>
  </div>
);

export default Dashboard;
