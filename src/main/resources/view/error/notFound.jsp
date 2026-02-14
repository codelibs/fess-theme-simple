<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%><!DOCTYPE html>
<html>
<head profile="http://a9.com/-/spec/opensearch/1.1/">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><la:message key="labels.system_error_title" /></title>
<link href="${fe:url('/css/simple/style.css')}" rel="stylesheet"
	type="text/css" />
</head>
<body class="error">
	<header>
		<jsp:include page="../header.jsp" />
	</header>
	<main class="container">
		<div class="text-center">
			<h2>
				<la:message key="labels.page_not_found_title" />
			</h2>
			<div>
				<la:message key="labels.check_url" />
				<br /> ${f:h(url)}
			</div>
		</div>
	</main>
	<jsp:include page="../footer.jsp" />
	<input type="hidden" id="contextPath" value="<%=request.getContextPath()%>" />
	<script type="text/javascript" src="${fe:url('/js/simple/suggestor.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/simple/search.js')}"></script>
</body>
</html>
