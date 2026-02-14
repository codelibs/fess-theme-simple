<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%><!DOCTYPE html>
<html>
<head profile="http://a9.com/-/spec/opensearch/1.1/">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><la:message key="labels.login.title" /></title>
<link href="${fe:url('/css/simple/style.css')}" rel="stylesheet" type="text/css" />
</head>
<body class="login-page">
	<div class="login-box">
		<div class="login-logo">
			<la:link href="/">
				<img src="${fe:url('/images/simple/logo-top.png')}"
					alt="<la:message key="labels.header_brand_name" />" />
			</la:link>
		</div>
		<div class="notification">${notification}</div>
		<div class="login-box-body">
			<p class="login-box-msg">
				<la:message key="labels.login" />
			</p>
			<%-- Message --%>
			<div>
				<la:info id="msg" message="false">
					<div class="alert alert-info">${msg}</div>
				</la:info>
				<la:errors />
			</div>
			<la:form styleId="login" method="post">
				<div class="form-field">
					<c:set var="ph_username">
						<la:message key="labels.login.placeholder_username" />
					</c:set>
					<la:text property="username" styleId="username"
						class="form-input" placeholder="${ph_username}" />
				</div>
				<div class="form-field">
					<c:set var="ph_password">
						<la:message key="labels.login.placeholder_password" />
					</c:set>
					<la:password property="password" class="form-input"
						placeholder="${ph_password}" />
				</div>
				<div class="text-center">
					<button type="submit" name="login"
						class="btn btn-primary btn-block"
						value="<la:message key="labels.login"/>">
						<span aria-hidden="true">&#x2192;</span>
						<la:message key="labels.login" />
					</button>
				</div>
			</la:form>
		</div>
	</div>
	<input type="hidden" id="contextPath" value="${contextPath}" />
	<script type="text/javascript" src="${fe:url('/js/simple/login.js')}"></script>
</body>
</html>
