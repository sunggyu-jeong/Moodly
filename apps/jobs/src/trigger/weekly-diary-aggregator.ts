import { createClient } from "@supabase/supabase-js";
import { schedules } from "@trigger.dev/sdk/v3";
import { decryptData } from "../util/crypto";
import { ICON_DATA } from "../util/icons";
import { ENV } from "./env";
import { processGeminiJob } from "./process-gemini";

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const weeklyDiaryAggregator = schedules.task({
  id: "weekly-diary-aggregator",
  cron: "0 3 * * *",
  
  run: async (payload) => {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = ENV;

    console.log("[Weekly Aggregator] 주간 일기 집계 프로세스 시작....");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const now = new Date(); 
    
    const endDate = new Date(now);
    
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);

    const fmtStart = startDate.toISOString().split('T')[0];
    const fmtEnd = endDate.toISOString().split('T')[0];

    console.log(`집계 기간: ${fmtStart} ~ ${fmtEnd} (오늘 기준 최근 7일)`);

    const { data: diaries, error } = await supabase
    .from("moodly_diary")
    .select("user_id, description, record_date, created_at, icon_id")
    .gte("record_date", fmtStart) 
    .lte("record_date", fmtEnd)
    .not("description", "is", null);

    if (error) {
      console.error("일기 데이터 조회 중 에러 발생:", error);
      throw error;
    }

    const sameDayDiaries = diaries?.filter((diary) => {
      const createdDateString = diary.created_at.split('T')[0];
      return diary.record_date === createdDateString;
    });

    if (!sameDayDiaries || sameDayDiaries.length === 0) {
      console.log("집계할 일기 데이터가 없습니다. 작업을 종료합니다.");
      return { message: "NO_DATA", range: `${fmtStart}~${fmtEnd}` };
    }

    console.log(`조회된 원본 일기 개수: ${sameDayDiaries.length}건`);

    const userMap = new Map<string, any[]>();

    for (const diary of sameDayDiaries) {
      const recordDate = diary.record_date;
      const createDate = diary.created_at.split('T')[0];

      if (recordDate !== createDate) {
        continue;
      }

      let plainDescription = "";
      try {
        const decrypted = decryptData(diary.description);
        plainDescription = typeof decrypted === 'string' ? decrypted : JSON.stringify(decrypted);
      } catch (e) {
        console.warn(`복호화 실패 (User: ${diary.user_id}, Date: ${recordDate}) - 건너뜀`);
        continue;
      }

      if (!plainDescription) continue;

      if (!userMap.has(diary.user_id)) {
        userMap.set(diary.user_id, []);
      }
      
      userMap.get(diary.user_id)?.push({
        date: recordDate,
        content: plainDescription,
        mood: diary.icon_id
      });
    }

    const jobsToInsert = [];

    const moodMap = ICON_DATA.reduce((acc, item) => {
      acc[item.id] = item.text;
      return acc;
    }, {} as Record<number, string>);

    for (const [userId, diaryEntries] of userMap) {
      if (diaryEntries.length < 0) continue;
      const combinedDiaries = diaryEntries
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => {
        const dateObj = new Date(d.date);
        
        const formattedDate = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 ${WEEKDAYS[dateObj.getDay()]}요일`;
        
        const moodText = moodMap[d.mood] || '알 수 없음';
    
        return `[${formattedDate}] (감정: ${moodText}) ${d.content}`;
      })
      .join(",");
    
      jobsToInsert.push({
        user_id: userId,
        status: 'pending',
        input_payload: {
          factInput: `${combinedDiaries}`,
          meta: {
            start_date: fmtStart,
            end_date: fmtEnd
          }
        }
      });
    }

    if (jobsToInsert.length === 0) {
      console.log("조건을 만족하는(유효한) 일기가 없어 작업을 생성하지 않습니다.");
      return { message: "NO_VALID_DIARIES", count: 0 };
    }

    console.log(`생성할 리포트 작업 수: ${jobsToInsert.length}건`);

    const { data: insertedJobs, error: insertError } = await supabase
      .from("tb_ai_jobs")
      .insert(jobsToInsert)
      .select("id");

    if (insertError) {
      console.error("tb_ai_jobs 테이블 INSERT 실패:", insertError);
      throw new Error(`Queue Insert Failed: ${insertError.message}`);
    }

    console.log(`tb_ai_jobs 테이블에 ${insertedJobs.length}건 저장 완료.`);

    const batchPayloads = insertedJobs.map((job) => ({
      payload: { jobId: job.id },
    }));

    const batchResult = await processGeminiJob.batchTrigger(batchPayloads);

    console.log(`배치 트리거 완료 (Batch ID: ${batchResult.batchId})`);

    return {
      message: "SUCCESS",
      inserted_count: insertedJobs.length,
      batch_id: batchResult.batchId,
      period: `${fmtStart} ~ ${fmtEnd}`
    };
  },
});