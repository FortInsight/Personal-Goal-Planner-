const SUPABASE_URL = window.SUPABASE_URL || "";
const SUPABASE_KEY = window.SUPABASE_KEY || "";


const supabaseClient =
  SUPABASE_URL && SUPABASE_KEY && window.supabase?.createClient
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    : null;

function authEnabled() {
  return Boolean(supabaseClient);
}

function openPlannerPage() {
  window.location.href = "goal.html";
}

async function protectGoalPage() {
  if (!authEnabled()) {
    window.location.href = "login.html";
    return null;
  }

  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    window.location.href = "login.html";
    return null;
  }

  return data.session;
}

async function logoutUser() {
  if (authEnabled()) {
    try {
      await supabaseClient.auth.signOut({ scope: "local" });
    } catch (error) {
      console.error("Could not sign out.", error);
    }
  }

  window.location.href = "login.html";
}

async function syncProfileFromSession() {
  if (!authEnabled()) {
    return;
  }

  try {
    const { data } = await supabaseClient.auth.getUser();
    const user = data?.user;
    if (!user) {
      return;
    }

    const userName =
      user.user_metadata?.user_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "";
    const email = user.email || "";

    if ((userName && state.profile.profileName !== userName) || state.profile.email !== email) {
      state.profile.profileName = userName;
      state.profile.email = email;
      saveState();
      render({ skipSave: true });
    }
  } catch (error) {
    console.error("Could not sync profile from session.", error);
  }
}


const STORAGE_KEY = "personal-goals-dashboard-rebuilt-v3";

function hasMeaningfulPlannerData(value) {
  return Boolean(
    value &&
      (Array.isArray(value.goals) && value.goals.length > 0 ||
        value.profile?.profileName ||
        value.profile?.email)
  );
}



async function signUpUser() {
  const email = document.getElementById("authEmail")?.value.trim();
  const password = document.getElementById("authPassword")?.value;
  const message = document.getElementById("authMessage");

  if (!message) return;
  message.textContent = "";

  if (!authEnabled()) {
    message.textContent = "Paste your Supabase URL and key into supabase-config.js first.";
    return;
  }

  if (!email || !password) {
    message.textContent = "Please enter email and password.";
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    message.textContent = "Sign up error: " + error.message;
    return;
  }

  message.textContent = "Account created. You can now log in.";
}

async function loginUser() {
  const email = document.getElementById("authEmail")?.value.trim();
  const password = document.getElementById("authPassword")?.value;
  const message = document.getElementById("authMessage");

  if (!message) return;
  message.textContent = "";

  if (!authEnabled()) {
    message.textContent = "Paste your Supabase URL and key into supabase-config.js first.";
    return;
  }

  if (!email || !password) {
    message.textContent = "Please enter email and password.";
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    message.textContent = "Login error: " + error.message;
    return;
  }

  message.textContent = "Login successful. Opening planner...";
  window.location.href = "goal.html";
}



const $ = (id) => document.getElementById(id);

const elements = {
  viewTabs: Array.from(document.querySelectorAll("[data-view-tab]")),
  viewPanels: Array.from(document.querySelectorAll("[data-view-panel]")),
  menuToggle: $("menuToggle"),
  menuPanel: $("menuPanel"),
  plannerHeaderToggle: $("plannerHeaderToggle"),
  plannerHeaderDetails: $("plannerHeaderDetails"),
  accountShortcutButton: $("accountShortcutButton"),
  logoutButton: $("logoutButton"),
  welcomeMessage: $("welcomeMessage"),
  signupButton: $("signupButton"),
  loginButton: $("loginButton"),
  todayLabel: $("todayLabel"),
  homeActionMode: $("homeActionMode"),
  goalForm: $("goalForm"),
  goalTitleField: $("goalTitleField"),
  goalPicker: $("goalPicker"),
  updateGoalSection: $("updateGoalSection"),
  goalTitle: $("goalTitle"),
  goalDate: $("goalDate"),
  goalTime: $("goalTime"),
  goalNotes: $("goalNotes"),
  goalRepeat: $("goalRepeat"),
  customRepeatWrap: $("customRepeatWrap"),
  goalRepeatInterval: $("goalRepeatInterval"),
  goalRepeatUnit: $("goalRepeatUnit"),
  goalSubmitButton: $("goalSubmitButton"),
  updateGoalForm: $("updateGoalForm"),
  updateGoalStatus: $("updateGoalStatus"),
  updateGoalProgress: $("updateGoalProgress"),
  updateGoalSubmitButton: $("updateGoalSubmitButton"),
  updateGoalDeleteButton: $("updateGoalDeleteButton"),
  updateStatusButtons: $("updateStatusButtons"),
  subGoalSection: $("subGoalSection"),
  subGoalForm: $("subGoalForm"),
  subGoalTitle: $("subGoalTitle"),
  subGoalDate: $("subGoalDate"),
  selectedSubGoalList: $("selectedSubGoalList"),
  totalGoals: $("totalGoals"),
  todayGoals: $("todayGoals"),
  todayCompletedGoals: $("todayCompletedGoals"),
  todayInProgressGoals: $("todayInProgressGoals"),
  dueNotCompletedGoals: $("dueNotCompletedGoals"),
  dailyProgressValue: $("dailyProgressValue"),
  dailyProgressFill: $("dailyProgressFill"),
  weeklyProgressValue: $("weeklyProgressValue"),
  weeklyProgressFill: $("weeklyProgressFill"),
  yearlyProgressValue: $("yearlyProgressValue"),
  yearlyProgressFill: $("yearlyProgressFill"),
  goalListRange: $("goalListRange"),
  goalListCalendarWrap: $("goalListCalendarWrap"),
  goalListCalendarDate: $("goalListCalendarDate"),
  goalListStatus: $("goalListStatus"),
  toggleGoalList: $("toggleGoalList"),
  toggleGoalTableButton: $("toggleGoalTableButton"),
  goalTableWrap: $("goalTableWrap"),
  goalList: $("goalList"),
  resetButton: $("resetButton"),
  reportRange: $("reportRange"),
  reportPeriod: $("reportPeriod"),
  dailyStatusCaption: $("dailyStatusCaption"),
  dailyDonut: $("dailyDonut"),
  dailyDonutValue: $("dailyDonutValue"),
  dailyStatusLegend: $("dailyStatusLegend"),
  chartCaption: $("chartCaption"),
  trendChart: $("trendChart"),
  completedReportCaption: $("completedReportCaption"),
  completedReportList: $("completedReportList"),
  accountForm: $("accountForm"),
  accountUserName: $("accountUserName"),
  accountEmail: $("accountEmail"),
  accountPassword: $("accountPassword"),
  accountPasswordConfirm: $("accountPasswordConfirm"),
  accountSubmitButton: $("accountSubmitButton"),
  accountMessage: $("accountMessage"),
  plannerStatusMessage: $("plannerStatusMessage"),
};
// const state = loadState();
// protectGoalPage();

// initialize();
const defaultProfile = {
  profileName: "",
  email: "",
};

function getFreshState() {
  return {
    profile: { ...defaultProfile },
    goals: [],
    ui: {
      activeView: "home",
      selectedGoalId: "",
      goalListCollapsed: false,
      headerCollapsed: false,
      reportRange: "day",
      reportPeriod: "",
    },
    meta: {
      updatedAt: new Date().toISOString(),
    },
  };
}
const state = loadState();

if (window.location.pathname.includes("goal.html")) {
  protectGoalPage().catch((error) => {
    console.error("Could not verify session.", error);
  });

  if (authEnabled()) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        window.location.href = "login.html";
      }
    });
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//   initialize();
//   syncProfileFromSession();
// });

document.addEventListener("DOMContentLoaded", async () => {
  window.goalPlannerSetStatus = handleGoalListStatusAction;
  window.goalPlannerApplySelectedStatus = updateSelectedGoalFromForm;
  window.goalPlannerDeleteSelectedGoal = deleteSelectedGoalFromForm;
  window.goalPlannerSetSelectedStatus = setSelectedGoalStatusAction;

  if (window.location.pathname.includes("goal.html")) {
    await protectGoalPage();
  }

  await loadStateFromSupabase();

  initialize();
  syncProfileFromSession();
});

function initialize() {
  state.ui.activeView = "home";
  elements.goalListCalendarDate.value = toIsoDate(getToday());
  elements.goalListRange.value = "today";
  elements.goalListStatus.value = "all";
  elements.reportRange.value = state.ui.reportRange || "day";
  state.ui.reportRange = elements.reportRange.value;
  updateCustomRepeatVisibility();
  updateCalendarVisibility();
  setMenuOpen(false);
  registerPwa();
  wireEvents();
  render({ skipSave: true });
  queueMicrotask(() => {
    if (elements.homeActionMode.value === "create") {
      focusGoalTitleField();
    }
  });
}

