// Smooth scroll buttons
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("btnToPlan").addEventListener("click", () => {
  scrollToId("plan-builder");
});

document.getElementById("btnToStart").addEventListener("click", () => {
  scrollToId("start-here");
});

// Simple plan builder
(function () {
  const patterns = {
    2: ["Full body", "Full body"],
    3: ["Full body", "Lower body", "Upper body"],
    4: ["Upper", "Lower", "Upper", "Lower"],
    5: ["Upper", "Lower", "Full body", "Upper", "Lower"],
    6: ["Upper", "Lower", "Upper", "Lower", "Full body", "Optional cardio"],
  };

  const goalSelect = document.getElementById("goalSelect");
  const daysInput = document.getElementById("daysInput");
  const timeInput = document.getElementById("timeInput");
  const summary = document.getElementById("planSummary");
  const daysContainer = document.getElementById("planDays");

  function goalLabel(value) {
    switch (value) {
      case "muscle":
        return "Build Muscle";
      case "strength":
        return "Strength";
      case "fatloss":
        return "Fat Loss";
      case "endurance":
        return "Endurance";
      default:
        return "Balanced / Tone";
    }
  }

  function dayTag(goal, type) {
    if (type === "Optional cardio") return "Easy cardio or stretching";
    if (goal === "endurance") return "Cardio with some strength";
    if (goal === "fatloss") return "Strength + light cardio";
    if (goal === "strength") return "Heavier compounds";
    if (goal === "muscle") return "Moderate weight, 6–12 reps";
    return "Mix of strength and movement";
  }

  function renderPlan() {
    let days = parseInt(daysInput.value, 10);
    if (isNaN(days)) days = 3;
    days = Math.min(Math.max(days, 2), 6);
    daysInput.value = days;

    let time = parseInt(timeInput.value, 10);
    if (isNaN(time)) time = 45;
    time = Math.min(Math.max(time, 20), 120);
    timeInput.value = time;

    const goal = goalSelect.value;
    const pat = patterns[days] || patterns[3];
    summary.textContent = `${days} days · ${goalLabel(goal)} · ${time} min`;

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysContainer.innerHTML = pat
      .map((type, i) => {
        const tag = dayTag(goal, type);
        return `
          <div class="plan-day">
            <strong>${labels[i] || "Day " + (i + 1)} – ${type}</strong><br />
            <span>${tag}</span><br />
            <span class="small-note">
              Choose 4–6 movements from the exercise library that fit this focus.
            </span>
          </div>
        `;
      })
      .join("");
  }

  document
    .getElementById("btnGeneratePlan")
    .addEventListener("click", renderPlan);

  renderPlan();
})();

// Exercise library
(function () {
  const exercises = [
    {
      name: "Goblet Squat",
      muscle: "lower",
      goal: "muscle",
      works: "Quads, glutes, core",
      equipment: "Dumbbell or kettlebell",
    },
    {
      name: "Romanian Deadlift",
      muscle: "lower",
      goal: "strength",
      works: "Hamstrings, glutes",
      equipment: "Barbell or dumbbells",
    },
    {
      name: "Push-up",
      muscle: "upper",
      goal: "strength",
      works: "Chest, shoulders, triceps, core",
      equipment: "Bodyweight",
    },
    {
      name: "Dumbbell Row",
      muscle: "upper",
      goal: "muscle",
      works: "Upper back, lats, biceps",
      equipment: "Dumbbell + bench",
    },
    {
      name: "Plank",
      muscle: "core",
      goal: "endurance",
      works: "Deep core stability",
      equipment: "Bodyweight",
    },
    {
      name: "Dead Bug",
      muscle: "core",
      goal: "endurance",
      works: "Core + coordination",
      equipment: "Bodyweight",
    },
    {
      name: "Farmer Carry",
      muscle: "full",
      goal: "strength",
      works: "Grip, traps, core",
      equipment: "2 dumbbells or kettlebells",
    },
    {
      name: "Brisk Walk / Treadmill",
      muscle: "full",
      goal: "endurance",
      works: "Cardio & general health",
      equipment: "Treadmill or outdoors",
    },
  ];

  const grid = document.getElementById("exerciseGrid");
  const chips = document.querySelectorAll(".chip[data-muscle]");
  const searchInput = document.getElementById("exerciseSearch");

  let currentMuscle = "all";

  function render() {
    const search = (searchInput.value || "").toLowerCase();

    const list = exercises.filter((ex) => {
      const muscleMatch =
        currentMuscle === "all" || ex.muscle === currentMuscle;
      const text = (ex.name + ex.works + ex.equipment).toLowerCase();
      const searchMatch = !search || text.includes(search);
      return muscleMatch && searchMatch;
    });

    if (!list.length) {
      grid.innerHTML =
        '<p class="small-note">No matches. Try another filter or clear the search.</p>';
      return;
    }

    grid.innerHTML = list
      .map(
        (ex) => `
      <article class="card">
        <h3>${ex.name}</h3>
        <p><strong>Works:</strong> ${ex.works}</p>
        <p><strong>Best for:</strong> ${ex.goal}</p>
        <p><strong>Equipment:</strong> ${ex.equipment}</p>
      </article>
    `
      )
      .join("");
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentMuscle = chip.getAttribute("data-muscle");
      render();
    });
  });

  searchInput.addEventListener("input", render);

  render();
})();