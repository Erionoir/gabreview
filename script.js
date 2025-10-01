// DOM Elements
const studyTextarea = document.getElementById('studyText');
const generateBtn = document.getElementById('generateBtn');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const resultContent = document.getElementById('resultContent');
const errorState = document.getElementById('errorState');
const analogyText = document.getElementById('analogyText');
const sourcesSection = document.getElementById('sourcesSection');
const sourcesList = document.getElementById('sourcesList');
const errorMessage = document.getElementById('errorMessage');
const copyBtn = document.getElementById('copyBtn');

// API Configuration
const GEMINI_API_KEY = 'AIzaSyAdFrE13TQvqUtdF6lOoHh_HZOVzqYs8Lo'; // Replace with your actual Gemini API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Generate analogy on button click
generateBtn.addEventListener('click', generateAnalogy);

// Allow Enter key with Ctrl to submit
studyTextarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        generateAnalogy();
    }
});

// Copy to clipboard functionality
copyBtn.addEventListener('click', () => {
    const textToCopy = analogyText.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Visual feedback
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
        }, 2000);
    });
});

// Main function to generate Minecraft analogy
async function generateAnalogy() {
    const studyText = studyTextarea.value.trim();

    // Validation
    if (!studyText) {
        showError('Please enter some study material to create an analogy.');
        return;
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        showError('API key not configured. Please add your Gemini API key to the script.js file.');
        return;
    }

    // Check if user is asking meta questions about the AI
    const lowerText = studyText.toLowerCase();
    const metaQuestions = ['what ai', 'what model', 'which ai', 'which model', 'what are you', 'who are you', 'what language model', 'which language model', 'gemini', 'chatgpt', 'gpt', 'claude'];
    if (metaQuestions.some(question => lowerText.includes(question))) {
        showError('Please enter study material to create an analogy.');
        return;
    }

    // Show loading state
    showLoading();

    try {
        // Create the prompt for Minecraft analogy
        const prompt = `You are explaining concepts to someone who has played Minecraft but knows nothing about the topic. Use the simplest possible language.

Study Material:
${studyText}

Create a super simple Minecraft analogy. Follow these rules:
1. Pretend you're talking to a friend who plays Minecraft - use everyday, simple words
2. NO complicated or technical words - only use words a 12-year-old would know
3. Talk ONLY about Minecraft things (blocks, tools, mobs, crafting, mining, etc.) - avoid the original fancy terms
4. Write one short paragraph (3-5 sentences max) explaining it like you would to a beginner
5. Then give up to 3 very short examples using only Minecraft stuff
6. Use simple sentences - no long, complex explanations
7. NO markdown formatting at all (no asterisks, hashtags, dashes, or special symbols)
8. Write in plain text only like you're texting a friend
9. Think: "How would I explain this to someone who only knows Minecraft?"

Keep it short, simple, and easy. Use basic words only.`;

        // Prepare request body with Google Search grounding and thinking
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            tools: [{
                googleSearch: {}
            }],
            generationConfig: {
                temperature: 1.0,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        // Make API request
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();

        // Extract the generated analogy
        const candidate = data.candidates[0];
        const analogyContent = candidate.content.parts[0].text;

        // Extract grounding metadata if available
        const groundingMetadata = candidate.groundingMetadata;

        // Display results
        displayResults(analogyContent, groundingMetadata);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An unexpected error occurred. Please check your API key and try again.');
    }
}

function showLoading() {
    generateBtn.disabled = true;
    generateBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
    `;
    
    emptyState.classList.add('hidden');
    resultContent.classList.add('hidden');
    errorState.classList.add('hidden');
    loadingState.classList.remove('hidden');
}

function showError(message) {
    generateBtn.disabled = false;
    generateBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
    `;
    
    loadingState.classList.add('hidden');
    emptyState.classList.add('hidden');
    resultContent.classList.add('hidden');
    errorState.classList.remove('hidden');
    
    errorMessage.textContent = message;
}

function displayResults(analogy, groundingMetadata) {
    generateBtn.disabled = false;
    generateBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
    `;
    
    loadingState.classList.add('hidden');
    emptyState.classList.add('hidden');
    errorState.classList.add('hidden');
    resultContent.classList.remove('hidden');
    
    // Display the analogy
    analogyText.textContent = analogy;
    
    // Display sources if available
    if (groundingMetadata && groundingMetadata.groundingChunks && groundingMetadata.groundingChunks.length > 0) {
        sourcesSection.classList.remove('hidden');
        sourcesList.innerHTML = '';
        
        groundingMetadata.groundingChunks.forEach((chunk, index) => {
            if (chunk.web) {
                const sourceItem = document.createElement('div');
                sourceItem.className = 'source-item';
                sourceItem.innerHTML = `
                    <span class="source-number">${index + 1}</span>
                    <a href="${chunk.web.uri}" target="_blank" rel="noopener noreferrer">
                        ${chunk.web.title || 'Source'}
                    </a>
                `;
                sourcesList.appendChild(sourceItem);
            }
        });
    } else {
        sourcesSection.classList.add('hidden');
    }
    
    // Scroll to results
    resultContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add keyboard shortcut info
console.log('%c🎮 Minecraft Study Buddy', 'font-size: 20px; font-weight: bold; color: #7cb342;');
console.log('%cTip: Press Ctrl+Enter in the text area to generate an analogy!', 'color: #666;');
