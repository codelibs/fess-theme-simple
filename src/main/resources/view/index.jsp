<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%><!DOCTYPE html>
<html>
<head profile="http://a9.com/-/spec/opensearch/1.1/">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><la:message key="labels.search_title" /></title>
<c:if test="${osddLink}">
	<link rel="search" type="application/opensearchdescription+xml"
		href="${fe:url('/osdd')}"
		title="<la:message key="labels.index_osdd_title" />" />
</c:if>
<link href="${fe:url('/css/simple/style.css')}" rel="stylesheet" type="text/css" />
</head>
<body>
	<la:form action="search" method="get" styleId="searchForm">
		${fe:facetForm()}${fe:geoForm()}
		<header>
			<nav class="site-header">
				<div id="content" class="container" style="max-width:100%">
					<div class="site-logo"></div>
					<div class="nav-collapse" id="navbar">
						<div style="margin-right:auto"></div>
						<ul class="nav-list">
							<c:choose>
								<c:when test="${!empty username && username != 'guest'}">
								<li class="nav-item"><span class="nav-link nav-user">${username}</span></li>
								<c:if test="${editableUser == true}">
									<li class="nav-item"><la:link href="/profile" styleClass="nav-link">
										<la:message key="labels.profile" />
									</la:link></li>
								</c:if>
								<c:if test="${adminUser == true}">
									<li class="nav-item"><la:link href="/admin" styleClass="nav-link">
										<la:message key="labels.administration" />
									</la:link></li>
								</c:if>
								<li class="nav-item"><la:link href="/logout/" styleClass="nav-link">
									<la:message key="labels.logout" />
								</la:link></li>
								</c:when>
								<c:when test="${ pageLoginLink }">
									<li class="nav-item"><la:link href="/login"
											styleClass="nav-link" role="button" aria-haspopup="true"
											aria-expanded="false">
											<span aria-hidden="true">&#x2192;</span>
											<la:message key="labels.login" />
										</la:link></li>
								</c:when>
							</c:choose>
							<li class="nav-item"><la:link href="/help"
									styleClass="nav-link help-link">
									<span aria-hidden="true">?</span>
									<la:message key="labels.index_help" />
								</la:link></li>
						</ul>
					</div>
				</div>
			</nav>
		</header>
		<div id="searchOptions" class="control-options">
			<div class="container">
				<jsp:include page="searchOptions.jsp" />
				<div>
					<button type="button" class="btn" id="searchOptionsClearButton">
						<la:message key="labels.search_options_clear" />
					</button>
					<la:link href="/search/advance" styleClass="btn btn-secondary">
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
		<main class="container">
			<div class="search-form-box text-center">
				<h1 class="mainLogo">
					<img src="${fe:url('/images/simple/logo.png')}"
						alt="<la:message key="labels.index_title" />" />
				</h1>
				<div class="notification">${notification}</div>
				<div>
					<la:info id="msg" message="true">
						<div class="alert alert-info">${msg}</div>
					</la:info>
					<la:errors header="errors.front_header"
						footer="errors.front_footer" prefix="errors.front_prefix"
						suffix="errors.front_suffix" />
				</div>
				<fieldset>
					<div class="clearfix">
						<div class="textbox" style="margin:0 auto;max-width:500px">
							<la:text styleClass="query search-input"
								property="q" size="50" maxlength="1000" styleId="contentQuery"
								autocomplete="off" />
						</div>
					</div>
					<c:if test="${!empty popularWords}">
						<div class="clearfix">
							<p class="text-truncate">
								<la:message key="labels.search_popular_word_word" />
								<c:forEach var="item" varStatus="s" items="${popularWords}">
									<c:if test="${s.index < 3}">
										<la:link
											href="/search?q=${f:u(item)}${fe:facetQuery()}${fe:geoQuery()}">${f:h(item)}</la:link>
									</c:if>
									<c:if test="${3 <= s.index}">
										<la:link styleClass="hidden-mobile"
											href="/search?q=${f:u(item)}${fe:facetQuery()}${fe:geoQuery()}">${f:h(item)}</la:link>
									</c:if>
								</c:forEach>
							</p>
						</div>
					</c:if>
					<div class="clearfix searchButtonBox">
						<button type="submit" name="search" id="searchButton"
							class="btn">
							<la:message key="labels.index_form_search_btn" />
						</button>
						<button type="button" class="btn"
							data-toggle="control-options" data-target="#searchOptions"
							id="searchOptionsButton">
							<span aria-hidden="true">&#x2699;</span>
							<la:message key="labels.index_form_option_btn" />
						</button>
					</div>
				</fieldset>
			</div>
		</main>
		<jsp:include page="footer.jsp" />
	</la:form>
	<input type="hidden" id="contextPath" value="${contextPath}" />
	<script type="text/javascript" src="${fe:url('/js/simple/suggestor.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/simple/index.js')}"></script>
</body>
</html>
