const STORAGE_KEY = "personal-daily-goals-v2";

const defaultState = {
  goals: [],
  completions: [],
  profile: {
    name: "",
    dailyReward: "",
    weeklyReward: "",
    monthlyReward: "",
    yearlyReward: ""
  }
};

const state = loadState();

const goalForm = document.getElementById("goalForm");
const updateGoalForm = document.getElementById("updateGoalForm");
const subGoalForm = document.getElementById("subGoalForm");
const profileForm = document.getElementById("profileForm");
const goalList = document.getElementById("goalList");
const goalTableWrap = document.getElementById("goalTableWrap");
const resetButton = document.getElementById("resetButton");
const toggleGoalListButton = document.getElementById("toggleGoalList");
const toggleGoalTableButton = document.getElementById("toggleGoalTableButton");
const goalListRange = document.getElementById("goalListRange");
const goalListCalendarWrap = document.getElementById("goalListCalendarWrap");
const goalListCalendarDate = document.getElementById("goalListCalendarDate");
const goalListStatus = document.getElementById("goalListStatus");
const statButtons = document.querySelectorAll(".stat-button");

const createFields = {
  picker: document.getElementById("goalPicker"),
  title: document.getElementById("goalTitle"),
  date: document.getElementById("goalDate"),
  time: document.getElementById("goalTime"),
  repeat: document.getElementById("goalRepeat"),
  customRepeatWrap: document.getElementById("customRepeatWrap"),
  repeatInterval: document.getElementById("goalRepeatInterval"),
  repeatUnit: document.getElementById("goalRepeatUnit"),
  notes: document.getElementById("goalNotes"),
  reward: document.getElementById("goalReward"),
  submitButton: document.getElementById("goalSubmitButton")
};

const updateFields = {
  status: document.getElementById("updateGoalStatus"),
  progress: document.getElementById("updateGoalProgress"),
  submitButton: document.getElementById("updateGoalSubmitButton")
};

const subGoalFields = {
  section: document.getElementById("subGoalSection"),
  title: document.getElementById("subGoalTitle"),
  date: document.getElementById("subGoalDate"),
  submitButton: document.getElementById("subGoalSubmitButton"),
  list: document.getElementById("selectedSubGoalList")
};

const profileFields = {
  name: document.getElementById("profileName"),
  dailyReward: document.getElementById("dailyReward"),
  weeklyReward: document.getElementById("weeklyReward"),
  monthlyReward: document.getElementById("monthlyReward"),
  yearlyReward: document.getElementById("yearlyReward"),
  dailyBanner: document.getElementById("rewardBannerDaily"),
  dailyBannerTitle: document.getElementById("rewardBannerDailyTitle"),
  dailyBannerText: document.getElementById("rewardBannerDailyText"),
  weeklyBanner: document.getElementById("rewardBannerWeekly"),
  weeklyBannerTitle: document.getElementById("rewardBannerWeeklyTitle"),
  weeklyBannerText: document.getElementById("rewardBannerWeeklyText"),
  monthlyBanner: document.getElementById("rewardBannerMonthly"),
  monthlyBannerTitle: document.getElementById("rewardBannerMonthlyTitle"),
  monthlyBannerText: document.getElementById("rewardBannerMonthlyText"),
  yearlyBanner: document.getElementById("rewardBannerYearly"),
  yearlyBannerTitle: document.getElementById("rewardBannerYearlyTitle"),
  yearlyBannerText: document.getElementById("rewardBannerYearlyText")
};

const expandedGoalRows = new Set();

const stats = {
  totalGoals: document.getElementById("totalGoals"),
  todayGoals: document.getElementById("todayGoals"),
  upcomingGoals: document.getElementById("upcomingGoals"),
  todayCompletedGoals: document.getElementById("todayCompletedGoals"),
  todayInProgressGoals: document.getElementById("todayInProgressGoals"),
  dueNotCompletedGoals: document.getElementById("dueNotCompletedGoals"),
  dailyProgressValue: document.getElementById("dailyProgressValue"),
  dailyProgressFill: document.getElementById("dailyProgressFill"),
  weeklyProgressValue: document.getElementById("weeklyProgressValue"),
  weeklyProgressFill: document.getElementById("weeklyProgressFill"),
  yearlyProgressValue: document.getElementById("yearlyProgressValue"),
  yearlyProgressFill: document.getElementById("yearlyProgressFill"),
  todayLabel: document.getElementById("todayLabel")
};

const reportElements = {
  range: document.getElementById("reportRange"),
  period: document.getElementById("reportPeriod"),
  dailyStatusCaption: document.getElementById("dailyStatusCaption"),
  dailyDonut: document.getElementById("dailyDonut"),
  dailyDonutValue: document.getElementById("dailyDonutValue"),
  dailyStatusLegend: document.getElementById("dailyStatusLegend"),
  chartCaption: document.getElementById("chartCaption"),
  trendChart: document.getElementById("trendChart"),
  summaryReportCaption: document.getElementById("summaryReportCaption"),
  summaryCompleted: document.getElementById("summaryCompleted"),
  summaryCompletedText: document.getElementById("summaryCompletedText"),
  summaryOutstanding: document.getElementById("summaryOutstanding"),
  summaryOutstandingText: document.getElementById("summaryOutstandingText"),
  summaryProgress: document.getElementById("summaryProgress"),
  summaryNarrative: document.getElementById("summaryNarrative")
};

initialize();

function initialize() {
  createFields.date.value = "";
  goalListCalendarDate.value = getTodayDate();
  syncGoalListControls();
  syncRepeatControls();
  stats.todayLabel.textContent = formatLongDate(getTodayDate());

  goalForm.addEventListener("submit", handleGoalSubmit);
  updateGoalForm.addEventListener("submit", handleGoalUpdate);
  subGoalForm.addEventListener("submit", handleSubGoalSubmit);
  profileForm.addEventListener("input", handleProfileChange);
  createFields.picker.addEventListener("change", syncFormFromSelectedGoal);
  createFields.repeat.addEventListener("change", handleRepeatChange);
  goalList.addEventListener("change", handleGoalStatusChange);
  subGoalFields.list.addEventListener("change", handleGoalStatusChange);
  goalList.addEventListener("click", handleGoalActions);
  subGoalFields.list.addEventListener("click", handleGoalActions);
  resetButton.addEventListener("click", resetGoals);
  toggleGoalListButton.addEventListener("click", toggleGoalList);
  toggleGoalTableButton.addEventListener("click", toggleGoalTable);
  goalListRange.addEventListener("change", handleGoalListRangeChange);
  goalListCalendarDate.addEventListener("change", render);
  goalListStatus.addEventListener("change", render);
  statButtons.forEach((button) => button.addEventListener("click", handleStatNavigation));
  reportElements.range.addEventListener("change", render);
  reportElements.period.addEventListener("change", renderReports);

  render();
}

function handleProfileChange() {
  state.profile.name = profileFields.name.value;
  state.profile.dailyReward = profileFields.dailyReward.value;
  state.profile.weeklyReward = profileFields.weeklyReward.value;
  state.profile.monthlyReward = profileFields.monthlyReward.value;
  state.profile.yearlyReward = profileFields.yearlyReward.value;
  persistAndRender();
}

