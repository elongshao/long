
import React from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Settings, 
  ShieldCheck
} from 'lucide-react';

const Instructions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl text-blue-600 mb-4">
          <HelpCircle size={32} />
        </div>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">用户操作手册</h3>
        <p className="text-slate-500 mt-2">汽车变更管理系统 (ECM) 全方位指南</p>
      </div>

      <div className="space-y-12">
        {/* 模块解析 */}
        <section>
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Settings className="text-blue-500" size={20} /> 系统模块说明
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ManualCard 
              title="控制面板" 
              desc="提供 KPI、状态分布和变更趋势的可视化概览，供管理层审查决策。"
            />
            <ManualCard 
              title="变更台账" 
              desc="所有变更记录的中央数据库。支持筛选、JSON 数据导入导出以及 Word 文档导出。"
            />
            <ManualCard 
              title="变更流程" 
              desc="符合 IATF 16949 标准的流程路线图，直观展示工程变更的生命周期。"
            />
          </div>
        </section>

        {/* 操作步骤 */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h4 className="text-lg font-bold mb-8">标准作业程序 (SOP)</h4>
          <div className="space-y-8">
            <Step 
              num="01" 
              title="发起变更" 
              desc="导航至“创建 ECN”。填写标题、来源并选择相关分类。系统将自动分配唯一的单据编号。"
            />
            <Step 
              num="02" 
              title="详细描述" 
              desc="定义“变更前”和“变更后”状况。请务必精确描述材料等级、尺寸或工艺参数。"
            />
            <Step 
              num="03" 
              title="验证与试产" 
              desc="安排试产。记录试产数量和结果。根据 PPAP 规则标记是否必须获得客户批准。"
            />
            <Step 
              num="04" 
              title="审核与关闭" 
              desc="由各部门负责人最终签发。在标记为“已完成”前，请确保已更新图纸和控制计划。"
            />
          </div>
        </section>

        {/* 贴士与合规 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
            <h5 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} /> 最佳实践
            </h5>
            <ul className="text-sm text-emerald-700 dark:text-emerald-500/80 space-y-2 list-disc pl-5">
              <li>在可行性分析中务必附带详细的技术/财务结论。</li>
              <li>使用页面缩放工具以便于查看复杂的多列数据。</li>
              <li>建议每周通过“导出 JSON”功能备份台账数据。</li>
            </ul>
          </div>
          <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
            <h5 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 mb-3">
              <ShieldCheck size={18} /> 合规性说明
            </h5>
            <p className="text-sm text-blue-700 dark:text-blue-500/80 leading-relaxed">
              本系统严格遵循 IATF 16949 第 8.5.6 条“更改控制”以及 VDA 标准指南，确保汽车供应链的可追溯性。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManualCard: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
    <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h5>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const Step: React.FC<{ num: string, title: string, desc: string }> = ({ num, title, desc }) => (
  <div className="flex gap-6">
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-lg">
      {num}
    </div>
    <div className="pt-1">
      <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h5>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Instructions;
