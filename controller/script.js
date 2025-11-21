// ===== CONFIGURATION =====
const WISPRFLOW_API_KEY = 'fl-9953569e43701a6ced5720e5cd0b60ee'; // Replace with your actual API key
const WISPRFLOW_API_URL = 'https://platform-api.wisprflow.ai/api/v1/dash/api';

// Generate unique session ID
function generateSessionId() {
  return (
    'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
  );
}

// State management
const state = {
  sessionId: generateSessionId(),
  stage: 'gathering',
  messages: [],
  isRecording: false,
  mediaRecorder: null,
  audioChunks: [],
};

const userInput = document.getElementById('userInput');
const micButton = document.getElementById('micButton');
const submitButton = document.getElementById('submitButton');
const statusMessage = document.getElementById('statusMessage');
const conversationHistory = document.getElementById('conversationHistory');
const inputWrapper = document.querySelector('.input-wrapper');
const promptText = document.querySelector('.prompt-text');

// ===== WISPRFLOW AI AUDIO FUNCTIONS =====

// Convert Blob to Base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Convert WebM to 16kHz WAV (required by Wisprflow)
const convertWebMToWAV = async (webmBlob) => {
  const audioContext = new AudioContext();
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Calculate the correct number of samples at 16 kHz
  const targetSampleRate = 16000;
  const resampleRatio = targetSampleRate / audioBuffer.sampleRate;
  const newLength = Math.floor(audioBuffer.length * resampleRatio);

  // Create an OfflineAudioContext with the correct length
  const offlineAudioContext = new OfflineAudioContext(
    1, // mono channel
    newLength,
    targetSampleRate
  );

  const source = offlineAudioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineAudioContext.destination);
  source.start(0);

  const renderedBuffer = await offlineAudioContext.startRendering();

  // Prepare WAV file headers and data
  const numberOfChannels = 1;
  const length = renderedBuffer.length * numberOfChannels * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  let offset = 0;

  // RIFF chunk descriptor
  writeString(view, offset, 'RIFF');
  offset += 4;
  view.setUint32(
    offset,
    36 + renderedBuffer.length * numberOfChannels * 2,
    true
  );
  offset += 4;
  writeString(view, offset, 'WAVE');
  offset += 4;

  // fmt sub-chunk
  writeString(view, offset, 'fmt ');
  offset += 4;
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, numberOfChannels, true);
  offset += 2;
  view.setUint32(offset, targetSampleRate, true);
  offset += 4;
  view.setUint32(offset, targetSampleRate * numberOfChannels * 2, true);
  offset += 4;
  view.setUint16(offset, numberOfChannels * 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;

  // data sub-chunk
  writeString(view, offset, 'data');
  offset += 4;
  view.setUint32(offset, renderedBuffer.length * numberOfChannels * 2, true);
  offset += 4;

  // Write PCM samples
  const channelData = renderedBuffer.getChannelData(0);
  for (let i = 0; i < renderedBuffer.length; i++) {
    const sample = channelData[i];
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
};

// Send audio to Wisprflow AI for transcription
async function transcribeWithWisprflow(audioBlob) {
  try {
    showStatus('Processing speech...', 'success');

    const base64Audio = await blobToBase64(audioBlob);
    const requestBody = {
      audio: base64Audio,
      language: ['en'],
      context: {
        app: {
          type: 'other',
        },
        dictionary_context: [],
        textbox_contents: {
          before_text: '',
          selected_text: '',
          after_text: '',
        },
      },
    };
    const response = await fetch(WISPRFLOW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WISPRFLOW_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    // Get the response text for better error debugging
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', responseText);

    if (!response.ok) {
      let errorMessage = `Wisprflow API error: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch (e) {
        errorMessage += ` - ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    const result = JSON.parse(responseText);

    // Extract transcribed text from response (try multiple field names)
    const transcript = result.text || result.transcript || result.output || '';

    if (transcript) {
      userInput.value = transcript;
      autoResizeTextarea();
      enableSubmitButton();
      showStatus('Speech recognized', 'success');
    } else {
      console.warn('No transcript found in response. Full response:', result);
      showStatus('No speech detected', 'error');
    }

    return transcript;
  } catch (error) {
    console.error('Wisprflow transcription error:', error);
    showStatus(`Transcription error: ${error.message}`, 'error');
    return null;
  }
}

// Initialize Wisprflow recording
async function initWisprflowRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    state.mediaRecorder = new MediaRecorder(stream);

    state.mediaRecorder.ondataavailable = (event) => {
      state.audioChunks.push(event.data);
    };

    state.mediaRecorder.onstop = async () => {
      const webmBlob = new Blob(state.audioChunks, { type: 'audio/webm' });

      // Check if audio is too short
      if (webmBlob.size < 1000) {
        showStatus(
          'Recording too short. Please speak for at least 1 second.',
          'error'
        );
        state.audioChunks = [];
        state.isRecording = false;
        micButton.classList.remove('recording');
        return;
      }

      console.log('WebM blob size:', webmBlob.size);

      try {
        // Convert to 16kHz WAV
        const wavBlob = await convertWebMToWAV(webmBlob);
        console.log('WAV blob size:', wavBlob.size);

        // Send to Wisprflow for transcription
        await transcribeWithWisprflow(wavBlob);
      } catch (error) {
        console.error('Error processing audio:', error);
        showStatus(`Error: ${error.message}`, 'error');
      }

      // Reset chunks
      state.audioChunks = [];
      state.isRecording = false;
      micButton.classList.remove('recording');
    };

    state.mediaRecorder.onstart = () => {
      state.isRecording = true;
      micButton.classList.add('recording');
      showStatus('Listening...', 'success');
    };

    state.mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event.error);
      showStatus(`Recording error: ${event.error}`, 'error');
      state.isRecording = false;
      micButton.classList.remove('recording');
    };

    return true;
  } catch (error) {
    console.error('Microphone access error:', error);
    showStatus('Could not access microphone', 'error');
    micButton.style.display = 'none';
    return false;
  }
}

