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
const API_KEYS = [
    'AIzaSyAdFrE13TQvqUtdF6lOoHh_HZOVzqYs8Lo',
    'AIzaSyA0spm4jONBRij-Mbt4BoSUOU2d-1rTV0I',
    'AIzaSyCC0hpetqoWZ4QyTHFysM60OlE8bUm7tr4',
    'AIzaSyB-Hs4wDhXwOpppBEqXmpCZgoCucaskLDU',
    'AIzaSyAwBhuwTglVYnGJC8wk4Zps5LxmwAJ4Cj4',
    'AIzaSyAG6_VdTOIAitYdh0swHrJZHglvbKvbi44'
];
let currentKeyIndex = 0;
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

    if (!API_KEYS || API_KEYS.length === 0 || API_KEYS[0] === 'YOUR_API_KEY_HERE') {
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

    // Try to generate with current API key, with automatic rotation on quota exceeded
    await generateWithKeyRotation(studyText, 0);
}

// Function to generate with automatic key rotation
async function generateWithKeyRotation(studyText, attemptCount) {
    // If we've tried all keys, show error
    if (attemptCount >= API_KEYS.length) {
        showError('All API keys have exceeded their quota. Please try again later.');
        return;
    }

    const currentKey = API_KEYS[currentKeyIndex];

    try {
        // Create the prompt for Minecraft analogy
        const prompt = `Ikaw ay nag-eexplain ng concepts sa kaibigan mo na naglalaro ng Minecraft pero wala siyang alam sa topic. Gamitin ang pinakasimpleng salita.

Study Material:
${studyText}

Gumawa ng super simple na Minecraft analogy. Sundin ang mga rules na ito:
1. Magsalita ng casual Tagalog - gamitin ang Taglish kung kailangan (mix ng Tagalog at English)
2. Gumamit ng DIRECT COMPARISONS - sabihin "Ang [concept] ay parang [Minecraft thing]"
3. Halimbawa: "Ang subclass is parang Iron Golem, tapos ang property niya is yung poppy na hawak niya"
4. Use simple Tagalog words lang - wag gumamit ng mahirap na technical terms
5. Pag-usapan lang ang Minecraft stuff (blocks, tools, mobs, crafting, mining)
6. Isulat ng MAXIMUM 2 SENTENCES LANG na nag-eexplain using direct comparisons
7. Pagkatapos, magbigay ng EXACTLY 1 short example lang using Minecraft comparison
8. Sa dulo, magdagdag ng CONCLUSION na nagsisimula sa "Basically, ang [concept] ay" - ito ay super short, jam-packed summary ng analogy at example combined
9. Walang markdown formatting - plain text lang
10. Magsalita parang nag-text ka lang sa tropa mo

Format: 
- Maximum 2 sentences with comparisons
- Exactly 1 example only
- Conclusion: "Basically, ang [concept] ay [super concise summary]"

Keep it super short and simple. Gamitin ang casual Taglish.`;

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
        const response = await fetch(`${GEMINI_API_URL}?key=${currentKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        // Check for quota exceeded error
        if (!response.ok) {
            if (data.error?.message?.includes('quota') || 
                data.error?.message?.includes('RESOURCE_EXHAUSTED') ||
                response.status === 429) {
                console.log(`API key ${currentKeyIndex + 1} quota exceeded, switching to next key...`);
                // Move to next key
                currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
                // Retry with next key
                await generateWithKeyRotation(studyText, attemptCount + 1);
                return;
            }
            throw new Error(data.error?.message || `API Error: ${response.status}`);
        }

        // Extract the generated analogy
        const candidate = data.candidates[0];
        const analogyContent = candidate.content.parts[0].text;

        // Extract grounding metadata if available
        const groundingMetadata = candidate.groundingMetadata;

        // Display results
        displayResults(analogyContent, groundingMetadata);

    } catch (error) {
        console.error('Error:', error);
        // Don't show error if we're retrying with another key
        if (attemptCount < API_KEYS.length - 1) {
            console.log('Retrying with next API key...');
            currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
            await generateWithKeyRotation(studyText, attemptCount + 1);
        } else {
            showError(error.message || 'An unexpected error occurred. Please check your API keys and try again.');
        }
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