function handleGoalSubmit(event) {
  event.preventDefault();

  const selectedGoalId = createFields.picker.value;
  const title = createFields.title.value.trim();
  const dueDate = createFields.date.value;
  const dueTime = createFields.time.value;
  const repeatValue = getSelectedRepeatValue();
  const normalizedRepeatValue = dueDate ? repeatValue : "none";

  if (!title || repeatValue === null) {
    return;
  }

  if (selectedGoalId) {
    const goal = state.goals.find((item) => item.id === selectedGoalId);
    if (!goal) {
      return;
    }

    goal.title = title;
    goal.dueDate = dueDate || "";
    goal.time = dueTime || "";
    goal.notes = createFields.notes.value.trim();
    goal.reward = createFields.reward.value.trim();
    goal.repeat = normalizedRepeatValue;
    focusGoalListOnDate(goal.dueDate);
    persistAndRender();
    return;
  }

  state.goals.unshift({
    id: crypto.randomUUID(),
    seriesId: crypto.randomUUID(),
    title,
    dueDate: dueDate || "",
    time: dueTime || "",
    status: "not-started",
    progress: 0,
    repeat: normalizedRepeatValue,
    notes: createFields.notes.value.trim(),
    reward: createFields.reward.value.trim(),
    generatedFromRepeat: false,
    subGoals: []
  });

  focusGoalListOnDate(dueDate || "");

  goalForm.reset();
  createFields.picker.value = "";
  createFields.date.value = "";
  createFields.submitButton.textContent = "Save goal";
  resetUpdateForm();
  resetSubGoalForm();
  persistAndRender();
}

function handleSubGoalSubmit(event) {
  event.preventDefault();

  const goalId = createFields.picker.value;
  const goal = state.goals.find((item) => item.id === goalId);
  const title = subGoalFields.title.value.trim();
  const dueDate = subGoalFields.date.value;

  if (!goal || !title || !dueDate) {
    return;
  }

  goal.subGoals = goal.subGoals || [];
  goal.subGoals.unshift({
    id: crypto.randomUUID(),
    title,
    dueDate,
    status: "not-started",
    progress: 0
  });
  syncGoalProgressFromSubGoals(goal);

  subGoalForm.reset();
  subGoalFields.date.value = goal.dueDate;
  persistAndRender();
}

function handleGoalStatusChange(event) {
  if (event.target.matches(".subgoal-status-select")) {
    handleSubGoalStatusChange(event);
    return;
  }

  if (!event.target.matches(".status-select")) {
    return;
  }

  const goalId = event.target.dataset.goalId;
  const goal = state.goals.find((item) => item.id === goalId);

  if (!goal) {
    return;
  }

  const previousStatus = goal.status;
  goal.status = event.target.value;
  if (goal.status === "completed") {
    goal.progress = 100;
  } else if (goal.status === "not-started") {
    goal.progress = 0;
  } else {
    goal.progress = Math.min(goal.progress || 0, 99);
  }

  if (previousStatus !== "completed" && goal.status === "completed") {
    recordCompletion(goal);
  }

  persistAndRender();
}

function handleSubGoalStatusChange(event) {
  const goalId = event.target.dataset.goalId;
  const subGoalId = event.target.dataset.subGoalId;
  const goal = state.goals.find((item) => item.id === goalId);

  if (!goal || !goal.subGoals) {
    return;
  }

  const subGoal = goal.subGoals.find((item) => item.id === subGoalId);
  if (!subGoal) {
    return;
  }

  subGoal.status = event.target.value;
  subGoal.progress = getSubGoalProgressFromStatus(subGoal.status);
  syncGoalProgressFromSubGoals(goal);
  persistAndRender();
}

function handleGoalUpdate(event) {
  event.preventDefault();

  const goalId = createFields.picker.value;
  const goal = state.goals.find((item) => item.id === goalId);

  if (!goal) {
    return;
  }

  const previousStatus = goal.status;
  goal.status = updateFields.status.value;
  goal.progress = normalizeProgress(updateFields.progress.value, updateFields.status.value);

  if (previousStatus !== "completed" && goal.status === "completed") {
    recordCompletion(goal);
  }

  if (goal.status === "completed") {
    resetUpdateForm();
  }

  persistAndRender();
}

function handleGoalActions(event) {
  if (event.target.matches(".toggle-subgoals-btn")) {
    const goalId = event.target.dataset.goalId;
    if (expandedGoalRows.has(goalId)) {
      expandedGoalRows.delete(goalId);
    } else {
      expandedGoalRows.add(goalId);
    }
    render();
    return;
  }

  if (event.target.matches(".remove-subgoal-btn")) {
    const goalId = event.target.dataset.goalId;
    const subGoalId = event.target.dataset.subGoalId;
    const goal = state.goals.find((item) => item.id === goalId);

    if (!goal || !goal.subGoals) {
      return;
    }

    goal.subGoals = goal.subGoals.filter((subGoal) => subGoal.id !== subGoalId);
    syncGoalProgressFromSubGoals(goal);
    persistAndRender();
    return;
  }

  if (!event.target.matches(".remove-btn")) {
    return;
  }

  const goalId = event.target.dataset.goalId;
  state.goals = state.goals.filter((goal) => goal.id !== goalId);
  persistAndRender();
}

function resetGoals() {
  Object.assign(state, structuredClone(defaultState));
  persistAndRender();
  goalForm.reset();
  createFields.picker.value = "";
  createFields.date.value = "";
  createFields.submitButton.textContent = "Save goal";
  resetUpdateForm();
  resetSubGoalForm();
}