function focusGoalTitleField() {
  const target = elements.goalTitleField || elements.goalTitle;
  target.scrollIntoView({ behavior: "smooth", block: "center" });

  window.setTimeout(() => {
    elements.goalTitle.focus({ preventScroll: true });
    elements.goalTitle.classList.remove("field-highlight");
    void elements.goalTitle.offsetWidth;
    elements.goalTitle.classList.add("field-highlight");
    window.setTimeout(() => {
      elements.goalTitle.classList.remove("field-highlight");
    }, 1800);
  }, 120);
}

function loadState() {
  const fallback = getFreshState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return fallback;
  }
}

function normalizeState(value) {
  const fallback = getFreshState();
  const next = {
    profile: { ...defaultProfile, ...(value.profile || {}) },
    goals: Array.isArray(value.goals) ? value.goals.map(normalizeGoal) : [],
    ui: {
      activeView: value.ui?.activeView || "home",
      selectedGoalId: value.ui?.selectedGoalId || "",
      goalListCollapsed: Boolean(value.ui?.goalListCollapsed),
      headerCollapsed: Boolean(value.ui?.headerCollapsed),
      reportRange: value.ui?.reportRange || "day",
      reportPeriod: value.ui?.reportPeriod || "",
    },
    meta: {
      updatedAt: value.meta?.updatedAt || new Date().toISOString(),
    },
  };

  if (!next.goals.some((goal) => goal.id === next.ui.selectedGoalId)) {
    next.ui.selectedGoalId = "";
  }
  if (!["home", "goals", "report", "account"].includes(next.ui.activeView)) {
    next.ui.activeView = "home";
  }

  return { ...fallback, ...next };
}

// function saveState(options = {}) {
//   state.meta.updatedAt = options.keepTimestamp ? state.meta.updatedAt : new Date().toISOString();
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//   } catch (error) {
//     console.error("Could not save planner data.", error);
//   }
// }
async function saveState(options = {}) {
  state.meta.updatedAt = options.keepTimestamp
    ? state.meta.updatedAt
    : new Date().toISOString();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Could not save planner data.", error);
  }

  await saveStateToSupabase();
}

// async function saveStateToSupabase() {
//   const { data: { session } } = await supabaseClient.auth.getSession();
//   const user = session?.user;

//   if (!user) return;

//   const { error } = await supabaseClient
//     .from("goals")
//     .upsert({
//       user_id: user.id,
//       goal_data: state,
//       updated_at: new Date().toISOString()
//     }, {
//       onConflict: "user_id"
//     });

//   if (error) {
//     console.error("Supabase save error:", error.message);
//   }
// }
async function saveStateToSupabase() {
  if (!authEnabled()) {
    return;
  }

  const { data: { session } } = await supabaseClient.auth.getSession();
  const user = session?.user;

  if (!user) return;

  const { data: existingRows, error: findError } = await supabaseClient
    .from("goals")
    .select("id, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (findError) {
    console.error("Supabase find error:", findError.message);
    return;
  }

  const existing = Array.isArray(existingRows) ? existingRows : [];
  const primaryRow = existing[0];

  if (primaryRow?.id) {
    const { error } = await supabaseClient
      .from("goals")
      .update({
        goal_data: state,
        updated_at: new Date().toISOString()
      })
      .eq("id", primaryRow.id);

    if (error) console.error("Supabase update error:", error.message);

    const duplicateIds = existing.slice(1).map((row) => row.id).filter(Boolean);
    if (duplicateIds.length) {
      const { error: deleteError } = await supabaseClient
        .from("goals")
        .delete()
        .in("id", duplicateIds);

      if (deleteError) {
        console.error("Supabase duplicate cleanup error:", deleteError.message);
      }
    }
    return;
  }

  const { error } = await supabaseClient
    .from("goals")
    .insert({
      user_id: user.id,
      goal_data: state,
      updated_at: new Date().toISOString()
    });

  if (error) console.error("Supabase insert error:", error.message);
}


async function loadStateFromSupabase() {
  if (!authEnabled()) {
    return;
  }

  const { data: { session } } = await supabaseClient.auth.getSession();
  const user = session?.user;

  if (!user) return;

  const { data, error } = await supabaseClient
    .from("goals")
    .select("id, goal_data, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Supabase load error:", error.message);
    return;
  }

  const rows = Array.isArray(data) ? data : [];
  const primaryRow = rows[0];

  if (primaryRow?.goal_data) {
    Object.assign(state, normalizeState(primaryRow.goal_data));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (storageError) {
      console.error("Could not mirror synced planner data locally.", storageError);
    }

    const duplicateIds = rows.slice(1).map((row) => row.id).filter(Boolean);
    if (duplicateIds.length) {
      const { error: deleteError } = await supabaseClient
        .from("goals")
        .delete()
        .in("id", duplicateIds);

      if (deleteError) {
        console.error("Supabase duplicate cleanup error:", deleteError.message);
      }
    }
    return;
  }

  if (hasMeaningfulPlannerData(state)) {
    await saveStateToSupabase();
  }
}
function registerPwa() {
  return;
}

function setPlannerStatusMessage(message, tone = "") {
  if (!elements.plannerStatusMessage) {
    return;
  }

  elements.plannerStatusMessage.textContent = message;
  elements.plannerStatusMessage.classList.remove("is-success", "is-error");
  if (tone === "success") {
    elements.plannerStatusMessage.classList.add("is-success");
  }
  if (tone === "error") {
    elements.plannerStatusMessage.classList.add("is-error");
  }
}

function normalizeGoal(goal) {
  return {
    id: goal.id || makeId(),
    title: goal.title || "",
    dueDate: goal.dueDate || "",
    time: goal.time || "",
    notes: goal.notes || "",
    status: normalizeStatus(goal.status),
    progress: clampNumber(goal.progress, 0, 100, 0),
    repeat: goal.repeat || "none",
    repeatInterval: clampNumber(goal.repeatInterval, 1, 999, 1),
    repeatUnit: goal.repeatUnit || "day",
    createdAt: goal.createdAt || new Date().toISOString(),
    updatedAt: goal.updatedAt || new Date().toISOString(),
    lastStatus: normalizeStatus(goal.lastStatus || goal.status),
    lastStatusProgress: clampNumber(goal.lastStatusProgress ?? goal.progress, 0, 100, 0),
    lastStatusChangedAt: goal.lastStatusChangedAt || goal.updatedAt || goal.createdAt || new Date().toISOString(),
    lastCompletedAt: goal.lastCompletedAt || "",
    history: normalizeHistory(goal),
    subGoals: Array.isArray(goal.subGoals)
      ? goal.subGoals.map((subGoal) => ({
          id: subGoal.id || makeId(),
          title: subGoal.title || "",
          dueDate: subGoal.dueDate || "",
          status: normalizeStatus(subGoal.status),
          createdAt: subGoal.createdAt || new Date().toISOString(),
        }))
      : [],
  };
}

function normalizeHistory(goal) {
  if (Array.isArray(goal.history) && goal.history.length) {
    return goal.history
      .map((entry) => ({
        date: entry.date || goal.updatedAt || goal.createdAt || new Date().toISOString(),
        status: normalizeStatus(entry.status),
        progress: clampNumber(entry.progress, 0, 100, 0),
      }))
      .sort((left, right) => new Date(left.date) - new Date(right.date))
      .slice(-120);
  }

  return [
    {
      date: goal.updatedAt || goal.createdAt || new Date().toISOString(),
      status: normalizeStatus(goal.status),
      progress: clampNumber(goal.progress, 0, 100, 0),
    },
  ];
}

function normalizeStatus(status) {
  return ["not-started", "in-progress", "completed"].includes(status) ? status : "not-started";
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, number));
}

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getToday() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateFromIso(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return new Date(next.getFullYear(), next.getMonth(), next.getDate());
}

function addMonths(date, amount) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return new Date(next.getFullYear(), next.getMonth(), next.getDate());
}

function addYears(date, amount) {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + amount);
  return new Date(next.getFullYear(), next.getMonth(), next.getDate());
}

function startOfWeek(date) {
  return addDays(date, -date.getDay());
}

function endOfWeek(date) {
  return addDays(startOfWeek(date), 6);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date) {
  return new Date(date.getFullYear(), 11, 31);
}

function sameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isBeforeDay(left, right) {
  return left.getTime() < right.getTime();
}

function isAfterDay(left, right) {
  return left.getTime() > right.getTime();
}

