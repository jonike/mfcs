<?php
include("../../header.php");

//Permissions Access
if(!mfcsPerms::evaluatePageAccess(2)){
    header('Location: /index.php?permissionFalse');
}

$tableName = "metadataStandards";

function defineList($tableName) {
    // $engine = EngineAPI::singleton();
    $l = new listManagement($tableName);

    $l->addField(array(
        "field"    => "type",
        "label"    => "Metadata Standard Name",
    ));

    $l->addField(array(
        "field"    => "typeID",
        "label"    => "Metadata Standard Abbreviation",
        "validate" => "alphaNoSpaces"
    ));

    $l->addField (array(
        'field'    => "ID",
        'label'    => "ID",
        'type'     => "hidden",
        'disabled' => TRUE
    ));

    return $l;
}

if (isset($engine->cleanPost['MYSQL'][$tableName."_submit"])) {
    log::insert("Admin: Add Metadata Standards");
    $list = defineList($tableName);
    $list->insert();
}

if (isset($engine->cleanPost['MYSQL'][$tableName."_update"])) {
    log::insert("Admin: Update Metadata Standards");
    $list = defineList($tableName);
    $list->update();
}

$list = defineList($tableName);

localVars::add("results",displayMessages());
log::insert("Admin: View Projects Page");

$engine->eTemplate("include","header");
?>

<section>
    <header class="page-header">
        <h1>Manage Metadata Schemas</h1>
    </header>

    <ul class="breadcrumbs">
        <li><a href="{local var="siteRoot"}">Home</a></li>
        <li><a href="{local var="siteRoot"}/admin/">Admin</a></li>
        <li class="pull-right noDivider"><a href="https://github.com/wvulibraries/mfcs/wiki/Metadata-Schemas" target="_blank"> <i class="fa fa-book"></i> Documentation</a></li>
    </ul>


    {local var="results"}

    <section>
        <header>
            <h2>Add Metadata Standards</h2>
        </header>
        {listObject display="insertForm"}
    </section>

    <hr />

    <div class="metadataTables responsive-table">
        <section>
            <header>
                <h2>Edit Metadata Standards</h2>
            </header>
            {listObject display="editTable"}
        </section>
    </div>
</section>

<?php
$engine->eTemplate("include","footer");
?>
