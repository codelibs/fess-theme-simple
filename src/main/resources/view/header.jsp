<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<la:form action="/search" method="get" styleId="searchForm"
	role="search">
	${fe:facetForm()}${fe:geoForm()}
		<nav class="site-header" style="padding-top:20px;">
			<div id="content" class="container" style="max-width:100%;">
				<la:link styleClass="site-logo" href="/">
					<img src="${fe:url('/images/simple/logo-head2.png')}"
						alt="<la:message key="labels.header_brand_name" />" />
				</la:link>
				<c:if test="${!chatPage}">
				<div
					class="header-search-box textbox"
					role="search">
					<div class="input-group">
						<la:text property="q" maxlength="1000" styleId="query"
							styleClass="search-input" autocomplete="off"/>
						<span class="input-group-append">
							<button type="submit" name="search" id="searchButton"
								class="btn" >
							</button>
							<button type="button" class="btn"
								data-toggle="control-options" data-target="#searchOptions"
								id="searchOptionsButton" >
								<span aria-hidden="true">&#x2699;</span> <span class="visually-hidden"><la:message
										key="labels.header_form_option_btn" /></span>
							</button>
						</span>
					</div>
				</div>
				</c:if>
				<ul class="nav-list hidden-mobile">
					<c:choose>
						<c:when test="${!empty username && username != 'guest'}">
							<li class="nav-item">
								<div class="dropdown">
									<a class="nav-link dropdown-toggle" data-toggle="dropdown"
										href="#" role="button" aria-haspopup="true"
										aria-expanded="false">
										<span>${username}</span>
									</a>
									<div class="dropdown-menu" aria-labelledby="userMenu">
										<c:if test="${editableUser == true}">
											<la:link href="/profile" styleClass="dropdown-item">
												<la:message key="labels.profile" />
											</la:link>
										</c:if>
										<c:if test="${adminUser == true}">
											<la:link href="/admin" styleClass="dropdown-item">
												<la:message key="labels.administration" />
											</la:link>
										</c:if>
										<la:link href="/logout/" styleClass="dropdown-item">
											<la:message key="labels.logout" />
										</la:link>
									</div>
								</div>
							</li>
						</c:when>
						<c:when test="${ pageLoginLink }">
							<li class="nav-item"><la:link href="/login"
									styleClass="nav-link" role="button" aria-haspopup="true"
									aria-expanded="false">
									<span aria-hidden="true">&#x2192;</span>
									<span><la:message key="labels.login" /></span>
								</la:link></li>
						</c:when>
					</c:choose>
					<c:choose>
						<c:when test="${chatPage}">
							<li class="nav-item"><la:link href="/" styleClass="nav-link" role="button">
								<span><la:message key="labels.search" /></span>
							</la:link></li>
						</c:when>
						<c:when test="${chatEnabled}">
							<li class="nav-item"><la:link href="/chat" styleClass="nav-link" role="button">
								<span aria-hidden="true">AI</span>
								<span><la:message key="labels.chat_ai_mode" /></span>
							</la:link></li>
						</c:when>
					</c:choose>
					<li class="nav-item"><la:link href="/help" styleClass="nav-link" role="help" aria-haspopup="true"
							aria-expanded="false">
							<span aria-hidden="true">?</span>
							<span><la:message key="labels.index_help" /></span>
						</la:link></li>
				</ul>
			</div>
		</nav>
	<c:if test="${!chatPage}">
	<div id="searchOptions" class="control-options">
		<div class="container">
			<jsp:include page="searchOptions.jsp" />
			<div>
				<button type="button" class="btn" id="searchOptionsClearButton">
					<la:message key="labels.search_options_clear" />
				</button>
				<la:link href="/search/advance?q=${f:u(q)}${fe:pagingQuery(null)}" styleClass="btn btn-secondary">
					<span aria-hidden="true">&#x2699;</span>
					<la:message key="labels.advance" />
				</la:link>
				<button type="button" class="btn" style="margin-left:auto"
					data-toggle="control-options" data-target="#searchOptions"
					id="searchOptionsCloseButton">
					<span aria-hidden="true">&#x2715;</span>
					<la:message key="labels.search_options_close" />
				</button>
			</div>
		</div>
	</div>
	</c:if>
</la:form>
