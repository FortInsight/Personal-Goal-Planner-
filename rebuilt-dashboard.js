const SUPABASE_URL = "https://atdrcseaofseybsorhhr.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_buo26QzG4HoNSL2Q03etaw_B4H4DvO8";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
// async function login(email) {
//   const { data, error } = await supabase.auth.signInWithOtp({
//     email: email,
//   });

//   if (error) {
//     alert("Login error: " + error.message);
//   } else {
//     alert("Check your email for login link!");
//   }
// }

//   button.disabled = false;
//   button.textContent = "Send login link";
// }
// const STORAGE_KEY = "personal-daily-goals-v2";

// const defaultState = {
//   goals: [],
//   completions: [],
//   profile: {
//     name: ""
//   }
// };

async function login(email) {
  const message = document.getElementById("authMessage");
  const button = document.getElementById("loginButton");

  if (!supabaseClient) {
    message.textContent = "Supabase not configured.";
    return;
  }

  message.textContent = "";
  button.disabled = true;
  button.textContent = "Sending...";

  if (!email) {
    message.textContent = "Please enter your email.";
    button.disabled = false;
    button.textContent = "Send login link";
    return;
  }

  const { error } = await supabaseClient.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: "https://fortinsight.com/goal.html"
    }
  });

  if (error) {
    message.textContent = "Error: " + error.message;
  } else {
    message.textContent = "Login link sent. Check your email.";
  }

  button.disabled = false;
  button.textContent = "Send login link";
}
const STORAGE_KEY = "personal-goals-dashboard-rebuilt-v3";

const $ = (id) => document.getElementById(id);

const elements = {
  viewTabs: Array.from(document.querySelectorAll("[data-view-tab]")),
  viewPanels: Array.from(document.querySelectorAll("[data-view-panel]")),
  profileForm: $("profileForm"),
  profileName: $("profileName"),
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
  updateGoalTitle: $("updateGoalTitle"),
  updateGoalStatus: $("updateGoalStatus"),
  updateGoalProgress: $("updateGoalProgress"),
  updateGoalSubmitButton: $("updateGoalSubmitButton"),
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
};

const defaultProfile = {
  profileName: "",
};

function getFreshState() {
  return {
    profile: { ...defaultProfile },
    goals: [],
    ui: {
      activeView: "home",
      selectedGoalId: "",
      goalListCollapsed: false,
      reportRange: "day",
      reportPeriod: "",
    },
    meta: {
      updatedAt: new Date().toISOString(),
    },
  };
}

const state = loadState();

initialize();

function initialize() {
  state.ui.activeView = "home";
  elements.goalListCalendarDate.value = toIsoDate(getToday());
  elements.reportRange.value = state.ui.reportRange || "day";
  updateCustomRepeatVisibility();
  updateCalendarVisibility();
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
  if (!["home", "goals", "report"].includes(next.ui.activeView)) {
    next.ui.activeView = "home";
  }

  return { ...fallback, ...next };
}

function saveState(options = {}) {
  state.meta.updatedAt = options.keepTimestamp ? state.meta.updatedAt : new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Could not save planner data.", error);
  }
}

function registerPwa() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.error("Service worker registration failed.", error);
      });
    });
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

