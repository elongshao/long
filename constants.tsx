
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Table, 
  GitBranch, 
  Settings, 
  HelpCircle,
  PlusCircle,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun
} from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'dashboard', label: '控制面板', icon: <LayoutDashboard size={20} /> },
  { id: 'workflow', label: '变更流程', icon: <GitBranch size={20} /> },
  { id: 'ecn-form', label: '创建 ECN', icon: <PlusCircle size={20} /> },
  { id: 'ledger', label: '变更台账', icon: <Table size={20} /> },
  { id: 'instructions', label: '使用说明', icon: <HelpCircle size={20} /> },
];

export const CATEGORIES = ['产品', '结构', '尺寸', '材料', '颜色', '功能', '性能', '工艺', '设备', '工装', '人员'];
export const PURPOSES = ['质量提升', '成本降低', '效率提升', '可靠性', '功能性', '其他'];
export const SOURCES = ['客户要求', '供应商申请', '内部需求', '其他'];
