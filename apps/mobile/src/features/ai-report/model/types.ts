export type WeeklyProgressProps = {
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

export type ChooseReportSheetProps = {
  dates: string[];
  selectedDate?: string | null;
  onSelect: (date: string) => void;
};
