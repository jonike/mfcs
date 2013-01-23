$(function() {
	// Instantiate the bootstrap tooltip plugin
	$("[rel='tooltip']").tooltip();

	// Blank both panes when changing tabs
	$("#fieldTab").on("click", "a", function() {
		$("#formPreview li").removeClass("well");
		showFieldSettings(); // blank the Field Settings pane
	});

	// Select a field to change settings
	$("#formPreview").on("click", "li", function() {
		$(this).addClass("well").addClass("well-small").siblings().removeClass("well");
		$("#fieldTab a[href='#fieldSettings']").tab("show");
		showFieldSettings($(this).attr("id"));
	});

	// Make the preview pane sortable -- sort order determines position
	$("#formPreview").sortable({
		revert: true,
		placeholder: "highlight",
		update: function(event, ui) {
			// Only perform this if it's a brand new field
			if ($(ui.item).hasClass("ui-draggable")) {
				addNewField(ui.item);
			}
		}
	});

	// Make field types draggable, linked to preview pane
	$("#fieldAdd li").draggable({
		connectToSortable: "#formPreview",
		helper: "clone",
		revert: "invalid",
	});

	// Set all the black magic bindings
	fieldSettingsBindings();

	// Form submit handler
	$("form[name=formPreview]").submit(function(e) {
		// Disable all fields so PHP doesn't get them
		$("#formPreview :input").prop('disabled', true);

		// Calculate position of all fields
		var pos = 0;
		$(":input[name^=position_]", this).each(function() {
			$(this).val(pos++);
		});

		// Create a multidimentional object to store field info
		var obj = {};
		$(".fieldValues :input").each(function() {
			var field = $(this).prop("name").split("_");

			if (!obj[ field[1] ]) {
				obj[ field[1] ] = {};
			}
			obj[ field[1] ][ field[0] ] = $(this).val();

		});

		// Convert object to JSON and add it to a hidden form field
		$(":input[name=fields]").val(JSON.stringify(obj));
	});

});

function showFieldSettings(fullID) {
	if (fullID === undefined) {
		// Hide the form and show a warning about having nothing selected
		$("#noFieldSelected").show();
		$("#fieldSettings form").hide();
	}
	else {
		id       = fullID.split("_")[1];
		var type = $("#type_"+id).val();

		// Select the Field Settings tab
		$("#fieldTab a[href='#fieldSettings']").tab("show");

		// Hide the nothing selected error and show the form
		$("#noFieldSelected").hide();
		$("#fieldSettings form").show();

		// Hide all but the common fields
		$("#fieldSettings form").children().not(".noHide").hide();

		// Show optional fields
		switch(type) {
			case 'Single Line Text':
			case 'Paragraph Text':
				$("#fieldSettings_container_range").show();

				$("#fieldSettings_format option").remove();
				$("#fieldSettings_format")
					.append($("<option>").prop("value","characters").text("Characters"))
					.append($("<option>").prop("value","words").text("Words"));
				break;

			case 'Multiple Choice':
			case 'Checkboxes':
			case 'Dropdown':
				break;

			case 'Number':
				$("#fieldSettings_container_range").show();

				$("#fieldSettings_format option").remove();
				$("#fieldSettings_format")
					.append($("<option>").prop("value","value").text("Value"))
					.append($("<option>").prop("value","digits").text("Digits"));
				break;

			case 'Email':
			case 'Phone':
			case 'Date':
			case 'Time':
			case 'Website':
			default:
				break;
		}

		// Update field settings to use values from form display
		$("#fieldSettings_name").val($("#name_"+id).val());
		$("#fieldSettings_label").val($("#label_"+id).val());
		$("#fieldSettings_defaultValue").val($("#defaultValue_"+id).val());
		$("#fieldSettings_placeholder").val($("#placeholder_"+id).val());
		$("#fieldSettings_ID").val($("#ID_"+id).val());
		$("#fieldSettings_class").val($("#class_"+id).val());
		$("#fieldSettings_styles").val($("#styles_"+id).val());
		$("#fieldSettings_options_required").prop("checked",($("#required_"+id).val()==='true'));
		$("#fieldSettings_options_duplicates").prop("checked",($("#duplicates_"+id).val()==='true'));
		$("#fieldSettings_options_readonly").prop("checked",($("#readonly_"+id).val()==='true'));
		$("#fieldSettings_options_disable").prop("checked",($("#disable_"+id).val()==='true'));
		$("#fieldSettings_min").val($("#min_"+id).val());
		$("#fieldSettings_max").val($("#max_"+id).val());
		$("#fieldSettings_format").val($("#format_"+id).val()).change();
	}
}

