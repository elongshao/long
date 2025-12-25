
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { ECNRecord, ECNStatus } from './types';
import { MENU_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import Workflow from './components/Workflow';
import ECNForm from './components/ECNForm';
import Ledger from './components/Ledger';
import Instructions from './components/Instructions';

const INITIAL_DATA: ECNRecord[] = [
  {
    id: '1',
    docNumber: 'ECN-20240501-001',
    title: '切换至低排放钢材等级',
    source: '内部需求',
    category: ['材料'],
    purpose: ['成本降低'],
    applicant: '张三',
    receiver: '李四',
    applyDate: '2024-05-01',
    implementationDate: '2024-06-15',
    status: ECNStatus.COMPLETED,
    beforeChange: '使用标准 A 级碳钢。',
    afterChange: '切换为低碳足迹的再生钢材 S 级。',
    feasibilityResult: '实验室测试显示材料强度与疲劳性能符合 OEM 标准。',
    feasibilityDate: '2024-05-10',
    technicalImpact: '材料更换不影响现有模具结构',
    costImpact: '原材料成本增加 5%',
    reviewers: [
      { id: 'r1', role: '质量部', name: '王五', opinion: '同意，符合 ESG 目标', date: '2024-05-12' },
      { id: 'r2', role: '生产部', name: '赵六', opinion: '可以实施，不影响节拍', date: '2024-05-13' }
    ],
    approver: '张总',
    trialDate: '2024-05-20',
    trialQuantity: 100,
    trialResult: '通过',
    trialVerificationNote: '首件检测符合图纸要求',
    customerApprovalRequired: true,
    customerApprovalResult: '客户 2024-06-01 已签字回传',
    affectedFiles: [],
    attachments: []
  },
  {
    id: '2',
    docNumber: 'ECN-20240510-002',
    title: '焊接机器人手臂程序更新',
    source: '供应商申请',
    category: ['设备', '工艺'],
    purpose: ['效率提升'],
    applicant: '发那科技术部',
    receiver: '生产维护组',
    applyDate: '2024-05-10',
    implementationDate: '2024-06-20',
    status: ECNStatus.REVIEW,
    beforeChange: '当前的焊接路径在转角处存在抖动，影响节拍。',
    afterChange: '优化算法补偿转角加速度。',
    feasibilityResult: '虚拟仿真显示焊接循环时间缩短 2.4 秒。',
    feasibilityDate: '2024-05-15',
    technicalImpact: '提高路径平滑度，减少电机负载',
    costImpact: '无额外成本',
    reviewers: [
      { id: 'r3', role: '制造工程', name: '陈工', opinion: '需在非生产时段验证', date: '2024-05-16' }
    ],
    approver: '李部长',
    trialDate: '',
    trialQuantity: 0,
    trialResult: '待定',
    trialVerificationNote: '',
    customerApprovalRequired: false,
    customerApprovalResult: '',
    affectedFiles: [],
    attachments: []
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [records, setRecords] = useState<ECNRecord[]>(INITIAL_DATA);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const addRecord = (newRecord: ECNRecord) => {
    setRecords(prev => [newRecord, ...prev]);
    setActiveTab('ledger');
  };

  const updateRecord = (id: string, updatedFields: Partial<ECNRecord>) => {
    setRecords(prev => prev.map(rec => rec.id === id ? { ...rec, ...updatedFields } : rec));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard records={records} />;
      case 'workflow': return <Workflow />;
      case 'ecn-form': return <ECNForm onSubmit={addRecord} />;
      case 'ledger': return <Ledger records={records} onUpdate={updateRecord} setRecords={setRecords} />;
      case 'instructions': return <Instructions />;
      default: return <Dashboard records={records} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark' : 'bg-slate-50'}`}>
      {/* 侧边栏 */}
      <aside 
        className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-30 shadow-sm ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Settings size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">ECM-PRO</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors mx-auto"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-2 overflow-y-auto custom-scroll">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold shadow-sm shadow-blue-500/10' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : ''} flex-shrink-0`}>
                {item.icon}
              </span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                title={isDarkMode ? "切换至浅色模式" : "切换至深色模式"}
                className="p-2 flex-1 flex justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-100 dark:border-slate-700"
              >
                {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>
              <div className="flex gap-1 items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-100 dark:border-slate-700">
                <button onClick={handleZoomOut} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm"><ZoomOut size={16} /></button>
                <button onClick={handleResetZoom} className="p-1 text-[10px] px-1.5 hover:bg-white dark:hover:bg-slate-700 rounded font-bold uppercase tracking-tight">{Math.round(zoomLevel * 100)}%</button>
                <button onClick={handleZoomIn} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm"><ZoomIn size={16} /></button>
              </div>
            </div>
          </div>
          {sidebarOpen && (
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                管
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate">管理员用户</p>
                <p className="text-[10px] text-slate-400 truncate font-medium">工程部</p>
              </div>
              <LogOut size={14} className="text-slate-400 cursor-pointer hover:text-red-500 transition-colors" />
            </div>
          )}
        </div>
      </aside>

      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {MENU_ITEMS.find(i => i.id === activeTab)?.label}
            </h2>
            <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              系统在线
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="搜索 ECN 记录..." 
                className="bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2 rounded-full text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-slate-100 dark:border-slate-700"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
              </button>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
              <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <User size={18} />
              </button>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-auto custom-scroll p-6 lg:p-10 relative">
          <div 
            className="transition-transform duration-200 origin-top-left pb-20"
            style={{ transform: `scale(${zoomLevel})`, width: `${100 / zoomLevel}%` }}
          >
            {renderContent()}
          </div>
        </section>
      </main>
    </div>
  );
};

// 额外的图标组件
const User = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default App;
