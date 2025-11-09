<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%><!DOCTYPE html>
<html>
<head profile="http://a9.com/-/spec/opensearch/1.1/">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><la:message key="labels.system_error_title" /></title>
<link href="${fe:url('/css/simple/bootstrap.min.css')}" rel="stylesheet"
	type="text/css" />
<link href="${fe:url('/css/simple/style.css')}" rel="stylesheet"
	type="text/css" />
<link href="${fe:url('/css/simple/font-awesome.min.css')}"
	rel="stylesheet" type="text/css" />
</head>
<style>
<!--
body{padding:0 ;margin:0 ;font-size: small;line-height:1.4;color: #222; font-family: arial,sans-serif;}
h3{line-height:1.6}
main{margin-top:1rem;margin-bottom:60px;max-width:632px !important}
header{background-color:#fafafa;border-bottom:1px solid #ebebeb;z-index:1}
p.text-truncate{font-size:medium}
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
<body class="error">
	<header>
		<jsp:include page="../header.jsp" />
	</header>
	<main class="container">
		<div class="text-center">
			<h2>
				<la:message key="labels.error_title" />
			</h2>
			<div>
				<la:info id="msg" message="true">
					<div class="alert alert-info">${msg}</div>
				</la:info>
				<la:errors styleClass="list-unstyled"/>
			</div>
		</div>
	</main>
	<jsp:include page="../footer.jsp" />
	<input type="hidden" id="contextPath" value="<%=request.getContextPath()%>" />
	<script type="text/javascript"
		src="${fe:url('/js/simple/jquery-3.7.1.min.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/simple/bootstrap.min.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/simple/suggestor.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/simple/search.js')}"></script>
</body>
</html>
