/**
 * Fess RAG Chat JavaScript
 * Enhanced with Atlassian Design System patterns
 * Vanilla JS version (no external dependencies)
 */
var FessChat = (function() {
    'use strict';

    var config = {
        apiUrl: '/api/v1/chat',
        streamUrl: '/api/v1/chat/stream',
        labels: {
            thinking: 'Thinking...',
            waiting: '...',
            error: 'An error occurred. Please try again.',
            sources: 'Sources',
            statusReady: 'AI Assistant',
            statusThinking: 'Processing',
            statusError: 'Error',
            copied: 'Copied!',
            copyFailed: 'Copy failed',
            phases: {
                intent: 'Analyzing question...',
                search: 'Searching documents...',
                evaluate: 'Evaluating results...',
                fetch: 'Retrieving content...',
                answer: 'Generating answer...'
            }
        }
    };

    var state = {
        sessionId: null,
        isProcessing: false,
        eventSource: null,
        currentPhase: null,
        completedPhases: [],
        lastMessage: null,
        lastError: null
    };

    var elements = {};

    var isComposing = false;

    var phaseOrder = ['intent', 'search', 'evaluate', 'fetch', 'answer'];

    /**
     * Deep merge utility to replace $.extend(true, ...)
     */
    function deepMerge(target, source) {
        if (!source) return target;
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = {};
                    }
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }

    /**
     * Initialize the chat module
     */
    function init(options) {
        deepMerge(config, options);

        elements = {
            chatMessages: document.getElementById('chatMessages'),
            chatInput: document.getElementById('chatInput'),
            sendBtn: document.getElementById('sendBtn'),
            newChatBtn: document.getElementById('newChatBtn'),
            statusArea: document.getElementById('statusArea'),
            emptyState: document.getElementById('emptyState'),
            progressIndicator: document.getElementById('progressIndicator'),
            progressMessage: document.getElementById('progressMessage'),
            errorBanner: document.getElementById('errorBanner'),
            charCount: document.getElementById('charCount')
        };

        bindEvents();
        autoResizeTextarea();
        updateCharCount();
        showStatus('ready');
    }

    /**
     * Bind event handlers
     */
    function bindEvents() {
        elements.sendBtn.addEventListener('click', sendMessage);

        elements.chatInput.addEventListener('keydown', function(e) {
            // Prevent sending during IME composition (Japanese, Chinese, etc.)
            if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Handle IME composition for older browsers
        elements.chatInput.addEventListener('compositionstart', function() {
            isComposing = true;
        });
        elements.chatInput.addEventListener('compositionend', function() {
            isComposing = false;
        });

        elements.chatInput.addEventListener('input', function() {
            autoResizeTextarea();
            updateCharCount();
        });

        elements.newChatBtn.addEventListener('click', newChat);

        // Suggestion chip click handlers (event delegation on document)
        document.addEventListener('click', function(e) {
            var chip = e.target.closest('.suggestion-chip');
            if (chip) {
                var suggestion = chip.dataset.suggestion;
                if (suggestion) {
                    elements.chatInput.value = suggestion;
                    updateCharCount();
                    autoResizeTextarea();
                    sendMessage();
                }
            }
        });

        // Error banner handlers (event delegation)
        elements.errorBanner.addEventListener('click', function(e) {
            var retryBtn = e.target.closest('.error-banner-retry');
            if (retryBtn) {
                hideErrorBanner();
                if (state.lastMessage) {
                    elements.chatInput.value = state.lastMessage;
                    updateCharCount();
                    sendMessage();
                }
                return;
            }

            var dismissBtn = e.target.closest('.error-banner-dismiss');
            if (dismissBtn) {
                hideErrorBanner();
            }
        });

        // Message action delegation (copy button)
        elements.chatMessages.addEventListener('click', function(e) {
            var copyBtn = e.target.closest('.copy-btn');
            if (copyBtn) {
                var messageContent = copyBtn.closest('.chat-message').querySelector('.message-text');
                copyToClipboard(messageContent.textContent, copyBtn);
            }
        });
    }

    /**
     * Auto-resize textarea based on content
     */
    function autoResizeTextarea() {
        var textarea = elements.chatInput;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }

    /**
     * Update character counter
     */
    function updateCharCount() {
        var count = elements.chatInput.value.length;
        var maxLength = 4000;
        elements.charCount.textContent = count;

        var counter = elements.charCount.parentNode;
        counter.classList.remove('warning', 'danger');
        if (count >= maxLength * 0.95) {
            counter.classList.add('danger');
        } else if (count >= maxLength * 0.8) {
            counter.classList.add('warning');
        }
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text, button) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                showCopySuccess(button);
            }).catch(function() {
                showCopyError(button);
            });
        } else {
            // Fallback for older browsers
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showCopySuccess(button);
            } catch (err) {
                showCopyError(button);
            }
            document.body.removeChild(textarea);
        }
    }

    function showCopySuccess(button) {
        var originalHtml = button.innerHTML;
        button.classList.add('copied');
        button.innerHTML = '\u2713 ' + escapeHtml(config.labels.copied);
        setTimeout(function() {
            button.classList.remove('copied');
            button.innerHTML = originalHtml;
        }, 2000);
    }

    function showCopyError(button) {
        var originalHtml = button.innerHTML;
        button.innerHTML = '\u2715 ' + escapeHtml(config.labels.copyFailed);
        setTimeout(function() {
            button.innerHTML = originalHtml;
        }, 2000);
    }

    /**
     * Send a message
     */
    function sendMessage() {
        // Check for IME composition
        if (isComposing) {
            return;
        }

        var message = elements.chatInput.value.trim();

        if (!message || state.isProcessing) {
            return;
        }

        state.isProcessing = true;
        state.lastMessage = message;
        state.currentPhase = null;
        state.completedPhases = [];

        hideEmptyState();
        hideErrorBanner();
        updateUI();
        showStatus('thinking');
        showProgressIndicator();

        // Add user message
        addMessage('user', message);

        // Clear input
        elements.chatInput.value = '';
        updateCharCount();
        autoResizeTextarea();

        // Add thinking indicator
        var thinkingId = addThinkingIndicator();

        // Use SSE for streaming
        streamChat(message, thinkingId);
    }

    /**
     * Stream chat using Server-Sent Events
     */
    function streamChat(message, thinkingId) {
        var url = config.streamUrl + '?message=' + encodeURIComponent(message);
        if (state.sessionId) {
            url += '&sessionId=' + encodeURIComponent(state.sessionId);
        }

        var eventSource = new EventSource(url);
        var responseContent = '';
        var messageElement = null;

        eventSource.onopen = function() {
            // Remove thinking indicator and create message element with waiting text
            var thinkingEl = document.getElementById(thinkingId);
            if (thinkingEl) {
                thinkingEl.parentNode.removeChild(thinkingEl);
            }
            messageElement = addMessage('assistant', config.labels.waiting, true);
        };

        eventSource.addEventListener('session', function(e) {
            var data = JSON.parse(e.data);
            if (data.sessionId) {
                state.sessionId = data.sessionId;
            }
        });

        eventSource.addEventListener('phase', function(e) {
            var data = JSON.parse(e.data);
            if (data.phase) {
                if (data.status === 'start') {
                    updatePhase(data.phase, 'active');
                    var phaseMessage = config.labels.phases[data.phase] || data.message || 'Processing...';
                    // Replace {keywords} placeholder with actual keywords
                    if (data.keywords) {
                        phaseMessage = phaseMessage.replace('{keywords}', data.keywords);
                    }
                    showStatus('thinking', phaseMessage);
                    updateProgressMessage(phaseMessage);
                    // Update message-text element with phase progress
                    if (messageElement) {
                        messageElement.querySelector('.message-text').textContent = phaseMessage;
                        scrollToBottom();
                    }
                } else if (data.status === 'complete') {
                    updatePhase(data.phase, 'completed');
                }
            }
        });

        eventSource.addEventListener('chunk', function(e) {
            var data = JSON.parse(e.data);
            if (data.content) {
                responseContent += data.content;
                if (messageElement) {
                    messageElement.querySelector('.message-text').textContent = responseContent;
                    scrollToBottom();
                }
            }
        });

        eventSource.addEventListener('sources', function(e) {
            var data = JSON.parse(e.data);
            if (data.sources && data.sources.length > 0 && messageElement) {
                addSourcesToMessage(messageElement, data.sources);
            }
        });

        eventSource.addEventListener('done', function(e) {
            var data = JSON.parse(e.data);
            state.sessionId = data.sessionId;

            // Replace streaming text with rendered HTML content if available
            if (data.htmlContent && messageElement) {
                messageElement.querySelector('.message-text').innerHTML = data.htmlContent;
            }

            // Add message actions
            if (messageElement) {
                addMessageActions(messageElement);
            }

            state.isProcessing = false;
            state.lastError = null;
            updateUI();
            showStatus('ready');
            hideProgressIndicator();
            eventSource.close();
            scrollToBottom();

            // Focus back to input
            elements.chatInput.focus();
        });

        eventSource.addEventListener('error', function(e) {
            var errorMessage = config.labels.error;
            try {
                var data = JSON.parse(e.data);
                if (data.message) {
                    errorMessage = data.message;
                }
            } catch (ex) {}

            handleError(thinkingId, messageElement, errorMessage);
            eventSource.close();
        });

        eventSource.onerror = function() {
            handleError(thinkingId, messageElement, config.labels.error);
            eventSource.close();
        };

        state.eventSource = eventSource;
    }

    /**
     * Handle error state
     */
    function handleError(thinkingId, messageElement, errorMessage) {
        var thinkingEl = document.getElementById(thinkingId);
        if (thinkingEl) {
            thinkingEl.parentNode.removeChild(thinkingEl);
        }

        // Remove the assistant message if it only contains waiting/phase text
        if (messageElement) {
            messageElement.parentNode.removeChild(messageElement);
        }

        state.lastError = errorMessage;
        state.isProcessing = false;
        updateUI();
        showStatus('error');
        hideProgressIndicator();
        showErrorBanner(errorMessage);
    }

    /**
     * Show error banner
     */
    function showErrorBanner(message) {
        elements.errorBanner.querySelector('.error-message').textContent = message;
        elements.errorBanner.classList.remove('hidden');
    }

    /**
     * Hide error banner
     */
    function hideErrorBanner() {
        elements.errorBanner.classList.add('hidden');
    }

    /**
     * Update phase indicator
     */
    function updatePhase(phase, status) {
        if (status === 'active') {
            state.currentPhase = phase;
        } else if (status === 'completed') {
            if (state.completedPhases.indexOf(phase) === -1) {
                state.completedPhases.push(phase);
            }
        }

        // Update visual indicators
        document.querySelectorAll('.progress-step').forEach(function(stepEl) {
            var stepPhase = stepEl.dataset.phase;
            stepEl.classList.remove('active', 'completed');

            if (state.completedPhases.indexOf(stepPhase) !== -1) {
                stepEl.classList.add('completed');
            } else if (stepPhase === state.currentPhase) {
                stepEl.classList.add('active');
            }
        });
    }

    /**
     * Update progress message
     */
    function updateProgressMessage(message) {
        elements.progressMessage.textContent = message;
    }

    /**
     * Show progress indicator
     */
    function showProgressIndicator() {
        // Reset all steps
        document.querySelectorAll('.progress-step').forEach(function(stepEl) {
            stepEl.classList.remove('active', 'completed');
        });
        elements.progressMessage.textContent = '';
        elements.progressIndicator.classList.remove('hidden');
    }

    /**
     * Hide progress indicator
     */
    function hideProgressIndicator() {
        elements.progressIndicator.classList.add('hidden');
        state.currentPhase = null;
        state.completedPhases = [];
    }

    /**
     * Hide empty state
     */
    function hideEmptyState() {
        elements.emptyState.style.display = 'none';
    }

    /**
     * Show empty state
     */
    function showEmptyState() {
        elements.emptyState.style.display = '';
    }

    /**
     * Format timestamp
     */
    function formatTimestamp(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    /**
     * Add a message to the chat
     */
    function addMessage(role, content, streaming) {
        var avatarText = role === 'user' ? 'U' : 'AI';
        var timestamp = formatTimestamp(new Date());

        var messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message ' + role;

        var avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.textContent = avatarText;

        var wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'message-wrapper';

        var contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        var textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = content;

        var timestampDiv = document.createElement('div');
        timestampDiv.className = 'message-timestamp';
        timestampDiv.textContent = timestamp;

        contentDiv.appendChild(textDiv);
        wrapperDiv.appendChild(contentDiv);
        wrapperDiv.appendChild(timestampDiv);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(wrapperDiv);

        elements.chatMessages.appendChild(messageDiv);
        scrollToBottom();

        return messageDiv;
    }

    /**
     * Add message actions (copy button)
     */
    function addMessageActions(messageElement) {
        var actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';

        var copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'message-action-btn copy-btn';
        copyBtn.setAttribute('aria-label', 'Copy message');
        copyBtn.textContent = 'Copy';

        actionsDiv.appendChild(copyBtn);
        messageElement.querySelector('.message-wrapper').appendChild(actionsDiv);
    }

    /**
     * Validates and sanitizes a URL to prevent javascript: and other dangerous protocols
     */
    function sanitizeUrl(url) {
        if (!url || typeof url !== 'string') {
            return '#';
        }
        var trimmedUrl = url.trim().toLowerCase();
        // Allow http, https, and absolute path URLs
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('/')) {
            return url;
        }
        // Allow relative URLs starting with ./ or ../
        if (trimmedUrl.startsWith('./') || trimmedUrl.startsWith('../')) {
            return url;
        }
        // Block known dangerous protocols
        var dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:', 'blob:'];
        for (var i = 0; i < dangerousProtocols.length; i++) {
            if (trimmedUrl.startsWith(dangerousProtocols[i])) {
                return '#';
            }
        }
        // Block URLs that look like protocol:// (unknown protocols)
        if (/^[a-z][a-z0-9+.-]*:/i.test(trimmedUrl)) {
            return '#';
        }
        // Allow other relative URLs (may contain colons in path/query)
        return url;
    }

    /**
     * Get file type icon based on URL or mimetype
     * Returns text indicator instead of Font Awesome class names
     */
    function getFileTypeIcon(url, mimetype) {
        if (mimetype) {
            if (mimetype.indexOf('pdf') !== -1) return 'PDF';
            if (mimetype.indexOf('word') !== -1 || mimetype.indexOf('document') !== -1) return 'DOC';
            if (mimetype.indexOf('excel') !== -1 || mimetype.indexOf('spreadsheet') !== -1) return 'XLS';
            if (mimetype.indexOf('powerpoint') !== -1 || mimetype.indexOf('presentation') !== -1) return 'PPT';
            if (mimetype.indexOf('image') !== -1) return 'IMG';
            if (mimetype.indexOf('text') !== -1) return 'TXT';
        }

        if (url) {
            var ext = url.split('.').pop().toLowerCase().split('?')[0];
            switch (ext) {
                case 'pdf': return 'PDF';
                case 'doc': case 'docx': return 'DOC';
                case 'xls': case 'xlsx': return 'XLS';
                case 'ppt': case 'pptx': return 'PPT';
                case 'jpg': case 'jpeg': case 'png': case 'gif': return 'IMG';
                case 'txt': case 'md': return 'TXT';
                case 'html': case 'htm': return 'Web';
            }
        }

        return '';
    }

    /**
     * Get file type label
     */
    function getFileTypeLabel(url, mimetype) {
        if (mimetype) {
            if (mimetype.indexOf('pdf') !== -1) return 'PDF';
            if (mimetype.indexOf('word') !== -1) return 'Word';
            if (mimetype.indexOf('excel') !== -1) return 'Excel';
            if (mimetype.indexOf('powerpoint') !== -1) return 'PowerPoint';
        }

        if (url) {
            var ext = url.split('.').pop().toLowerCase().split('?')[0];
            switch (ext) {
                case 'pdf': return 'PDF';
                case 'doc': case 'docx': return 'Word';
                case 'xls': case 'xlsx': return 'Excel';
                case 'ppt': case 'pptx': return 'PowerPoint';
                case 'html': case 'htm': return 'Web';
            }
        }

        return 'Document';
    }

    /**
     * Add sources to a message (card style)
     */
    function addSourcesToMessage(messageElement, sources) {
        var sourcesDiv = document.createElement('div');
        sourcesDiv.className = 'message-sources';

        var heading = document.createElement('h6');
        heading.textContent = config.labels.sources;
        sourcesDiv.appendChild(heading);

        var list = document.createElement('ul');
        list.className = 'source-list';

        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            var title = source.title || source.url || ('Source ' + (i + 1));
            var url = sanitizeUrl(source.url);
            var icon = getFileTypeIcon(source.url, source.mimetype);
            var typeLabel = getFileTypeLabel(source.url, source.mimetype);

            var li = document.createElement('li');
            var anchor = document.createElement('a');
            anchor.href = url;
            anchor.className = 'source-card';
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';

            var indexSpan = document.createElement('span');
            indexSpan.className = 'source-index';
            indexSpan.textContent = (i + 1);

            var infoDiv = document.createElement('div');
            infoDiv.className = 'source-info';

            var titleSpan = document.createElement('span');
            titleSpan.className = 'source-title';
            titleSpan.textContent = title;

            var metaDiv = document.createElement('div');
            metaDiv.className = 'source-meta';

            var typeSpan = document.createElement('span');
            typeSpan.className = 'source-type';
            typeSpan.textContent = icon + ' ' + typeLabel;

            metaDiv.appendChild(typeSpan);
            infoDiv.appendChild(titleSpan);
            infoDiv.appendChild(metaDiv);
            anchor.appendChild(indexSpan);
            anchor.appendChild(infoDiv);
            li.appendChild(anchor);
            list.appendChild(li);
        }

        sourcesDiv.appendChild(list);
        messageElement.querySelector('.message-content').appendChild(sourcesDiv);
    }

    /**
     * Add thinking indicator
     */
    function addThinkingIndicator() {
        var id = 'thinking-' + Date.now();

        var messageDiv = document.createElement('div');
        messageDiv.id = id;
        messageDiv.className = 'chat-message assistant';

        var avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.textContent = 'AI';

        var thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'thinking-indicator';
        thinkingDiv.textContent = config.labels.thinking;

        var dotsDiv = document.createElement('div');
        dotsDiv.className = 'thinking-dots';
        dotsDiv.appendChild(document.createElement('span'));
        dotsDiv.appendChild(document.createElement('span'));
        dotsDiv.appendChild(document.createElement('span'));

        thinkingDiv.appendChild(dotsDiv);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(thinkingDiv);

        elements.chatMessages.appendChild(messageDiv);
        scrollToBottom();
        return id;
    }

    /**
     * Start a new chat
     */
    function newChat() {
        // Close any active EventSource connection
        if (state.eventSource) {
            state.eventSource.close();
            state.eventSource = null;
        }

        // Reset processing state
        state.isProcessing = false;

        if (state.sessionId) {
            // Clear session on server
            fetch(config.apiUrl, {
                method: 'POST',
                body: new URLSearchParams({
                    sessionId: state.sessionId,
                    clear: 'true'
                })
            });
        }
        state.sessionId = null;
        state.lastMessage = null;
        state.lastError = null;
        state.currentPhase = null;
        state.completedPhases = [];
        var chatMsgs = elements.chatMessages.querySelectorAll('.chat-message');
        chatMsgs.forEach(function(msg) {
            msg.parentNode.removeChild(msg);
        });
        showEmptyState();
        hideErrorBanner();
        hideProgressIndicator();
        showStatus('ready');
        updateUI();  // Re-enable buttons and input
    }

    /**
     * Show status message
     * @param {string} status - Status type (thinking, error, ready)
     * @param {string} customMessage - Optional custom message to display
     */
    function showStatus(status, customMessage) {
        if (!elements.statusArea) return;

        var text = '';
        var cssClass = 'status-lozenge status-ready';

        switch (status) {
            case 'thinking':
                text = customMessage || config.labels.statusThinking || 'Processing';
                cssClass = 'status-lozenge status-thinking';
                break;
            case 'error':
                text = config.labels.statusError || 'Error';
                cssClass = 'status-lozenge status-error';
                break;
            case 'ready':
            default:
                text = config.labels.statusReady || 'AI Assistant';
                cssClass = 'status-lozenge status-ready';
                break;
        }

        elements.statusArea.className = cssClass;
        // Build status content with DOM methods
        elements.statusArea.textContent = '';
        var statusText = document.createElement('span');
        statusText.className = 'status-text';
        statusText.textContent = text;
        elements.statusArea.appendChild(document.createTextNode('AI '));
        elements.statusArea.appendChild(statusText);
    }

    /**
     * Update UI state
     */
    function updateUI() {
        elements.sendBtn.disabled = state.isProcessing;
        elements.chatInput.disabled = state.isProcessing;
    }

    /**
     * Scroll chat to bottom
     */
    function scrollToBottom() {
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    /**
     * Escape HTML characters
     */
    function escapeHtml(text) {
        if (!text) return '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API
    return {
        init: init
    };
})();
