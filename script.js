// 1. Define your Data (The ViewModel)
// Simple structure: 7 days, let's say 4 tasks per day = 28 squares
const totalDays = 7;
const tasksPerDay = 5; 
const totalSquares = totalDays * tasksPerDay;

// Load from memory or create new array
let taskData = JSON.parse(localStorage.getItem("myTasks")) || new Array(totalSquares).fill("neutral");

const container = document.getElementById("app-container");

// 2. The Render Loop (Like InitializeComponent)
function renderGrid() {
    container.innerHTML = ''; // Clear existing

    taskData.forEach((status, index) => {
        // Create a div (like new Button())
        const square = document.createElement("div");
        square.classList.add("task-square");
        
        // Apply classes based on loaded data
        if (status === "completed") square.classList.add("completed");
        if (status === "failed") square.classList.add("failed");

        // 3. Click Handler (The Event Listener)
        square.onclick = () => {
            toggleStatus(index);
        };

        container.appendChild(square);
    });
}

// 4. Logic to handle clicks
function toggleStatus(index) {
    const current = taskData[index];
    
    // Cycle: Neutral -> Green -> Red -> Neutral
    if (current === "neutral") taskData[index] = "completed";
    else if (current === "completed") taskData[index] = "failed";
    else taskData[index] = "neutral";

    // Save to phone storage
    localStorage.setItem("myTasks", JSON.stringify(taskData));
    
    // Re-render UI
    renderGrid();
}

// Initial Run
renderGrid();