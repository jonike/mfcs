<?php

include("../../header.php");

$tableName = "projects";

function defineList($tableName) {
	// $engine = EngineAPI::singleton();
	$l      = new listManagement($tableName);

	$l->addField(array(
		"field"    => "projectName",
		"label"    => "Project Name",
		));

	$l->addField(array(
		"field"    => "projectID",
		"label"    => "Project ID (Short Name)",
		"validate" => "alphaNoSpaces"
		));

	$l->addField (

		array(
			'field'    => "ID",
			'label'    => "ID",
			'type'     => "hidden",
			'disabled' => TRUE
			)

		);

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
		<h1>Manage Projects</h1>
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
			<h2>Add Project</h2>
		</header>
		{listObject display="insertForm"}
	</section>

	<hr />

	<section>
		<header>
			<h2>Edit Projects</h2>
		</header>
		{listObject display="editTable"}
	</section>
</section>

<?php
$engine->eTemplate("include","footer");
?>