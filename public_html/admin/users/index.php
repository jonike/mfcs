<?php

include("../../header.php");

$tableName = "users";

function defineList($tableName) {
	$l      = new listManagement($tableName);

	$l->addField(array(
		"field"    => "username",
		"label"    => "Username",
		));

	$l->addField(array(
		"field"    => "firstname",
		"label"    => "First Name",
		"dupes"    => TRUE
		));

	$l->addField(array(
		"field"    => "lastname",
		"label"    => "Last Name",
		"dupes"    => TRUE
		));

	$l->addField(array(
		"field"    => "isStudent",
		"label"    => "Student?",
		"dupes"    => TRUE,
		"type"     => "yesNo"
		));

	$l->addField(array(
		"field"    => "status",
		"label"    => "Status",
		"type"     => "select",
		"dupes"    => TRUE,
		"options"  => array(
			array("value"=>"Editor","label"=>"Editor"),
			array("value"=>"User","label"=>"User","selected"=>TRUE),
			array("value"=>"Admin","label"=>"Admin")
			)
		));

	return $l;
}

if (isset($engine->cleanPost['MYSQL'][$tableName."_submit"])) {
	$list = defineList($tableName);
	$list->insert();
}
if (isset($engine->cleanPost['MYSQL'][$tableName."_update"])) {
	$list = defineList($tableName);
	$list->update();
}

$list = defineList($tableName);

localVars::add("results",displayMessages());

$engine->eTemplate("include","header");
?>

<section>
	<header class="page-header">
		<h1>Manage Users</h1>
	</header>

	<nav id="breadcrumbs">
		<ul class="breadcrumb">
		<li><a href="{local var="siteRoot"}">Home</a></li>
		<li><a href="{local var="siteRoot"}/admin/">Admin</a></li>
		</ul>
	</nav>

	{local var="results"}

	<section>
		<header>
			<h2>Add User</h2>
		</header>
		{listObject display="insertForm"}
	</section>

	<hr />

	<section>
		<header>
			<h2>Edit Users</h2>
		</header>
		{listObject display="editTable"}
	</section>
</section>

<?php
$engine->eTemplate("include","footer");
?>