function fieldSettingsBindings() {
	$("#fieldSettings_name").keyup(function() {
		$("#formPreview .well .controls :input").prop('name',$(this).val());
		$("#formPreview .well :input[name^=name_]").val($(this).val());

		// If no id, set id to be the same as name
		// if (!$("#fieldSettings_ID").val()) {
		// 	$("#formPreview .well .control-group label").prop('for',$(this).val());
		// 	$("#formPreview .well .controls :input").prop('id',$(this).val());
		// 	$("#formPreview .well :input[name^=ID_]").val($(this).val());
		// }
	});

	$("#fieldSettings_label").keyup(function() {
		$("#formPreview .well .control-group label").text($(this).val());
		$("#formPreview .well :input[name^=label_]").val($(this).val());
	});

	$("#fieldSettings_defaultValue").keyup(function() {
		$("#formPreview .well .controls :input").val($(this).val());
		$("#formPreview .well :input[name^=defaultValue_]").val($(this).val());
	});

	$("#fieldSettings_placeholder").keyup(function() {
		$("#formPreview .well .controls :input").prop('placeholder',$(this).val());
		$("#formPreview .well :input[name^=placeholder_]").val($(this).val());
	});

	$("#fieldSettings_ID").keyup(function() {
		$("#formPreview .well .control-group label").prop('for',$(this).val());
		$("#formPreview .well .controls :input").prop('id',$(this).val());
		$("#formPreview .well :input[name^=ID_]").val($(this).val());
	});

	$("#fieldSettings_class").keyup(function() {
		$("#formPreview .well .controls :input").prop('class',$(this).val());
		$("#formPreview .well :input[name^=class_]").val($(this).val());
	});

	$("#fieldSettings_styles").keyup(function() {
		$("#formPreview .well .controls :input").attr('style',$(this).val());
		$("#formPreview .well :input[name^=styles_]").val($(this).val());
	});

	$("#fieldSettings_options_required").change(function() {
		// $("#formPreview .well .controls :input").prop('required',$(this).is(":checked")); // Requires that you fill the preview with a value
		$("#formPreview .well :input[name^=required_]").val($(this).is(":checked"));
	});

	$("#fieldSettings_options_duplicates").change(function() {
		$("#formPreview .well :input[name^=duplicates_]").val($(this).is(":checked"));
	});

	$("#fieldSettings_options_readonly").change(function() {
		$("#formPreview .well .controls :input").prop('readonly',$(this).is(":checked"));
		$("#formPreview .well :input[name^=readonly_]").val($(this).is(":checked"));
	});

	$("#fieldSettings_options_disable").change(function() {
		$("#formPreview .well .controls :input").prop('disabled',$(this).is(":checked"));
		$("#formPreview .well :input[name^=disable_]").val($(this).is(":checked"));
	});

	$("#fieldSettings_min").change(function() {
		$("#formPreview .well :input[name^=min_]").val($(this).val());
		if ($("#fieldSettings_min").val() > $("#fieldSettings_max").val()) {
			$("#fieldSettings_max").val($("#fieldSettings_min").val()).change();
		}
	});

	$("#fieldSettings_max").change(function() {
		$("#formPreview .well :input[name^=max_]").val($(this).val());
		if ($("#fieldSettings_min").val() > $("#fieldSettings_max").val()) {
			$("#fieldSettings_min").val($("#fieldSettings_max").val()).change();
		}
	});

	$("#fieldSettings_format").change(function() {
		$("#formPreview .well :input[name^=format_]").val($(this).val());
	});



}

