let currentScenario = 0;
    let decisionScore = 0;

    let scenarios = [];

    async function loadScenarios() {
        try {
            const response = await fetch("question_with_id.json");
            const data = await response.json();
    
            
            const scenariosAll = data.scenarios;
            const shuffled = scenariosAll.sort(() => 0.5 - Math.random());
            scenarios = shuffled.slice(0, 10);
            
    
            const startBtn = document.getElementById('start-btn');
            if (startBtn) {
                startBtn.disabled = false;
            }
    
        } catch (error) {
            console.error("Error loading JSON:", error);
        }
    }
    
    

loadScenarios();


    const characterStates = {
        wakeup: {
            mood: "ตื่นตกใจ",
            status: "โอ้ไม่! สายแล้ว!",
            class: "avatar-wakeup"
        },
        office: {
            mood: "ทำยังไงดี",
            status: "เครียด",
            class: "avatar-office"
        },
        conflict: {
            mood: "หักห้ามใจตนเอง",
            status: "",
            class: "avatar-conflict"
        },
        travel: {
            mood: "กังวล",
            status: "",
            class: "avatar-travel"
        },
        career: {
            mood: "ลังเล",
            status: "",
            class: "avatar-career"
        }
        
        
    };
    

    
    function startGame() {
        currentScenario = 0;
        decisionScore = 0;
        updateScore();
        showScenario();
    }

    function updateCharacterDisplay(characterStateKey) {
        const state = characterStates[characterStateKey];
        const avatar = document.getElementById('character-avatar');
        const mood = document.getElementById('character-mood');
        const status = document.getElementById('character-status');

        // Remove all avatar classes
        avatar.className = 'character-avatar';
        // Add new class
        avatar.classList.add(state.class);

        // Update text content
        mood.textContent = state.mood;
        status.textContent = state.status;
    }

    function showScenario() {
        if (currentScenario >= scenarios.length) {
            showGameOver();
            return;
        }

        const scenario = scenarios[currentScenario];
        document.getElementById('scenario-title').textContent = scenario.title;
        document.getElementById('scenario-text').textContent = scenario.text;

        // Update character display
        updateCharacterDisplay(scenario.characterState);

        // Get or create illustration div
        const scenarioCard = document.getElementById('scenario-card');
        let illustrationDiv = scenarioCard.querySelector('.scenario-illustration');
        if (!illustrationDiv) {
            illustrationDiv = document.createElement('div');
            illustrationDiv.className = 'scenario-illustration';
            scenarioCard.insertBefore(illustrationDiv, document.getElementById('scenario-title'));
        }

        // Set background image based on imageUrl
        if (scenario.imageUrl) {
            illustrationDiv.style.backgroundImage = `url('${scenario.imageUrl}')`;
            illustrationDiv.style.backgroundSize = 'cover';
            illustrationDiv.style.backgroundPosition = 'center';
            illustrationDiv.style.display = 'flex'; // Ensure it's visible if hidden previously
            // Clear any old content (like character emoji)
            illustrationDiv.innerHTML = '';
        } else {
            // Fallback if no image URL
            illustrationDiv.style.backgroundImage = 'none';
            illustrationDiv.style.display = 'none';
        }
        
        // Remove old illustration classes if any (e.g., wakeup-scene, office-scene)
        // This is important to ensure the background-image takes precedence
        illustrationDiv.classList.remove('wakeup-scene', 'office-scene', 'conflict-scene', 'travel-scene', 'career-scene');


        const choicesContainer = document.getElementById('choices-container');
        choicesContainer.innerHTML = '';

        scenario.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.innerHTML = `<span class="choice-number">${index + 1}</span>${choice.text}`;
            button.onclick = () => makeChoice(index);
            choicesContainer.appendChild(button);
        });

        document.getElementById('feedback-section').style.display = 'none';
        document.getElementById('scenario-card').style.display = 'block';
        updateProgress();
    }

    function makeChoice(choiceIndex) {
        const scenario = scenarios[currentScenario];
        const choice = scenario.choices[choiceIndex];

        // Update score
        decisionScore += choice.score;
        updateScore();

        // Show feedback
        document.getElementById('feedback-title').textContent = 'ผลการตัดสินใจ';
        document.getElementById('feedback-text').textContent = scenario.feedback[choiceIndex];
        document.getElementById('skill-title').textContent = 'ทักษะการตัดสินใจที่พัฒนา';
        document.getElementById('skill-text').textContent = scenario.skillDevelopment[choiceIndex];

        document.getElementById('scenario-card').style.display = 'none';
        document.getElementById('feedback-section').style.display = 'block';
        document.getElementById('next-btn').style.display = 'block';
    }

    function nextScenario() {
        currentScenario++;
        showScenario();
    }

    function updateScore() {
        // Character display will update based on scenario, not score
    }

    function updateProgress() {
        const progress = ((currentScenario + 1) / scenarios.length) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
    }

    function showGameOver() {
        const maxScore = scenarios.length * 5; // Total scenarios * max score per scenario
        const percentage = Math.round((decisionScore / maxScore) * 100);

        let evaluation = '';
        if (percentage >= 80) {
            evaluation = 'ยอดเยี่ยม! คุณมีทักษะการตัดสินใจที่ดีมาก';
        } else if (percentage >= 60) {
            evaluation = 'ดีมาก! คุณมีทักษะการตัดสินใจที่ดี';
        } else if (percentage >= 40) {
            evaluation = 'ใช้ได้! ยังมีโอกาสพัฒนาทักษะการตัดสินใจอีกมาก';
        } else {
            evaluation = 'ต้องฝึกฝนเพิ่มเติม แต่คุณได้เรียนรู้แล้ว!';
        }

        document.getElementById('final-score').innerHTML = `
            <div>คะแนนการตัดสินใจ: ${decisionScore}/${maxScore} (${percentage}%)</div>
            <div style="margin-top: 15px; font-size: 1.1em; color: #333;">${evaluation}</div>
            <div style="margin-top: 20px; font-size: 0.9em; color: #666; line-height: 1.5;">
                คุณได้ฝึกฝนทักษะการตัดสินใจผ่านสถานการณ์ต่างๆ ในชีวิตประจำวัน<br>
                การตัดสินใจที่ดีต้องใช้การวิเคราะห์ การพิจารณาผลกระทบ และการรับผิดชอบ
            </div>
        `;

        document.getElementById('feedback-section').style.display = 'none';
        document.getElementById('scenario-card').style.display = 'none';
        document.getElementById('game-over').style.display = 'block';
    }

    function restartGame() {
        document.getElementById('game-over').style.display = 'none';
        startGame();
    }

    // Initialize the game
    // updateScore();
    // updateProgress();