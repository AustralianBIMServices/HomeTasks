// --- CONFIGURATION ---
// Add or remove items from this list to generate rows automatically
const taskDefinitions = [
    "Kitchen Clean",
    "Take Vitamins",
    "Do Exercise",
    "Read 10 Mins",
    "Walk Dog",
    "No Sugar",
    "Sleep 8hrs"
];

const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"];

// --- STATE MANAGEMENT ---
// Calculate total interactive squares needed
const totalSquares = taskDefinitions.length * 7;

// Load data or create empty array
// Note: If you change the number of tasks, we might need to reset data to avoid misalignment
let taskData = JSON.parse(localStorage.getItem("myTasks")) || new Array(totalSquares).fill("neutral");

// If the saved data length doesn't match current config, resize it (preserves old data where possible)
if (taskData.length !== totalSquares) {
    const oldData = taskData;
    taskData = new Array(totalSquares).fill("neutral");
    // Copy what we can
    for(let i=0; i < Math.min(oldData.length, totalSquares); i++) {
        taskData[i] = oldData[i];
    }
}

const container = document.getElementById("app-container");

// --- RENDERING ---
function renderGrid() {
    container.innerHTML = ''; // Clear screen

    // 1. Render the Header Row
    // Top-left corner needs to be an empty block or a title
    const corner = document.createElement("div");
    corner.classList.add("cell", "header-cell");
    corner.innerText = "Task";
    container.appendChild(corner);

    // Loop for M, T, W...
    dayHeaders.forEach(day => {
        const header = document.createElement("div");
        header.classList.add("cell", "header-cell");
        header.innerText = day;
        container.appendChild(header);
    });

    // 2. Render the Task Rows
    taskDefinitions.forEach((taskName, rowIndex) => {
        
        // A. Create the Row Label (First Column)
        const label = document.createElement("div");
        label.classList.add("cell", "label-cell");
        label.innerText = taskName;
        container.appendChild(label);

        // B. Create the 7 Days for this task
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            // Calculate unique ID for flat array
            // Logic: (Current Row * 7 days) + Current Day
            const flatIndex = (rowIndex * 7) + dayIndex;

            const square = document.createElement("div");
            square.classList.add("cell", "task-square");

            // Apply Color State
            const status = taskData[flatIndex];
            if (status === "completed") square.classList.add("completed");
            if (status === "failed") square.classList.add("failed");

            // Click Event
            square.onclick = () => toggleStatus(flatIndex);

            container.appendChild(square);
        }
    });
}

function toggleStatus(index) {
    const current = taskData[index];
    
    // Cycle: Neutral -> Green -> Red -> Neutral
    if (current === "neutral") taskData[index] = "completed";
    else if (current === "completed") taskData[index] = "failed";
    else taskData[index] = "neutral";

    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("myTasks", JSON.stringify(taskData));
    renderGrid();
}

// Start
renderGrid();