function dayDiff(start, end) {
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function monthDiff(start, end) {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

function yearDiff(start, end) {
  return end.getFullYear() - start.getFullYear();
}

function isGoalScheduledOn(goal, date) {
  if (!goal.dueDate) return false;
  const baseDate = dateFromIso(goal.dueDate);
  if (!baseDate || isBeforeDay(date, baseDate)) return false;

  if (goal.repeat === "none") return sameDay(baseDate, date);
  if (goal.repeat === "daily") return true;
  if (goal.repeat === "weekly") return dayDiff(baseDate, date) % 7 === 0;
  if (goal.repeat === "monthly") {
    return date.getDate() === baseDate.getDate() && monthDiff(baseDate, date) >= 0;
  }
  if (goal.repeat === "yearly") {
    return date.getDate() === baseDate.getDate() && date.getMonth() === baseDate.getMonth() && yearDiff(baseDate, date) >= 0;
  }
  if (goal.repeat === "custom") {
    const every = Math.max(1, goal.repeatInterval || 1);
    if (goal.repeatUnit === "day") {
      return dayDiff(baseDate, date) % every === 0;
    }
    if (goal.repeatUnit === "week") {
      return dayDiff(baseDate, date) % (every * 7) === 0;
    }
    if (goal.repeatUnit === "month") {
      return date.getDate() === baseDate.getDate() && monthDiff(baseDate, date) % every === 0;
    }
    if (goal.repeatUnit === "year") {
      return (
        date.getDate() === baseDate.getDate() &&
        date.getMonth() === baseDate.getMonth() &&
        yearDiff(baseDate, date) % every === 0
      );
    }
  }

  return false;
}

function getFilterRange() {
  const today = getToday();
  const selectedCalendarDate = dateFromIso(elements.goalListCalendarDate.value) || today;
  const range = elements.goalListRange.value;

  if (range === "planned") {
    return {
      start: today,
      end: today,
      label: "Planned goals",
    };
  }

  if (range === "today") {
    return {
      start: selectedCalendarDate,
      end: selectedCalendarDate,
      label: formatLongDate(selectedCalendarDate),
    };
  }

  if (range === "tomorrow") {
    const tomorrow = addDays(selectedCalendarDate, 1);
    return {
      start: tomorrow,
      end: tomorrow,
      label: "Tomorrow",
    };
  }

  if (range === "week") {
    return {
      start: startOfWeek(selectedCalendarDate),
      end: endOfWeek(selectedCalendarDate),
      label: "Selected week",
    };
  }

  if (range === "month") {
    return {
      start: startOfMonth(selectedCalendarDate),
      end: endOfMonth(selectedCalendarDate),
      label: "Selected month",
    };
  }

  if (range === "year") {
    return {
      start: startOfYear(selectedCalendarDate),
      end: endOfYear(selectedCalendarDate),
      label: "Selected year",
    };
  }

  if (range === "calendar") {
    return {
      start: selectedCalendarDate,
      end: selectedCalendarDate,
      label: "Selected date",
    };
  }

  return {
    start: null,
    end: null,
    label: "All goals",
  };
}

function goalOccursWithin(goal, start, end) {
  if (!start || !end) return true;
  if (!goal.dueDate) {
    return sameDay(getToday(), start) && sameDay(start, end) && goal.status !== "completed";
  }
  for (let cursor = new Date(start); !isAfterDay(cursor, end); cursor = addDays(cursor, 1)) {
    if (isGoalScheduledOn(goal, cursor)) {
      return true;
    }
  }
  return false;
}

function isPlannedGoalForDate(goal, date = getToday()) {
  if (!goal) return false;
  return getGoalStateForDate(goal, date).status !== "completed";
}

function isDueAndNotCompletedGoal(goal, date = getToday()) {
  if (!goal || !goalOccursWithin(goal, date, date)) {
    return false;
  }

  return getGoalStateForDate(goal, date).status !== "completed";
}

function firstOccurrenceWithin(goal, start, end) {
  if (!start || !end) {
    return goal.dueDate ? dateFromIso(goal.dueDate) : null;
  }
  if (!goal.dueDate) {
    return sameDay(getToday(), start) && goal.status !== "completed" ? start : null;
  }
  for (let cursor = new Date(start); !isAfterDay(cursor, end); cursor = addDays(cursor, 1)) {
    if (isGoalScheduledOn(goal, cursor)) {
      return cursor;
    }
  }
  return null;
}

function syncGoalFromSubGoals(goal) {
  if (!goal.subGoals.length) {
    return;
  }

  const completed = goal.subGoals.filter((item) => item.status === "completed").length;
  const inProgress = goal.subGoals.filter((item) => item.status === "in-progress").length;
  goal.progress = Math.round((completed / goal.subGoals.length) * 100);

  if (completed === goal.subGoals.length) {
    goal.status = "completed";
    goal.progress = 100;
    return;
  }

  goal.status = inProgress > 0 || completed > 0 ? "in-progress" : "not-started";
}

function getSuccess(goal, date = getToday()) {
  const stateForDate = getGoalStateForPeriod(goal, date, date);

  if (goal.subGoals.length) {
    const completed = goal.subGoals.filter((item) => item.status === "completed").length;
    const percent = Math.round((completed / goal.subGoals.length) * 100);
    return {
      pct: percent,
      text: `${percent}% (${completed}/${goal.subGoals.length})`,
    };
  }

  const percent = clampNumber(stateForDate.progress, 0, 100, 0);
  return {
    pct: percent,
    text: `${percent}%`,
  };
}

function getGoalStateForDate(goal, date) {
  return getGoalStateForPeriod(goal, date, date);
}

function getTodayOccurrenceGoals() {
  const today = getToday();
  return state.goals
    .filter((goal) => goalRelevantToPeriod(goal, today, today))
    .map((goal) => ({
      goal,
      state: getGoalStateForDate(goal, today),
    }));
}

function getDueTodayGoalEntries(date = getToday()) {
  return state.goals
    .filter((goal) => goalOccursWithin(goal, date, date))
    .map((goal) => ({
      goal,
      state: getGoalStateForDate(goal, date),
    }));
}

function percentFromGoalStates(goalStates) {
  if (!goalStates.length) return 0;
  const completed = goalStates.filter((entry) => entry.state.status === "completed").length;
  return Math.round((completed / goalStates.length) * 100);
}

function advanceRepeatingGoal(goal, baseDate) {
  if (!goal.repeat || goal.repeat === "none") {
    return;
  }

  const currentDueDate = dateFromIso(goal.dueDate) || baseDate || getToday();

  if (goal.repeat === "daily") {
    goal.dueDate = toIsoDate(addDays(currentDueDate, 1));
  } else if (goal.repeat === "weekly") {
    goal.dueDate = toIsoDate(addDays(currentDueDate, 7));
  } else if (goal.repeat === "monthly") {
    goal.dueDate = toIsoDate(addMonths(currentDueDate, 1));
  } else if (goal.repeat === "yearly") {
    goal.dueDate = toIsoDate(addYears(currentDueDate, 1));
  } else if (goal.repeat === "custom") {
    const interval = Math.max(1, goal.repeatInterval || 1);

    if (goal.repeatUnit === "day") {
      goal.dueDate = toIsoDate(addDays(currentDueDate, interval));
    } else if (goal.repeatUnit === "week") {
      goal.dueDate = toIsoDate(addDays(currentDueDate, interval * 7));
    } else if (goal.repeatUnit === "month") {
      goal.dueDate = toIsoDate(addMonths(currentDueDate, interval));
    } else if (goal.repeatUnit === "year") {
      goal.dueDate = toIsoDate(addYears(currentDueDate, interval));
    }
  }
}

function applyGoalStatusChange(goal, status, progress, occurrenceDate) {
  goal.status = normalizeStatus(status);
  goal.progress = clampNumber(progress, 0, 100, 0);

  if (goal.status === "completed") {
    goal.progress = 100;
  }

  if (goal.status === "not-started") {
    goal.progress = 0;
  }

  goal.lastStatus = goal.status;
  goal.lastStatusProgress = goal.progress;
  // Use local noon for date-only fields to prevent UTC offset from
  // shifting the tracked date to the wrong calendar day.
  const trackedNoon = new Date(occurrenceDate.getFullYear(), occurrenceDate.getMonth(), occurrenceDate.getDate(), 12, 0, 0, 0);
  goal.lastStatusChangedAt = trackedNoon.toISOString();
  if (goal.status === "completed") {
    goal.lastCompletedAt = trackedNoon.toISOString();
  }

  goal.updatedAt = new Date().toISOString();
  recordGoalHistoryForDate(goal, occurrenceDate);

  if (goal.status === "completed" && goal.repeat && goal.repeat !== "none") {
    advanceRepeatingGoal(goal, occurrenceDate);
    goal.status = "not-started";
    goal.progress = 0;
  }
}

function recordGoalHistory(goal) {
  if (!goal) return;
  if (!Array.isArray(goal.history)) goal.history = [];
  goal.history.push({
    date: new Date().toISOString(),
    status: normalizeStatus(goal.status),
    progress: clampNumber(goal.progress, 0, 100, 0),
  });
  goal.history = goal.history
    .sort((left, right) => new Date(left.date) - new Date(right.date))
    .slice(-120);
}

function getHistoryEntriesForPeriod(goal, start, end) {
  if (!Array.isArray(goal.history) || !goal.history.length) {
    return [];
  }

  return goal.history
    .filter((entry) => {
      const entryDate = new Date(entry.date);
      const normalizedDate = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
      return !isBeforeDay(normalizedDate, start) && !isAfterDay(normalizedDate, end);
    })
    .sort((left, right) => new Date(left.date) - new Date(right.date));
}

function getLatestHistoryDateInPeriod(goal, start, end) {
  const entries = getHistoryEntriesForPeriod(goal, start, end);
  if (!entries.length) {
    return null;
  }

  const latestEntryDate = new Date(entries[entries.length - 1].date);
  return new Date(latestEntryDate.getFullYear(), latestEntryDate.getMonth(), latestEntryDate.getDate());
}

function getUpdatedAtDate(goal) {
  if (!goal?.updatedAt) {
    return null;
  }

  const updatedDate = new Date(goal.updatedAt);
  if (Number.isNaN(updatedDate.getTime())) {
    return null;
  }

  return new Date(updatedDate.getFullYear(), updatedDate.getMonth(), updatedDate.getDate());
}

function getTrackedStatusDate(value) {
  if (!value) {
    return null;
  }

  const trackedDate = new Date(value);
  if (Number.isNaN(trackedDate.getTime())) {
    return null;
  }

  return new Date(trackedDate.getFullYear(), trackedDate.getMonth(), trackedDate.getDate());
}

function hasUpdatedStateInPeriod(goal, start, end) {
  const updatedAtDate = getUpdatedAtDate(goal);
  if (!updatedAtDate || !start || !end) {
    return false;
  }

  return !isBeforeDay(updatedAtDate, start) && !isAfterDay(updatedAtDate, end);
}

function hasTrackedStatusInPeriod(goal, start, end) {
  const trackedDate = getTrackedStatusDate(goal.lastStatusChangedAt);
  if (!trackedDate || !start || !end) {
    return false;
  }

  return !isBeforeDay(trackedDate, start) && !isAfterDay(trackedDate, end);
}

function getGoalStateForPeriod(goal, start, end) {
  const entries = getHistoryEntriesForPeriod(goal, start, end);

  if (!entries.length) {
    if (hasTrackedStatusInPeriod(goal, start, end)) {
      return {
        status: normalizeStatus(goal.lastStatus),
        progress: clampNumber(goal.lastStatusProgress, 0, 100, 0),
      };
    }

    if (hasUpdatedStateInPeriod(goal, start, end)) {
      return {
        status: normalizeStatus(goal.status),
        progress: clampNumber(goal.progress, 0, 100, 0),
      };
    }

    // KEY FIX: only reset for repeating goals
    if (goal.repeat && goal.repeat !== "none") {
      return { status: "not-started", progress: 0 };
    }

    // keep original for non-repeating goals
    return {
      status: normalizeStatus(goal.status),
      progress: clampNumber(goal.progress, 0, 100, 0),
    };
  }

  const latest = entries[entries.length - 1];

  return {
    status: normalizeStatus(latest.status),
    progress: clampNumber(latest.progress, 0, 100, 0),
  };
}

function hasHistoryActivityInPeriod(goal, start, end) {
  return getHistoryEntriesForPeriod(goal, start, end).length > 0;
}

function goalRelevantToPeriod(goal, start, end) {
  return hasHistoryActivityInPeriod(goal, start, end) || hasTrackedStatusInPeriod(goal, start, end) || hasUpdatedStateInPeriod(goal, start, end) || goalOccursWithin(goal, start, end);
}

function getGoalsForReportPeriod(start, end, selectedReportGoal = "all") {
  let reportGoals = state.goals.filter((goal) => {
    return goalRelevantToPeriod(goal, start, end);
  });

  if (selectedReportGoal !== "all") {
    reportGoals = reportGoals.filter((goal) => goal.id === selectedReportGoal);
  }

  return reportGoals;
}

function summarizeGoalsForPeriod(start, end, selectedReportGoal = "all") {
  const scheduledGoals = getGoalsForReportPeriod(start, end, selectedReportGoal);
  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;

  scheduledGoals.forEach((goal) => {
    const periodState = getGoalStateForPeriod(goal, start, end);
    if (periodState.status === "completed") {
      completed += 1;
      return;
    }
    if (periodState.status === "in-progress") {
      inProgress += 1;
      return;
    }
    notStarted += 1;
  });

  const total = scheduledGoals.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    inProgress,
    notStarted,
    percent,
  };
}

function getRepeatLabel(goal) {
  if (goal.repeat === "none") return "One time";
  if (goal.repeat === "daily") return "Repeats daily";
  if (goal.repeat === "weekly") return "Repeats weekly";
  if (goal.repeat === "monthly") return "Repeats monthly";
  if (goal.repeat === "yearly") return "Repeats yearly";
  if (goal.repeat === "custom") {
    const unitMap = { day: "days", week: "weeks", month: "months", year: "years" };
    return `Repeats every ${goal.repeatInterval} ${unitMap[goal.repeatUnit] || "days"}`;
  }
  return "One time";
}

function formatDate(value) {
  const date = value instanceof Date ? value : dateFromIso(value);
  if (!date) return "No due date";
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const sample = new Date();
  sample.setHours(hours || 0, minutes || 0, 0, 0);
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(sample);
}

function getFilteredGoals() {
  const { start, end } = getFilterRange();
  const statusFilter = elements.goalListStatus.value;
  const range = elements.goalListRange.value;

  return [...state.goals]
    .sort(sortGoals)
    .filter((goal) => {
      if (range === "planned") {
        return isPlannedGoalForDate(goal, getToday());
      }
      if (!start || !end) return true;
      return goalRelevantToPeriod(goal, start, end);
    })
    .filter((goal) => matchesStatusFilter(goal, statusFilter, start, end));
}

function matchesStatusFilter(goal, filter, start, end) {
  if (filter === "all") return true;
  if (filter === "not-completed") {
    const occurrenceDate = firstOccurrenceWithin(goal, start, end) || getToday();
    return getGoalStateForDate(goal, occurrenceDate).status !== "completed";
  }
  if (filter === "due-not-completed") {
    return isDueAndNotCompletedGoal(goal, getToday());
  }
  const occurrenceDate = firstOccurrenceWithin(goal, start, end) || getToday();
  return getGoalStateForDate(goal, occurrenceDate).status === filter;
}

function sortGoals(left, right) {
  const leftDate = dateFromIso(left.dueDate);
  const rightDate = dateFromIso(right.dueDate);

  if (leftDate && rightDate && leftDate.getTime() !== rightDate.getTime()) {
    return leftDate - rightDate;
  }
  if (leftDate && !rightDate) return -1;
  if (!leftDate && rightDate) return 1;
  return left.title.localeCompare(right.title);
}

function selectedGoal() {
  return state.goals.find((goal) => goal.id === state.ui.selectedGoalId) || null;
}

function updateCustomRepeatVisibility() {
  elements.customRepeatWrap.hidden = elements.goalRepeat.value !== "custom";
}

function ensurePlannedGoalRangeOption() {
  if (!elements.goalListRange) {
    return;
  }

  const hasPlannedOption = Array.from(elements.goalListRange.options).some((optionNode) => optionNode.value === "planned");
  if (hasPlannedOption) {
    return;
  }

  const plannedOption = document.createElement("option");
  plannedOption.value = "planned";
  plannedOption.textContent = "Planned";
  elements.goalListRange.insertBefore(plannedOption, elements.goalListRange.querySelector('option[value="today"]') || null);
}

function ensureGoalStatusOptions() {
  if (!elements.goalListStatus) {
    return;
  }

  const currentValue = elements.goalListStatus.value || "all";
  const options = [
    { value: "all", label: "All" },
    { value: "not-completed", label: "Not completed" },
    { value: "not-started", label: "Not started" },
    { value: "in-progress", label: "In progress" },
    { value: "completed", label: "Completed" },
    { value: "due-not-completed", label: "Due and not completed" },
  ];

  elements.goalListStatus.innerHTML = options
    .map((optionNode) => `<option value="${optionNode.value}">${optionNode.label}</option>`)
    .join("");

  const nextValue = options.some((optionNode) => optionNode.value === currentValue) ? currentValue : "all";
  elements.goalListStatus.value = nextValue;
}

function renderProfile() {
  if (elements.todayLabel) {
    elements.todayLabel.textContent = formatLongDate(getToday());
  }

  if (elements.welcomeMessage) {
    const name = state.profile.profileName?.trim();
    elements.welcomeMessage.textContent = name ? `Welcome, ${name}` : "Welcome";
  }

  if (elements.accountUserName) {
    elements.accountUserName.value = state.profile.profileName || "";
  }

  if (elements.accountEmail) {
    elements.accountEmail.value = state.profile.email || "";
  }
}

async function updateAccountSettings(event) {
  event.preventDefault();

  if (!authEnabled()) {
    if (elements.accountMessage) {
      elements.accountMessage.textContent = "Supabase is not configured.";
    }
    return;
  }

  const userName = elements.accountUserName?.value.trim() || "";
  const email = elements.accountEmail?.value.trim() || "";
  const password = elements.accountPassword?.value || "";
  const confirmPassword = elements.accountPasswordConfirm?.value || "";
  const previousEmail = state.profile.email || "";

  if (elements.accountMessage) {
    elements.accountMessage.textContent = "";
  }

  if (!userName || !email) {
    elements.accountMessage.textContent = "Username and email are required.";
    return;
  }

  if (password && password !== confirmPassword) {
    elements.accountMessage.textContent = "Passwords do not match.";
    return;
  }

  const payload = {
    data: {
      user_name: userName,
    },
  };

  if (email !== previousEmail) {
    payload.email = email;
  }

  if (password) {
    payload.password = password;
  }

  try {
    const { error } = await supabaseClient.auth.updateUser(payload);
    if (error) {
      elements.accountMessage.textContent = `Update error: ${error.message}`;
      return;
    }

    state.profile.profileName = userName;
    state.profile.email = email;
    saveState();
    render({ skipSave: true });

    if (elements.accountPassword) elements.accountPassword.value = "";
    if (elements.accountPasswordConfirm) elements.accountPasswordConfirm.value = "";

    elements.accountMessage.textContent =
      email !== previousEmail
        ? "Account updated. Check your email to confirm the new address."
        : "Account updated successfully.";
  } catch (error) {
    elements.accountMessage.textContent = "Could not update account settings.";
    console.error("Could not update account settings.", error);
  }
}

function updateHeaderVisibility() {
  if (!elements.plannerHeaderDetails || !elements.plannerHeaderToggle) {
    return;
  }

  const isCollapsed = state.ui.headerCollapsed;
  elements.plannerHeaderDetails.hidden = isCollapsed;
  elements.plannerHeaderToggle.textContent = isCollapsed ? "Show header" : "Hide header";
  elements.plannerHeaderToggle.setAttribute("aria-expanded", String(!isCollapsed));
}

function setMenuOpen(isOpen) {
  if (!elements.menuPanel || !elements.menuToggle) {
    return;
  }

  elements.menuPanel.hidden = !isOpen;
  elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function renderViewState() {
  elements.viewTabs.forEach((button) => {
    const isActive = button.dataset.viewTab === state.ui.activeView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  elements.viewPanels.forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== state.ui.activeView;
  });
}

function scrollToActiveView() {
  const activePanel = document.querySelector(`[data-view-panel="${state.ui.activeView}"]`);
  if (!activePanel) {
    return;
  }

  activePanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderGoalPicker() {
  const current = state.ui.selectedGoalId;
  const options = ['<option value="">Select a goal</option>']
    .concat(
      [...state.goals].sort(sortGoals).map((goal) => {
        const due = goal.dueDate ? ` - ${formatDate(goal.dueDate)}` : "";
        return `<option value="${goal.id}">${escapeHtml(goal.title)}${due}</option>`;
      }),
    )
    .join("");

  elements.goalPicker.innerHTML = options;
  elements.goalPicker.value = current;
}

function renderSelectedGoal() {
  const goal = selectedGoal();
  elements.updateGoalSection.hidden = false;
  elements.updateGoalForm.hidden = false;
  elements.subGoalSection.hidden = !goal;
  elements.updateGoalStatus.disabled = !goal;
  elements.updateGoalProgress.disabled = !goal;
  elements.updateGoalSubmitButton.disabled = !goal;
  elements.updateGoalDeleteButton.disabled = !goal;

  if (!goal) {
    elements.updateGoalStatus.value = "not-started";
    elements.updateGoalProgress.value = 0;
    elements.goalSubmitButton.textContent = "Save goal";
    elements.selectedSubGoalList.innerHTML = "";
    renderUpdateStatusButtons("not-started", true);
    return;
  }

  const currentOccurrenceDate = firstOccurrenceWithin(goal, getToday(), getToday()) || getToday();
  const currentState = getGoalStateForDate(goal, currentOccurrenceDate);
  elements.updateGoalStatus.value = currentState.status;
  elements.updateGoalProgress.value = currentState.progress;
  elements.goalSubmitButton.textContent = "Save goal";
  renderUpdateStatusButtons(currentState.status, false);
  renderSubGoals(goal);
}

function renderUpdateStatusButtons(activeStatus, disabled) {
  if (!elements.updateStatusButtons) {
    return;
  }

  elements.updateStatusButtons
    .querySelectorAll("button[data-update-status-action]")
    .forEach((buttonNode) => {
      if (!(buttonNode instanceof HTMLButtonElement)) {
        return;
      }

      buttonNode.disabled = disabled;
      buttonNode.classList.toggle("is-active", buttonNode.dataset.updateStatusAction === activeStatus);
    });
}

function renderSubGoals(goal) {
  if (!goal || !goal.subGoals.length) {
    elements.selectedSubGoalList.innerHTML =
      '<div class="empty-state">No sub-goals yet. Add one to break this plan into smaller steps.</div>';
    return;
  }

  const rows = goal.subGoals
    .slice()
    .sort(sortGoals)
    .map(
      (subGoal) => `
        <div class="subgoal-row">
          <div>${escapeHtml(subGoal.title)}</div>
          <div>${formatDate(subGoal.dueDate)}</div>
          <div>${statusLabel(subGoal.status)}</div>
          <div>
            <select class="status-select ${statusClass(subGoal.status)}" data-subgoal-id="${subGoal.id}" data-goal-id="${goal.id}">
              ${statusOptions(subGoal.status)}
            </select>
          </div>
        </div>
      `,
    )
    .join("");

  elements.selectedSubGoalList.innerHTML = `
    <div class="subgoal-table">
      <div class="subgoal-table-head">
        <span>Sub-goal</span>
        <span>Due date</span>
        <span>Status</span>
        <span>Action</span>
      </div>
      ${rows}
    </div>
  `;
}

function renderStats() {
  const today = getToday();
  const allGoals = state.goals;
  const todayGoals = getTodayOccurrenceGoals();
  const dueTodayGoals = getDueTodayGoalEntries(today);
  const dueTodayNotCompleted = dueTodayGoals.filter((entry) => entry.state.status !== "completed");
  const plannedGoals = allGoals.filter((goal) => isPlannedGoalForDate(goal, today));
  const dueNotCompleted = dueTodayNotCompleted;

  elements.totalGoals.textContent = String(plannedGoals.length);
  elements.todayGoals.textContent = String(dueTodayNotCompleted.length);
  elements.todayCompletedGoals.textContent = String(todayGoals.filter((entry) => entry.state.status === "completed").length);
  elements.todayInProgressGoals.textContent = String(todayGoals.filter((entry) => entry.state.status === "in-progress").length);
  elements.dueNotCompletedGoals.textContent = String(dueNotCompleted.length);

  setProgressCard(elements.dailyProgressValue, elements.dailyProgressFill, percentFromGoalStates(todayGoals));
  setProgressCard(
    elements.weeklyProgressValue,
    elements.weeklyProgressFill,
    percentFromGoalStates(
      allGoals
        .filter((goal) => goalRelevantToPeriod(goal, startOfWeek(today), endOfWeek(today)))
        .map((goal) => ({ goal, state: getGoalStateForPeriod(goal, startOfWeek(today), endOfWeek(today)) })),
    ),
  );
  setProgressCard(
    elements.yearlyProgressValue,
    elements.yearlyProgressFill,
    percentFromGoalStates(
      allGoals
        .filter((goal) => goalRelevantToPeriod(goal, startOfYear(today), endOfYear(today)))
        .map((goal) => ({ goal, state: getGoalStateForPeriod(goal, startOfYear(today), endOfYear(today)) })),
    ),
  );
}

function setProgressCard(labelNode, fillNode, percent) {
  labelNode.textContent = `${percent}%`;
  fillNode.style.width = `${percent}%`;
}

function renderGoalStatusButtons(goalId, currentStatus) {
  return [
    { value: "not-started", label: "Not started" },
    { value: "in-progress", label: "In progress" },
    { value: "completed", label: "Completed" },
  ]
    .map((item) => `
      <button
        type="button"
        class="status-chip ${item.value === currentStatus ? "is-active" : ""}"
        data-goal-status-action="${item.value}"
        data-goal-id="${goalId}"
        onclick="window.goalPlannerSetStatus && window.goalPlannerSetStatus('${goalId}', '${item.value}')"
      >
        ${item.label}
      </button>
    `)
    .join("");
}

function renderGoalList() {
  const goals = getFilteredGoals();
  const { start, end, label } = getFilterRange();
  const range = elements.goalListRange.value;
  elements.goalList.innerHTML = goals.length
    ? goals
      .map((goal) => {
          const occurrence = firstOccurrenceWithin(goal, start, end);
          const activityDate = getLatestHistoryDateInPeriod(goal, start, end);
          const occurrenceDate = range === "planned"
            ? (dateFromIso(goal.dueDate) || activityDate || getToday())
            : (occurrence || activityDate || getToday());
          const stateForDate = range === "planned"
            ? getGoalStateForDate(goal, getToday())
            : getGoalStateForPeriod(goal, occurrenceDate, occurrenceDate);
          const success = getSuccess(goal, occurrenceDate);
          const dateLabel = !goal.dueDate && range === "planned"
            ? "No due date"
            : `${formatDate(occurrenceDate)}${goal.time ? ` at ${escapeHtml(formatTime(goal.time))}` : ""}`;
          return `
            <article class="goal-list-card">
              <div class="goal-list-card__header">
                <div>
                  <h3 class="goal-list-card__title">${escapeHtml(goal.title)}</h3>
                  <p class="goal-list-card__date">${dateLabel}</p>
                </div>
                <span class="pill">${statusLabel(stateForDate.status)}</span>
              </div>
              <div class="goal-list-card__meta">
                <span class="goal-list-card__meta-item">Progress: ${stateForDate.progress}%</span>
                <span class="goal-list-card__meta-item">Success: ${success.text}</span>
                <span class="pill repeat-pill">${escapeHtml(getRepeatLabel(goal))}</span>
              </div>
              <p class="goal-list-card__notes">${escapeHtml(goal.notes || "No notes")}</p>
              <div class="goal-list-card__actions">
                <div class="status-chip-group">
                  ${renderGoalStatusButtons(goal.id, stateForDate.status)}
                </div>
                <button class="remove-btn" type="button" data-remove-goal="${goal.id}">Remove</button>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="empty-state">No goals found for ${label.toLowerCase()}.</div>`;

  if (elements.plannerStatusMessage && !elements.plannerStatusMessage.textContent) {
    setPlannerStatusMessage("Planner controls loaded.");
  }
}

function handleGoalListStatusAction(goalId, statusValue) {
  if (!goalId || !statusValue) return;

  const goal = state.goals.find((item) => item.id === goalId);
  if (!goal) {
    setPlannerStatusMessage("Goal action could not find that goal.", "error");
    return;
  }

  setPlannerStatusMessage(`Updating ${goal.title}...`);

  const { start, end } = getFilterRange();
  const occurrenceDate = firstOccurrenceWithin(goal, start, end) || getLatestHistoryDateInPeriod(goal, start, end) || getToday();
  if (setGoalStatusForOccurrence(goal, statusValue, occurrenceDate, { cancelledMessage: "Update cancelled." })) {
    setPlannerStatusMessage(`${goal.title} updated to ${statusLabel(statusValue)}.`, "success");
    render();
  }
}

function updateSelectedGoalFromForm() {
  const goal = selectedGoal();
  if (!goal) {
    setPlannerStatusMessage("Select a goal first before updating it.", "error");
    return;
  }

  setPlannerStatusMessage(`Updating ${goal.title}...`);
  const occurrenceDate = firstOccurrenceWithin(goal, getToday(), getToday()) || getToday();
  const nextStatus = normalizeStatus(elements.updateGoalStatus.value);
  const requestedProgress = clampNumber(elements.updateGoalProgress.value, 0, 100, 0);

  if (setGoalStatusForOccurrence(goal, nextStatus, occurrenceDate, {
    preferredProgress: requestedProgress,
    cancelledMessage: "Update cancelled.",
  })) {
    state.ui.selectedGoalId = goal.id;
    setPlannerStatusMessage(`${goal.title} updated to ${statusLabel(nextStatus)}.`, "success");
    render();
  }
}

function deleteSelectedGoalFromForm() {
  const goal = selectedGoal();
  if (!goal) {
    setPlannerStatusMessage("Select a goal first before deleting it.", "error");
    return;
  }

  const isRepeating = goal.repeat && goal.repeat !== "none";
  const confirmationMessage = isRepeating
    ? `Delete "${goal.title}" and all repeating occurrences?`
    : `Delete "${goal.title}"?`;

  if (!confirm(confirmationMessage)) {
    setPlannerStatusMessage("Delete cancelled.", "error");
    return;
  }

  state.goals = state.goals.filter((item) => item.id !== goal.id);
  state.ui.selectedGoalId = "";
  elements.homeActionMode.value = "create";
  setPlannerStatusMessage(
    isRepeating ? `${goal.title} and all occurrences were deleted.` : `${goal.title} was deleted.`,
    "success",
  );
  render();
}

function setSelectedGoalStatusAction(statusValue) {
  const goal = selectedGoal();
  if (!goal) {
    setPlannerStatusMessage("Select a goal first before updating it.", "error");
    return;
  }

  elements.updateGoalStatus.value = normalizeStatus(statusValue);
  renderUpdateStatusButtons(normalizeStatus(statusValue), false);

  if (statusValue === "completed") {
    elements.updateGoalProgress.value = 100;
  } else if (statusValue === "not-started") {
    elements.updateGoalProgress.value = 0;
  } else if (Number(elements.updateGoalProgress.value) <= 0) {
    elements.updateGoalProgress.value = 50;
  }

  updateSelectedGoalFromForm();
}

function setGoalStatusForOccurrence(goal, statusValue, occurrenceDate, options = {}) {
  const nextStatus = normalizeStatus(statusValue);
  const previousState = getGoalStateForDate(goal, occurrenceDate);
  let nextProgress = options.preferredProgress ?? previousState.progress;

  if (nextStatus === "completed") {
    nextProgress = 100;
  } else if (nextStatus === "not-started") {
    nextProgress = 0;
  } else if (nextProgress <= 0) {
    const requestedProgress = requestProgressValue(previousState.progress || goal.progress || 50);
    if (requestedProgress === null) {
      setPlannerStatusMessage(options.cancelledMessage || "Update cancelled.", "error");
      render({ keepTimestamp: true, skipSave: true });
      return false;
    }
    nextProgress = requestedProgress;
  }

  applyGoalStatusChange(goal, nextStatus, nextProgress, occurrenceDate);
  return true;
}

if (typeof window !== "undefined") {
  window.goalPlannerSetStatus = handleGoalListStatusAction;
  window.goalPlannerApplySelectedStatus = updateSelectedGoalFromForm;
  window.goalPlannerDeleteSelectedGoal = deleteSelectedGoalFromForm;
  window.goalPlannerSetSelectedStatus = setSelectedGoalStatusAction;
}

function renderReports() {
  const range = elements.reportRange.value;
  const periods = buildReportPeriods(range);
  if (!periods.length) {
    elements.reportPeriod.innerHTML = '<option value="">No periods</option>';
    renderEmptyReport();
    return;
  }

  const currentValue = state.ui.reportPeriod;
  const activeValue = getActivePeriodValue(range, periods);
  if (!currentValue || !periods.some((period) => period.value === currentValue)) {
    state.ui.reportPeriod = activeValue || periods[periods.length - 1].value;
  }

  elements.reportPeriod.innerHTML = periods
    .map((period) => `<option value="${period.value}">${escapeHtml(period.label)}</option>`)
    .join("");
  elements.reportPeriod.value = state.ui.reportPeriod;

  const selected = periods.find((period) => period.value === state.ui.reportPeriod) || periods[periods.length - 1];
  // const { completed, inProgress, notStarted, total, percent } = summarizeGoalsForPeriod(selected.start, selected.end);
  const selectedReportGoal = document.getElementById("reportGoal")?.value || "all";
  const { completed, inProgress, notStarted, total, percent } =
  summarizeGoalsForPeriod(selected.start, selected.end, selectedReportGoal);

  elements.dailyStatusCaption.textContent = selected.label;
  elements.dailyDonutValue.textContent = total ? `${percent}%` : "0%";
  const donutColor = completed > 0 && completed === total ? "var(--success)" : "var(--accent)";
  elements.dailyDonut.style.background = `conic-gradient(${donutColor} ${percent * 3.6}deg, rgba(255,255,255,0.1) 0deg)`;
  elements.dailyStatusLegend.innerHTML = [
    legendItem("Completed", completed, "#56d6a2"),
    legendItem("In progress", inProgress, "#ffcc66"),
    legendItem("Not started", notStarted, "#ff7d7d"),
  ].join("");

  const trendBars = buildTrendBars(range);
  elements.chartCaption.textContent =
    range === "day"
      ? "Daily view"
      : range === "week"
        ? "Weekly view"
        : range === "month"
          ? "Monthly view"
          : "Yearly view";
  elements.trendChart.innerHTML = trendBars.join("");
  renderCompletedReportList(selected.start, selected.end, selected.label, selectedReportGoal);
}

function getCompletedGoalsForPeriod(start, end, selectedReportGoal = "all") {
  return getGoalsForReportPeriod(start, end, selectedReportGoal)
    .filter((goal) => getGoalStateForPeriod(goal, start, end).status === "completed")
    .sort(sortGoals);
}

function renderCompletedReportList(start, end, label, selectedReportGoal = "all") {
  if (!elements.completedReportList || !elements.completedReportCaption) {
    return;
  }

  const completedGoals = getCompletedGoalsForPeriod(start, end, selectedReportGoal);
  elements.completedReportCaption.textContent = label;

  elements.completedReportList.innerHTML = completedGoals.length
    ? completedGoals
        .map((goal) => `
          <article class="completed-report-item">
            <div>
              <strong>${escapeHtml(goal.title)}</strong>
              <div class="goal-table-notes">${escapeHtml(goal.notes || "Completed in this period")}</div>
            </div>
            <div class="completed-report-meta">
              <span class="pill">${escapeHtml(formatDate(goal.dueDate))}</span>
              <span class="pill repeat-pill">${escapeHtml(getRepeatLabel(goal))}</span>
            </div>
          </article>
        `)
        .join("")
    : '<div class="empty-state">No completed goals in this period.</div>';
}

function buildReportPeriods(range) {
  const { startDate, endDate } = getReportDateBounds();

  if (range === "day") {
    const periods = [];
    for (let date = new Date(startDate); !isAfterDay(date, endDate); date = addDays(date, 1)) {
      periods.push({
        value: toIsoDate(date),
        label: formatLongDate(date),
        start: new Date(date),
        end: new Date(date),
      });
    }
    return periods;
  }

  if (range === "week") {
    const periods = [];
    for (
      let date = startOfWeek(startDate);
      !isAfterDay(date, endDate);
      date = addDays(date, 7)
    ) {
      const start = startOfWeek(date);
      const end = endOfWeek(date);
      periods.push({
        value: `${toIsoDate(start)}-week`,
        label: `${formatDate(start)} to ${formatDate(end)}`,
        start,
        end,
      });
    }
    return periods;
  }

  if (range === "month") {
    const periods = [];
    for (
      let date = startOfMonth(startDate);
      !isAfterDay(date, endDate);
      date = addMonths(date, 1)
    ) {
      periods.push({
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        label: new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" }).format(date),
        start: startOfMonth(date),
        end: endOfMonth(date),
      });
    }
    return periods;
  }

  const periods = [];
  for (
    let date = startOfYear(startDate);
    !isAfterDay(date, endDate);
    date = addYears(date, 1)
  ) {
    periods.push({
      value: `${date.getFullYear()}`,
      label: `${date.getFullYear()}`,
      start: startOfYear(date),
      end: endOfYear(date),
    });
  }
  return periods;
}

function getReportDateBounds() {
  const today = getToday();
  const goalDates = state.goals
    .flatMap((goal) => [goal.dueDate, ...(goal.subGoals || []).map((subGoal) => subGoal.dueDate)])
    .map(dateFromIso)
    .filter(Boolean)
    .sort((left, right) => left - right);

  if (!goalDates.length) {
    return { startDate: today, endDate: today };
  }

  const firstGoalDate = goalDates[0];
  const lastGoalDate = goalDates[goalDates.length - 1];
  return {
    startDate: isAfterDay(firstGoalDate, today) ? today : firstGoalDate,
    endDate: isAfterDay(today, lastGoalDate) ? today : lastGoalDate,
  };
}

function getActivePeriodValue(range, periods) {
  const today = getToday();
  const active = periods.find((period) => !isAfterDay(period.start, today) && !isAfterDay(today, period.end));
  return active?.value || "";
}

function buildTrendBars(range) {
  const periods = buildReportPeriods(range);
  return periods.map((period) => {
    const selectedReportGoal = document.getElementById("reportGoal")?.value || "all";
    const { total, percent } = summarizeGoalsForPeriod(
      period.start,
      period.end,
      selectedReportGoal
);
    const barClass = percent >= 80 ? "good" : percent >= 40 ? "mid" : "low";
    const shortLabel =
      range === "day"
        ? new Intl.DateTimeFormat("en-CA", { weekday: "short" }).format(period.start)
        : range === "week"
          ? new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric" }).format(period.start)
          : range === "month"
            ? new Intl.DateTimeFormat("en-CA", { month: "short" }).format(period.start)
            : period.label;
    const dateLabel =
      range === "year"
        ? period.label
        : new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric" }).format(period.start);

    return `
      <div class="chart-col">
        <div class="chart-value">${percent}%</div>
        <div class="chart-bar-wrap">
          ${total
            ? `<div class="chart-bar ${barClass}" style="height:${Math.max(8, percent)}%"></div>`
            : '<div class="chart-empty">No data</div>'}
        </div>
        <div class="chart-name">${escapeHtml(shortLabel)}</div>
        <div class="chart-date">${escapeHtml(dateLabel)}</div>
      </div>
    `;
  });
}

function requestProgressValue(currentValue = 0) {
  const fallbackValue = clampNumber(currentValue, 0, 100, 0);
  const response = window.prompt("Enter progress percentage (1 to 99)", String(fallbackValue || 50));

  if (response === null) {
    return null;
  }

  const parsedValue = Number(response);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0 || parsedValue >= 100) {
    window.alert("Please enter a number from 1 to 99.");
    return null;
  }

  return clampNumber(parsedValue, 1, 99, fallbackValue || 50);
}

function renderEmptyReport() {
  elements.dailyStatusCaption.textContent = "Today";
  elements.dailyDonutValue.textContent = "0%";
  elements.dailyDonut.style.background = "conic-gradient(var(--accent) 0deg, rgba(255,255,255,0.1) 0deg)";
  elements.dailyStatusLegend.innerHTML = [
    legendItem("Completed", 0, "#56d6a2"),
    legendItem("In progress", 0, "#ffcc66"),
    legendItem("Not started", 0, "#ff7d7d"),
  ].join("");
  elements.chartCaption.textContent = "Daily view";
  elements.trendChart.innerHTML = '<div class="empty-state">No data yet.</div>';
  if (elements.completedReportCaption) {
    elements.completedReportCaption.textContent = "Today";
  }
  if (elements.completedReportList) {
    elements.completedReportList.innerHTML = '<div class="empty-state">No completed goals yet.</div>';
  }
}

function legendItem(label, value, color) {
  return `
    <div class="legend-item">
      <span class="legend-label"><span class="legend-dot" style="background:${color}"></span>${escapeHtml(label)}</span>
      <span class="legend-value">${value}</span>
    </div>
  `;
}

function statusClass(status) {
  return `status-select--${status}`;
}

function statusLabel(status) {
  if (status === "completed") return "Completed";
  if (status === "in-progress") return "In progress";
  return "Not started";
}

function statusOptions(selected) {
  return [
    { value: "not-started", label: "Not started" },
    { value: "in-progress", label: "In progress" },
    { value: "completed", label: "Completed" },
  ]
    .map((item) => `<option value="${item.value}"${item.value === selected ? " selected" : ""}>${item.label}</option>`)
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function render(options = {}) {
  state.goals.forEach(syncGoalFromSubGoals);
  renderProfile();
  updateHeaderVisibility();
  renderViewState();
  renderGoalPicker();
  renderSelectedGoal();
  renderStats();
  renderGoalList();
  populateReportGoalDropdown(); 
  renderReports();
  updateTableVisibility();
  updateCalendarVisibility();

  if (!options.skipSave) {
    saveState({ keepTimestamp: options.keepTimestamp });
  }
}
function populateReportGoalDropdown() {
  const reportGoal = document.getElementById("reportGoal");
  if (!reportGoal) return;

  const currentValue = reportGoal.value || "all";

  reportGoal.innerHTML = '<option value="all">All goals</option>';

  state.goals.forEach((goal) => {
    const option = document.createElement("option");
    option.value = goal.id;
    option.textContent = goal.dueDate
      ? `${goal.title} - ${new Date(goal.dueDate).toLocaleDateString()}`
      : goal.title;

    reportGoal.appendChild(option);
  });

  const stillExists =
    currentValue === "all" || state.goals.some((goal) => goal.id === currentValue);

  reportGoal.value = stillExists ? currentValue : "all";
}
function updateTableVisibility() {
  elements.goalTableWrap.hidden = state.ui.goalListCollapsed;
  elements.toggleGoalTableButton.textContent = state.ui.goalListCollapsed ? "Expand list" : "Collapse list";
  elements.toggleGoalTableButton.setAttribute("aria-expanded", String(!state.ui.goalListCollapsed));
}

function updateCalendarVisibility() {
  ensurePlannedGoalRangeOption();
  ensureGoalStatusOptions();
  elements.goalListCalendarWrap.hidden = elements.goalListRange.value !== "calendar";
}

function handleGoalListStatusChange(target) {
  if (!(target instanceof HTMLSelectElement)) return;

  const goalId = target.dataset.goalId;
  const subGoalId = target.dataset.subgoalId;

  if (goalId && subGoalId) {
    const goal = state.goals.find((item) => item.id === goalId);
    const subGoal = goal?.subGoals.find((item) => item.id === subGoalId);
    if (!subGoal || !goal) return;

    subGoal.status = normalizeStatus(target.value);
    syncGoalFromSubGoals(goal);
    recordGoalHistory(goal);
    render();
    return;
  }

  if (!goalId) return;
  const goal = state.goals.find((item) => item.id === goalId);
  if (!goal) return;

  const { start, end } = getFilterRange();
  const occurrenceDate = firstOccurrenceWithin(goal, start, end) || getLatestHistoryDateInPeriod(goal, start, end) || getToday();
  const previousState = getGoalStateForDate(goal, occurrenceDate);
  const nextStatus = normalizeStatus(target.value);
  let nextProgress = previousState.progress;

  if (nextStatus === "completed") {
    nextProgress = 100;
  } else if (nextStatus === "not-started") {
    nextProgress = 0;
  } else {
    const requestedProgress = requestProgressValue(previousState.progress || goal.progress || 50);
    if (requestedProgress === null) {
      target.value = previousState.status;
      render({ keepTimestamp: true, skipSave: true });
      return;
    }
    nextProgress = requestedProgress;
  }

  applyGoalStatusChange(goal, nextStatus, nextProgress, occurrenceDate);
  render();
}

function wireEvents() {
  elements.signupButton?.addEventListener("click", signUpUser);
  elements.loginButton?.addEventListener("click", loginUser);
  elements.accountShortcutButton?.addEventListener("click", () => {
    state.ui.activeView = "account";
    setMenuOpen(false);
    render({ keepTimestamp: true });
    scrollToActiveView();
  });
  elements.logoutButton?.addEventListener("click", logoutUser);
  elements.accountForm?.addEventListener("submit", updateAccountSettings);
  elements.plannerHeaderToggle?.addEventListener("click", () => {
    state.ui.headerCollapsed = !state.ui.headerCollapsed;
    render({ keepTimestamp: true });
  });
  elements.menuToggle?.addEventListener("click", () => {
    const isOpen = elements.menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });


  elements.homeActionMode.addEventListener("change", () => {
    if (elements.homeActionMode.value === "update") {
      render({ keepTimestamp: true, skipSave: true });
      elements.updateGoalSection.scrollIntoView({ behavior: "smooth", block: "start" });
      elements.goalPicker.focus();
      return;
    }

    state.ui.selectedGoalId = "";
    render({ keepTimestamp: true });
    focusGoalTitleField();
  });

  elements.homeActionMode.addEventListener("click", () => {
    if (elements.homeActionMode.value === "create") {
      state.ui.selectedGoalId = "";
      render({ keepTimestamp: true, skipSave: true });
      focusGoalTitleField();
    }
  });

  elements.viewTabs.forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.activeView = button.dataset.viewTab;
      setMenuOpen(false);
      render({ keepTimestamp: true });
      scrollToActiveView();
    });
  });

  elements.goalPicker.addEventListener("change", () => {
    if (elements.goalPicker.value) {
      elements.homeActionMode.value = "update";
    }
    state.ui.selectedGoalId = elements.goalPicker.value;
    render({ keepTimestamp: true });
  });

  elements.goalRepeat.addEventListener("change", updateCustomRepeatVisibility);
  elements.updateGoalStatus?.addEventListener("change", () => {
    const goal = selectedGoal();
    const previousStatus = goal?.status || "not-started";
    const previousProgress = goal?.progress || 0;

    if (elements.updateGoalStatus.value !== "in-progress") {
      if (elements.updateGoalStatus.value === "completed") {
        elements.updateGoalProgress.value = 100;
      }
      if (elements.updateGoalStatus.value === "not-started") {
        elements.updateGoalProgress.value = 0;
      }
      return;
    }

    const requestedProgress = requestProgressValue(Number(elements.updateGoalProgress.value) || 50);
    if (requestedProgress === null) {
      elements.updateGoalStatus.value = previousStatus;
      elements.updateGoalProgress.value = previousProgress;
      return;
    }

    elements.updateGoalProgress.value = requestedProgress;
  });

  elements.goalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const payload = {
      title: elements.goalTitle.value.trim(),
      dueDate: elements.goalDate.value,
      time: elements.goalTime.value,
      notes: elements.goalNotes.value.trim(),
      repeat: elements.goalRepeat.value,
      repeatInterval: clampNumber(elements.goalRepeatInterval.value, 1, 999, 1),
      repeatUnit: elements.goalRepeatUnit.value,
      updatedAt: new Date().toISOString(),
    };

    if (!payload.title) return;

    if (payload.repeat !== "custom") {
      payload.repeatInterval = 1;
      payload.repeatUnit = "day";
    }

    const createdGoal = normalizeGoal({
      ...payload,
      status: "not-started",
      progress: 0,
      createdAt: new Date().toISOString(),
    });
    state.goals.push(createdGoal);

    elements.goalForm.reset();
    elements.goalRepeat.value = "none";
    elements.goalRepeatInterval.value = 2;
    elements.goalRepeatUnit.value = "day";
    updateCustomRepeatVisibility();
    elements.goalListRange.value = "today";
    elements.goalListStatus.value = "all";
    setPlannerStatusMessage(`${createdGoal.title} saved as a new goal.`, "success");
    render();
  });

  elements.updateGoalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateSelectedGoalFromForm();
  });

  elements.updateGoalSubmitButton?.addEventListener("click", () => {
    updateSelectedGoalFromForm();
  });

  elements.updateGoalDeleteButton?.addEventListener("click", () => {
    deleteSelectedGoalFromForm();
  });

  elements.subGoalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const goal = selectedGoal();
    if (!goal) return;

    const title = elements.subGoalTitle.value.trim();
    const dueDate = elements.subGoalDate.value;
    if (!title || !dueDate) return;

    goal.subGoals.push({
      id: makeId(),
      title,
      dueDate,
      status: "not-started",
      createdAt: new Date().toISOString(),
    });
    syncGoalFromSubGoals(goal);
    recordGoalHistory(goal);
    elements.subGoalForm.reset();
    render();
  });

  elements.goalListRange.addEventListener("change", () => {
    updateCalendarVisibility();
    render({ keepTimestamp: true, skipSave: true });
  });

  elements.goalListCalendarDate.addEventListener("change", () => render({ keepTimestamp: true, skipSave: true }));
  elements.goalListStatus.addEventListener("change", () => render({ keepTimestamp: true, skipSave: true }));

  elements.toggleGoalList.addEventListener("click", () => {
    state.ui.activeView = "goals";
    state.ui.goalListCollapsed = false;
    ensurePlannedGoalRangeOption();
    elements.goalListRange.value = "planned";
    elements.goalListStatus.value = "all";
    updateCalendarVisibility();
    render({ keepTimestamp: true, skipSave: true });
    document.getElementById("allGoalsSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.toggleGoalTableButton.addEventListener("click", () => {
    state.ui.goalListCollapsed = !state.ui.goalListCollapsed;
    render({ keepTimestamp: true, skipSave: true });
  });

  elements.resetButton.addEventListener("click", () => {
    if (!confirm("Reset all goals?")) return;
    state.goals = [];
    state.ui.selectedGoalId = "";
    render();
  });

  elements.goalList.addEventListener("change", (event) => {
    handleGoalListStatusChange(event.target);
  });

  elements.goalList.addEventListener("input", (event) => {
    handleGoalListStatusChange(event.target);
  });

  elements.goalList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const statusButton = target.closest("button[data-goal-status-action][data-goal-id]");
    if (statusButton instanceof HTMLButtonElement) {
      handleGoalListStatusAction(statusButton.dataset.goalId, statusButton.dataset.goalStatusAction);
      return;
    }

    const removeButton = target.closest("button[data-remove-goal]");
    if (!(removeButton instanceof HTMLButtonElement)) return;

    state.goals = state.goals.filter((goal) => goal.id !== removeButton.dataset.removeGoal);
    if (state.ui.selectedGoalId === removeButton.dataset.removeGoal) {
      state.ui.selectedGoalId = "";
    }
    render();
  });

  document.querySelectorAll("[data-target='allGoalsSection']").forEach((button) => {
    if (button.id === "toggleGoalList") {
      return;
    }
    button.addEventListener("click", () => {
      state.ui.activeView = "goals";
      const range = button.getAttribute("data-range");
      const status = button.getAttribute("data-status");
      state.ui.goalListCollapsed = false;
      if (range) elements.goalListRange.value = range;
      elements.goalListStatus.value = status || "all";
      updateCalendarVisibility();
      render({ keepTimestamp: true, skipSave: true });
      document.getElementById("allGoalsSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  elements.reportRange.addEventListener("change", () => {
    state.ui.activeView = "report";
    state.ui.reportRange = elements.reportRange.value;
    state.ui.reportPeriod = "";
    render({ keepTimestamp: true, skipSave: true });
  });

  elements.reportPeriod.addEventListener("change", () => {
    state.ui.activeView = "report";
    state.ui.reportPeriod = elements.reportPeriod.value;
    render({ keepTimestamp: true, skipSave: true });
  });
  document.getElementById("reportGoal")?.addEventListener("change", () => {
  render({ keepTimestamp: true, skipSave: true });
});
}
function recordGoalHistoryForDate(goal, date) {
  if (!goal) return;

  if (!Array.isArray(goal.history)) {
    goal.history = [];
  }

  // Use local noon to prevent UTC offset from rolling the date to the wrong day
  // when the entry is later read back and normalized in getHistoryEntriesForPeriod.
  const localNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);

  goal.history.push({
    date: localNoon.toISOString(),
    status: goal.status,
    progress: goal.progress
  });

  goal.history = goal.history.slice(-120);
}