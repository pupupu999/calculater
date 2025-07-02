import { db } from '../server/firebase-admin.js';

export default async function monthlyResetForAllUsers() {
    const snapshot = await db.collection('users').get();

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, "0")}`;

    for (const doc of snapshot.docs) {
        const uid = doc.id;
        const data = doc.data();

        if (!data.results || !data.results.day_value) {
            console.log(`User ${uid} has no results.`);
            continue;
        }

        const lastMonthEntries = data.results.day_value.filter((d) => {
            const date = d.date.toDate();
            const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            return ym === lastMonth;
        });

        const lastMonthRebuy = lastMonthEntries.reduce((sum, d) => sum + (Number(d.rebuy) || 0), 0);

        let lastTotalChip = null;
        if (lastMonthEntries.length > 0) {
            const lastEntry = lastMonthEntries[lastMonthEntries.length - 1];
            lastTotalChip = Object.values(lastEntry.total_chip)[0];
        }

        await doc.ref.update({
            [`results.monthly_summary.${lastMonth}.rebuy`]: lastMonthRebuy,
            [`results.monthly_summary.${lastMonth}.total_chip`]: lastTotalChip ?? null,
            [`results.monthly_summary.${lastMonth}.ranking`]: null,
            [`results.monthly_summary.${thisMonth}.rebuy`]: null,
            [`results.monthly_summary.${thisMonth}.total_chip`]: null,
            [`results.monthly_summary.${thisMonth}.ranking`]: null,
            'results.current_month_total_chip': 0
        });

        console.log(`Monthly reset completed for user ${uid}.`);
    }
}

monthlyResetForAllUsers();
