// Generate unique session ID
function generateSessionId() {
  return (
    'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
  );
}

// State management
const state = {
  sessionId: generateSessionId(),
  stage: 'gathering', // 'gathering' or 'recommend'
  messages: [],
  isRecording: false,
  recognition: null,
};

// DOM elements
const userInput = document.getElementById('userInput');
const micButton = document.getElementById('micButton');
const submitButton = document.getElementById('submitButton');
const statusMessage = document.getElementById('statusMessage');
const conversationHistory = document.getElementById('conversationHistory');
const inputWrapper = document.querySelector('.input-wrapper');

// Initialize speech recognition
function initSpeechRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    state.recognition = new SpeechRecognition();

    state.recognition.continuous = false;
    state.recognition.interimResults = false;
    state.recognition.lang = 'en-US';

    state.recognition.onstart = () => {
      state.isRecording = true;
      micButton.classList.add('recording');
      showStatus('Listening...', 'success');
    };

    state.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      autoResizeTextarea();
      enableSubmitButton();
      showStatus('Speech recognized', 'success');
    };

    state.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      showStatus(`Error: ${event.error}`, 'error');
      state.isRecording = false;
      micButton.classList.remove('recording');
    };

    state.recognition.onend = () => {
      state.isRecording = false;
      micButton.classList.remove('recording');
      if (!userInput.value) {
        showStatus('', '');
      }
    };
  } else {
    console.warn('Speech recognition not supported');
    micButton.style.display = 'none';
  }
}

// Auto-resize textarea
function autoResizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 200) + 'px';
}

// Enable/disable submit button based on input
function enableSubmitButton() {
  submitButton.disabled = !userInput.value.trim();
}

// Show status message
function showStatus(message, type = '') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;

  if (message && type !== 'error') {
    setTimeout(() => {
      if (statusMessage.textContent === message) {
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
      }
    }, 3000);
  }
}

// Add message to conversation history
function addMessage(content, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;

  const labelDiv = document.createElement('div');
  labelDiv.className = 'message-label';
  labelDiv.textContent = sender === 'user' ? 'You' : 'FCI Assistant';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = content;

  messageDiv.appendChild(labelDiv);
  messageDiv.appendChild(contentDiv);
  conversationHistory.appendChild(messageDiv);

  conversationHistory.classList.add('active');
  inputWrapper.classList.add('has-conversation');

  // Hide header when conversation starts
  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) {
    pageHeader.classList.add('hidden');
  }

  // Auto scroll to bottom
  setTimeout(() => {
    conversationHistory.scrollTop = conversationHistory.scrollHeight;
  }, 100);
}

// Add loading indicator
function showLoading(message = null) {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message ai loading-message';
  loadingDiv.id = 'loadingMessage';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'message-label';
  labelDiv.textContent = 'FCI Assistant';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  if (message) {
    contentDiv.innerHTML = `${message} <span class="loading"></span>`;
  } else {
    contentDiv.innerHTML = '<span class="loading"></span>';
  }

  loadingDiv.appendChild(labelDiv);
  loadingDiv.appendChild(contentDiv);
  conversationHistory.appendChild(loadingDiv);

  // Auto scroll to bottom
  setTimeout(() => {
    conversationHistory.scrollTop = conversationHistory.scrollHeight;
  }, 100);
}

// Remove loading indicator
function hideLoading() {
  const loadingMessage = document.getElementById('loadingMessage');
  if (loadingMessage) {
    loadingMessage.remove();
  }
}

// Handle AI response via webhook
async function getAIResponse(userMessage) {
  const webhookUrl = 'https://n8n.srv983823.hstgr.cloud/webhook/newsletter';

  try {
    // Create an AbortController with extended timeout (5 minutes)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: state.sessionId,
        message: userMessage,
        stage: state.stage,
        conversationHistory: state.messages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle n8n response structure: [{ output: "message" }]
    console.log('Webhook response:', data);

    // Return the complete response data
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timeout after 5 minutes');
      throw new Error(
        'Request timed out. The newsletter generation is taking longer than expected.'
      );
    }
    console.error('Webhook error:', error);
    throw error;
  }
}