// Start/Stop recording
async function toggleRecording() {
  if (!state.mediaRecorder) {
    const initialized = await initWisprflowRecording();
    if (!initialized) return;
  }

  if (state.isRecording) {
    // Stop recording
    state.mediaRecorder.stop();
    showStatus('Processing...', 'success');
  } else {
    // Start recording
    state.audioChunks = [];
    state.mediaRecorder.start();
  }
}

// ===== UI FUNCTIONS =====

function autoResizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 200) + 'px';
}

function enableSubmitButton() {
  submitButton.disabled = !userInput.value.trim();
}

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

function addMessage(content, sender, allowHTML = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;

  const labelDiv = document.createElement('div');
  labelDiv.className = 'message-label';
  labelDiv.textContent = sender === 'user' ? 'You' : 'FCI Assistant';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  // Check if content contains HTML tags, if so use innerHTML
  if (allowHTML || /<[a-z][\s\S]*>/i.test(content)) {
    contentDiv.innerHTML = content;
  } else {
    contentDiv.textContent = content;
  }

  messageDiv.appendChild(labelDiv);
  messageDiv.appendChild(contentDiv);
  conversationHistory.appendChild(messageDiv);

  conversationHistory.classList.add('active');
  inputWrapper.classList.add('has-conversation');

  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) {
    pageHeader.classList.add('hidden');
  }

  setTimeout(() => {
    conversationHistory.scrollTop = conversationHistory.scrollHeight;
  }, 100);
}

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

  setTimeout(() => {
    conversationHistory.scrollTop = conversationHistory.scrollHeight;
  }, 100);
}

function hideLoading() {
  const loadingMessage = document.getElementById('loadingMessage');
  if (loadingMessage) {
    loadingMessage.remove();
  }
}

// ===== API FUNCTIONS =====

async function getAIResponse(userMessage) {
  const webhookUrl = 'https://n8n.srv983823.hstgr.cloud/webhook/newsletter';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);

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
    console.log('Webhook response:', data);

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

async function callShowroomWebhook(userPreferences) {
  const showroomWebhookUrl =
    'https://n8n.srv983823.hstgr.cloud/webhook/fci-showroom';

  try {
    const response = await fetch(showroomWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: state.sessionId,
        preferences: userPreferences,
        conversationHistory: state.messages,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error(`Showroom webhook error! status: ${response.status}`);
      return null;
    } else {
      const data = await response.json();
      console.log('Showroom webhook response:', data);
      return data;
    }
  } catch (error) {
    console.error('Showroom webhook error:', error);
    return null;
  }
}

