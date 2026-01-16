// --- CONFIGURATION ---
// We now use Objects instead of Strings to define structure
const taskDefinitions = [
    { name: "Kitchen Clean", parts: 1 },
    { name: "Take Vitamins", parts: 1 }, // Standard square
    { name: "Water (AM/PM)", parts: 2 }, // Split square
    { name: "Do Exercise", parts: 1 },
    { name: "Walk Dog", parts: 2 },      // Split square
    { name: "Read Book", parts: 1 },
    { name: "No Sugar", parts: 1 }
];

const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"];

// --- STATE MANAGEMENT ---
const container = document.getElementById("app-container");

// Load data
let taskData = JSON.parse(localStorage.getItem("myTasks")) || [];

// --- DATA MIGRATION & VALIDATION ---
// We ensure the data structure matches the current definitions.
// If you add a row or change 'parts', this fixes the data automatically.
const totalRows = taskDefinitions.length;
const totalDays = 7;
const neededSize = totalRows * totalDays;

// Resize main array if needed
if (taskData.length !== neededSize) {
    // Fill with empty placeholders if new rows added
    for (let i = taskData.length; i < neededSize; i++) {
        taskData.push(null); 
    }
}

// Deep validation of every cell
taskDefinitions.forEach((taskDef, rowIndex) => {
    for (let day = 0; day < 7; day++) {
        const flatIndex = (rowIndex * 7) + day;
        let cellData = taskData[flatIndex];

        // 1. If cell is empty or old format (string), reset it to array
        if (!Array.isArray(cellData)) {
            cellData = new Array(taskDef.parts).fill("neutral");
            taskData[flatIndex] = cellData;
        }
        
        // 2. If 'parts' count changed (e.g., you changed a task from 1 to 2 parts)
        if (cellData.length !== taskDef.parts) {
            // Reset this specific cell to neutral to avoid errors
            taskData[flatIndex] = new Array(taskDef.parts).fill("neutral");
        }
    }
});


// --- RENDERING ---
function renderGrid() {
    container.innerHTML = ''; 

    // 1. Headers
    const corner = document.createElement("div");
    corner.classList.add("cell", "header-cell");
    corner.innerText = "Task";
    container.appendChild(corner);

    dayHeaders.forEach(day => {
        const header = document.createElement("div");
        header.classList.add("cell", "header-cell");
        header.innerText = day;
        container.appendChild(header);
    });

    // 2. Rows
    taskDefinitions.forEach((task, rowIndex) => {
        // Label
        const label = document.createElement("div");
        label.classList.add("cell", "label-cell");
        label.innerText = task.name;
        container.appendChild(label);

        // Days
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const flatIndex = (rowIndex * 7) + dayIndex;
            const currentStates = taskData[flatIndex]; // This is now an Array ex: ["neutral", "neutral"]

            // Container for the cell
            const squareContainer = document.createElement("div");
            squareContainer.classList.add("task-square"); // relative container

            // Generate Parts (1 or 2)
            currentStates.forEach((status, partIndex) => {
                const btn = document.createElement("div");
                
                // Base classes
                btn.classList.add("split-part", status); // Adds "neutral", "completed", etc.

                // Shape classes
                if (task.parts === 1) {
                    // If only 1 part, it's just a full square, no clipping needed actually, 
                    // but let's treat it as "part-0" without the clip if we wanted.
                    // Actually, easiest is just:
                    btn.style.clipPath = "none"; 
                } else {
                    // Part 0 = Top Left, Part 1 = Bottom Right
                    btn.classList.add(`part-${partIndex}`);
                }

                // Click Handler
                btn.onclick = (e) => {
                    e.stopPropagation(); // Prevent bubbling
                    toggleStatus(flatIndex, partIndex);
                };

                squareContainer.appendChild(btn);
            });

            container.appendChild(squareContainer);
        }
    });
}

function toggleStatus(flatIndex, partIndex) {
    const currentStatus = taskData[flatIndex][partIndex];
    let newStatus = "neutral";

    if (currentStatus === "neutral") newStatus = "completed";
    else if (currentStatus === "completed") newStatus = "failed";
    
    // Update State
    taskData[flatIndex][partIndex] = newStatus;

    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("myTasks", JSON.stringify(taskData));
    renderGrid();
}

renderGrid();