function addNewField(item) {
	// Remove class to designate this is not new for next time
	$(item).removeClass("ui-draggable");

	// Preserve type
	var type = $("a", item).text();

	// Assign an id to new li
	var newID = 0;
	$("#formPreview li").each(function() {
		if ($(this)[0] !== $(item)[0]) {
			var thisID = $(this).attr("id").split("_");
			if (newID <= thisID[1]) {
				newID = parseInt(thisID[1])+1;
			}
		}
	});
	$(item).attr("id","formPreview_"+newID);

	// Add base html
	// $(item).html('<i class="icon-play"></i><div class="fieldPreview"></div>');
	$(item).html('<div class="fieldPreview"></div>');

	// Add field specific html to .fieldPreview
	$(".fieldPreview", item).html(newFieldPreview(newID,type));

	// Container for hidden fields
	$(item).append('<div class="fieldValues"></div>');
	$(".fieldValues", item).html(newFieldValues(newID,type));

	// Display settings for new field
	$("#formPreview_"+newID).click();
}

function newFieldPreview(id,type) {
	var output;

	output  = '<div class="control-group"><label class="control-label" for="">Untitled</label><div class="controls">';

	switch(type) {
		case 'Single Line Text':
			output += '<input type="text">';
			break;

		case 'Paragraph Text':
			output += '<textarea></textarea>';
			break;

		case 'Multiple Choice':
		case 'Checkboxes':
		case 'Dropdown':
			break;

		case 'Number':
			output += '<input type="number">';
			break;

		case 'Email':
			output += '<input type="email">';
			break;

		case 'Phone':
			break;

		case 'Date':
			output += '<input type="date">';
			break;

		case 'Time':
		case 'Website':
		default:
			break;
	}

	output += '</div></div>';

	return output;
}

function newFieldValues(id,type) {
	var output;

	output  = '<input type="hidden" id="position_'+id+'" name="position_'+id+'" value="" />';
	output += '<input type="hidden" id="type_'+id+'" name="type_'+id+'" value="'+type+'" />';
	output += '<input type="hidden" id="name_'+id+'" name="name_'+id+'" value="untitled'+(id+1)+'" />';
	output += '<input type="hidden" id="label_'+id+'" name="label_'+id+'" value="Untitled" />';
	output += '<input type="hidden" id="defaultValue_'+id+'" name="defaultValue_'+id+'" value="" />';
	output += '<input type="hidden" id="placeholder_'+id+'" name="placeholder_'+id+'" value="" />';
	output += '<input type="hidden" id="ID_'+id+'" name="ID_'+id+'" value="untitled'+(id+1)+'" />';
	output += '<input type="hidden" id="class_'+id+'" name="class_'+id+'" value="" />';
	output += '<input type="hidden" id="styles_'+id+'" name="styles_'+id+'" value="" />';
	output += '<input type="hidden" id="required_'+id+'" name="required_'+id+'" value="false" />';
	output += '<input type="hidden" id="duplicates_'+id+'" name="duplicates_'+id+'" value="false" />';
	output += '<input type="hidden" id="readonly_'+id+'" name="readonly_'+id+'" value="false" />';
	output += '<input type="hidden" id="disable_'+id+'" name="disable_'+id+'" value="false" />';
	output += '<input type="hidden" id="min_'+id+'" name="min_'+id+'" value="" />';       // Range
	output += '<input type="hidden" id="max_'+id+'" name="max_'+id+'" value="" />';       // Range
	output += '<input type="hidden" id="format_'+id+'" name="format_'+id+'" value="" />'; // Range
	output += '<input type="hidden" id="validation_'+id+'" name="validation_'+id+'" value="" />';
	output += '<input type="hidden" id="access_'+id+'" name="access_'+id+'" value="" />';
	output += '<input type="hidden" id="sortable_'+id+'" name="sortable_'+id+'" value="" />';
	output += '<input type="hidden" id="searchable_'+id+'" name="searchable_'+id+'" value="" />';
	output += '<input type="hidden" id="releaseToPublic_'+id+'" name="releaseToPublic_'+id+'" value="" />';

	return output;
}
