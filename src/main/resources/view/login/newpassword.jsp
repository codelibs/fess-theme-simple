<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%><!DOCTYPE html>
${fe:html(true)}
<head>
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
		<div class="login-box-body">
			<p class="login-box-msg">
				<la:message key="labels.login.newpassword" />
			</p>
			<%-- Message --%>
			<div>
				<la:info id="msg" message="false">
					<div class="alert alert-info">${msg}</div>
				</la:info>
				<la:errors />
			</div>
			<la:form styleId="newPassword" method="post">
				<div class="form-field">
					<c:set var="ph_new_password">
						<la:message key="labels.login.placeholder_new_password" />
					</c:set>
					<la:password property="password" class="form-input"
						placeholder="${ph_new_password}" />
				</div>
				<div class="form-field">
					<c:set var="ph_confirm_password">
						<la:message key="labels.login.placeholder_confirm_new_password" />
					</c:set>
					<la:password property="confirmPassword" class="form-input"
						placeholder="${ph_confirm_password}" />
				</div>
				<div class="text-center">
					<button type="submit" name="changePassword"
						class="btn btn-primary btn-block"
						value="<la:message key="labels.login.update"/>">
						<la:message key="labels.login.update" />
					</button>
				</div>
			</la:form>
		</div>
	</div>
	<input type="hidden" id="contextPath" value="${contextPath}" />
	<script type="text/javascript" src="${fe:url('/js/simple/login.js')}"></script>
</body>
${fe:html(false)}