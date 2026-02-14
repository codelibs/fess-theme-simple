<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%><!DOCTYPE html>
<html>
<head profile="http://a9.com/-/spec/opensearch/1.1/">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${f:h(displayQuery)}-<la:message
		key="labels.search_title" /></title>
<c:if test="${osddLink}">
	<link rel="search" type="application/opensearchdescription+xml"
		href="${fe:url('/osdd')}"
		title="<la:message key="labels.index_osdd_title" />" />
</c:if>
<link href="${fe:url('/css/simple/style.css')}" rel="stylesheet" type="text/css" />
</head>
<body class="search">
	<header>
		<jsp:include page="header.jsp" />
		<ul class="filter-list container ml-md-ex">
			<li class="filter-item"><la:message key="labels.searchoptions_menu_sort" /> <a
				href="#searchOptions" class="badge"
				data-toggle="control-options"> <c:if test="${empty sort}">
						<la:message key="labels.searchoptions_score" />
					</c:if> <c:if test="${sort=='score.desc'}">
						<la:message key="labels.searchoptions_score" />
					</c:if> <c:if test="${sort=='filename.asc'}">
						<la:message key="labels.search_result_sort_filename_asc" />
					</c:if> <c:if test="${sort=='filename.desc'}">
						<la:message key="labels.search_result_sort_filename_desc" />
					</c:if> <c:if test="${sort=='created.asc'}">
						<la:message key="labels.search_result_sort_created_asc" />
					</c:if> <c:if test="${sort=='created.desc'}">
						<la:message key="labels.search_result_sort_created_desc" />
					</c:if> <c:if test="${sort=='content_length.asc'}">
						<la:message key="labels.search_result_sort_content_length_asc" />
					</c:if> <c:if test="${sort=='content_length.desc'}">
						<la:message key="labels.search_result_sort_content_length_desc" />
					</c:if> <c:if test="${sort=='last_modified.asc'}">
						<la:message key="labels.search_result_sort_last_modified_asc" />
					</c:if> <c:if test="${sort=='last_modified.desc'}">
						<la:message key="labels.search_result_sort_last_modified_desc" />
					</c:if> <c:if test="${sort=='click_count.asc'}">
						<la:message key="labels.search_result_sort_click_count_asc" />
					</c:if> <c:if test="${sort=='click_count.desc'}">
						<la:message key="labels.search_result_sort_click_count_desc" />
					</c:if> <c:if test="${sort=='favorite_count.asc'}">
						<la:message key="labels.search_result_sort_favorite_count_asc" />
					</c:if> <c:if test="${sort=='favorite_count.desc'}">
						<la:message key="labels.search_result_sort_favorite_count_desc" />
					</c:if> <c:if test="${sort.indexOf(',') >= 0}">
						<la:message key="labels.search_result_sort_multiple" />
					</c:if>
			</a></li>
			<li class="filter-item"><la:message key="labels.searchoptions_menu_num" /> <a
				href="#searchOptions" class="badge"
				data-toggle="control-options"> <la:message
						key="labels.searchoptions_num" arg0="${f:h(num)}" />
			</a></li>
			<li class="filter-item"><la:message key="labels.searchoptions_menu_lang" /> <a
				href="#searchOptions" class="badge"
				data-toggle="control-options"> <c:if test="${empty lang}">
						<la:message key="labels.searchoptions_all" />
					</c:if> <c:if test="${!empty lang}">
						<c:forEach var="sLang" items="${lang}">
							<c:forEach var="item" items="${langItems}">
								<c:if test="${item.value==sLang}">${f:h(item.label)}</c:if>
							</c:forEach>
						</c:forEach>
					</c:if>
			</a></li>
			<c:if test="${displayLabelTypeItems}">
				<li class="filter-item"><la:message key="labels.searchoptions_menu_labels" /> <a
					href="#searchOptions" class="badge"
					data-toggle="control-options"> <c:if
							test="${empty fields.label}">
							<la:message key="labels.searchoptions_all" />
						</c:if> <c:if test="${!empty fields.label}">
							<c:forEach var="sLabel" items="${fields.label}">
								<c:forEach var="item" items="${labelTypeItems}">
									<c:if test="${item.value==sLabel}">${f:h(item.label)}</c:if>
								</c:forEach>
							</c:forEach>
						</c:if>
				</a></li>
			</c:if>
		</ul>
	</header>
	<main id="content" class="container ml-md-ex">
		<c:if test="${f:h(allRecordCount) != 0}">
			<div id="subheader" style="color:#808080">
				<p>
					<la:message key="labels.search_result_status"
						arg0="${f:h(displayQuery)}" arg1="${f:h(allRecordCount)}"
						arg2="${f:h(currentStartRecordNumber)}"
						arg3="${f:h(currentEndRecordNumber)}" />
					<c:if test="${execTime!=null}">
						<la:message key="labels.search_result_time" arg0="${f:h(execTime)}" />
					</c:if>
				</p>
				<c:if test="${! empty sdh }">
				<p>
					<la:message key="labels.similar_doc_result_status" />
				</p>
				</c:if>
			</div>
			<c:if test="${partialResults}">
				<div class="alert">
					<p>
						<la:message key="labels.process_time_is_exceeded" />
					</p>
				</div>
			</c:if>
		</c:if>
		<c:if test="${!empty popularWords}">
			<div>
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
		<c:forEach var="item" varStatus="s" items="${relatedContents}">
			<div>
				${item}
			</div>
		</c:forEach>
		<c:choose>
			<c:when test="${f:h(allRecordCount) != 0}">
				<jsp:include page="searchResults.jsp" />
			</c:when>
			<c:otherwise>
				<jsp:include page="searchNoResult.jsp" />
			</c:otherwise>
		</c:choose>
		<c:if test="${!empty relatedQueries}">
			<div>
				<p class="text-truncate">
					<la:message key="labels.search_related_queries" />
					<c:forEach var="item" varStatus="s" items="${relatedQueries}">
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
		<c:if test="${f:h(allRecordCount) != 0}">
			<div>
				<nav id="subfooter" style="margin:0 auto">
					<ul class="pagination">
						<c:if test="${existPrevPage}">
							<li class="page-num"><la:link aria-label="Previous"
									href="/search/prev?q=${f:u(q)}&pn=${f:u(currentPageNumber)}&num=${f:u(pageSize)}&sdh=${f:u(fe:sdh(sdh))}${fe:pagingQuery(null)}${fe:facetQuery()}${fe:geoQuery()}">
									<span aria-hidden="true">&laquo;</span>
									<span class="visually-hidden"><la:message key="labels.prev_page" /></span>
								</la:link></li>
						</c:if>
						<c:if test="${!existPrevPage}">
							<li class="page-num disabled" aria-label="Previous"><a href="#">
								<span aria-hidden="true">&laquo;</span> <span class="visually-hidden"><la:message
										key="labels.prev_page" /></span>
							</a></li>
						</c:if>
						<c:forEach var="pageNumber" varStatus="s" items="${pageNumberList}">
							<li
								<c:choose>
									<c:when test="${pageNumber < currentPageNumber - 2 || pageNumber > currentPageNumber + 2}">class="page-num hidden-mobile"</c:when>
									<c:when test="${pageNumber == currentPageNumber && pageNumber >= currentPageNumber - 2 && pageNumber <= currentPageNumber + 2}">class="page-num active"</c:when>
									<c:otherwise>class="page-num"</c:otherwise>
								</c:choose>>
								<la:link
									href="/search/move?q=${f:u(q)}&pn=${f:u(pageNumber)}&num=${f:u(pageSize)}&sdh=${f:u(fe:sdh(sdh))}${fe:pagingQuery(null)}${fe:facetQuery()}${fe:geoQuery()}">${f:h(pageNumber)}</la:link>
							</li>
						</c:forEach>
						<c:if test="${existNextPage}">
							<li class="page-num"><la:link aria-label="Next"
									href="/search/next?q=${f:u(q)}&pn=${f:u(currentPageNumber)}&num=${f:u(pageSize)}&sdh=${f:u(fe:sdh(sdh))}${fe:pagingQuery(null)}${fe:facetQuery()}${fe:geoQuery()}">
									<span class="visually-hidden"><la:message key="labels.next_page" /></span>
									<span aria-hidden="true">&raquo;</span>
								</la:link></li>
						</c:if>
						<c:if test="${!existNextPage}">
							<li class="page-num disabled" aria-label="Next"><a href="#"> <span
									class="visually-hidden"><la:message key="labels.next_page" /></span> <span
									aria-hidden="true">&raquo;</span>
							</a></li>
						</c:if>
					</ul>
				</nav>
			</div>
		</c:if>
	</main>
	<jsp:include page="footer.jsp" />
	<input type="hidden" id="contextPath" value="${contextPath}" />
	<script type="text/javascript" src="${fe:url('/js/simple/suggestor.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/simple/search.js')}"></script>
</body>
</html>
