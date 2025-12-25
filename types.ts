
export enum ECNStatus {
  DRAFT = '草稿',
  INITIATED = '已发起',
  FEASIBILITY = '可行性分析',
  REVIEW = '内部评审',
  CUSTOMER_APP = '客户批准',
  IMPLEMENTATION = '工程实施',
  TRIAL = '试产验证',
  COMPLETED = '已关闭',
  REJECTED = '已拒绝'
}

export type ChangeSource = '客户要求' | '供应商申请' | '内部需求' | '其他';
export type ChangeCategory = '产品' | '结构' | '尺寸' | '材料' | '颜色' | '功能' | '性能' | '工艺' | '设备' | '工装' | '人员' | '其他';

export interface AffectedFile {
  name: string;
  required: boolean;
  status: '待更新' | '已更新' | '不涉及';
  version?: string;
}

export interface Attachment {
  id: string;
  step: number;
  fileName: string;
  fileType: string;
  uploadDate: string;
}

export interface Reviewer {
  id: string;
  role: string;
  name: string;
  opinion: string;
  date: string;
}

export interface ECNRecord {
  id: string;
  docNumber: string;
  title: string;
  source: ChangeSource;
  category: ChangeCategory[];
  purpose: string[];
  applicant: string;
  receiver: string;
  applyDate: string;
  implementationDate: string;
  status: ECNStatus;
  
  // 1. 发起阶段
  beforeChange: string;
  afterChange: string;
  
  // 2. 可行性分析
  feasibilityResult: string;
  feasibilityDate: string;
  technicalImpact: string;
  costImpact: string;
  
  // 3. 评审
  reviewers: Reviewer[];
  approver: string;
  
  // 4. 客户批准
  customerApprovalRequired: boolean;
  customerApprovalResult: string;
  
  // 5. 工程实施 (文件修改)
  affectedFiles: AffectedFile[];
  
  // 6. 试产验证
  trialDate: string;
  trialQuantity: number;
  trialResult: '通过' | '失败' | '待定';
  trialVerificationNote: string;
  
  // 附件管理
  attachments: Attachment[];
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  rejected: number;
}
