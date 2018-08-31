<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%-- query matched some document --%>

<div id="result" class="centor" >
	<input type="hidden" id="queryId" value="${f:u(queryId)}" /> <input
		type="hidden" id="rt" value="${f:u(requestedTime)}" />
	<ol class="list-unstyled">
		<c:forEach var="doc" varStatus="s" items="${documentItems}">
			<li id="result${s.index}">
				<h3 class="title text-truncate">
					<a class="link" href="${doc.url_link}" data-uri="${doc.url_link}"
						data-id="${doc.doc_id}" data-order="${s.index}">${doc.content_title}</a>
				</h3>
				<div class="site text-truncate">
					<cite>${f:h(doc.site_path)}</cite>
					<c:if test="${doc.has_cache=='true'}">
						<small class="d-none d-lg-inline-block"> <la:link
								href="/cache/?docId=${doc.doc_id}${appendHighlightParams}"
								class="cache">
								<la:message key="labels.search_result_cache" />
							</la:link>
						</small>
					</c:if>
					<c:if test="${doc.similar_docs_count!=null&&doc.similar_docs_count>1}">
						<small class="d-none d-lg-inline-block"> <la:link
								href="/search?q=${f:u(q)}&ex_q=${f:u(queryEntry.value)}&sdh=${f:u(fe:sdh(doc.similar_docs_hash))}${fe:facetQuery()}${fe:geoQuery()}">
								<la:message key="labels.search_result_similar"
											arg0="${fe:formatNumber(doc.similar_docs_count-1)}" />
							</la:link>
						</small>
					</c:if>
				</div>
				<div class="body" style="color:#545454">
					<c:if test="${thumbnailSupport && !empty doc.thumbnail}">
						<a class="link mr-3 d-none d-sm-flex" href="${doc.url_link}" data-uri="${doc.url_link}" data-id="${doc.doc_id}"
							data-order="${s.index}"
						> <img src="${fe:url('/images/blank.png')}"
							data-src="${fe:url('/thumbnail/')}?docId=${f:u(doc.doc_id)}&queryId=${f:u(queryId)}" class="thumbnail"
						>
						</a>
					</c:if>
					<div class="description">${doc.content_description}</div>
				</div>
			</li>
		</c:forEach>
	</ol>

</div>

