// --- CONFIGURATION ---
const taskDefinitions = [
    { name: "Kitchen Clean", parts: 1 },
    { name: "Take Vitamins", parts: 1 },
    { name: "Water (AM/PM)", parts: 2 }, 
    { name: "Do Exercise", parts: 1 },
    { name: "Walk Dog", parts: 2 },      
    { name: "Read Book", parts: 1 },
    { name: "No Sugar", parts: 1 }
];

const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"];

// --- SETUP ---
const container = document.getElementById("app-container");
let rawData = localStorage.getItem("myTasks");
let taskData = [];

// Handle Data Loading & Versioning
if (rawData) {
    let parsed = JSON.parse(rawData);
    if (parsed.length > 0 && typeof parsed[0] === "string") {
        taskData = []; // Wipe old string data
    } else {
        taskData = parsed;
    }
}

// Ensure Data Integrity
taskDefinitions.forEach((taskDef, rowIndex) => {
    for (let day = 0; day < 7; day++) {
        const flatIndex = (rowIndex * 7) + day;
        if (!taskData[flatIndex] || taskData[flatIndex].length !== taskDef.parts) {
            taskData[flatIndex] = new Array(taskDef.parts).fill("neutral");
        }
    }
});

// --- FULL SCREEN LOGIC ---
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// --- RENDER ENGINE ---
function renderGrid() {
    container.innerHTML = ''; 

    // 1. Header Corner (The Full Screen Button)
    const corner = document.createElement("div");
    corner.classList.add("cell", "header-cell");
    corner.innerText = "Task";
    corner.style.cursor = "pointer"; // Show it's clickable
    
    // Add the toggle event here
    corner.onclick = toggleFullScreen; 
    
    container.appendChild(corner);

    // 2. Day Headers
    dayHeaders.forEach(day => {
        const header = document.createElement("div");
        header.classList.add("cell", "header-cell");
        header.innerText = day;
        container.appendChild(header);
    });

    // 3. Rows
    taskDefinitions.forEach((task, rowIndex) => {
        // Label
        const label = document.createElement("div");
        label.classList.add("cell", "label-cell");
        label.innerText = task.name;
        container.appendChild(label);

        // Days
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const flatIndex = (rowIndex * 7) + dayIndex;
            const currentStates = taskData[flatIndex]; 

            const squareContainer = document.createElement("div");
            squareContainer.classList.add("task-square");

            currentStates.forEach((status, partIndex) => {
                const btn = document.createElement("div");
                btn.classList.add("split-part", status);

                if (task.parts === 1) {
                    btn.style.clipPath = "none";
                } else {
                    btn.classList.add(`part-${partIndex}`);
                }

                btn.onclick = (e) => {
                    e.stopPropagation(); 
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
    
    taskData[flatIndex][partIndex] = newStatus;
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("myTasks", JSON.stringify(taskData));
    renderGrid();
}

renderGrid();