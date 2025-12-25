
import React from 'react';
import { ECNRecord, ECNStatus } from '../types';
import { 
  Download, 
  Upload, 
  FileText, 
  Trash2, 
  Table,
  Search,
  ExternalLink
} from 'lucide-react';

interface Props {
  records: ECNRecord[];
  setRecords: React.Dispatch<React.SetStateAction<ECNRecord[]>>;
  onOpenRecord: (record: ECNRecord) => void;
}

const Ledger: React.FC<Props> = ({ records, setRecords, onOpenRecord }) => {

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `ECN_台账_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) setRecords(json);
      } catch (err) {
        alert("JSON 格式错误，请检查文件内容是否为有效的台账数组。");
      }
    };
    reader.readAsText(file);
  };

  const exportToWord = (record: ECNRecord) => {
    const filesList = record.affectedFiles?.map(f => `<li>${f.name}: [${f.status}]</li>`).join('') || '无';
    const attachmentsList = record.attachments?.map(a => `<li>阶段 ${a.step} - ${a.fileName} (${a.uploadDate})</li>`).join('') || '无';
    
    // 评审人员表格行
    const reviewerRows = record.reviewers?.map(r => `
      <tr>
        <td style='border: 1px solid #ccc; padding: 8px;'>${r.role || '-'}</td>
        <td style='border: 1px solid #ccc; padding: 8px;'>${r.name || '-'}</td>
        <td style='border: 1px solid #ccc; padding: 8px;'>${r.opinion || '-'}</td>
        <td style='border: 1px solid #ccc; padding: 8px;'>${r.date || '-'}</td>
      </tr>
    `).join('') || '<tr><td colspan="4" style="border: 1px solid #ccc; padding: 8px; text-align: center;">无会签记录</td></tr>';

    const htmlContent = `
      <html>
        <head><meta charset='utf-8'></head>
        <body style='font-family: 宋体, SimSun, serif; padding: 40px; line-height: 1.6;'>
          <h1 style='color: #1e40af; text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 10px;'>工程变更通知单 (ECN)</h1>
          <p style='text-align: right;'><b>文档编号:</b> ${record.docNumber} | <b>申请日期:</b> ${record.applyDate}</p>
          
          <h3 style='background: #f1f5f9; padding: 8px;'>1. 变更描述</h3>
          <table border='1' cellspacing='0' cellpadding='8' style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
            <tr><td width='20%'><b>变更标题</b></td><td>${record.title}</td></tr>
            <tr><td><b>变更来源</b></td><td>${record.source} | <b>分类:</b> ${record.category?.join(', ') || 'N/A'}</td></tr>
            <tr><td><b>变更前状况</b></td><td>${record.beforeChange}</td></tr>
            <tr><td><b>变更后状况</b></td><td>${record.afterChange}</td></tr>
          </table>

          <h3 style='background: #f1f5f9; padding: 8px;'>2. 可行性与影响评估</h3>
          <table border='1' cellspacing='0' cellpadding='8' style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
            <tr><td width='20%'><b>可行性分析</b></td><td>${record.feasibilityResult || '未填写'}</td></tr>
            <tr><td><b>技术影响</b></td><td>${record.technicalImpact || 'N/A'}</td></tr>
            <tr><td><b>成本影响</b></td><td>${record.costImpact || 'N/A'}</td></tr>
          </table>

          <h3 style='background: #f1f5f9; padding: 8px;'>3. 多功能小组 (MDT) 会签记录</h3>
          <table border='1' cellspacing='0' cellpadding='8' style='width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;'>
            <thead>
              <tr style='background: #f8fafc;'>
                <th style='border: 1px solid #ccc; text-align: left;'>部门/角色</th>
                <th style='border: 1px solid #ccc; text-align: left;'>评审人姓名</th>
                <th style='border: 1px solid #ccc; text-align: left;'>评审意见</th>
                <th style='border: 1px solid #ccc; text-align: left;'>会签日期</th>
              </tr>
            </thead>
            <tbody>
              ${reviewerRows}
            </tbody>
          </table>
          <p><b>最终核准人:</b> ${record.approver || '待审批'}</p>

          <h3 style='background: #f1f5f9; padding: 8px;'>4. 客户批准</h3>
          <p>${record.customerApprovalRequired ? (record.customerApprovalResult || '审批中') : '不涉及'}</p>

          <h3 style='background: #f1f5f9; padding: 8px;'>5. 工程实施与受影响文件</h3>
          <ul>${filesList}</ul>

          <h3 style='background: #f1f5f9; padding: 8px;'>6. 试产验证</h3>
          <table border='1' cellspacing='0' cellpadding='8' style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
            <tr><td width='20%'><b>试产详情</b></td><td>日期: ${record.trialDate || 'N/A'} | 数量: ${record.trialQuantity || 0} | 结果: ${record.trialResult}</td></tr>
            <tr><td><b>验证说明</b></td><td>${record.trialVerificationNote || '无'}</td></tr>
          </table>

          <h3 style='background: #f1f5f9; padding: 8px;'>7. 附件索引</h3>
          <ul>${attachmentsList}</ul>

          <p style='margin-top: 50px; font-size: 12px; border-top: 1px solid #ccc; padding-top: 10px;'>* 此文档由 Automotive ECM 系统自动生成。符合 IATF 16949 第 8.5.6 条更改控制要求。</p>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${record.docNumber}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const deleteRecord = (id: string) => {
    if (confirm("确定要删除这条 ECN 记录吗？此操作不可撤销。")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600">
            <Table size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">变更台账 (Change Ledger)</h3>
            <p className="text-xs text-slate-500 font-medium">中心化管理所有的工程变更记录与合规性文档</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm text-xs font-bold uppercase tracking-wider group">
            <Upload size={14} className="text-blue-500 group-hover:scale-110 transition-transform" /> 加载 JSON
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>
          <button 
            onClick={exportJSON} 
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm text-xs font-bold uppercase tracking-wider group"
          >
            <Download size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" /> 导出 JSON
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">文档编号</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">标题与描述</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">变更分类</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">申请人</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">流程状态</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">申请日期</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.map(record => (
                <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => onOpenRecord(record)}
                      className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      title="点击打开详情查看/编辑"
                    >
                      {record.docNumber}
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <div className="max-w-xs">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{record.title}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-1">{record.source}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {record.category.map(cat => (
                        <span key={cat} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-slate-500 uppercase">{cat}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-semibold text-slate-600 dark:text-slate-300">{record.applicant || '系统发起'}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      record.status === ECNStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                      record.status === ECNStatus.REJECTED ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' :
                      'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-400 font-medium">{record.applyDate}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button 
                        onClick={() => exportToWord(record)}
                        className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all shadow-sm active:scale-95"
                        title="导出详细 Word 通知单"
                      >
                        <FileText size={18} />
                      </button>
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all shadow-sm active:scale-95"
                        title="物理删除记录"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-300">
                        <Search size={40} />
                      </div>
                      <div className="max-w-xs mx-auto">
                        <p className="text-slate-800 dark:text-slate-200 font-bold">暂无变更数据</p>
                        <p className="text-slate-400 text-xs mt-1">目前还没有任何 ECN 记录。您可以手动“创建 ECN”或点击上方“加载 JSON”导入备份数据。</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