function getGoalStateForPeriod(goal, start, end) {
  const entries = getHistoryEntriesForPeriod(goal, start, end);

  if (!entries.length) {
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


function summarizeGoalsForPeriod(start, end, selectedReportGoal = "all") {
  let scheduledGoals = state.goals.filter((goal) => goalOccursWithin(goal, start, end));
  if (selectedReportGoal !== "all") {
  scheduledGoals = scheduledGoals.filter(goal => goal.id === selectedReportGoal);
}
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

  return [...state.goals]
    .sort(sortGoals)
    .filter((goal) => goalOccursWithin(goal, start, end))
    .filter((goal) => matchesStatusFilter(goal, statusFilter));
}

function matchesStatusFilter(goal, filter) {
  if (filter === "all") return true;
  if (filter === "due-not-completed") {
    const today = getToday();
    const dueDate = dateFromIso(goal.dueDate);
    return Boolean(dueDate && !isAfterDay(dueDate, today) && goal.status !== "completed");
  }
  return goal.status === filter;
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

function renderProfile() {
  elements.profileName.value = state.profile.profileName || "";
  elements.todayLabel.textContent = formatLongDate(getToday());
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
  const isUpdateMode = elements.homeActionMode.value === "update";
  elements.updateGoalSection.hidden = !isUpdateMode;
  elements.updateGoalForm.hidden = !isUpdateMode;
  elements.subGoalSection.hidden = !goal;
  elements.updateGoalStatus.disabled = !goal;
  elements.updateGoalProgress.disabled = !goal;
  elements.updateGoalSubmitButton.disabled = !goal;

  if (!goal) {
    elements.goalTitle.value = "";
    elements.goalDate.value = "";
    elements.updateGoalTitle.value = "";
    elements.goalTime.value = "";
    elements.goalNotes.value = "";
    elements.goalRepeat.value = "none";
    elements.goalRepeatInterval.value = 2;
    elements.goalRepeatUnit.value = "day";
    elements.updateGoalStatus.value = "not-started";
    elements.updateGoalProgress.value = 0;
    elements.goalSubmitButton.textContent = "Save goal";
    elements.selectedSubGoalList.innerHTML = "";
    updateCustomRepeatVisibility();
    return;
  }

  elements.goalTitle.value = goal.title;
  elements.updateGoalTitle.value = goal.title;
  elements.goalDate.value = goal.dueDate;
  elements.goalTime.value = goal.time || "";
  elements.goalNotes.value = goal.notes || "";
  elements.goalRepeat.value = goal.repeat || "none";
  elements.goalRepeatInterval.value = goal.repeatInterval || 2;
  elements.goalRepeatUnit.value = goal.repeatUnit || "day";
  elements.updateGoalStatus.value = goal.status;
  elements.updateGoalProgress.value = goal.progress;
  elements.goalSubmitButton.textContent = "Save changes";
  updateCustomRepeatVisibility();
  renderSubGoals(goal);
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
  const todayGoals = allGoals.filter((goal) => goalOccursWithin(goal, today, today));
  const dueNotCompleted = allGoals.filter((goal) => {
    const dueDate = dateFromIso(goal.dueDate);
    return dueDate && !isAfterDay(dueDate, today) && goal.status !== "completed";
  });

  elements.totalGoals.textContent = String(allGoals.length);
  elements.todayGoals.textContent = String(todayGoals.length);
  elements.todayCompletedGoals.textContent = String(todayGoals.filter((goal) => goal.status === "completed").length);
  elements.todayInProgressGoals.textContent = String(todayGoals.filter((goal) => goal.status === "in-progress").length);
  elements.dueNotCompletedGoals.textContent = String(dueNotCompleted.length);

  setProgressCard(elements.dailyProgressValue, elements.dailyProgressFill, percentFromGoals(todayGoals));
  setProgressCard(
    elements.weeklyProgressValue,
    elements.weeklyProgressFill,
    percentFromGoals(allGoals.filter((goal) => goalOccursWithin(goal, startOfWeek(today), endOfWeek(today)))),
  );
  setProgressCard(
    elements.yearlyProgressValue,
    elements.yearlyProgressFill,
    percentFromGoals(allGoals.filter((goal) => goalOccursWithin(goal, startOfYear(today), endOfYear(today)))),
  );
}

function percentFromGoals(goals) {
  if (!goals.length) return 0;
  const completed = goals.filter((goal) => goal.status === "completed").length;
  return Math.round((completed / goals.length) * 100);
}

function setProgressCard(labelNode, fillNode, percent) {
  labelNode.textContent = `${percent}%`;
  fillNode.style.width = `${percent}%`;
}

function renderGoalList() {
  const goals = getFilteredGoals();
  const { start, end, label } = getFilterRange();
  elements.goalList.innerHTML = goals.length
    ? goals
        .map((goal) => {
          const occurrence = firstOccurrenceWithin(goal, start, end);
          const occurrenceDate = occurrence || getToday();
          const stateForDate = getGoalStateForPeriod(goal, occurrenceDate, occurrenceDate);
          const success = getSuccess(goal, occurrenceDate);
          return `
            <article class="goal-table-row">
              <div class="goal-table-cell goal-table-title">${escapeHtml(goal.title)}</div>
              <div class="goal-table-cell">
                ${occurrence ? formatDate(occurrence) : formatDate(goal.dueDate)}
                ${goal.time ? `<div class="goal-table-notes">${escapeHtml(formatTime(goal.time))}</div>` : ""}
              </div>
              <div class="goal-table-cell"><span class="pill">${statusLabel(stateForDate.status)}</span></div>
              <div class="goal-table-cell">${stateForDate.progress}%</div>
              <div class="goal-table-cell">${success.text}</div>
              <div class="goal-table-cell"><span class="pill repeat-pill">${escapeHtml(getRepeatLabel(goal))}</span></div>
              <div class="goal-table-cell goal-table-notes">${escapeHtml(goal.notes || "No notes")}</div>
              <div class="goal-table-cell">
                <div class="goal-actions">
                  <select class="status-select ${statusClass(stateForDate.status)}" data-goal-id="${goal.id}">
                    ${statusOptions(stateForDate.status)}
                  </select>
                  <button class="remove-btn" type="button" data-remove-goal="${goal.id}">Remove</button>
                </div>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="empty-state">No goals found for ${label.toLowerCase()}.</div>`;
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

    return `
      <div class="chart-col">
        <div class="chart-value">${percent}%</div>
        <div class="chart-bar-wrap">
          ${total
            ? `<div class="chart-bar ${barClass}" style="height:${Math.max(8, percent)}%"></div>`
            : '<div class="chart-empty">No data</div>'}
        </div>
        <div class="chart-name">${escapeHtml(shortLabel)}</div>
      </div>
    `;
  });
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
  elements.goalListCalendarWrap.hidden = elements.goalListRange.value !== "calendar";
}

function wireEvents() {
  elements.profileForm.addEventListener("input", () => {
    state.profile = {
      profileName: elements.profileName.value.trim(),
    };
    render();
  });
  document.getElementById("loginButton")?.addEventListener("click", () => {
  const email = document.getElementById("email")?.value || "";
  login(email);
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
      render({ keepTimestamp: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  elements.goalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const goal = selectedGoal();
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

    if (goal) {
      Object.assign(goal, payload);
      recordGoalHistory(goal);
    } else {
      const createdGoal = normalizeGoal({
        ...payload,
        status: "not-started",
        progress: 0,
        createdAt: new Date().toISOString(),
      });
      state.goals.push(createdGoal);
    }

    state.ui.selectedGoalId = "";
    elements.goalListRange.value = "all";
    elements.goalListStatus.value = "all";
    render();
  });

  elements.updateGoalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const goal = selectedGoal();
    if (!goal) return;
    const newTitle = elements.updateGoalTitle.value.trim();
    if (newTitle) {
      goal.title = newTitle;
}
    

    goal.status = normalizeStatus(elements.updateGoalStatus.value);
    goal.progress = clampNumber(elements.updateGoalProgress.value, 0, 100, 0);
    if (goal.status === "completed") goal.progress = 100;
    if (goal.status === "not-started") goal.progress = 0;
    goal.updatedAt = new Date().toISOString();
    recordGoalHistory(goal);
    state.ui.selectedGoalId = goal.id;
    render();
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
    const target = event.target;
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
    const occurrenceDate = firstOccurrenceWithin(goal, getFilterRange().start, getFilterRange().end) || getToday();
goal.status = normalizeStatus(target.value);
goal.progress = goal.status === "completed" ? 100 : goal.status === "not-started" ? 0 : 50;
goal.updatedAt = new Date().toISOString();

recordGoalHistoryForDate(goal, occurrenceDate);

if (goal.status === "completed" && goal.repeat && goal.repeat !== "none") {
  const currentDueDate = dateFromIso(goal.dueDate) || getToday();

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

  goal.status = "not-started";
  goal.progress = 0;
}

render();
  });

  elements.goalList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.dataset.removeGoal) return;

    state.goals = state.goals.filter((goal) => goal.id !== target.dataset.removeGoal);
    if (state.ui.selectedGoalId === target.dataset.removeGoal) {
      state.ui.selectedGoalId = "";
    }
    render();
  });

  document.querySelectorAll("[data-target='allGoalsSection']").forEach((button) => {
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

  goal.history.push({
    date: date.toISOString(),
    status: goal.status,
    progress: goal.progress
  });

  goal.history = goal.history.slice(-120);
}