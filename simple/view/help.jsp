<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head profile="http://a9.com/-/spec/opensearch/1.1/">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><la:message key="labels.search_title" /></title>
<link href="${fe:url('/css/bootstrap.min.css')}" rel="stylesheet"
	type="text/css" />
<link href="${fe:url('/css/style.css')}" rel="stylesheet" type="text/css" />
<link href="${fe:url('/css/font-awesome.min.css')}"
	rel="stylesheet" type="text/css" />
<style>
<!--
body{padding:0 ;margin:0 ;font-size: small;line-height:1.4;color: #222; font-family: arial,sans-serif;}
main{margin-top:1rem;margin-bottom:60px;max-width:632px !important}
header{background-color:#fafafa;border-bottom:1px solid #ebebeb;z-index:1}
ul.container{margin-top:1rem}
.textbox{
	background:#fff;
	display:flex;
	border-radius:2px;
	box-shadow:0 2px 2px 0 rgba(0,0,0,0.16),0 0 0 1px rgba(0,0,0,0.08);
	height:44px;
	}
.textbox:hover{box-shadow:0 3px 8px 0 rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.08)}
#searchButton,#searchOptionsButton{background-color: transparent}
#searchButton,#searchOptionsButton{box-shadow:0 0px}
#query.form-control{border: none;box-shadow:none}
@media(min-width:768px){.ml-md-ex{margin-left:9.375rem !important}}

-->
</style>
</head>
<body>
	<header>
		<jsp:include page="header.jsp" />
	</header>
	<main class="container ml-md-ex" >
		<div class="row">
			<div class="col">

				<jsp:include page="${helpPage}" />

			</div>
		</div>
		<div class="text-right">
			<a href="#"><la:message key="labels.footer_back_to_top" /></a>
		</div>
	</main>
	<jsp:include page="footer.jsp" />
	<input type="hidden" id="contextPath" value="${contextPath}" />
	<script type="text/javascript"
		src="${fe:url('/js/jquery-3.3.1.min.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/bootstrap.min.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/suggestor.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/help.js')}"></script>
</body>
</html>
