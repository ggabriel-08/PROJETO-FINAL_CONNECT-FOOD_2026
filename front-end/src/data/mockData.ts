import type { User, CommentItem, DailyMealPlan } from '../types';

// ALL MOCK DATA HAS BEEN REMOVED.
// ALL DATA IS FETCHED IN REAL-TIME DIRECTLY FROM THE MYSQL DATABASE via API.

export const INITIAL_USERS: User[] = [];

export const INITIAL_COMMENTS: CommentItem[] = [];

export const INITIAL_MEAL_PLANS: Record<string, DailyMealPlan> = {};
