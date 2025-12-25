
import React from 'react';
import { 
  ArrowRight, 
  Lightbulb, 
  Search, 
  UserCheck, 
  Users, 
  Rocket, 
  CheckCircle,
  ShieldCheck,
  FileEdit
} from 'lucide-react';

const STEPS = [
  { id: 1, title: '变更发起', desc: '识别来源，描述现状与提议', icon: <Lightbulb size={24} />, color: 'blue' },
  { id: 2, title: '可行性分析', desc: '技术评估、成本及制造影响分析', icon: <Search size={24} />, color: 'amber' },
  { id: 3, title: '内部评审', desc: 'MDT 多功能小组会签审批', icon: <Users size={24} />, color: 'indigo' },
  { id: 4, title: '客户批准', desc: 'OEM 客户书面确认(按需)', icon: <ShieldCheck size={24} />, color: 'violet' },
  { id: 5, title: '工程实施', desc: '图纸、FMEA、CP、WI 同步更新', icon: <FileEdit size={24} />, color: 'cyan' },
  { id: 6, title: '试产验证', desc: '产线跑合验证、FAI 首件检测', icon: <Rocket size={24} />, color: 'purple' },
  { id: 7, title: '变更关闭', desc: '资料归档，量产正式释放', icon: <CheckCircle size={24} />, color: 'green' },
];

const Workflow: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="text-center mb-16">
        <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">IATF 16949 工程变更工作流</h3>
        <p className="text-slate-500 mt-2 font-medium">汽车零部件行业标准 ECM 闭环管理流程</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 relative">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center group">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 shadow-xl group-hover:-translate-y-2 ${
              step.color === 'blue' ? 'bg-blue-600' :
              step.color === 'amber' ? 'bg-amber-500' :
              step.color === 'indigo' ? 'bg-indigo-600' :
              step.color === 'violet' ? 'bg-violet-600' :
              step.color === 'cyan' ? 'bg-cyan-600' :
              step.color === 'purple' ? 'bg-purple-600' :
              'bg-emerald-600'
            } text-white`}>
              {step.icon}
            </div>
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">步骤 {step.id}</span>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{step.title}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed px-1 line-clamp-3">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <InfoBlock title="文档同步控制" color="blue">
          变更流程第 5 步要求必须完成 <b>Drawing, PFMEA, CP, WI</b> 的同步更新，并在 ECN 中勾选状态，确保制造一致性。
        </InfoBlock>
        <InfoBlock title="附件追溯要求" color="amber">
          每个阶段（发起、可行性、试产等）都需上传支撑文件（如测试报告、对比图），所有附件随 ECN 永久存档。
        </InfoBlock>
        <InfoBlock title="量产释放条件" color="emerald">
          必须满足：内部评审通过 + 客户批准(按需) + 文件更新完成 + 试产验证合格，方可进入变更关闭阶段。
        </InfoBlock>
      </div>
    </div>
  );
};

const InfoBlock: React.FC<{ title: string, color: string, children: React.ReactNode }> = ({ title, color, children }) => (
  <div className={`bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm border-t-4 ${
    color === 'blue' ? 'border-t-blue-500' : color === 'amber' ? 'border-t-amber-500' : 'border-t-emerald-500'
  }`}>
    <h4 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed">{children}</p>
  </div>
);

export default Workflow;