async function callGenerateNewsletterWebhook(previousResponseData) {
  const generateWebhookUrl =
    'https://n8n.srv983823.hstgr.cloud/webhook/generate-newsletter';

  try {
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);

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

    let responseObj;
    if (Array.isArray(data) && data.length > 0) {
      responseObj = data[0].output || data[0];
    } else {
      responseObj = data.output || data;
    }

    if (responseObj.stage === 'gathering') {
      console.log('Stage returned to gathering - showing reply to customer');
      hideLoading();

      state.stage = 'gathering';

      const replyMessage =
        responseObj.reply ||
        responseObj.message ||
        "I couldn't find matching products. Could you provide more details?";

      state.messages.push({ role: 'ai', content: replyMessage });
      addMessage(replyMessage, 'ai');

      return { ...data, backToGathering: true };
    }

    let newsletterReady = false;
    newsletterReady =
      responseObj.newsletterReady === true ||
      (responseObj.data && responseObj.data.products) ||
      responseObj.success === true ||
      (responseObj.products && responseObj.products.length > 0);

    if (newsletterReady) {
      hideLoading();

      const replyMessage = responseObj.reply || responseObj.message;

      if (replyMessage) {
        state.messages.push({ role: 'ai', content: replyMessage });
        addMessage(replyMessage, 'ai');
      }

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

async function handleSubmit() {
  const message = userInput.value.trim();
  if (!message) return;

  state.messages.push({ role: 'user', content: message });
  addMessage(message, 'user');

  userInput.value = '';
  autoResizeTextarea();
  enableSubmitButton();

  try {
    showLoading();

    const responseData = await getAIResponse(message);
    hideLoading();

    let aiMessage;
    let newsletterReady = false;
    let shouldGenerateNewsletter = false;

    if (Array.isArray(responseData) && responseData.length > 0) {
      const dataObj = responseData[0].output || responseData[0];

      shouldGenerateNewsletter = dataObj.stage === 'recommend';

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
      const dataObj = responseData.output || responseData;

      console.log('Full response data object (non-array):', dataObj);
      console.log('Stage value:', dataObj.stage);

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

    if (!newsletterReady) {
      state.messages.push({ role: 'ai', content: aiMessage });
      addMessage(aiMessage, 'ai');
    }

    const currentStage =
      Array.isArray(responseData) && responseData.length > 0
        ? (responseData[0].output || responseData[0]).stage
        : (responseData.output || responseData).stage;

    if (currentStage === 'recommend' && !newsletterReady) {
      console.log('Stage is recommend, showing loading message...');

      const existingLoading = document.getElementById('loadingMessage');
      if (existingLoading) {
        existingLoading.remove();
      }
      showLoading('✨ Finding the perfect pieces for you...');

      showStatus('Generating your personalized selection...', 'success');
    }

    if (shouldGenerateNewsletter) {
      console.log('Stage is recommend, calling webhooks...');

      let userPreferences = {};
      if (Array.isArray(responseData) && responseData.length > 0) {
        const dataObj = responseData[0].output || responseData[0];
        userPreferences = dataObj.summary || dataObj.preferences || {};
      } else {
        const dataObj = responseData.output || responseData;
        userPreferences = dataObj.summary || dataObj.preferences || {};
      }

      callShowroomWebhook(userPreferences)
        .then((showroomResponse) => {
          if (showroomResponse) {
            console.log('Processing showroom response:', showroomResponse);

            let showroomMessage = '';
            if (
              Array.isArray(showroomResponse) &&
              showroomResponse.length > 0
            ) {
              const responseObj =
                showroomResponse[0].output || showroomResponse[0];
              showroomMessage =
                responseObj.content || responseObj.message || '';
            } else {
              const responseObj = showroomResponse.output || showroomResponse;
              showroomMessage =
                responseObj.content || responseObj.message || '';
            }

            if (showroomMessage) {
              // Hyperlink the word "showroom" in the message
              const hyperlinkedMessage = showroomMessage.replace(
                /\bshowroom\b/gi,
                '<a href="https://www.fcilondon.co.uk/about-us/map-and-directions.html" target="_blank" style="color: #000000; text-decoration: underline;">showroom</a>'
              );

              state.messages.push({ role: 'ai', content: showroomMessage });
              addMessage(hyperlinkedMessage, 'ai');

              showAppointmentButton();
            }
          }
        })
        .catch((error) => {
          console.error('Error processing showroom response:', error);
        });

      const generateResult = await callGenerateNewsletterWebhook(responseData);
      if (generateResult && generateResult.backToGathering) {
        console.log('Returned to gathering stage, continuing conversation...');
        return;
      }
    }

    if (newsletterReady) {
      console.log('Newsletter is ready, generating...', responseData);

      hideLoading();

      generateNewsletter(responseData);
    }
  } catch (error) {
    hideLoading();
    console.error('Error:', error);

    showRetryButton();
  }
}

function generateNewsletter(newsletterData) {
  console.log('generateNewsletter called with:', newsletterData);

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

  conversationHistory.scrollTop = conversationHistory.scrollHeight;

  sessionStorage.setItem('sessionId', state.sessionId);
  sessionStorage.setItem('newsletterData', JSON.stringify(newsletterData));

  setTimeout(() => {
    const loadingMsg = document.getElementById('newsletterLoading');
    if (loadingMsg) {
      loadingMsg.remove();
    }

    addMessage(
      'Click "View Selection" below to see your curated product picks.',
      'ai'
    );

    showStatus('Your personalized selection is ready!', 'success');
    showNewsletterButton();
  }, 1500);
}

function showAppointmentButton() {
  console.log('showAppointmentButton called');
  const actionButtons = document.querySelector('.action-buttons');

  if (!actionButtons) {
    console.error('Action buttons container not found!');
    return;
  }

  const existingAppointmentBtn = actionButtons.querySelector(
    '.appointment-button'
  );
  if (existingAppointmentBtn) {
    console.log('Appointment button already exists');
    return;
  }

  const bookAppointmentBtn = document.createElement('button');
  bookAppointmentBtn.className = 'submit-button appointment-button';
  bookAppointmentBtn.textContent = 'Book an Appointment';
  bookAppointmentBtn.style.backgroundColor = '#000000';
  bookAppointmentBtn.style.color = '#ffffff';
  bookAppointmentBtn.addEventListener('click', () => {
    window.open(
      'https://www.fcilondon.co.uk/book-a-showroom-visit.html',
      '_blank'
    );
  });

  actionButtons.insertBefore(bookAppointmentBtn, actionButtons.firstChild);
}

function showNewsletterButton() {
  const actionButtons = document.querySelector('.action-buttons');

  if (!actionButtons) {
    console.error('Action buttons container not found!');
    return;
  }

  actionButtons.innerHTML = '';

  const viewNewsletterBtn = document.createElement('button');
  viewNewsletterBtn.className = 'submit-button';
  viewNewsletterBtn.textContent = 'View Selection';
  viewNewsletterBtn.addEventListener('click', () => {
    window.location.href = 'newsletter.php';
  });

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

function showRetryButton() {
  console.log('showRetryButton called');
  submitButton.textContent = 'Retry';
  submitButton.disabled = false;
  addMessage(
    "I wasn't able to find exactly what you're looking for at the moment. Could you please provide more specific details about the furniture pieces you're interested in, or include a price range? This will help me assist you better.",
    'ai'
  );
}

// ===== EVENT LISTENERS =====

userInput.addEventListener('input', () => {
  autoResizeTextarea();
  enableSubmitButton();

  if (submitButton.textContent === 'Retry') {
    submitButton.textContent = 'Continue';
  }
});

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!submitButton.disabled) {
      if (promptText && !promptText.classList.contains('stopped')) {
        promptText.classList.add('stopped');
      }
      handleSubmit();
    }
  }
});

// Updated mic button event listener for Wisprflow
micButton.addEventListener('click', toggleRecording);

submitButton.addEventListener('click', () => {
  if (promptText && !promptText.classList.contains('stopped')) {
    promptText.classList.add('stopped');
  }
  handleSubmit();
});

// Initialize on page load
userInput.focus();
