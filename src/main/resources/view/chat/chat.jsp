<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%><!DOCTYPE html>
${fe:html(true)}
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><la:message key="labels.chat_title" /></title>
<link href="${fe:url('/css/simple/style.css')}" rel="stylesheet" type="text/css" />
<link href="${fe:url('/css/simple/chat.css')}" rel="stylesheet" type="text/css" />
</head>
<body>
	<jsp:include page="../header.jsp" />
	<main class="container">
		<div class="chat-container">
			<div class="chat-card">
				<div class="chat-card-header">
					<div id="statusArea" class="status-lozenge status-ready" role="status" aria-live="polite">
						<span aria-hidden="true">AI</span>
						<span class="status-text"><la:message key="labels.chat_status_ready" /></span>
					</div>
					<button type="button" id="newChatBtn" class="btn btn-secondary" aria-label="<la:message key="labels.chat_new_chat" />">
						<span aria-hidden="true">+</span>
						<la:message key="labels.chat_new_chat" />
					</button>
				</div>
				<div class="chat-card-body">
					<div id="chatMessages" class="chat-messages" role="log" aria-live="polite" aria-label="<la:message key="labels.chat_messages_area" />">
						<div id="emptyState" class="empty-state">
							<div class="empty-state-icon">
								<span aria-hidden="true">&#x1F4AC;</span>
							</div>
							<h5 class="empty-state-title"><la:message key="labels.chat_welcome_title" /></h5>
							<p class="empty-state-description"><la:message key="labels.chat_welcome_description" /></p>
						</div>
					</div>
					<div id="progressIndicator" class="progress-indicator hidden" role="status" aria-live="polite">
						<div class="progress-steps">
							<div class="progress-step" data-phase="intent">
								<div class="step-icon"><span aria-hidden="true">&#x2606;</span></div>
								<span class="step-label"><la:message key="labels.chat_step_intent" /></span>
							</div>
							<div class="progress-step" data-phase="search">
								<div class="step-icon"></div>
								<span class="step-label"><la:message key="labels.chat_step_search" /></span>
							</div>
							<div class="progress-step" data-phase="evaluate">
								<div class="step-icon"><span aria-hidden="true">&#x2713;</span></div>
								<span class="step-label"><la:message key="labels.chat_step_evaluate" /></span>
							</div>
							<div class="progress-step" data-phase="fetch">
								<div class="step-icon"><span aria-hidden="true">&#x1F4C4;</span></div>
								<span class="step-label"><la:message key="labels.chat_step_fetch" /></span>
							</div>
							<div class="progress-step" data-phase="answer">
								<div class="step-icon"><span aria-hidden="true">&#x270E;</span></div>
								<span class="step-label"><la:message key="labels.chat_step_answer" /></span>
							</div>
						</div>
						<div class="progress-message" id="progressMessage"></div>
					</div>
				</div>
				<div class="chat-card-footer">
					<div id="errorBanner" class="error-banner hidden" role="alert">
						<div class="error-banner-content">
							<span aria-hidden="true">&#x26A0;</span>
							<span class="error-message"></span>
						</div>
						<button type="button" class="error-banner-retry btn btn-retry">
							<span aria-hidden="true">&#x21BB;</span> <la:message key="labels.chat_retry" />
						</button>
						<button type="button" class="error-banner-dismiss dismiss-btn" aria-label="<la:message key="labels.chat_dismiss" />">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="input-wrapper">
						<div class="chat-input-group">
							<textarea id="chatInput" class="chat-textarea"
								placeholder="<la:message key="labels.chat_input_placeholder" />"
								rows="1" maxlength="4000"
								aria-label="<la:message key="labels.chat_input_placeholder" />"></textarea>
							<div class="chat-input-append">
								<button type="button" id="sendBtn" class="btn btn-send" aria-label="<la:message key="labels.chat_send" />">
									<span aria-hidden="true">&#x25B6;</span>
								</button>
							</div>
						</div>
						<div class="input-footer">
							<span class="input-hint"><la:message key="labels.chat_input_hint" /></span>
							<span class="char-counter"><span id="charCount">0</span> / 4000</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
	<jsp:include page="../footer.jsp" />
	<input type="hidden" id="contextPath" value="${contextPath}" />
	<script type="text/javascript" src="${fe:url('/js/simple/chat.js')}"></script>
	<script type="text/javascript">
		document.addEventListener('DOMContentLoaded', function() {
			FessChat.init({
				apiUrl: '${fe:url('/api/v1/chat')}',
				streamUrl: '${fe:url('/api/v1/chat/stream')}',
				labels: {
					thinking: '<la:message key="labels.chat_thinking" />',
					waiting: '<la:message key="labels.chat_waiting" />',
					error: '<la:message key="labels.chat_error" />',
					sources: '<la:message key="labels.chat_sources" />',
					statusReady: '<la:message key="labels.chat_status_ready" />',
					statusThinking: '<la:message key="labels.chat_status_thinking" />',
					statusError: '<la:message key="labels.chat_status_error" />',
					copied: '<la:message key="labels.chat_copied" />',
					copyFailed: '<la:message key="labels.chat_copy_failed" />',
					phases: {
						intent: '<la:message key="labels.chat_phase_intent" />',
						search: '<la:message key="labels.chat_phase_search" />',
						evaluate: '<la:message key="labels.chat_phase_evaluate" />',
						fetch: '<la:message key="labels.chat_phase_fetch" />',
						answer: '<la:message key="labels.chat_phase_answer" />'
					}
				}
			});
		});
	</script>
</body>
${fe:html(false)}