// Call generate-newsletter webhook
async function callGenerateNewsletterWebhook(previousResponseData) {
  const generateWebhookUrl =
    'https://n8n.srv983823.hstgr.cloud/webhook/generate-newsletter';

  try {
    console.log(
      'Calling generate-newsletter webhook with data:',
      previousResponseData
    );

    // Extract the summary from the response
    let summary = '';
    if (
      Array.isArray(previousResponseData) &&
      previousResponseData.length > 0
    ) {
      const dataObj = previousResponseData[0].output || previousResponseData[0];
      summary = dataObj.summary || '';
    } else {
      const dataObj = previousResponseData.output || previousResponseData;
      summary = dataObj.summary || '';
    }

    console.log('Extracted summary:', summary);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

    const response = await fetch(generateWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: state.sessionId,
        summary: summary,
        previousResponse: previousResponseData,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Generate-newsletter webhook response:', data);

    // Extract response object (handle both array and direct object responses)
    let responseObj;
    if (Array.isArray(data) && data.length > 0) {
      responseObj = data[0].output || data[0];
    } else {
      responseObj = data.output || data;
    }

    // Check if the response stage is 'gathering' (back to gathering more info)
    if (responseObj.stage === 'gathering') {
      console.log('Stage returned to gathering - showing reply to customer');
      hideLoading();

      // Update state to gathering
      state.stage = 'gathering';

      // Display the reply message to the customer
      const replyMessage =
        responseObj.reply ||
        responseObj.message ||
        "I couldn't find matching products. Could you provide more details?";

      state.messages.push({ role: 'ai', content: replyMessage });
      addMessage(replyMessage, 'ai');

      // Return with gathering flag so handleSubmit knows not to generate newsletter
      return { ...data, backToGathering: true };
    }

    // Check if newsletter is ready from the generate webhook response
    let newsletterReady = false;
    newsletterReady =
      responseObj.newsletterReady === true ||
      (responseObj.data && responseObj.data.products) ||
      responseObj.success === true ||
      (responseObj.products && responseObj.products.length > 0);

    if (newsletterReady) {
      // Remove loading if it exists
      hideLoading();

      // Check if there's a reply message to show before generating newsletter
      const replyMessage = responseObj.reply || responseObj.message;

      if (replyMessage) {
        // Add the reply message to conversation history
        state.messages.push({ role: 'ai', content: replyMessage });
        addMessage(replyMessage, 'ai');
      }

      // Trigger newsletter generation
      generateNewsletter(data);
    }

    return data;
  } catch (error) {
    hideLoading();
    if (error.name === 'AbortError') {
      console.error('Generate-newsletter request timeout after 5 minutes');
      showStatus('Newsletter generation timed out. Please try again.', 'error');
    } else {
      console.error('Generate-newsletter webhook error:', error);
    }
    throw error;
  }
}

// Handle form submission
async function handleSubmit() {
  const message = userInput.value.trim();
  if (!message) return;

  // Add user message to history
  state.messages.push({ role: 'user', content: message });
  addMessage(message, 'user');

  // Clear input
  userInput.value = '';
  autoResizeTextarea();
  enableSubmitButton();

  // Get AI response
  try {
    // Show initial loading
    showLoading();

    const responseData = await getAIResponse(message);
    hideLoading();

    // Extract the text message from the response
    let aiMessage;
    let newsletterReady = false;
    let shouldGenerateNewsletter = false;

    if (Array.isArray(responseData) && responseData.length > 0) {
      // Check if response has output wrapper (n8n format)
      const dataObj = responseData[0].output || responseData[0];

      console.log('Full response data object:', dataObj);
      console.log('Stage value:', dataObj.stage);

      // Check if stage is 'recommend' - this triggers the generate-newsletter webhook
      shouldGenerateNewsletter = dataObj.stage === 'recommend';

      // Check if newsletter is ready - check multiple indicators
      newsletterReady =
        dataObj.newsletterReady === true ||
        (dataObj.data && dataObj.data.products) ||
        dataObj.success === true;

      console.log('Newsletter ready check:', {
        newsletterReady: dataObj.newsletterReady,
        hasData: !!dataObj.data,
        hasProducts: !!(dataObj.data && dataObj.data.products),
        success: dataObj.success,
        stage: dataObj.stage,
        shouldGenerateNewsletter: shouldGenerateNewsletter,
        finalResult: newsletterReady,
      });

      // If newsletter is ready, skip showing the message since we'll show the generation message
      if (newsletterReady) {
        aiMessage = dataObj.message || 'Your selection is being prepared...';
      } else {
        aiMessage =
          dataObj.reply ||
          dataObj.output ||
          dataObj.message ||
          'Thank you for that information!';
      }
    } else {
      // Check if response has output wrapper (n8n format)
      const dataObj = responseData.output || responseData;

      console.log('Full response data object (non-array):', dataObj);
      console.log('Stage value:', dataObj.stage);

      // Check if stage is 'recommend' - this triggers the generate-newsletter webhook
      shouldGenerateNewsletter = dataObj.stage === 'recommend';

      newsletterReady =
        dataObj.newsletterReady === true ||
        (dataObj.data && dataObj.data.products) ||
        dataObj.success === true;

      if (newsletterReady) {
        aiMessage = dataObj.message || 'Your selection is being prepared...';
      } else {
        aiMessage =
          dataObj.reply ||
          dataObj.output ||
          dataObj.message ||
          'Thank you for that information!';
      }
    }

    // Only add AI message if newsletter is not ready
    // If newsletter is ready, we'll show the generation message directly
    if (!newsletterReady) {
      state.messages.push({ role: 'ai', content: aiMessage });
      addMessage(aiMessage, 'ai');
    }

    // Check if we're in recommend stage and newsletter is ready
    const currentStage =
      Array.isArray(responseData) && responseData.length > 0
        ? (responseData[0].output || responseData[0]).stage
        : (responseData.output || responseData).stage;

    if (currentStage === 'recommend' && !newsletterReady) {
      console.log('Stage is recommend, showing loading message...');

      // Update the loading message for the recommend stage
      const existingLoading = document.getElementById('loadingMessage');
      if (existingLoading) {
        existingLoading.remove();
      }
      showLoading('✨ Finding the perfect pieces for you...');

      showStatus('Generating your personalized selection...', 'success');
    }

    // Check if stage is 'recommend' and call generate-newsletter webhook
    if (shouldGenerateNewsletter) {
      console.log('Stage is recommend, calling generate-newsletter webhook...');
      const generateResult = await callGenerateNewsletterWebhook(responseData);

      // If generate-newsletter returned to gathering stage, stop here
      // The message has already been displayed in callGenerateNewsletterWebhook
      if (generateResult && generateResult.backToGathering) {
        console.log('Returned to gathering stage, continuing conversation...');
        return; // Exit handleSubmit, allowing customer to respond
      }
    }

    // Update stage based on response from workflow
    if (newsletterReady) {
      console.log('Newsletter is ready, generating...', responseData);

      // Remove loading if it exists
      hideLoading();

      // Immediately trigger newsletter generation
      generateNewsletter(responseData);
    }
  } catch (error) {
    hideLoading();
    console.error('Error:', error);

    // Show retry button and helpful message
    showRetryButton();
  }
}

// Generate newsletter
function generateNewsletter(newsletterData) {
  console.log('generateNewsletter called with:', newsletterData);

  // Show loading message in conversation
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message ai';
  loadingDiv.id = 'newsletterLoading';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'message-label';
  labelDiv.textContent = 'FCI Assistant';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.innerHTML =
    '✨ Generating your personalized selection... <span class="loading"></span>';

  loadingDiv.appendChild(labelDiv);
  loadingDiv.appendChild(contentDiv);
  conversationHistory.appendChild(loadingDiv);

  // Auto scroll to bottom
  conversationHistory.scrollTop = conversationHistory.scrollHeight;

  // Store session data and newsletter data for the newsletter page
  sessionStorage.setItem('sessionId', state.sessionId);
  sessionStorage.setItem('newsletterData', JSON.stringify(newsletterData));

  // Simulate processing time and show completion
  setTimeout(() => {
    // Remove loading message
    const loadingMsg = document.getElementById('newsletterLoading');
    if (loadingMsg) {
      loadingMsg.remove();
    }

    // Add completion message
    addMessage(
      'Click "View Selection" below to see your curated product picks.',
      'ai'
    );

    showStatus('Your personalized selection is ready!', 'success');

    // Show button to view newsletter
    showNewsletterButton();
  }, 1500);
}

// Show newsletter button
function showNewsletterButton() {
  console.log('showNewsletterButton called');
  const actionButtons = document.querySelector('.action-buttons');

  if (!actionButtons) {
    console.error('Action buttons container not found!');
    return;
  }

  console.log('Action buttons found, creating buttons...');

  // Clear existing buttons
  actionButtons.innerHTML = '';

  // Create view newsletter button
  const viewNewsletterBtn = document.createElement('button');
  viewNewsletterBtn.className = 'submit-button';
  viewNewsletterBtn.textContent = 'View Selection';
  viewNewsletterBtn.addEventListener('click', () => {
    window.location.href = 'newsletter.php';
  });

  // Create reset button
  const resetBtn = document.createElement('button');
  resetBtn.className = 'submit-button';
  resetBtn.textContent = 'Reset Brief';
  resetBtn.style.backgroundColor = '#ffffff';
  resetBtn.style.color = '#000000';
  resetBtn.addEventListener('click', () => {
    window.location.reload();
  });

  actionButtons.appendChild(viewNewsletterBtn);
  actionButtons.appendChild(resetBtn);

  console.log('Buttons added successfully');
}

// Show retry button when error occurs
function showRetryButton() {
  console.log('showRetryButton called');

  // Change the submit button text to "Retry"
  submitButton.textContent = 'Retry';
  submitButton.disabled = false;

  // Add message prompting user to be more specific
  addMessage(
    "I wasn't able to find exactly what you're looking for at the moment. Could you please provide more specific details about the furniture pieces you're interested in, or include a price range? This will help me assist you better.",
    'ai'
  );
}

// Event listeners
userInput.addEventListener('input', () => {
  autoResizeTextarea();
  enableSubmitButton();

  // Reset button text back to "Continue" if it was changed to "Retry"
  if (submitButton.textContent === 'Retry') {
    submitButton.textContent = 'Continue';
  }
});

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!submitButton.disabled) {
      handleSubmit();
    }
  }
});

micButton.addEventListener('click', () => {
  if (!state.recognition) {
    showStatus('Speech recognition not supported in this browser', 'error');
    return;
  }

  if (state.isRecording) {
    state.recognition.stop();
  } else {
    state.recognition.start();
  }
});

submitButton.addEventListener('click', handleSubmit);

// Initialize
initSpeechRecognition();
userInput.focus();
