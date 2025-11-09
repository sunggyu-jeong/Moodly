export type WeeklyProgresProps = {
  isLoading?: boolean;
  isFirst: boolean;
  totalDays: number;
  doneDays: number;
  remainDays: number;
  onConfirm: () => void;
};
