
import React, { useState } from 'react';
import { 
  ECNRecord, 
  ECNStatus, 
  ChangeSource, 
  AffectedFile,
  Attachment,
  Reviewer
} from '../types';
import { 
  FileCheck, 
  Save, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  Paperclip, 
  Upload, 
  X, 
  FileText, 
  AlertCircle, 
  Plus, 
  Trash2,
  ShieldCheck,
  CheckCircle,
  Users,
  Calendar,
  User,
  // Added missing Settings import
  Settings
} from 'lucide-react';
import { CATEGORIES, PURPOSES, SOURCES } from '../constants';

interface Props {
  onSubmit: (record: ECNRecord) => void;
}

const DEFAULT_FILES: AffectedFile[] = [
  { name: '产品图纸 (Drawing)', required: true, status: '待更新' },
  { name: '过程流程图 (PFD)', required: true, status: '待更新' },
  { name: '过程 FMEA (PFMEA)', required: true, status: '待更新' },
  { name: '控制计划 (CP)', required: true, status: '待更新' },
  { name: '作业指导书 (WI)', required: true, status: '待更新' },
];

const DEFAULT_REVIEWERS: Reviewer[] = [
  { id: 'def-1', role: '质量部', name: '', opinion: '', date: new Date().toISOString().split('T')[0] },
  { id: 'def-2', role: '制造工程部', name: '', opinion: '', date: new Date().toISOString().split('T')[0] },
];

