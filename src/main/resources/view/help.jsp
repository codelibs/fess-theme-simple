<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%><!DOCTYPE html>
<html>
<head profile="http://a9.com/-/spec/opensearch/1.1/">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><la:message key="labels.search_title" /></title>
<link href="${fe:url('/css/simple/style.css')}" rel="stylesheet" type="text/css" />
</head>
<body>
	<header>
		<jsp:include page="header.jsp" />
	</header>
	<main class="container ml-md-ex">
		<div>
			<jsp:include page="${helpPage}" />
		</div>
		<div style="text-align:right">
			<a href="#"><la:message key="labels.footer_back_to_top" /></a>
		</div>
	</main>
	<jsp:include page="footer.jsp" />
	<input type="hidden" id="contextPath" value="${contextPath}" />
	<script type="text/javascript" src="${fe:url('/js/simple/suggestor.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/simple/help.js')}"></script>
</body>
</html>
