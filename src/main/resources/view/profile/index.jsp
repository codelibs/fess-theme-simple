<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%><!DOCTYPE html>
<html>
<head profile="http://a9.com/-/spec/opensearch/1.1/">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><la:message key="labels.profile.title" /></title>
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
				<la:message key="labels.profile" />
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
					<c:set var="ph_old_password">
						<la:message key="labels.profile.placeholder_old_password" />
					</c:set>
					<la:password property="oldPassword" class="form-input"
						placeholder="${ph_old_password}" />
				</div>
				<div class="form-field">
					<c:set var="ph_new_password">
						<la:message key="labels.profile.placeholder_new_password" />
					</c:set>
					<la:password property="newPassword" class="form-input"
						     placeholder="${ph_new_password}" />
				</div>
				<div class="form-field">
					<c:set var="ph_confirm_password">
						<la:message key="labels.profile.placeholder_confirm_new_password" />
					</c:set>
					<la:password property="confirmNewPassword" class="form-input"
						     placeholder="${ph_confirm_password}" />
				</div>
				<div class="text-center">
					<la:link href="/"
						styleClass="btn">
						<span aria-hidden="true">&#x2190;</span>
						<la:message key="labels.profile.back" />
					</la:link>
					<button type="submit" name="changePassword"
						class="btn btn-primary"
						value="<la:message key="labels.profile.update"/>">
						<la:message key="labels.profile.update" />
					</button>
				</div>
			</la:form>
		</div>
	</div>
	<input type="hidden" id="contextPath" value="${contextPath}" />
	<script type="text/javascript" src="${fe:url('/js/simple/profile.js')}"></script>
</body>
</html>