function render() {
  cleanupFutureGeneratedRepeats();
  syncRepeatingGoals();
  state.goals.forEach(syncGoalProgressFromSubGoals);
  const today = getTodayDate();
  const undatedActiveGoals = state.goals.filter((goal) => !goal.dueDate && goal.status !== "completed");
  const plannedGoals = state.goals.filter((goal) => goal.status !== "completed");
  const allTodayGoals = state.goals.filter((goal) => goal.dueDate === today);
  const todayGoals = plannedGoals.filter((goal) => goal.dueDate === today || !goal.dueDate);
  const upcomingGoals = plannedGoals.filter((goal) => goal.dueDate > today);
  const todayCompletedGoals = allTodayGoals.filter((goal) => goal.status === "completed");
  const todayInProgressGoals = allTodayGoals.filter((goal) => goal.status === "in-progress");
  const dueNotCompletedGoals = state.goals.filter((goal) => goal.dueDate && goal.dueDate <= today && goal.status !== "completed");
  const dailyProgress = getPeriodProgress("day");
  const weeklyProgress = getPeriodProgress("week");
  const yearlyProgress = getPeriodProgress("year");
  const visibleGoals = getVisibleGoalsForList();

  stats.totalGoals.textContent = String(plannedGoals.length);
  stats.todayGoals.textContent = String(todayGoals.length);
  stats.upcomingGoals.textContent = String(upcomingGoals.length);
  stats.todayCompletedGoals.textContent = String(todayCompletedGoals.length);
  stats.todayInProgressGoals.textContent = String(todayInProgressGoals.length + undatedActiveGoals.filter((goal) => goal.status === "in-progress").length);
  stats.dueNotCompletedGoals.textContent = String(dueNotCompletedGoals.length);
  stats.dailyProgressValue.textContent = `${dailyProgress}%`;
  stats.dailyProgressFill.style.width = `${dailyProgress}%`;
  stats.weeklyProgressValue.textContent = `${weeklyProgress}%`;
  stats.weeklyProgressFill.style.width = `${weeklyProgress}%`;
  stats.yearlyProgressValue.textContent = `${yearlyProgress}%`;
  stats.yearlyProgressFill.style.width = `${yearlyProgress}%`;

  renderProfile();
  renderGoalTable(goalList, sortGoals(visibleGoals));
  renderGoalPicker();
  renderReports();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderGoalCollection(container, goals, isTodayView) {
  if (!goals.length) {
    container.innerHTML = isTodayView
      ? '<div class="empty-state">No goals are scheduled for today yet.</div>'
      : '<div class="empty-state">No goals added yet. Start by adding your first goal.</div>';
    return;
  }

  container.innerHTML = goals.map((goal) => {
    const dueState = getDueState(goal);
    const classes = [
      "goal-item",
      dueState === "today" ? "today" : "",
      goal.status === "completed" ? "completed" : ""
    ].filter(Boolean).join(" ");

    return `
      <article class="${classes}">
        <div class="goal-head">
          <div>
            <h3 class="goal-title">${escapeHtml(goal.title)}</h3>
            <div class="goal-meta">
              <span class="pill">${escapeHtml(goal.dueDate ? `Due ${formatShortDate(goal.dueDate)}` : "No due date")}</span>
              ${goal.time ? `<span class="pill">${escapeHtml(formatTime(goal.time))}</span>` : ""}
              <span class="pill">${escapeHtml(humanizeStatus(goal.status))}</span>
              <span class="pill">${goal.progress || 0}%</span>
              <span class="pill">${escapeHtml(humanizeDueState(dueState))}</span>
              <span class="pill repeat-pill">${escapeHtml(humanizeRepeat(goal.repeat || "none"))}</span>
              ${goal.reward ? `<span class="pill reward-pill">${escapeHtml(goal.status === "completed" ? `Earned: ${goal.reward}` : `Reward: ${goal.reward}`)}</span>` : ""}
            </div>
          </div>
        </div>
        ${goal.notes ? `<p class="goal-notes">${escapeHtml(goal.notes)}</p>` : ""}
        <div class="goal-actions">
          <select class="${getStatusSelectClass(goal.status)}" data-goal-id="${goal.id}" aria-label="Change status for ${escapeHtml(goal.title)}">
            <option value="in-progress" ${goal.status === "in-progress" ? "selected" : ""}>In progress</option>
            <option value="completed" ${goal.status === "completed" ? "selected" : ""}>Completed</option>
          </select>
          <button class="remove-btn" type="button" data-goal-id="${goal.id}">Remove</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderGoalTable(container, goals) {
  const isExpanded = toggleGoalTableButton.getAttribute("aria-expanded") !== "false";
  const performanceMap = new Map(
    getGoalPerformance(goalListRange.value).map((item) => [item.key, item])
  );

  if (!goals.length) {
    container.innerHTML = goalListRange.value === "day"
      ? '<div class="empty-state">No goals are scheduled for today yet.</div>'
      : '<div class="empty-state">No goals added yet. Start by adding your first goal.</div>';
    goalTableWrap.hidden = false;
    toggleGoalTableButton.setAttribute("aria-expanded", "true");
    toggleGoalTableButton.textContent = "Collapse list";
    return;
  }

  goalTableWrap.hidden = !isExpanded;
  toggleGoalTableButton.setAttribute("aria-expanded", String(isExpanded));
  toggleGoalTableButton.textContent = isExpanded ? "Collapse list" : "Expand list";
  container.innerHTML = goals.map((goal) => {
    const dueState = getDueState(goal);
    const notes = goal.notes ? escapeHtml(goal.notes) : '<span class="goal-table-notes">No notes</span>';
    const reward = goal.reward ? escapeHtml(goal.reward) : '<span class="goal-table-notes">No reward</span>';
    const displayDueDate = getGoalListDisplayDate(goal, goalListRange.value);
    const performance = performanceMap.get(goal.seriesId || goal.id);
    const successText = performance
      ? `${performance.rate}% (${performance.completed}/${performance.total})`
      : `${goal.progress || 0}%`;
    const subGoalCount = (goal.subGoals || []).length;
    const hasSubGoals = subGoalCount > 0;
    const showSubGoals = hasSubGoals && expandedGoalRows.has(goal.id);

    return `
      <article class="goal-table-row ${goal.status === "completed" ? "completed" : ""} ${dueState === "today" ? "today" : ""}">
        <div class="goal-table-cell goal-table-title">${escapeHtml(goal.title)}</div>
        <div class="goal-table-cell">
          <span class="pill">${escapeHtml(formatShortDate(displayDueDate || goal.dueDate))}</span>
          ${goal.time ? `<span class="pill">${escapeHtml(formatTime(goal.time))}</span>` : ""}
        </div>
        <div class="goal-table-cell">
          <span class="pill">${escapeHtml(humanizeStatus(goal.status))}</span>
        </div>
        <div class="goal-table-cell">
          <span class="pill">${goal.progress || 0}%</span>
        </div>
        <div class="goal-table-cell">
          <span class="pill">${escapeHtml(successText)}</span>
        </div>
        <div class="goal-table-cell">
          <span class="pill">${escapeHtml(humanizeRepeat(goal.repeat || "none"))}</span>
        </div>
        <div class="goal-table-cell goal-table-notes">${notes}</div>
        <div class="goal-table-cell goal-table-notes">${reward}</div>
        <div class="goal-table-cell">
          <div class="goal-actions">
            <select class="${getStatusSelectClass(goal.status)}" data-goal-id="${goal.id}" aria-label="Change status for ${escapeHtml(goal.title)}">
              <option value="not-started" ${goal.status === "not-started" ? "selected" : ""}>Not started</option>
              <option value="in-progress" ${goal.status === "in-progress" ? "selected" : ""}>In progress</option>
              <option value="completed" ${goal.status === "completed" ? "selected" : ""}>Completed</option>
            </select>
            ${hasSubGoals ? `
              <button class="ghost-btn toggle-subgoals-btn inline-btn" type="button" data-goal-id="${goal.id}">
                ${showSubGoals ? "Hide" : "Show"} sub-goals (${subGoalCount})
              </button>
            ` : ""}
            <button class="remove-btn" type="button" data-goal-id="${goal.id}">Remove</button>
          </div>
        </div>
      </article>
      ${showSubGoals ? renderSubGoalRows(goal) : ""}
    `;
  }).join("");
}

function sortGoals(goals) {
  return [...goals].sort((left, right) => {
    const leftHasDate = Boolean(left.dueDate);
    const rightHasDate = Boolean(right.dueDate);

    if (leftHasDate && rightHasDate) {
      return left.dueDate.localeCompare(right.dueDate);
    }

    if (leftHasDate) {
      return -1;
    }

    if (rightHasDate) {
      return 1;
    }

    return left.title.localeCompare(right.title);
  });
}

function getDueState(goal) {
  const today = getTodayDate();

  if (!goal.dueDate) {
    return "no-date";
  }

  if (goal.dueDate === today) {
    return "today";
  }

  if (goal.dueDate < today) {
    return goal.status === "completed" ? "completed" : "overdue";
  }

  return "upcoming";
}

function humanizeDueState(value) {
  const labels = {
    today: "Today",
    upcoming: "Upcoming",
    overdue: "Overdue",
    completed: "Finished",
    "no-date": "No due date"
  };

  return labels[value] || value;
}

function humanizeRepeat(repeat) {
  const customRepeat = parseCustomRepeat(repeat);
  if (customRepeat) {
    return `Repeats every ${customRepeat.interval} ${pluralizeUnit(customRepeat.unit, customRepeat.interval)}`;
  }

  const labels = {
    none: "One time",
    daily: "Repeats daily",
    weekly: "Repeats weekly",
    monthly: "Repeats monthly",
    yearly: "Repeats yearly"
  };

  return labels[repeat] || "One time";
}

function humanizeStatus(status) {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusSelectClass(status) {
  return `status-select status-select--${status}`;
}

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLongDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function formatShortDate(dateString) {
  if (!dateString) {
    return "No due date";
  }

  return new Date(`${dateString}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTime(timeString) {
  if (!timeString) {
    return "";
  }

  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? normalizeState(saved) : structuredClone(defaultState);
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function persistAndRender() {
  render();
}

function toggleGoalList() {
  const isExpanded = toggleGoalListButton.getAttribute("aria-expanded") !== "false";
  toggleGoalListButton.setAttribute("aria-expanded", String(!isExpanded));
  goalList.hidden = isExpanded;
}

function toggleGoalTable() {
  const isExpanded = toggleGoalTableButton.getAttribute("aria-expanded") !== "false";
  toggleGoalTableButton.setAttribute("aria-expanded", String(!isExpanded));
  goalTableWrap.hidden = isExpanded;
  toggleGoalTableButton.textContent = isExpanded ? "Expand list" : "Collapse list";
}

function handleStatNavigation(event) {
  const targetId = event.currentTarget.dataset.target;
  const targetRange = event.currentTarget.dataset.range;
  const targetStatus = event.currentTarget.dataset.status;
  if (!targetId) {
    return;
  }

  if (targetId === "allGoalsSection") {
    if (targetRange) {
      goalListRange.value = targetRange;
    }
    syncGoalListControls();
    goalListStatus.value = targetStatus || "all";
    toggleGoalListButton.setAttribute("aria-expanded", "true");
    goalList.hidden = false;
    toggleGoalTableButton.setAttribute("aria-expanded", "true");
    goalTableWrap.hidden = false;
    toggleGoalTableButton.textContent = "Collapse list";
    render();
  }

  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function handleGoalListRangeChange() {
  syncGoalListControls();
  render();
}

function focusGoalListOnDate(dueDate) {
  goalListStatus.value = "all";
  goalListRange.value = "all";

  syncGoalListControls();
  toggleGoalListButton.setAttribute("aria-expanded", "true");
  goalList.hidden = false;
  toggleGoalTableButton.setAttribute("aria-expanded", "true");
  goalTableWrap.hidden = false;
}

function syncGoalListControls() {
  goalListCalendarWrap.hidden = goalListRange.value !== "calendar";
  if (!goalListCalendarDate.value) {
    goalListCalendarDate.value = getTodayDate();
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeState(saved) {
  const stateWithDefaults = {
    ...structuredClone(defaultState),
    ...saved
  };

  stateWithDefaults.goals = (stateWithDefaults.goals || []).map((goal) => ({
    ...goal,
    seriesId: goal.seriesId || crypto.randomUUID(),
    dueDate: goal.dueDate || "",
    time: goal.time || "",
    status: goal.status === "planned" ? "not-started" : (goal.status || "not-started"),
    progress: normalizeProgress(goal.progress ?? (goal.status === "completed" ? 100 : 0), goal.status),
    repeat: goal.repeat || "none",
    reward: goal.reward || "",
    generatedFromRepeat: Boolean(goal.generatedFromRepeat),
    subGoals: (goal.subGoals || []).map((subGoal) => ({
      id: subGoal.id || crypto.randomUUID(),
      title: subGoal.title || "Sub-goal",
      dueDate: subGoal.dueDate || goal.dueDate || "",
      status: subGoal.status === "planned" ? "not-started" : (subGoal.status || "not-started"),
      progress: getSubGoalProgressFromStatus(subGoal.status || "not-started")
    }))
  }));

  markLegacyGeneratedRepeats(stateWithDefaults.goals);
  stateWithDefaults.completions = stateWithDefaults.completions || [];
  stateWithDefaults.profile = {
    name: saved.profile?.name || "",
    dailyReward: saved.profile?.dailyReward || "",
    weeklyReward: saved.profile?.weeklyReward || "",
    monthlyReward: saved.profile?.monthlyReward || "",
    yearlyReward: saved.profile?.yearlyReward || ""
  };
  return stateWithDefaults;
}

function renderProfile() {
  profileFields.name.value = state.profile.name || "";
  profileFields.dailyReward.value = state.profile.dailyReward || "";
  profileFields.weeklyReward.value = state.profile.weeklyReward || "";
  profileFields.monthlyReward.value = state.profile.monthlyReward || "";
  profileFields.yearlyReward.value = state.profile.yearlyReward || "";
  renderRewardBanner({
    banner: profileFields.dailyBanner,
    title: profileFields.dailyBannerTitle,
    text: profileFields.dailyBannerText,
    heading: "daily",
    reward: state.profile.dailyReward,
    progress: getPeriodProgress("day")
  });
  renderRewardBanner({
    banner: profileFields.weeklyBanner,
    title: profileFields.weeklyBannerTitle,
    text: profileFields.weeklyBannerText,
    heading: "weekly",
    reward: state.profile.weeklyReward,
    progress: getPeriodProgress("week")
  });
  renderRewardBanner({
    banner: profileFields.monthlyBanner,
    title: profileFields.monthlyBannerTitle,
    text: profileFields.monthlyBannerText,
    heading: "monthly",
    reward: state.profile.monthlyReward,
    progress: getPeriodProgress("month")
  });
  renderRewardBanner({
    banner: profileFields.yearlyBanner,
    title: profileFields.yearlyBannerTitle,
    text: profileFields.yearlyBannerText,
    heading: "yearly",
    reward: state.profile.yearlyReward,
    progress: getPeriodProgress("year")
  });
}

function renderRewardBanner(config) {
  const reward = (config.reward || "").trim();
  config.banner.classList.remove("reward-banner--ready", "reward-banner--success", "reward-banner--pop");
  config.title.textContent = `${capitalize(config.heading)} reward progress`;

  if (!reward) {
    config.banner.hidden = true;
    return;
  }

  config.banner.hidden = false;
  config.banner.classList.add("reward-banner--ready");

  if (config.progress >= 100) {
    config.banner.classList.remove("reward-banner--ready");
    config.banner.classList.add("reward-banner--success");
    config.text.textContent = `You earned your ${config.heading} achieved goal reward: ${reward}.`;
    triggerRewardBannerPop(config.banner);
    return;
  }

  config.text.textContent = `You have ${config.progress}% progress toward your ${config.heading} achieved goal reward: ${reward}.`;
  triggerRewardBannerPop(config.banner);
}

function triggerRewardBannerPop(banner) {
  banner.classList.remove("reward-banner--pop");
  void banner.offsetWidth;
  banner.classList.add("reward-banner--pop");
}

function renderGoalPicker() {
  const selectedId = createFields.picker.value;
  const sortedGoals = sortGoals(state.goals.filter((goal) => goal.status !== "completed"));

  createFields.picker.innerHTML = [
    '<option value="">Create a new goal</option>',
    ...sortedGoals.map((goal) => {
      const label = `${escapeHtml(goal.title)} - ${escapeHtml(formatShortDate(goal.dueDate))}`;
      return `<option value="${goal.id}">${label}</option>`;
    })
  ].join("");

  if (sortedGoals.some((goal) => goal.id === selectedId)) {
    createFields.picker.value = selectedId;
  }

  syncFormFromSelectedGoal();
}

function syncFormFromSelectedGoal() {
  const goalId = createFields.picker.value;
  const goal = state.goals.find((item) => item.id === goalId);

  if (!goal) {
    resetGoalForm();
    resetUpdateForm();
    resetSubGoalForm();
    return;
  }

  createFields.title.value = goal.title;
  createFields.date.value = goal.dueDate || "";
  createFields.time.value = goal.time || "";
  createFields.notes.value = goal.notes || "";
  createFields.reward.value = goal.reward || "";
  const customRepeat = parseCustomRepeat(goal.repeat);
  if (customRepeat) {
    createFields.repeat.value = "custom";
    createFields.repeatInterval.value = customRepeat.interval;
    createFields.repeatUnit.value = customRepeat.unit;
  } else {
    createFields.repeat.value = goal.repeat || "none";
    createFields.repeatInterval.value = 2;
    createFields.repeatUnit.value = "day";
  }
  syncRepeatControls();
  createFields.submitButton.textContent = "Update goal details";
  updateFields.status.value = goal.status;
  updateFields.progress.value = goal.progress ?? 0;
  updateFields.submitButton.textContent = "Update goal";
  renderSelectedSubGoals(goal);
}

function resetUpdateForm() {
  updateGoalForm.reset();
  updateFields.progress.value = 0;
  updateFields.submitButton.textContent = "Update goal";
}

function resetGoalForm() {
  goalForm.reset();
  createFields.picker.value = "";
  createFields.date.value = "";
  createFields.time.value = "";
  createFields.repeat.value = "none";
  createFields.repeatInterval.value = 2;
  createFields.repeatUnit.value = "day";
  syncRepeatControls();
  createFields.submitButton.textContent = "Save goal";
}

function resetSubGoalForm() {
  subGoalForm.reset();
  subGoalFields.section.hidden = true;
  subGoalFields.list.innerHTML = '<div class="empty-state">Select a goal first to add sub-goals.</div>';
}

function handleRepeatChange() {
  syncRepeatControls();
}

function syncRepeatControls() {
  const isCustom = createFields.repeat.value === "custom";
  createFields.customRepeatWrap.hidden = !isCustom;

  if (isCustom) {
    createFields.customRepeatWrap.classList.remove("custom-repeat-pop");
    void createFields.customRepeatWrap.offsetWidth;
    createFields.customRepeatWrap.classList.add("custom-repeat-pop");
  } else {
    createFields.customRepeatWrap.classList.remove("custom-repeat-pop");
  }
}

function getSelectedRepeatValue() {
  if (createFields.repeat.value !== "custom") {
    return createFields.repeat.value;
  }

  const interval = Number(createFields.repeatInterval.value);
  const unit = createFields.repeatUnit.value;
  if (!Number.isInteger(interval) || interval < 1 || !["day", "week", "month", "year"].includes(unit)) {
    return null;
  }

  return `custom:${interval}:${unit}`;
}

function parseCustomRepeat(repeat) {
  if (typeof repeat !== "string" || !repeat.startsWith("custom:")) {
    return null;
  }

  const [, intervalValue, unit] = repeat.split(":");
  const interval = Number(intervalValue);
  if (!Number.isInteger(interval) || interval < 1 || !["day", "week", "month", "year"].includes(unit)) {
    return null;
  }

  return { interval, unit };
}

function pluralizeUnit(unit, interval) {
  return interval === 1 ? unit : `${unit}s`;
}

function pluralizeCount(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

function formatReportNarrative(bucketLabel, totalGoals, completedCount, outstandingCount, progress) {
  if (!totalGoals) {
    return `No goals were scheduled for ${bucketLabel}.`;
  }

  const completedLabel = `${completedCount} ${pluralizeCount(completedCount, "goal")}`;
  const outstandingLabel = `${outstandingCount} ${pluralizeCount(outstandingCount, "goal")}`;
  const opener = `On ${bucketLabel}, you completed ${completedLabel} out of ${totalGoals} ${pluralizeCount(totalGoals, "goal")}.`;

  if (completedCount === totalGoals) {
    return `${opener} Amazing work, you finished everything you planned and reached ${progress}% overall progress.`;
  }

  if (completedCount === 0) {
    return `${opener} You still have ${outstandingLabel} to work through, and your overall progress is ${progress}%. Keep going, one small win can turn the day around.`;
  }

  return `${opener} You have ${outstandingLabel} remaining, and your overall progress is ${progress}%. Strong progress so far, keep the momentum going.`;
}

function recordCompletion(goal) {
  const completedOn = getTodayDate();
  const alreadyLogged = state.completions.some((entry) => {
    return entry.goalId === goal.id && entry.completedOn === completedOn;
  });

  if (alreadyLogged) {
    return;
  }

  state.completions.push({
    goalId: goal.id,
    seriesId: goal.seriesId,
    title: goal.title,
    dueDate: goal.dueDate,
    completedOn,
    repeat: goal.repeat || "none"
  });
}

function createNextRepeat(goal) {
  if (!goal.repeat || goal.repeat === "none" || !goal.dueDate) {
    return;
  }

  const nextDate = getNextDate(goal.dueDate, goal.repeat);
  if (!nextDate) {
    return;
  }
  const existingNextGoal = state.goals.some((item) => {
    return item.seriesId === goal.seriesId && item.dueDate === nextDate;
  });

  if (existingNextGoal) {
    return;
  }

  state.goals.unshift({
    id: crypto.randomUUID(),
    seriesId: goal.seriesId,
    title: goal.title,
    dueDate: nextDate,
    status: "planned",
    repeat: goal.repeat,
    notes: goal.notes,
    reward: goal.reward || "",
    subGoals: []
  });
}

function syncRepeatingGoals() {
  const today = getTodayDate();

  state.goals
    .filter((goal) => goal.status === "completed" && goal.repeat && goal.repeat !== "none" && goal.dueDate)
    .forEach((goal) => {
      let nextDate = getNextDate(goal.dueDate, goal.repeat);
      if (!nextDate) {
        return;
      }

      while (nextDate <= today) {
        const existingNextGoal = state.goals.some((item) => {
          return item.seriesId === goal.seriesId && item.dueDate === nextDate;
        });

        if (!existingNextGoal) {
          state.goals.unshift({
            id: crypto.randomUUID(),
            seriesId: goal.seriesId,
            title: goal.title,
            dueDate: nextDate,
            status: "planned",
            repeat: goal.repeat,
            notes: goal.notes,
            reward: goal.reward || "",
            generatedFromRepeat: true,
            subGoals: []
          });
        }

        nextDate = getNextDate(nextDate, goal.repeat);
      }
    });
}

function getNextDate(dateString, repeat) {
  if (!dateString) {
    return null;
  }

  const date = new Date(`${dateString}T00:00:00`);
  const customRepeat = parseCustomRepeat(repeat);

  if (customRepeat) {
    if (customRepeat.unit === "day") {
      date.setDate(date.getDate() + customRepeat.interval);
    } else if (customRepeat.unit === "week") {
      date.setDate(date.getDate() + (customRepeat.interval * 7));
    } else if (customRepeat.unit === "month") {
      date.setMonth(date.getMonth() + customRepeat.interval);
    } else if (customRepeat.unit === "year") {
      date.setFullYear(date.getFullYear() + customRepeat.interval);
    }

    return formatAsInputDate(date);
  }

  if (repeat === "daily") {
    date.setDate(date.getDate() + 1);
  } else if (repeat === "weekly") {
    date.setDate(date.getDate() + 7);
  } else if (repeat === "monthly") {
    date.setMonth(date.getMonth() + 1);
  } else if (repeat === "yearly") {
    date.setFullYear(date.getFullYear() + 1);
  }

  return formatAsInputDate(date);
}

function cleanupFutureGeneratedRepeats() {
  const today = getTodayDate();
  state.goals = state.goals.filter((goal) => {
    return !(goal.generatedFromRepeat && goal.dueDate > today);
  });
}

function markLegacyGeneratedRepeats(goals) {
  const completedBySeries = new Map();

  goals.forEach((goal) => {
    if (goal.status === "completed") {
      completedBySeries.set(goal.seriesId, true);
    }
  });

  goals.forEach((goal) => {
    if (
      !goal.generatedFromRepeat &&
      goal.status !== "completed" &&
      goal.repeat &&
      goal.repeat !== "none" &&
      completedBySeries.has(goal.seriesId)
    ) {
      goal.generatedFromRepeat = true;
    }
  });
}

function formatAsInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderReports() {
  const range = reportElements.range.value;
  const buckets = createTimeBuckets(range);
  const series = getTrendSeries(range, buckets);
  reportElements.chartCaption.textContent = `${getRangeLabel(range)} view`;

  renderReportPeriodOptions(buckets);
  renderDailyStatus();
  renderTrendChart(series);
  renderReportSummary();
}

function renderSelectedSubGoals(goal) {
  subGoalFields.section.hidden = false;
  subGoalFields.date.value = goal.dueDate;

  if (!goal.subGoals || !goal.subGoals.length) {
    subGoalFields.list.innerHTML = '<div class="empty-state">No sub-goals yet. Add the first step for this goal.</div>';
    return;
  }

  subGoalFields.list.innerHTML = goal.subGoals.map((subGoal) => {
    return `
      <article class="subgoal-card">
        <div>
          <strong>${escapeHtml(subGoal.title)}</strong>
          <div class="goal-meta">
            <span class="pill">${escapeHtml(formatShortDate(subGoal.dueDate))}</span>
            <span class="pill">${escapeHtml(humanizeStatus(subGoal.status))}</span>
          </div>
        </div>
        <div class="goal-actions">
          <select class="${getStatusSelectClass(subGoal.status)} subgoal-status-select" data-goal-id="${goal.id}" data-sub-goal-id="${subGoal.id}">
            <option value="not-started" ${subGoal.status === "not-started" ? "selected" : ""}>Not started</option>
            <option value="in-progress" ${subGoal.status === "in-progress" ? "selected" : ""}>In progress</option>
            <option value="completed" ${subGoal.status === "completed" ? "selected" : ""}>Completed</option>
          </select>
          <button class="remove-btn remove-subgoal-btn" type="button" data-goal-id="${goal.id}" data-sub-goal-id="${subGoal.id}">Remove</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderSubGoalRows(goal) {
  const subGoals = goal.subGoals || [];

  if (!subGoals.length) {
    return `
      <article class="subgoal-row">
        <div class="empty-state">No sub-goals added for this goal yet.</div>
      </article>
    `;
  }

  return `
    <article class="subgoal-row">
      <div class="subgoal-table-head">
        <span>Sub-goal</span>
        <span>Due date</span>
        <span>Status</span>
        <span>Action</span>
      </div>
      <div class="subgoal-table">
        ${subGoals.map((subGoal) => `
          <div class="subgoal-table-row">
            <div>${escapeHtml(subGoal.title)}</div>
            <div><span class="pill">${escapeHtml(formatShortDate(subGoal.dueDate))}</span></div>
            <div><span class="pill">${escapeHtml(humanizeStatus(subGoal.status))}</span></div>
            <div class="goal-actions">
              <select class="${getStatusSelectClass(subGoal.status)} subgoal-status-select" data-goal-id="${goal.id}" data-sub-goal-id="${subGoal.id}">
                <option value="not-started" ${subGoal.status === "not-started" ? "selected" : ""}>Not started</option>
                <option value="in-progress" ${subGoal.status === "in-progress" ? "selected" : ""}>In progress</option>
                <option value="completed" ${subGoal.status === "completed" ? "selected" : ""}>Completed</option>
              </select>
              <button class="remove-btn remove-subgoal-btn" type="button" data-goal-id="${goal.id}" data-sub-goal-id="${subGoal.id}">Remove</button>
            </div>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderDailyStatus() {
  const today = getTodayDate();
  const todayGoals = state.goals.filter((goal) => goal.dueDate === today);
  const completed = todayGoals.filter((goal) => goal.status === "completed").length;
  const inProgress = todayGoals.filter((goal) => goal.status === "in-progress").length;
  const total = todayGoals.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const completedDeg = total ? Math.round((completed / total) * 360) : 0;

  reportElements.dailyStatusCaption.textContent = formatLongDate(today);
  reportElements.dailyDonut.style.background = `conic-gradient(#56d6a2 0deg ${completedDeg}deg, rgba(255, 255, 255, 0.1) ${completedDeg}deg 360deg)`;
  reportElements.dailyDonutValue.textContent = `${percent}%`;

  const legendItems = [
    { label: "Completed", value: completed, color: "#56d6a2" },
    { label: "In progress", value: inProgress, color: "#68c5ff" }
  ];

  reportElements.dailyStatusLegend.innerHTML = legendItems.map((item) => {
    return `
      <div class="legend-item">
        <span class="legend-label">
          <span class="legend-dot" style="background:${item.color};"></span>
          <span>${item.label}</span>
        </span>
        <span class="legend-value">${item.value}</span>
      </div>
    `;
  }).join("");
}

function renderTrendChart(series) {
  if (!series.length) {
    reportElements.trendChart.innerHTML = '<div class="empty-state">No trend data available yet.</div>';
    return;
  }

  const maxValue = 100;

  reportElements.trendChart.innerHTML = series.map((item) => {
    if (item.total === 0) {
      return `
        <div class="chart-col">
          <div class="chart-value">No data</div>
          <div class="chart-bar-wrap">
            <div class="chart-empty">No data</div>
          </div>
          <div class="chart-name">${escapeHtml(item.label)}</div>
        </div>
      `;
    }

    const height = Math.max(8, Math.round((item.rate / maxValue) * 130));
    const tone = item.rate >= 80 ? "good" : item.rate >= 50 ? "mid" : "low";
    return `
      <div class="chart-col">
        <div class="chart-value">${item.rate}%</div>
        <div class="chart-bar-wrap">
          <div class="chart-bar ${tone}" style="height: ${height}px;"></div>
        </div>
        <div class="chart-name">${escapeHtml(item.label)}</div>
      </div>
    `;
  }).join("");
}

function getTrendSeries(range, buckets = createTimeBuckets(range)) {
  return buckets.map((bucket) => {
    const goals = state.goals.filter((goal) => bucket.match(goal.dueDate));
    const completed = goals.filter((goal) => goal.status === "completed").length;

    return {
      label: bucket.label,
      total: goals.length,
      completed,
      rate: goals.length ? Math.round((completed / goals.length) * 100) : 0
    };
  });
}
}

function renderReportPeriodOptions(buckets) {
  const previousValue = reportElements.period.value;

  reportElements.period.innerHTML = buckets.map((bucket, index) => {
    return `<option value="${index}">${escapeHtml(bucket.longLabel || bucket.label)}</option>`;
  }).join("");

  if (!buckets.length) {
    return;
  }

  const hasPrevious = buckets.some((_, index) => String(index) === previousValue);
  if (hasPrevious) {
    reportElements.period.value = previousValue;
    return;
  }

  reportElements.period.value = String(getCurrentBucketIndex(buckets));
}

function renderReportSummary() {
  const range = reportElements.range.value;
  const buckets = createTimeBuckets(range);

  if (!buckets.length) {
    reportElements.summaryReportCaption.textContent = "Selected period";
    reportElements.summaryCompleted.textContent = "0";
    reportElements.summaryCompletedText.textContent = "No completed goals in this period.";
    reportElements.summaryOutstanding.textContent = "0";
    reportElements.summaryOutstandingText.textContent = "No outstanding goals in this period.";
    reportElements.summaryProgress.textContent = "0%";
    reportElements.summaryNarrative.textContent = "Choose a period to see your completed work, missed work, and overall progress.";
    return;
  }

  const selectedIndex = Number(reportElements.period.value || buckets.length - 1);
  const bucket = buckets[Math.max(0, Math.min(selectedIndex, buckets.length - 1))];
  const goals = state.goals.filter((goal) => bucket.match(goal.dueDate));
  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const outstandingGoals = goals.filter((goal) => goal.status !== "completed");
  const progress = goals.length
    ? Math.round(goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / goals.length)
    : 0;

  reportElements.summaryReportCaption.textContent = bucket.longLabel || bucket.label;
  reportElements.summaryCompleted.textContent = String(completedGoals.length);
  reportElements.summaryCompletedText.textContent = completedGoals.length
    ? completedGoals.map((goal) => goal.title).join(", ")
    : "No completed goals in this period.";
  reportElements.summaryOutstanding.textContent = String(outstandingGoals.length);
  reportElements.summaryOutstandingText.textContent = outstandingGoals.length
    ? outstandingGoals.map((goal) => goal.title).join(", ")
    : "No outstanding goals in this period.";
  reportElements.summaryProgress.textContent = `${progress}%`;
  reportElements.summaryNarrative.textContent = formatReportNarrative(
    bucket.longLabel || bucket.label,
    goals.length,
    completedGoals.length,
    outstandingGoals.length,
    progress
  );
}

function createTimeBuckets(range) {
  const today = new Date(`${getTodayDate()}T00:00:00`);
  const firstGoalDate = getFirstGoalDate();
  const lastGoalDate = getLastGoalDate();

  if (range === "day") {
    const startDate = firstGoalDate && firstGoalDate > addDays(today, -6)
      ? firstGoalDate
      : addDays(today, -6);
    const totalDays = diffInDays(startDate, today) + 1;

    return Array.from({ length: totalDays }, (_, index) => {
      const date = addDays(startDate, index);
      const key = formatAsInputDate(date);
      return {
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        longLabel: date.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        }),
        match: (dueDate) => dueDate === key
      };
    });
  }

  if (range === "week") {
    const currentWeekStart = startOfWeek(new Date(today));
    const firstWeekStart = firstGoalDate ? startOfWeek(new Date(firstGoalDate)) : currentWeekStart;
    const bucketStarts = [];
    const cursor = new Date(firstWeekStart);

    while (cursor <= currentWeekStart) {
      bucketStarts.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 7);
    }

    return bucketStarts.map((start) => {
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return {
        label: `W${getWeekNumber(start)}`,
        longLabel: `${formatShortDate(formatAsInputDate(start))} to ${formatShortDate(formatAsInputDate(end))}`,
        match: (dueDate) => dueDate >= formatAsInputDate(start) && dueDate <= formatAsInputDate(end)
      };
    });
  }

  if (range === "month") {
    const firstMonthDate = firstGoalDate
      ? new Date(firstGoalDate.getFullYear(), firstGoalDate.getMonth(), 1)
      : new Date(today.getFullYear(), today.getMonth(), 1);
    const endMonthDate = lastGoalDate
      ? new Date(lastGoalDate.getFullYear(), lastGoalDate.getMonth(), 1)
      : new Date(today.getFullYear(), today.getMonth(), 1);
    const bucketMonths = [];
    const cursor = new Date(firstMonthDate);

    while (cursor <= endMonthDate) {
      bucketMonths.push(new Date(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return bucketMonths.map((date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      return {
        label: date.toLocaleDateString(undefined, { month: "short" }),
        longLabel: date.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
        match: (dueDate) => {
          const compare = new Date(`${dueDate}T00:00:00`);
          return compare.getFullYear() === year && compare.getMonth() === month;
        }
      };
    });
  }

  const firstYear = firstGoalDate ? firstGoalDate.getFullYear() : today.getFullYear();
  const lastYear = lastGoalDate ? lastGoalDate.getFullYear() : today.getFullYear();
  return Array.from({ length: lastYear - firstYear + 1 }, (_, index) => {
    const year = firstYear + index;
    return {
      label: String(year),
      longLabel: String(year),
      match: (dueDate) => new Date(`${dueDate}T00:00:00`).getFullYear() === year
    };
  });
}

function getCurrentBucketIndex(buckets) {
  const today = getTodayDate();
  const currentIndex = buckets.findIndex((bucket) => bucket.match(today));

  if (currentIndex >= 0) {
    return currentIndex;
  }

  return Math.max(0, buckets.length - 1);
}

function getGoalPerformance(range) {
  const grouped = new Map();

  state.goals
    .filter((goal) => isInRange(goal.dueDate, range))
    .forEach((goal) => {
      const key = goal.seriesId || goal.id;
      const current = grouped.get(key) || {
        key,
        title: goal.title,
        total: 0,
        completed: 0
      };

      current.total += 1;
      if (goal.status === "completed") {
        current.completed += 1;
      }

      grouped.set(key, current);
    });

  return [...grouped.values()]
    .map((item) => ({
      ...item,
      rate: item.total ? Math.round((item.completed / item.total) * 100) : 0
    }))
    .sort((left, right) => right.rate - left.rate || right.completed - left.completed);
}

function getPeriodProgress(range) {
  const goals = state.goals.filter((goal) => isInRange(goal.dueDate, range));
  if (!goals.length) {
    return 0;
  }

  return Math.round(goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / goals.length);
}

function syncGoalProgressFromSubGoals(goal) {
  if (!goal.subGoals || !goal.subGoals.length) {
    return;
  }

  const totalProgress = goal.subGoals.reduce((sum, subGoal) => {
    subGoal.progress = getSubGoalProgressFromStatus(subGoal.status);
    return sum + subGoal.progress;
  }, 0);

  goal.progress = Math.round(totalProgress / goal.subGoals.length);

  if (goal.subGoals.every((subGoal) => subGoal.status === "completed")) {
    goal.status = "completed";
    goal.progress = 100;
    return;
  }

  if (goal.subGoals.every((subGoal) => subGoal.status === "not-started")) {
    goal.status = "not-started";
    goal.progress = 0;
    return;
  }

  goal.status = "in-progress";
}

function getSubGoalProgressFromStatus(status) {
  if (status === "completed") {
    return 100;
  }

  if (status === "in-progress") {
    return 50;
  }

  return 0;
}

function getVisibleGoalsForList() {
  const range = goalListRange.value;
  const status = goalListStatus.value;
  let visibleGoals;
  const today = getTodayDate();

  if (range === "all") {
    visibleGoals = state.goals;
  } else {
    visibleGoals = state.goals.filter((goal) => isInGoalListRange(goal, range));
  }

  if (status === "all") {
    return visibleGoals;
  }

  if (status === "due-not-completed") {
    return visibleGoals.filter((goal) => goal.dueDate && goal.dueDate <= today && goal.status !== "completed");
  }

  return visibleGoals.filter((goal) => goal.status === status);
}

function isInGoalListRange(goal, range) {
  const today = getTodayDate();

  if (range === "today") {
    return Boolean(getGoalListOccurrenceDate(goal, range)) || (!goal.dueDate && goal.status !== "completed");
  }

  if (range === "tomorrow") {
    return Boolean(getGoalListOccurrenceDate(goal, range));
  }

  if (range === "calendar") {
    return Boolean(getGoalListOccurrenceDate(goal, range));
  }

  return Boolean(getGoalListOccurrenceDate(goal, range));
}

function getGoalListOccurrenceDate(goal, range) {
  if (!goal.dueDate) {
    return null;
  }

  const window = getGoalListRangeWindow(range);
  if (!window) {
    return goal.dueDate;
  }

  if (goal.dueDate >= window.start && goal.dueDate <= window.end) {
    return goal.dueDate;
  }

  if (!goal.repeat || goal.repeat === "none" || goal.status === "completed") {
    return null;
  }

  let occurrenceDate = goal.dueDate;
  let safety = 0;

  while (occurrenceDate < window.start && safety < 500) {
    const nextDate = getNextDate(occurrenceDate, goal.repeat);
    if (!nextDate || nextDate === occurrenceDate) {
      return null;
    }

    occurrenceDate = nextDate;
    safety += 1;
  }

  if (occurrenceDate >= window.start && occurrenceDate <= window.end) {
    return occurrenceDate;
  }

  return null;
}

function getGoalListRangeWindow(range) {
  const today = new Date(`${getTodayDate()}T00:00:00`);

  if (range === "today") {
    const date = formatAsInputDate(today);
    return { start: date, end: date };
  }

  if (range === "tomorrow") {
    const tomorrow = formatAsInputDate(addDays(new Date(today), 1));
    return { start: tomorrow, end: tomorrow };
  }

  if (range === "calendar") {
    const selectedDate = goalListCalendarDate.value;
    return selectedDate ? { start: selectedDate, end: selectedDate } : null;
  }

  if (range === "week") {
    const start = startOfWeek(new Date(today));
    const end = addDays(new Date(start), 6);
    return { start: formatAsInputDate(start), end: formatAsInputDate(end) };
  }

  if (range === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { start: formatAsInputDate(start), end: formatAsInputDate(end) };
  }

  if (range === "year") {
    const start = new Date(today.getFullYear(), 0, 1);
    const end = new Date(today.getFullYear(), 11, 31);
    return { start: formatAsInputDate(start), end: formatAsInputDate(end) };
  }

  return null;
}

function getGoalListDisplayDate(goal, range) {
  if (!goal.dueDate) {
    return "";
  }

  return getGoalListOccurrenceDate(goal, range) || goal.dueDate;
}

function normalizeProgress(value, status) {
  const parsed = Number(value);
  if (status === "completed") {
    return 100;
  }
  if (status === "not-started") {
    return 0;
  }
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(99, Math.round(parsed)));
}

function isInRange(dateString, range) {
  if (!dateString) {
    return false;
  }

  const date = new Date(`${dateString}T00:00:00`);
  const today = new Date(`${getTodayDate()}T00:00:00`);

  if (range === "day") {
    return formatAsInputDate(date) === formatAsInputDate(today);
  }

  if (range === "week") {
    const start = startOfWeek(new Date(today));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return date >= start && date <= end;
  }

  if (range === "month") {
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
  }

  return date.getFullYear() === today.getFullYear();
}

function startOfWeek(date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function getWeekNumber(date) {
  const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = copy.getUTCDay() || 7;
  copy.setUTCDate(copy.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1));
  return Math.ceil((((copy - yearStart) / 86400000) + 1) / 7);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getRangeLabel(range) {
  const labels = {
    day: "Daily",
    week: "Weekly",
    month: "Monthly",
    year: "Yearly"
  };

  return labels[range] || capitalize(range);
}

function getFirstGoalDate() {
  const datedGoals = state.goals.filter((goal) => goal.dueDate);
  if (!datedGoals.length) {
    return null;
  }

  const sortedDates = datedGoals
    .map((goal) => new Date(`${goal.dueDate}T00:00:00`))
    .sort((left, right) => left - right);

  return sortedDates[0];
}

function getLastGoalDate() {
  const datedGoals = state.goals.filter((goal) => goal.dueDate);
  if (!datedGoals.length) {
    return null;
  }

  const sortedDates = datedGoals
    .map((goal) => new Date(`${goal.dueDate}T00:00:00`))
    .sort((left, right) => right - left);

  return sortedDates[0];
}

function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function diffInDays(start, end) {
  const msPerDay = 86400000;
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / msPerDay);
}
