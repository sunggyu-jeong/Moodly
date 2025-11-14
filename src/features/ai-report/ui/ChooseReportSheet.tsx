// src/features/ai-report/choose-report-sheet/ui/ChooseReportSheet.tsx
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import type { ChooseReportSheetProps } from '@/features/ai-report/model/types';
import { useBottomSheet } from '@/shared/hooks/useBottomSheet';
import { common, gray } from '@/shared/styles/colors';
import BottomSheetWrapper from '@/shared/ui/elements/BottomSheetWrapper';
import { Body1 } from '@/shared/ui/typography/Body1';
import { H3 } from '@/shared/ui/typography/H3';

export interface ChooseReportSheetHandle {
  expand: () => void;
  collapse: () => void;
  close: () => void;
}
const MIN_HEIGHT = 300;
const ITEM_ROW_HEIGHT = 52;

const ChooseReportSheet = forwardRef<ChooseReportSheetHandle, ChooseReportSheetProps>(
  ({ dates, selectedDate, onSelect }, ref) => {
    const { sheetRef, snapPoints, handleSheetChanges } = useBottomSheet({
      snapPoints: [MIN_HEIGHT, '31.3%'],
    });

    useImperativeHandle(ref, () => ({
      expand: () => sheetRef.current?.expand(),
      collapse: () => sheetRef.current?.collapse?.(),
      close: () => sheetRef.current?.close?.(),
    }));

    const handlePress = useCallback(
      (date: string) => {
        onSelect(date);
      },
      [onSelect],
    );

    const keyExtractor = useCallback((item: string) => item, []);

    const renderItem = useCallback(
      ({ item }: { item: string; index: number }) => {
        const isSelected = item === selectedDate;

        return (
          <TouchableOpacity
            style={styles.dateRow}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.dateItem, { backgroundColor: isSelected ? gray[50] : common.white }]}
            >
              <Body1
                weight="regular"
                style={styles.dateLabel}
              >
                {item}
              </Body1>
            </View>
          </TouchableOpacity>
        );
      },
      [handlePress, selectedDate],
    );

    return (
      <BottomSheetWrapper
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.container}>
          <H3
            weight="semibold"
            style={styles.title}
          >
            리포트 날짜 선택
          </H3>

          <FlatList
            data={dates}
            keyExtractor={keyExtractor}
            initialNumToRender={3}
            windowSize={3}
            scrollEnabled={dates?.length > 3}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            renderItem={renderItem}
          />
        </View>
      </BottomSheetWrapper>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 16,
    marginTop: 8,
  },
  title: {
    marginTop: 10,
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    maxHeight: ITEM_ROW_HEIGHT * 3,
  },
  dateRow: {
    width: '100%',
    height: ITEM_ROW_HEIGHT,
    justifyContent: 'center',
  },
  dateItem: {
    alignSelf: 'stretch',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  dateLabel: {
    marginVertical: 12,
    marginHorizontal: 20,
    color: gray[500],
  },
});

ChooseReportSheet.displayName = 'ChooseReportSheet';
export default ChooseReportSheet;
