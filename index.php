<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FCI London - Personalized Selection</title>
    <link rel="stylesheet" href="styles.css?v=5">
</head>

<body>
    <!-- Header -->
    <header class="page-header">
        <div class="header-content">
            <img src="logo-horizontal-text.png" alt="FCI LONDON" class="header-logo">
            <a href="https://www.fcilondon.co.uk/" target="_blank" class="visit-website-link">Visit Website</a>
        </div>
    </header>

    <div class="container">
        <!-- Conversation history will appear here -->
        <div id="conversationHistory" class="conversation-history"></div>
        <div class="input-wrapper">

            <div class="prompt-text">
                Hi there! Please hit the mic or type here to let me know what you're looking for
            </div>
            <div class="input-container">
                <textarea
                    id="userInput"
                    class="user-input"
                    placeholder=""
                    rows="1"
                    autofocus></textarea>

                <button id="micButton" class="mic-button" aria-label="Speech to text">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                </button>
            </div>

            <div class="action-buttons">
                <button id="submitButton" class="submit-button" disabled>Continue</button>
            </div>

            <div id="statusMessage" class="status-message"></div>
        </div>


    </div>

    <script src="script.js?v=13"></script>
</body>

</html>