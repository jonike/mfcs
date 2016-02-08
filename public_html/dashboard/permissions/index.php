<?php
require_once "../../header.php";

$object_forms   = forms::getForms(TRUE);
$metadata_forms = forms::getForms(FALSE);

$form_block = "";
foreach ($object_forms as $form) {
	$form_block .= build_permissions_html($form);
}
localvars::add("object_form_permissions",$form_block);

$form_block = "";
foreach ($metadata_forms as $form) {
	$form_block .= build_permissions_html($form);
}
localvars::add("metadata_form_permissions",$form_block);


function build_permissions_html($form) {
	$permissions = mfcsPerms::permissions_for_form($form['ID']);

	$form_block  = sprintf('<div class="form_permission_block" id="formID-%s">',$form['ID']);
	$form_block .= sprintf('<h3>%s</h3>',forms::title($form['ID']));

	foreach ($permissions as $type=>$usernames) {
		$form_block .= sprintf('<h4>%s</h4>',mfcsPerms::type_is($type));
		$form_block .= '<ul>';

		foreach ($usernames as $username) {
			if (is_empty($username)) continue;

			$user = users::get($username);
			$inactive_user = (strtolower($user['status']) == "inactive")?TRUE:FALSE;

			$form_block   .= sprintf('<li>%s%s%s</li>',
				($inactive_user)?'<span class="inactive_user">':"",
				$username,
				($inactive_user)?'</span>':""
				);
		}

		$form_block .= '</ul>';
	}

	$form_block .= '</div>';

	return $form_block;
}

$engine->eTemplate("include","header");

?>

<section>
	<header class="page-header">
		<h1>Permissions Information</h1>
	</header>

	<ul class="breadcrumbs">
		<li><a href="{local var="siteRoot"}">Home</a></li>
	</ul>

<div id="object_forms_permissions">
	<h2>Object Forms</h2>
{local var="object_form_permissions"}
</div>

<div id="metadata_forms_permissions">
	<h2>Metadata Forms</h2>
{local var="metadata_form_permissions"}
</div>


</section>

<?php
$engine->eTemplate("include","footer");
?>
