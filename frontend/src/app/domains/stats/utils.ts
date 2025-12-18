import {Activity} from "@/app/domains/activity/types.ts";
import {AggrConfig, DailyStats} from "@/app/domains/stats/types.ts";
import moment, {Moment} from "moment";
import {forEach, isEmpty, map, orderBy, sum} from "lodash";
import {Category} from "@/app/domains/category/types.ts";

export const DAY_FORMAT = 'YYYY-MM-DD';
const SLEEP_BEGIN_MIN = 21; // hour of day
const SLEEP_BEGIN_MAX = 8;

export const minutesByCategory = (activities: Activity[]): Record<number, number> => {
  const byCategory: Record<number, number> = {};
  forEach(activities, (activity) => {
    byCategory[activity.category_id!] ||= 0;
    byCategory[activity.category_id!] += activity.to!.diff(activity.from!, 'minutes')
  })
  return byCategory
}

// compute sleepAt[] for each day(could be yesterday, among [SLEEP_BEGIN_MIN, SLEEP_BEGIN_MAX])
const computeSleepAt = (sortedActivities: Activity[], sleepCategoryId?: number): Record<string, Moment> => {
  const sleepAt: Record<string, Moment> = {}

  const canBeginSleep = (hour: number) => hour >= SLEEP_BEGIN_MIN || hour <= SLEEP_BEGIN_MAX;
  const sleeps = sortedActivities.filter(a => a.category_id === sleepCategoryId && canBeginSleep(a.from!.hour()));
  for (let i = 0; i < sleeps.length;) {
    const slp = sleeps[i]
    const hour = slp.from!.hour()

    let sleepAtMost = slp.from!.clone();
    if (hour >= SLEEP_BEGIN_MIN) {
      sleepAtMost = sleepAtMost.clone().add(1, 'day')
    }
    sleepAtMost = sleepAtMost.startOf('day').hour(SLEEP_BEGIN_MIN); // at most SLEEP_HOUR_MIN

    sleepAt[sleepAtMost.format(DAY_FORMAT)] = slp.from!;

    // skip same day sleeps
    i++;
    while (i < sleeps.length && sleeps[i].from!.isSameOrBefore(sleepAtMost)) {
      i++
    }
  }

  return sleepAt;
}

// divide days by sleep time
const divideDayBySleep = (activities: Activity[], sleepAt: Record<string, Moment>): Record<string, Activity[]> => {
  const byDay: Record<string, Activity[]> = {}

  const append = (day: string, activity: Activity) => {
    byDay[day] ||= [];
    byDay[day].push(activity);
  }

  // divide activities by sleepAt[]
  for (const activity of activities) {
    let day = activity.from!.format(DAY_FORMAT);
    const nxtDay = activity.from!.clone().add(1, 'day').format(DAY_FORMAT);
    const [fr, till] = [sleepAt[day], sleepAt[nxtDay]];

    if (fr && activity.from!.isBefore(fr)) {
      day = activity.from!.clone().add(-1, 'day').format(DAY_FORMAT);
    } else if (till && activity.from!.isSameOrAfter(till)) {
      day = activity.from!.clone().add(1, 'day').format(DAY_FORMAT);
    }
    append(day, activity)
  }
  return byDay;
}

// compute daily stats, divided by each day's sleep time(could be yesterday, among [SLEEP_BEGIN_MIN, SLEEP_BEGIN_MAX])
export const computeDailyStats = (activities: Activity[], categories: Category[]): DailyStats[] => {
  if (isEmpty(activities) || isEmpty(categories)) {
    return []
  }

  const slpCateId = categories?.find((category) => category.name === 'Sleep')?.id;

  activities = orderBy(activities, ['from'])
  const sleepAt = computeSleepAt(activities, slpCateId);
  const byDay = divideDayBySleep(activities, sleepAt);

  return map(byDay, (activities, date) => {
    const sleep_at = sleepAt[date] || moment(date)
    const by_category = minutesByCategory(activities);
    const sleep_len = slpCateId && by_category[slpCateId] || 0;
    const total = sum(Object.values(by_category));

    return {
      date,
      sleep_at,
      activities,
      by_category,
      sleep_len,
      total,
    }
  })
}

const MockAggrConf = {
  Build: {
    color: "#4CAF50",
    categoryNames: "Self Study Read Hobby Exercise Peace".split(" ")
  },
  Waste: {
    color: "#F44336",
    categoryNames: "Game Vid Idle Wander Surf".split(" ")
  },
  Sleep: {
    color: "#673AB7",
    categoryNames: "Sleep".split(" ")
  }
}

export const getDefaultAggrConfigs = (categories: Category[]): AggrConfig[] => {
  return map(MockAggrConf, ({color, categoryNames}, name) => {
    const category_ids = []
    for(const name of categoryNames) {
      const id = categories.find(c => c.name === name)?.id
      if(id){category_ids.push(id)}
    }
    return {
      name,
      color,
      category_ids,
    }
  })
}
