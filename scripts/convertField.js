import { db } from '../server/firebase-admin.js';

async function convertScoresForAllUsers() {
    const usersSnap = await db.collection("users").get();
    const date = new Date();
    const currentYearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    for (const docSnap of usersSnap.docs) {
        const uid = docSnap.id;
        const docData = docSnap.data();
        const docRef = db.collection("users").doc(uid);
        const dayValue = docData?.results?.day_value || [];

        // 現時点では total_chip は数値 → currentMonthTotal を計算
        let currentMonthTotal = 0;
        if (dayValue.length > 0) {
            const lastEntry = dayValue[dayValue.length - 1];
            if (typeof lastEntry.total_chip === "number") {
                currentMonthTotal = lastEntry.total_chip;
            }
        }

        // 保存用に total_chip を Map形式に変換
        const newDayValue = dayValue.map((entry) => {
            if (typeof entry.total_chip === "number") {
                let dateObj;
                if (entry.date?.toDate) {
                    dateObj = entry.date.toDate();
                } else if (typeof entry.date === "string") {
                    dateObj = new Date(entry.date);
                } else {
                    dateObj = new Date();
                }

                const yearMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

                return {
                    ...entry,
                    total_chip: { [yearMonth]: entry.total_chip }
                };
            } else {
                // すでにMap形式ならそのまま
                return entry;
            }
        });

        // monthly_summaryを取得または初期化
        const monthlySummary = docData?.results?.monthly_summary || {};

        // 現在月のオブジェクトをセット
        monthlySummary[currentYearMonth] = {
            total_chip: currentMonthTotal,
            ranking: null,
            rebuy: null,
            tournament: null
        };

        await docRef.update({
            "results.day_value": newDayValue,
            "results.monthly_summary": monthlySummary,
            "results.current_month_total_chip": currentMonthTotal
        });

        console.log(`変換が完了しました: ${uid}`);
    }
}

convertScoresForAllUsers().catch((error) => {
    console.error("変換処理中にエラー:", error);
});