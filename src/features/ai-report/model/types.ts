export type WeeklyProgresProps = {
  isLoading?: boolean;
  isFirst: boolean;
  totalDays: number;
  doneDays: number;
  remainDays: number;
  onConfirm: () => void;
};

export type AIReportGeneratingProps = {
  nickname?: string;
  isLoading?: boolean;
};