const ECNForm: React.FC<Props> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [newFileName, setNewFileName] = useState('');
  const [formData, setFormData] = useState<Partial<ECNRecord>>({
    id: Date.now().toString(),
    docNumber: `ECN-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    status: ECNStatus.INITIATED,
    category: [],
    purpose: [],
    applyDate: new Date().toISOString().split('T')[0],
    source: '内部需求' as ChangeSource,
    reviewers: DEFAULT_REVIEWERS,
    trialResult: '待定',
    trialQuantity: 0,
    customerApprovalRequired: false,
    affectedFiles: DEFAULT_FILES,
    attachments: []
  });

  const STEPS = [
    { num: 1, label: '变更发起', desc: '基本信息与描述' },
    { num: 2, label: '可行性分析', desc: '技术与影响评估' },
    { num: 3, label: '内部评审', desc: '多功能小组会签' },
    { num: 4, label: '客户批准', desc: '外部确认(如需)' },
    { num: 5, label: '工程实施', desc: '文件更新跟踪' },
    { num: 6, label: '试产验证', desc: '产线跑合与检测' },
    { num: 7, label: '变更关闭', desc: '最终批准与释放' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const updateFileStatus = (index: number, status: AffectedFile['status']) => {
    const files = [...(formData.affectedFiles || [])];
    files[index].status = status;
    setFormData({ ...formData, affectedFiles: files });
  };

  const addAffectedFile = () => {
    if (!newFileName.trim()) return;
    const newFile: AffectedFile = {
      name: newFileName.trim(),
      required: true,
      status: '待更新'
    };
    setFormData({
      ...formData,
      affectedFiles: [...(formData.affectedFiles || []), newFile]
    });
    setNewFileName('');
  };

  const removeAffectedFile = (index: number) => {
    const files = [...(formData.affectedFiles || [])];
    files.splice(index, 1);
    setFormData({ ...formData, affectedFiles: files });
  };

  const addReviewer = () => {
    const newReviewer: Reviewer = {
      id: Date.now().toString(),
      role: '',
      name: '',
      opinion: '',
      date: new Date().toISOString().split('T')[0]
    };
    setFormData({
      ...formData,
      reviewers: [...(formData.reviewers || []), newReviewer]
    });
  };

  const removeReviewer = (id: string) => {
    setFormData({
      ...formData,
      reviewers: formData.reviewers?.filter(r => r.id !== id)
    });
  };

  const updateReviewer = (id: string, field: keyof Reviewer, value: string) => {
    setFormData({
      ...formData,
      reviewers: formData.reviewers?.map(r => r.id === id ? { ...r, [field]: value } : r)
    });
  };

  const handleFileUpload = (stepNum: number) => {
    const fileName = `附件_${stepNum}_${Math.random().toString(36).substr(2, 5)}.pdf`;
    const newAttachment: Attachment = {
      id: Date.now().toString(),
      step: stepNum,
      fileName: fileName,
      fileType: 'application/pdf',
      uploadDate: new Date().toLocaleDateString()
    };
    setFormData({
      ...formData,
      attachments: [...(formData.attachments || []), newAttachment]
    });
  };

  const removeAttachment = (id: string) => {
    setFormData({
      ...formData,
      attachments: formData.attachments?.filter(a => a.id !== id)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title) {
      const finalData = { ...formData, status: ECNStatus.COMPLETED } as ECNRecord;
      onSubmit(finalData);
    }
  };

  const renderAttachments = (stepNum: number) => (
    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">
          <Paperclip size={14} className="text-blue-500" /> 本阶段附件 (技术报告/图片)
        </label>
        <button 
          type="button" 
          onClick={() => handleFileUpload(stepNum)}
          className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-blue-600 font-bold hover:bg-blue-50 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Upload size={12} /> 上传文件
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.attachments?.filter(a => a.step === stepNum).map(a => (
          <div key={a.id} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 group shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText size={14} className="text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="truncate max-w-[150px] font-bold text-slate-700 dark:text-slate-200">{a.fileName}</span>
              <span className="text-[10px] text-slate-400">{a.uploadDate}</span>
            </div>
            <button onClick={() => removeAttachment(a.id)} className="ml-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
        {formData.attachments?.filter(a => a.step === stepNum).length === 0 && (
          <div className="w-full py-4 text-center">
            <p className="text-[10px] text-slate-400 italic">暂无附件，请上传相关的技术方案或验证结果</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="mb-8 flex items-center justify-between px-2">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">工程变更通知单 (ECN)</h3>
          <p className="text-slate-500 text-sm mt-1">IATF 16949 规范化变更执行表单</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">文档序列号</p>
          <p className="font-mono text-blue-600 font-bold text-lg">{formData.docNumber}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide no-wrap px-2">
        {STEPS.map((s) => (
          <React.Fragment key={s.num}>
            <div className={`flex items-center gap-3 flex-shrink-0 transition-all duration-300 ${step === s.num ? 'scale-105' : 'opacity-70'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-lg ${
                step === s.num ? 'bg-blue-600 text-white shadow-blue-500/25 ring-4 ring-blue-500/10' : 
                step > s.num ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}>
                {step > s.num ? <FileCheck size={20} /> : s.num}
              </div>
              <div className="hidden lg:block min-w-[80px]">
                <p className={`text-[11px] font-bold leading-none uppercase tracking-wider ${step === s.num ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>{s.label}</p>
                <p className="text-[9px] text-slate-400 mt-1 font-medium">{s.desc}</p>
              </div>
            </div>
            {s.num < 7 && <div className={`w-6 h-px mx-1 ${step > s.num ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 lg:p-12 min-h-[650px] flex flex-col transition-all">
        {step === 1 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField label="变更标题" required><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required className="input-field" placeholder="简述变更核心内容..." /></FormField>
              <FormField label="变更来源" required>
                <select name="source" value={formData.source} onChange={handleInputChange} className="input-field">
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="变更前状况 (现状)" required><textarea name="beforeChange" value={formData.beforeChange || ''} onChange={handleInputChange} className="input-field h-32" placeholder="详细描述现有工艺、材料或设计状态..." /></FormField>
              <FormField label="变更后状况 (提议)" required><textarea name="afterChange" value={formData.afterChange || ''} onChange={handleInputChange} className="input-field h-32" placeholder="详细描述变更后的目标状态及技术参数..." /></FormField>
            </div>
            {renderAttachments(1)}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField label="可行性分析结论"><textarea name="feasibilityResult" value={formData.feasibilityResult || ''} onChange={handleInputChange} className="input-field h-32" placeholder="描述实验、仿真或对标分析的结果..." /></FormField>
              <div className="space-y-6">
                <FormField label="关键技术影响分析"><input type="text" name="technicalImpact" value={formData.technicalImpact || ''} onChange={handleInputChange} className="input-field" placeholder="对模具、治具或配合精度的影响" /></FormField>
                <FormField label="成本/财务影响评估"><input type="text" name="costImpact" value={formData.costImpact || ''} onChange={handleInputChange} className="input-field" placeholder="单件成本波动或总投资估算" /></FormField>
              </div>
            </div>
            {renderAttachments(2)}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">多功能小组 (MDT) 会签</h4>
                  <p className="text-xs text-slate-500 mt-0.5">汽车行业标准 MDT 会签模式，支持跨部门并行评审</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={addReviewer}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all font-bold text-sm"
              >
                <Plus size={16} /> 增加评审人员
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.reviewers?.map((reviewer) => (
                <div key={reviewer.id} className="relative group bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col gap-4 shadow-sm hover:border-indigo-500/30 transition-all">
                  <button 
                    type="button" 
                    onClick={() => removeReviewer(reviewer.id)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Settings size={10} /> 部门/角色
                        </label>
                        <input 
                          type="text" 
                          value={reviewer.role} 
                          onChange={(e) => updateReviewer(reviewer.id, 'role', e.target.value)}
                          placeholder="如: 质量部"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <User size={10} /> 评审人姓名
                        </label>
                        <input 
                          type="text" 
                          value={reviewer.name} 
                          onChange={(e) => updateReviewer(reviewer.id, 'name', e.target.value)}
                          placeholder="签字姓名"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <FileText size={10} /> 评审意见 / 备注
                      </label>
                      <textarea 
                        value={reviewer.opinion} 
                        onChange={(e) => updateReviewer(reviewer.id, 'opinion', e.target.value)}
                        placeholder="在此输入评审结论..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[60px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Calendar size={10} /> 会签日期
                      </label>
                      <input 
                        type="date" 
                        value={reviewer.date} 
                        onChange={(e) => updateReviewer(reviewer.id, 'date', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-md pt-6 border-t border-slate-100 dark:border-slate-800">
              <FormField label="最终核准负责人 (批准人)" required>
                <input type="text" name="approver" value={formData.approver || ''} onChange={handleInputChange} className="input-field" placeholder="输入最终核准人姓名" />
              </FormField>
            </div>
            {renderAttachments(3)}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800 shadow-inner">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-2xl text-blue-600">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="customerApprovalRequired" checked={formData.customerApprovalRequired} onChange={handleInputChange} className="w-6 h-6 rounded-lg border-2 border-blue-200 text-blue-600 focus:ring-blue-500 transition-all" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">涉及 OEM 客户批准项</p>
                      <p className="text-xs text-slate-500 mt-0.5">如涉及产品 A 面、材料性能更改、关键工序外发等必须勾选</p>
                    </div>
                  </label>
                  
                  {formData.customerApprovalRequired && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4">
                      <FormField label="客户批准详情 (批准日期/文件编号/反馈意见)">
                        <textarea name="customerApprovalResult" value={formData.customerApprovalResult || ''} onChange={handleInputChange} className="input-field h-32 bg-white dark:bg-slate-900" placeholder="记录客户签字回传的文件编号或关键反馈..." />
                      </FormField>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {renderAttachments(4)}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-lg">
                  <FileText className="text-blue-500" size={20} /> 受影响技术文件清单
                </h4>
                <p className="text-xs text-slate-500 mt-1">请确保量产释放前所有勾选文件均已完成物理更新与下发</p>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={newFileName} 
                  onChange={(e) => setNewFileName(e.target.value)} 
                  placeholder="添加其他文件(如SIP)..."
                  className="px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 w-48"
                  onKeyPress={(e) => e.key === 'Enter' && addAffectedFile()}
                />
                <button 
                  type="button" 
                  onClick={addAffectedFile}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.affectedFiles?.map((file, idx) => (
                <div key={idx} className="group flex flex-col p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-all shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1 flex-1">{file.name}</span>
                    <button 
                      type="button" 
                      onClick={() => removeAffectedFile(idx)}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={file.status} 
                      onChange={(e) => updateFileStatus(idx, e.target.value as AffectedFile['status'])}
                      className={`text-[10px] w-full px-2 py-1.5 rounded-lg border-none outline-none font-bold cursor-pointer transition-colors ${
                        file.status === '已更新' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                        file.status === '待更新' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                        'bg-slate-100 text-slate-500 dark:bg-slate-700'
                      }`}
                    >
                      <option value="待更新">⏳ 待更新</option>
                      <option value="已更新">✅ 已更新</option>
                      <option value="不涉及">⚪ 不涉及</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            {renderAttachments(5)}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField label="试产日期"><input type="date" name="trialDate" value={formData.trialDate || ''} onChange={handleInputChange} className="input-field" /></FormField>
              <FormField label="试产数量 (PCS)"><input type="number" name="trialQuantity" value={formData.trialQuantity || 0} onChange={handleInputChange} className="input-field" /></FormField>
              <FormField label="验证结论">
                <select name="trialResult" value={formData.trialResult} onChange={handleInputChange} className={`input-field font-bold ${formData.trialResult === '通过' ? 'text-emerald-500' : formData.trialResult === '失败' ? 'text-rose-500' : ''}`}>
                  <option value="待定">待定</option>
                  <option value="通过">验证通过</option>
                  <option value="失败">验证失败</option>
                </select>
              </FormField>
            </div>
            <FormField label="试产验证详情 / 报告摘要">
              <textarea name="trialVerificationNote" value={formData.trialVerificationNote || ''} onChange={handleInputChange} className="input-field h-32" placeholder="填写FAI首件检查记录、制程CPK表现或成品测试数据摘要..." />
            </FormField>
            {renderAttachments(6)}
          </div>
        )}

        {step === 7 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <CheckCircle size={120} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 flex items-center gap-3"><Send size={28} /> 变更正式关闭确认</h4>
              <p className="text-blue-100 text-sm leading-relaxed mb-8 max-w-2xl">
                提交后，该 ECN 将标记为“已关闭”并自动发布。系统将确认以下条件已满足：<br/>
                1. 评审与客户批准已获取； 2. 技术资料已分发至现场； 3. 试产验证合格； 4. 旧版呆滞物料已完成清退/打标。
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                  <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest mb-1">变更单号</p>
                  <p className="font-mono font-bold text-lg">{formData.docNumber}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                  <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest mb-1">执行状态</p>
                  <p className="font-bold text-lg">量产释放中</p>
                </div>
              </div>
            </div>
            {renderAttachments(7)}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-8 py-4 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 上一步
            </button>
          ) : <div />}
          
          {step < 7 ? (
            <button type="button" onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-12 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 font-bold group">
              下一步 <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button type="submit" className="flex items-center gap-2 px-12 py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/25 font-bold">
              <Save size={20} /> 完成变更并关闭单据
            </button>
          )}
        </div>
      </form>
      
      <style>{`
        .input-field {
          @apply w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400 font-medium;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

const FormField: React.FC<{ label: string, required?: boolean, children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="space-y-3">
    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-rose-500 text-lg leading-none">*</span>}
    </label>
    {children}
  </div>
);

export default ECNForm;
